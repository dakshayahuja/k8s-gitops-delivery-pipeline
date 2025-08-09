#!/bin/bash
source "../.env"
DOMAIN="$GODADDY_DOMAIN"
RECORD_NAME="$GODADDY_RECORD_NAME"
API_KEY="$GODADDY_API_KEY"
API_SECRET="$GODADDY_API_SECRET"
NEW_IP=$(kubectl get svc ingress-nginx-controller -n ingress-nginx -o jsonpath="{.status.loadBalancer.ingress[0].hostname}")

echo "⚙️ Updating GoDaddy DNS: $RECORD_NAME.$DOMAIN → $NEW_IP"

curl -X PUT "https://api.godaddy.com/v1/domains/$DOMAIN/records/A/$RECORD_NAME" \
  -H "Authorization: sso-key $API_KEY:$API_SECRET" \
  -H "Content-Type: application/json" \
  -d "[{\"data\":\"$NEW_IP\",\"ttl\":600}]"