# 🏗️ System Architecture & Deployment Status

## Overview

This document provides a comprehensive view of the **current technical architecture and deployment status** of the Kubernetes GitOps Delivery Pipeline project, showing both the design decisions and what's currently running.

## 🎯 Current System Overview

The Expense Tracker application is built on a **modern, scalable architecture** featuring:

- **Microservices Architecture**: Separate frontend, backend, and database services
- **Kubernetes Orchestration**: Containerized deployment with basic scaling
- **GitOps Workflow**: Automated deployment via ArgoCD and GitHub Actions
- **Basic Monitoring**: Prometheus & Grafana for observability
- **Security Features**: TLS encryption, OAuth authentication, and secure networking

## 🏢 Infrastructure Architecture

### Cloud Infrastructure (AWS)

```
AWS Setup:
├── VPC (10.0.0.0/16)
│   ├── Public Subnets (10.0.101.0/24, 10.0.102.0/24)
│   │   ├── NAT Gateway
│   │   └── Internet Gateway
│   └── Private Subnets (10.0.1.0/24, 10.0.2.0/24)
│       └── EKS Worker Nodes
├── EKS Cluster (v1.29)
│   ├── Control Plane (AWS Managed)
│   ├── Worker Node Groups
│   │   ├── Spot Instances (t3a.medium, t3.medium, t3a.small, t3.small)
│   │   └── Auto-scaling (1-5 nodes)
│   └── IAM Roles for Service Accounts
└── Supporting Services
    ├── Route 53 (DNS)
    ├── Certificate Manager (SSL)
    └── CloudWatch (Logging)
```

**Current Infrastructure Status:**
- **Region**: `us-east-1`
- **Cluster Name**: `gitops-delivery-cluster`
- **Terraform State**: S3 backend `gitops-delivery-pipeline`

### Network Architecture

| Component | Status | Network | Details |
|-----------|--------|---------|---------|
| **Public Load Balancer** | ✅ Active | Internet-facing | AWS ELB with external IP |
| **Private Subnets** | ✅ Active | Application workloads | Isolated from internet |
| **NAT Gateway** | ✅ Active | Outbound internet access | For private subnet workloads |
| **Security Groups** | ✅ Active | Basic traffic filtering | Standard EKS security groups |

## 🚀 Application Architecture

### Service Architecture

```
Service Layout:
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React SPA)   │◄──►│   (FastAPI)     │◄──►│  (PostgreSQL)   │
│                 │    │                 │    │                 │
│ • Static Assets │    │ • REST API      │    │ • User Data     │
│ • Client Logic  │    │ • Business Logic│    │ • Expenses      │
│ • State Mgmt    │    │ • Auth Service  │    │ • Settings      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend** | React 18 + Vite | Latest | Modern SPA with fast builds |
| **Backend** | FastAPI + SQLAlchemy | Latest | High-performance API |
| **Database** | PostgreSQL | 15 | ACID-compliant data storage |
| **Container** | Docker | Latest | Application packaging |
| **Orchestration** | Kubernetes | 1.29 | Container orchestration |
| **Ingress** | NGINX Ingress | Latest | Traffic routing and SSL termination |

### Current Application Deployment Status

| Component | Status | Namespace | Replicas | Image |
|-----------|--------|-----------|----------|-------|
| **Frontend** | ✅ Running | `expense-tracker` | 2 | `ghcr.io/dakshayahuja/expense-frontend:0.1` |
| **Backend** | ✅ Running | `expense-tracker` | 2 | `ghcr.io/dakshayahuja/expense-backend:0.1` |
| **PostgreSQL** | ✅ Running | `expense-tracker` | 1 | `postgres:15` |

## 🔄 GitOps Workflow

### Deployment Pipeline

```
GitOps Flow:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Code      │───►│   GitHub    │───►│   GitHub    │───►│   ArgoCD    │
│   Changes   │    │   Push      │    │   Actions   │    │   Sync      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                           │
                                                           ▼
                                                    ┌─────────────┐
                                                    │ Kubernetes  │
                                                    │   Cluster   │
                                                    └─────────────┘
```

### CI/CD Components

| Component | Status | Technology | Details |
|-----------|--------|------------|---------|
| **Source Control** | ✅ Active | GitHub | Main repository |
| **CI Pipeline** | ✅ Active | GitHub Actions | Image building and pushing |
| **Container Registry** | ✅ Active | GitHub Container Registry | Image storage |
| **GitOps Operator** | ✅ Active | ArgoCD | Auto-sync enabled |
| **Infrastructure** | ✅ Active | Terraform | S3 backend |

## 🏗️ Kubernetes Architecture

### Cluster Components

```
EKS Cluster:
┌─────────────────────────────────────────────────────────────┐
│                    Control Plane (AWS Managed)              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   API       │  │   Scheduler │  │ Controller  │        │
│  │   Server    │  │             │  │   Manager   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Current Worker Nodes                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Node 1    │  │   Node 2    │  │   Node 3    │        │
│  │             │  │             │  │             │        │
│  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │        │
│  │ │  Pods   │ │  │ │  Pods   │ │  │ │  Pods   │ │        │
│  │ │         │ │  │ │         │ │  │ │         │ │        │
│  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### Core Infrastructure Status

| Component | Status | Namespace | Replicas | Purpose |
|-----------|--------|-----------|----------|---------|
| **ArgoCD** | ✅ Running | `argocd` | 1 | GitOps operator |
| **NGINX Ingress** | ✅ Running | `ingress-nginx` | 1 | Traffic routing |
| **Cert Manager** | ✅ Running | `cert-manager` | 1 | SSL certificates |
| **Prometheus Stack** | ✅ Running | `monitoring` | 1 | Monitoring |
| **Cluster Autoscaler** | ✅ Running | `kube-system` | 1 | Node scaling |

### Application Deployment

```
Application Stack:
┌─────────────────────────────────────────────────────────────┐
│                    Ingress Layer                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   NGINX     │  │   TLS       │  │   Load      │        │
│  │   Ingress   │  │   (Cert-Manager)│   Balancing │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Frontend  │  │   Backend   │  │      Database       │ │
│  │   (2 pods)  │  │   (2 pods)  │  │     (1 pod)        │ │
│  │             │  │             │  │                     │ │
│  │ • React SPA │  │ • FastAPI   │  │ • PostgreSQL       │ │
│  │ • Nginx     │  │ • SQLAlchemy│  │ • Persistent       │ │
│  │ • Static    │  │ • JWT Auth  │  │   Volume (gp3)     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🌐 Networking & Services

### Ingress Configuration

- **Domain**: `k8s.dakshayahuja.in`
- **SSL**: Let's Encrypt certificates via cert-manager
- **Load Balancer**: AWS ELB with external IP
- **Routes**:
  - `/` → Frontend
  - `/api` → Backend
  - `/grafana` → Grafana

### Service Configuration

| Service | Type | Port | Target | Status |
|---------|------|------|--------|--------|
| `frontend` | ClusterIP | 80 | Frontend pods | ✅ Healthy |
| `backend` | ClusterIP | 8000 | Backend pods | ✅ Healthy |
| `postgres` | ClusterIP | 5432 | PostgreSQL pod | ✅ Healthy |

## 🔒 Security Features

### Security Implementation

- **TLS Encryption**: ✅ End-to-end HTTPS encryption
- **OAuth 2.0**: ✅ Google authentication configured
- **JWT Tokens**: ✅ Backend session management
- **Network Isolation**: ✅ Private subnets for workloads
- **IAM Roles**: ✅ Service account permissions
- **Secrets Management**: ✅ Kubernetes secrets for sensitive data

### Authentication & Authorization

- **Google OAuth**: Configured for user authentication
- **JWT tokens**: Backend session management
- **TLS encryption**: End-to-end HTTPS

### Network Security

- **Private subnets**: Application workloads isolated
- **Security groups**: Basic traffic filtering
- **IAM roles**: Service account permissions

## 📊 Monitoring & Observability

### Monitoring Stack

```
Monitoring:
┌─────────────────┐    ┌─────────────────┐
│   Prometheus    │    │     Grafana     │
│                 │    │                 │
│ • Metrics      │◄──►│ • Dashboards    │
│ • Scraping     │    │ • Visualization │
│ • Storage      │    │ • Analysis      │
└─────────────────┘    └─────────────────┘
```

### Metrics & Status

| Category | Current Metrics | Status | Access |
|----------|----------------|--------|--------|
| **Infrastructure** | CPU, memory, disk, network | ✅ Active | Prometheus |
| **Application** | Basic HTTP metrics | ✅ Active | Service monitors |
| **Database** | Connection metrics | ✅ Active | Postgres exporter |
| **Dashboards** | Default node-exporter | ✅ Active | `/grafana` (admin/admin) |

## 🚀 Scalability & Performance

### Scaling Strategy

```
Scaling (Fixed):
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load          │    │   Fixed Scaling │    │   Basic Health  │
│   Balancer      │───►│   (Replicas)    │───►│   Management    │
│                 │    │                 │    │                 │
│ • Traffic       │    │ • Fixed replicas│    │ • Health checks │
│ • Health checks │    │ • Manual scaling│    │ • Storage       │
│ • SSL termination│   │ • 2 pods each  │    │ • Basic probes  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Implementation:**
- **Frontend**: 2 replicas (fixed)
- **Backend**: 2 replicas (fixed)
- **Database**: 1 replica (PostgreSQL)
- **No HPA/VPA**: Manual scaling only

### Performance Features

- **Static Replicas**: 2 pods per service for basic redundancy
- **Health Checks**: Readiness and liveness probes configured
- **Database**: Connection pooling via SQLAlchemy
- **Static Assets**: Nginx serving for frontend

## 🔄 High Availability

### Availability Design

```
HA (Basic):
┌─────────────────┐    ┌─────────────────┐
│   Availability Zone 1a                 │
│                 │                      │
│ ┌─────────────┐ │                      │
│ │  Node 1     │ │                      │
│ │ ┌─────────┐ │ │                      │
│ │ │  Pods   │ │ │                      │
│ │ │         │ │ │                      │
│ │ └─────────┘ │ │                      │
│ └─────────────┘ │                      │
└─────────────────┘                      │
                                         │
┌─────────────────────────────────────────┐
│   Availability Zone 1b                 │
│                 │                      │
│ ┌─────────────┐ │                      │
│ │  Node 2     │ │                      │
│ │ ┌─────────┐ │ │                      │
│ │ │  Pods   │ │ │                      │
│ │ │         │ │ │                      │
│ │ └─────────┘ │ │                      │
│ └─────────────┘ │                      │
└─────────────────────────────────────────┘
```

### Disaster Recovery

- **Multi-AZ Deployment**: ✅ Spread across availability zones
- **Persistent Storage**: ✅ Database data survives pod restarts
- **Basic Redundancy**: ✅ Multiple pods for frontend/backend

## 🔧 Configuration Management

### Configuration Strategy

```
Configuration:
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Environment   │    │   Kubernetes    │    │   Application  │
│   Variables     │    │   ConfigMaps    │    │   Settings     │
│                 │    │                 │    │                 │
│ • Database URL │◄──►│ • Nginx Config  │◄──►│ • App Config   │
│ • API Keys     │    │ • Environment   │    │ • Feature Flags│
│ • Secrets      │    │ • Volumes       │    │ • UI Settings  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Configuration Components

| Component | Status | Implementation | Details |
|-----------|--------|----------------|---------|
| **ConfigMaps** | ✅ Active | Kubernetes ConfigMaps | Nginx config, environment vars |
| **Secrets** | ✅ Active | Kubernetes Secrets | Database credentials, backend secrets |
| **Environment Variables** | ✅ Active | Container env vars | Database URL, API keys |
| **Volumes** | ✅ Active | ConfigMap volumes | Configuration mounting |

### Resource Management

- **No explicit resource limits** set on deployments
- **Health checks** configured (readiness/liveness probes)
- **Persistent storage** for PostgreSQL (gp3 storage class)

## 🚨 Health Status

### Cluster Health

- **Nodes**: All healthy and running
- **Control plane**: AWS managed, healthy
- **Add-ons**: EBS CSI driver, cluster autoscaler

### Application Health

- **All pods**: Running and ready
- **Services**: All endpoints healthy
- **Ingress**: SSL working, traffic routing correctly

## 🔄 Deployment Method

### GitOps Workflow

- **Source**: GitHub repository
- **CI/CD**: GitHub Actions for building images
- **Deployment**: ArgoCD auto-sync enabled
- **Updates**: Automatic on Git push

### Deployment Scripts

- **`bringup.sh`**: Complete cluster and app deployment
- **`teardown.sh`**: Clean cluster removal
- **`update-dns.sh`**: DNS record updates

## 📋 Next Steps & Implementation Plan

### Resource Management & Scaling
- **HPA**: Implement automatic pod scaling based on CPU/memory usage
- **Resource Limits**: Add CPU/memory constraints for better resource allocation

### Advanced Monitoring
- **Custom Dashboards**: Create business-specific Grafana dashboards
- **Alerting**: Implement Prometheus alerting for critical events

### Enhanced Security
- **Network Policies**: Add pod-to-pod communication rules
- **RBAC**: Implement more granular access control

### Backup & Recovery
- **Database Backups**: Automated PostgreSQL backups to S3
- **Backup Testing**: Regular backup verification procedures

### Performance
- **CDN**: Add CloudFront for static assets
- **Caching**: Implement Redis for session and data caching

## 🎯 Status Summary

| Aspect | Status | Implementation Status | Notes |
|--------|--------|----------------------|-------|
| **Infrastructure** | ✅ Production Ready | EKS cluster with autoscaling | Multi-AZ, spot instances |
| **Applications** | ✅ Running | All services operational | 2 replicas each, healthy |
| **Monitoring** | ✅ Basic | Prometheus + Grafana working | Default dashboards |
| **Security** | ✅ Basic | TLS + OAuth configured | End-to-end encryption |
| **Scaling** | ⚠️ Manual | Fixed replicas, no HPA | Ready for HPA implementation |
| **Backup** | ❌ None | No automated backup strategy | Future enhancement needed |

## 📚 Additional Resources

- **Kubernetes Documentation**: https://kubernetes.io/docs/
- **ArgoCD Documentation**: https://argo-cd.readthedocs.io/
- **Terraform Documentation**: https://www.terraform.io/docs/
- **AWS EKS Documentation**: https://docs.aws.amazon.com/eks/
