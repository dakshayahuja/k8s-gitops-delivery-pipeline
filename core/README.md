```bash
helm repo add argo https://argoproj.github.io/argo-helm
helm repo add autoscaler https://kubernetes.github.io/autoscaler
helm repo update

helm upgrade --install argocd argo/argo-cd --namespace argocd --create-namespace --values argo/argo-cd-values.yaml

helm upgrade --install cluster-autoscaler autoscaler/cluster-autoscaler --namespace kube-system --values core/cluster-autoscaler-values.yaml

kubectl port-forward service/argocd-server -n argocd 8080:443

password=(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)

argo cd - admin : {password}
```