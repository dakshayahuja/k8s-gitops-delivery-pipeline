terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.70.0"
    }
  }
  required_version = ">= 1.4.0"
  backend "s3" {
    bucket         = "gitops-delivery-pipeline"
    key            = "terraform/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
  }
}

provider "aws" {
  region = var.region
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.13.0"

  name = "eks-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${var.region}a", "${var.region}b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true

  tags = {
    Terraform   = "true"
    Environment = "dev"
  }
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.24.0"

  cluster_name    = var.cluster_name
  cluster_version = "1.29"
  subnet_ids      = module.vpc.private_subnets
  vpc_id          = module.vpc.vpc_id

  enable_irsa                              = true
  enable_cluster_creator_admin_permissions = true
  authentication_mode                      = "API"
  cluster_endpoint_public_access           = true
  cluster_endpoint_private_access          = false

  access_entries = {
    root = {
      principal_arn = "arn:aws:iam::135893647954:root"
      policy_associations = {
        cluster_admin = {
          policy_arn = "arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy"
          access_scope = {
            type = "cluster"
          }
        }
      }
    }
  }

  eks_managed_node_groups = {
    spot = {
      desired_size   = 2
      max_size       = 5
      min_size       = 1
      instance_types = ["t3.small", "t3.micro", "t3a.small"]
      capacity_type  = "SPOT"
    }
    autoscale = {
      autoscaler = "arn:aws:iam::aws:policy/AutoScalingFullAccess"
    }
  }

  tags = {
    Terraform   = "true"
    Environment = "dev"
  }
}

resource "aws_iam_policy" "cluster_autoscaler" {
  name        = "cluster-autoscaler-policy"
  description = "IAM policy for Kubernetes Cluster Autoscaler to scale EKS node groups"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "autoscaling:DescribeAutoScalingGroups",
          "autoscaling:DescribeAutoScalingInstances",
          "autoscaling:DescribeLaunchConfigurations",
          "autoscaling:DescribeTags",
          "autoscaling:SetDesiredCapacity",
          "autoscaling:TerminateInstanceInAutoScalingGroup",
          "ec2:DescribeLaunchTemplateVersions"
        ]
        Resource = "*"
      }
    ]
  })
}

module "cluster_autoscaler_irsa" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-assumable-role-with-oidc"
  version = "~> 5.30.0"

  create_role                   = true
  role_name                     = "eks-cluster-autoscaler"
  provider_url                  = module.eks.oidc_provider
  oidc_fully_qualified_subjects = ["system:serviceaccount:kube-system:cluster-autoscaler"]
}

resource "aws_iam_role_policy_attachment" "cluster_autoscaler_attach" {
  role       = module.cluster_autoscaler_irsa.iam_role_name
  policy_arn = aws_iam_policy.cluster_autoscaler.arn
}