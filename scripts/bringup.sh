#!/bin/bash

set -e

echo "🔧 Applying Terraform to create EKS cluster..."
cd terraform
terraform apply -auto-approve

echo "⏳ Waiting for cluster to be ready..."
sleep 30

echo "📡 Getting kubeconfig for kubectl..."
aws eks update-kubeconfig --region us-east-1 --name gitops-delivery-cluster
echo "✅ Kubeconfig updated!"
