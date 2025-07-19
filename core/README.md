```bash
helm repo add argo https://argoproj.github.io/argo-helm
helm repo add autoscaler https://kubernetes.github.io/autoscaler
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo add jetstack https://charts.jetstack.io
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm upgrade --install argocd argo/argo-cd --namespace argocd --create-namespace --values core/argocd-values.yaml

helm upgrade --install cluster-autoscaler autoscaler/cluster-autoscaler --namespace kube-system --values core/cluster-autoscaler-values.yaml

helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace --values core/ingress-nginx-values.yaml

helm upgrade --install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --set crds.enabled=true

helm upgrade --install kube-prometheus prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace --values core/monitoring/kube-prometheus-values.yaml

kubectl port-forward service/argocd-server -n argocd 8080:443

password=(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)

argo cd - admin : {password}
```