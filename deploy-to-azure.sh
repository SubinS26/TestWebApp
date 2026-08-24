#!/usr/bin/env bash
# ==============================================================================
# Azure App Service One-Command Deployment Script for TestWebApp
# ==============================================================================

set -e

RESOURCE_GROUP="${AZURE_RESOURCE_GROUP:-CW2Scalable-rg}"
APP_NAME="${AZURE_APP_NAME:-cw2-videoshare-api}"
ZIP_NAME="deploy-package.zip"

echo "========================================================"
echo " Starting Azure Deployment for: ${APP_NAME}"
echo " Resource Group: ${RESOURCE_GROUP}"
echo "========================================================"

# 1. Check Azure CLI login
echo "[1/4] Checking Azure CLI authentication..."
if ! az account show > /dev/null 2>&1; then
  echo "Error: Azure CLI is not authenticated. Please run 'az login' first."
  exit 1
fi

# 2. Build Frontend Webpack Bundle
echo "[2/4] Building production React bundle..."
npm run build

# 3. Create Deployment Package (excluding dev dependencies & test files)
echo "[3/4] Packaging application for App Service deployment..."
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

echo "Deployment archive created (${ZIP_NAME})"

# 4. Deploy to Azure App Service
echo "[4/4] Deploying archive to Azure App Service: ${APP_NAME}..."
az webapp deploy \
  --resource-group "${RESOURCE_GROUP}" \
  --name "${APP_NAME}" \
  --src-path "${ZIP_NAME}" \
  --type zip \
  --clean true

# Clean up zip
rm -f "${ZIP_NAME}"

echo "========================================================"
echo " Deployment Complete!"
echo " Web App URL: https://${APP_NAME}.azurewebsites.net"
echo " Live Health Check: https://${APP_NAME}.azurewebsites.net/health"
echo " To monitor logs in real-time run:"
echo "   az webapp log tail --resource-group ${RESOURCE_GROUP} --name ${APP_NAME}"
echo "========================================================"
