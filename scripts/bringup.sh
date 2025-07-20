#!/bin/bash

set -e

echo "🔧 Applying Terraform to create EKS cluster..."
cd terraform
terraform apply -auto-approve

echo "⏳ Waiting for cluster to be ready..."
sleep 30

echo "📡 Getting kubeconfig for kubectl..."
aws eks update-kubeconfig --region us-east-1 --name gitops-delivery-cluster

echo "🚀 Installing Helm charts for NGINX, Cert Manager, Prometheus..."
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx -n ingress-nginx --create-namespace -f core/ingress-nginx-values.yaml
helm upgrade --install cert-manager jetstack/cert-manager -n cert-manager --create-namespace --set installCRDs=true
helm upgrade --install kube-prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace -f core/monitoring/kube-prometheus-values.yaml
helm upgrade --install argocd argo/argo-cd -n argocd --create-namespace -f core/argocd-values.yaml

echo "🌀 Waiting for ArgoCD to be ready..."
kubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=180s

echo "🔐 Loading ArgoCD admin password from .env..."
set -a
source "$(dirname "$0")/../.env"
set +a

echo "🔐 Generating bcrypt hash..."
BCRYPT_HASH=$(htpasswd -nbBC 10 "" "$ARGOCD_ADMIN_PASSWORD" | tr -d ':\n')

echo "🔧 Creating ArgoCD admin secret..."
kubectl create secret generic argocd-secret \
  -n argocd \
  --from-literal=admin.password="$BCRYPT_HASH" \
  --from-literal=admin.passwordMtime="$(date +%FT%T%Z)" \
  --dry-run=client -o yaml | kubectl apply -f -

echo "📦 Applying ArgoCD app manifests..."
kubectl apply -f manifests/apps/

echo "✅ Kubeconfig updated!"

echo "🌐 Updating GoDaddy DNS entry for your domain..."
bash scripts/update-dns.sh

echo "🔐 Generating bcrypt hash..."
BCRYPT_HASH=$(htpasswd -nbBC 10 "" "$ARGOCD_ADMIN_PASSWORD" | tr -d ':\n')

echo "🔧 Patching ArgoCD admin password..."
kubectl -n argocd patch secret argocd-secret \
  -p "{\"stringData\": {\"admin.password\": \"$BCRYPT_HASH\", \"admin.passwordMtime\": \"$(date +%FT%T%Z)\"}}"