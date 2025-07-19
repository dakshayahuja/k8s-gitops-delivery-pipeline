#!/bin/bash

set -e

echo "🔥 Destroying EKS cluster and all infra..."
cd terraform
terraform destroy -auto-approve

echo "✅ Cluster torn down."