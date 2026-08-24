#!/usr/bin/env bash
set -e

# ========================================================
# Kubernetes (K8s) Cluster Deployment & Verification Script
# Platform: Cloud-Native Video Sharing Platform (Instagram Reels Clone)
# ========================================================

RESOURCE_GROUP="CW2Scalable-rg"
AKS_CLUSTER_NAME="cw2-videoshare-aks"
ACR_NAME="cw2videoregistry01"
LOCATION="italynorth"
NAMESPACE="videoshare-prod"
IMAGE_TAG="latest"

echo "=========================================================="
echo "🚀 Deploying VideoShare Platform to Kubernetes (K8s)"
echo "=========================================================="

# Check for kubectl
if ! command -v kubectl &> /dev/null; then
    echo "❌ Error: kubectl is not installed."
    exit 1
fi

# Determine deployment mode (Local vs AKS)
MODE="${1:-local}"

if [ "$MODE" == "aks" ]; then
    echo "📦 [1/4] Ensuring Azure Container Registry (ACR) & AKS credentials..."
    az acr login --name "$ACR_NAME" || true
    az aks get-credentials --resource-group "$RESOURCE_GROUP" --name "$AKS_CLUSTER_NAME" --overwrite-existing || true
    
    echo "🏗️ [2/4] Building and pushing container image to ACR..."
    IMAGE_URI="${ACR_NAME}.azurecr.io/videoshare-api:${IMAGE_TAG}"
    docker build -t "$IMAGE_URI" .
    docker push "$IMAGE_URI"
else
    echo "💻 [1/2] Building local Docker container image..."
    docker build -t subinshrestha/videoshare-api:latest .
fi

echo "☸️ Applying Kubernetes Manifests via Kustomize..."
kubectl apply -k k8s/

echo "⏳ Waiting for Deployment rollout in namespace '${NAMESPACE}'..."
kubectl rollout status deployment/videoshare-deployment -n "$NAMESPACE" --timeout=180s

echo "=========================================================="
echo "✅ Kubernetes Cluster Deployment Successful!"
echo "=========================================================="

echo "📊 Cluster Status Overview:"
kubectl get pods,services,hpa,ingress -n "$NAMESPACE"

echo ""
echo "🌐 To access the application locally (port-forward):"
echo "   kubectl port-forward svc/videoshare-service 8080:80 -n ${NAMESPACE}"
echo "   Open http://localhost:8080"
