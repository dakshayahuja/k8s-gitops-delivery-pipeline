# 🏗️ Core Infrastructure Components

This directory contains the Helm values and configuration files for the core infrastructure components of the Kubernetes GitOps delivery pipeline.

## 📋 Overview

The core infrastructure provides the foundational services needed to run the GitOps pipeline and the Expense Tracker application:

- **ArgoCD**: GitOps operator for automated deployments
- **NGINX Ingress**: Traffic routing and load balancing
- **Cert-Manager**: Automated SSL/TLS certificate management
- **Prometheus Stack**: Monitoring and observability
- **Cluster Autoscaler**: Automatic node scaling

## 🚀 Components

### ArgoCD (GitOps Operator)
- **Purpose**: Manages GitOps deployments and application lifecycle
- **Configuration**: `argocd-values.yaml`
- **Namespace**: `argocd`
- **Features**: Auto-sync enabled, RBAC configured, monitoring integration

### NGINX Ingress Controller
- **Purpose**: Handles external traffic routing and SSL termination
- **Configuration**: `ingress-nginx-values.yaml`
- **Namespace**: `ingress-nginx`
- **Features**: Load balancing, SSL termination, traffic management

### Cert-Manager
- **Purpose**: Automatically provisions and manages SSL certificates
- **Configuration**: Default Helm values with CRDs enabled
- **Namespace**: `cert-manager`
- **Features**: Let's Encrypt integration, automatic certificate renewal

### Prometheus Monitoring Stack
- **Purpose**: Infrastructure and application monitoring
- **Configuration**: `monitoring/kube-prometheus-values.yaml`
- **Namespace**: `monitoring`
- **Features**: Prometheus metrics collection, Grafana dashboards, alerting

### Cluster Autoscaler
- **Purpose**: Automatically scales EKS worker nodes based on demand
- **Configuration**: `cluster-autoscaler-values.yaml`
- **Namespace**: `kube-system`
- **Features**: Spot instance support, multi-AZ scaling, cost optimization

## 🔧 Installation

### Prerequisites
- Kubernetes cluster (EKS) with Helm 3.x
- Proper IAM roles and permissions configured
- DNS domain configured for ingress

### Quick Installation
```bash
# Add required Helm repositories
helm repo add argo https://argoproj.github.io/argo-helm
helm repo add autoscaler https://kubernetes.github.io/autoscaler
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo add jetstack https://charts.jetstack.io
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install ArgoCD
helm upgrade --install argocd argo/argo-cd \
  --namespace argocd \
  --create-namespace \
  --values argocd-values.yaml

# Install Cluster Autoscaler
helm upgrade --install cluster-autoscaler autoscaler/cluster-autoscaler \
  --namespace kube-system \
  --values cluster-autoscaler-values.yaml

# Install NGINX Ingress
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --values ingress-nginx-values.yaml

# Install Cert-Manager
helm upgrade --install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set crds.enabled=true

# Install Prometheus Stack
helm upgrade --install kube-prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --values monitoring/kube-prometheus-values.yaml

# Apply cluster issuer for SSL certificates
kubectl apply -f cluster-issuer.yaml
```

## 🌐 Access

### ArgoCD Dashboard
```bash
# Port forward to access ArgoCD UI
kubectl port-forward service/argocd-server -n argocd 8080:443

# Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Access at: https://localhost:8080
# Username: admin
# Password: [from command above]
```

### Grafana Dashboard
- **URL**: `https://k8s.dakshayahuja.in/grafana`
- **Default Credentials**: `admin/admin`
- **Features**: Infrastructure monitoring, application metrics, custom dashboards

## 📊 Monitoring

### Prometheus Metrics
- **Endpoint**: `/metrics` on all services
- **Scraping**: Automatic service discovery
- **Storage**: Persistent volume for metrics retention

### Grafana Dashboards
- **Node Exporter**: System metrics (CPU, memory, disk, network)
- **Kubernetes**: Cluster and pod metrics
- **Application**: Custom expense tracker metrics
- **Database**: PostgreSQL connection and performance metrics

## 🔒 Security

### TLS/SSL
- **Certificates**: Automatically managed by Cert-Manager
- **Provider**: Let's Encrypt (free SSL certificates)
- **Renewal**: Automatic certificate renewal

### Access Control
- **ArgoCD**: RBAC configured for team access
- **Monitoring**: Basic authentication on Grafana
- **Ingress**: TLS termination and security headers

## 📈 Scaling

### Cluster Autoscaler
- **Node Groups**: Multiple instance types (t3a.medium, t3.medium, t3a.small, t3.small)
- **Scaling Range**: 1-5 nodes per availability zone
- **Spot Instances**: Cost optimization with spot instance support
- **Multi-AZ**: Automatic distribution across availability zones

### Application Scaling
- **Frontend**: 2 replicas for redundancy
- **Backend**: 2 replicas for load distribution
- **Database**: 1 replica (PostgreSQL with persistent storage)

## 🚨 Troubleshooting

### Common Issues
1. **ArgoCD sync failures**: Check Git repository access and manifests
2. **Certificate issues**: Verify cluster issuer configuration
3. **Ingress not working**: Check load balancer and DNS configuration
4. **Monitoring gaps**: Verify Prometheus service monitors and targets

### Logs
```bash
# ArgoCD logs
kubectl logs -n argocd deployment/argocd-server

# Ingress logs
kubectl logs -n ingress-nginx deployment/ingress-nginx-controller

# Prometheus logs
kubectl logs -n monitoring deployment/prometheus-kube-prometheus-prometheus
```

## 📚 Additional Resources

- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [NGINX Ingress Documentation](https://kubernetes.github.io/ingress-nginx/)
- [Cert-Manager Documentation](https://cert-manager.io/docs/)
- [Prometheus Operator Documentation](https://prometheus-operator.dev/)
- [Cluster Autoscaler Documentation](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler)