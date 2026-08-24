#!/usr/bin/env bash
# ==============================================================================
# Unified Azure Deployment Script for TestWebApp (Frontend & Backend)
# ==============================================================================

set -e

RESOURCE_GROUP="${AZURE_RESOURCE_GROUP:-CW2Scalable-rg}"
BACKEND_APP="${AZURE_BACKEND_APP:-cw2-videoshare-api}"
FRONTEND_APP="${AZURE_FRONTEND_APP:-videoshare-frontend}"
TARGET="${1:-all}" # Options: all, backend, frontend, db
ZIP_NAME="deploy-package.zip"

echo "========================================================"
echo " 🚀 TestWebApp Azure Deployment Automation"
echo " Resource Group: ${RESOURCE_GROUP}"
echo " Target:         ${TARGET}"
echo "========================================================"

# 1. Check Azure CLI authentication
echo "[1/4] Checking Azure CLI authentication..."
if ! az account show > /dev/null 2>&1; then
  echo "❌ Error: Azure CLI is not authenticated. Please run 'az login' first."
  exit 1
fi
echo "✅ Authenticated with Azure subscription."

# 2. Build Webpack Bundle
echo "[2/4] Building production React bundle (Webpack)..."
npm run build
echo "✅ Frontend bundle compiled successfully to /dist."

# 3. Deploy Frontend to Azure Static Web Apps (if target is 'all' or 'frontend')
if [ "$TARGET" = "all" ] || [ "$TARGET" = "frontend" ]; then
  echo "[3/4] Deploying Frontend to Azure Static Web App (${FRONTEND_APP})..."
  if command -v swa &> /dev/null; then
    swa deploy ./dist --env production --app-name "${FRONTEND_APP}" --resource-group "${RESOURCE_GROUP}" || true
  else
    npx -y @azure/static-web-apps-cli deploy ./dist --env production --app-name "${FRONTEND_APP}" --resource-group "${RESOURCE_GROUP}" || true
  fi
  echo "✅ Frontend static deployment completed."
fi

# 4. Deploy Backend to Azure App Service (if target is 'all' or 'backend')
if [ "$TARGET" = "all" ] || [ "$TARGET" = "backend" ]; then
  echo "[4/4] Packaging & Deploying Backend to Azure App Service (${BACKEND_APP})..."
  rm -f "${ZIP_NAME}"

  zip -q -r "${ZIP_NAME}" \
    app.js \
    app-routes.js \
    package.json \
    package-lock.json \
    config \
    routes \
    views \
    dist \
    styles \
    scripts \
    -x "dist/posts/*" "dist/temp/*" "dist/users/*" "dist/groups/*"

  az webapp deploy \
    --resource-group "${RESOURCE_GROUP}" \
    --name "${BACKEND_APP}" \
    --src-path "${ZIP_NAME}" \
    --type zip \
    --clean true

  rm -f "${ZIP_NAME}"
  echo "✅ Backend deployment completed."
fi

echo "========================================================"
echo " 🎉 Deployment Process Finished Successfully!"
echo " 🌐 Backend API URL:    https://${BACKEND_APP}.azurewebsites.net"
echo " 🩺 Health Check:       https://${BACKEND_APP}.azurewebsites.net/health"
echo " 🖥️ Static Frontend:    https://${FRONTEND_APP}.azurestaticapps.net"
echo ""
echo " To monitor backend live logs:"
echo "   az webapp log tail --resource-group ${RESOURCE_GROUP} --name ${BACKEND_APP}"
echo "========================================================"
