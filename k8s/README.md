# Kubernetes (K8s) Cloud-Native Deployment Architecture

## 1. Overview & Architectural Topology

This directory contains the production-grade **Kubernetes (K8s)** manifests and declarative GitOps specifications for the **Cloud-Native Instagram Reels / Video-Sharing Platform**.

```mermaid
graph TD
    Client([Global Users / Edge Traffic]) --> Ingress[Ingress Controller / TLS Termination]
    
    subgraph K8s_Namespace [Namespace: videoshare-prod]
        Ingress -->|Route /| Service[ClusterIP / LoadBalancer Service]
        Service --> Pod1[Pod 1: Node.js API + Video Pipeline]
        Service --> Pod2[Pod 2: Node.js API + Video Pipeline]
        Service --> Pod3[Pod 3: Node.js API + Video Pipeline]
        
        HPA[Horizontal Pod Autoscaler (HPA)] -.->|Scale 2 - 10 Replicas| Deployment[Deployment: videoshare-deployment]
        PDB[Pod Disruption Budget (PDB)] -.->|Guarantees High Availability| Deployment
        
        ConfigMap[ConfigMap: videoshare-config] -->|Env Vars| Deployment
        Secret[Secret: videoshare-secret] -->|Encrypted Credentials| Deployment
        PVC[PersistentVolumeClaim: 10Gi] -->|Media Cache /posts| Deployment
    end

    Pod1 -->|TCP / SSL| MySQL[(Azure Database for MySQL Flexible Server)]
    Pod1 -->|HTTPS / Async Replication| AzureBlob[(Azure Blob Storage: media, posts, comments)]
    Pod2 -->|TCP / SSL| MySQL
    Pod2 -->|HTTPS / Async Replication| AzureBlob
```

---

## 2. Manifest Inventory & Structure

| File | Resource Type | Purpose & Specifications |
| :--- | :--- | :--- |
| [`00-namespace.yaml`](file:///home/haku/Documents/University/CourseDocuments/ScalableAdvancedSoftwareSolution/Assessment&Feedback/TestWebApp-main/k8s/00-namespace.yaml) | `Namespace` | Logical isolation boundary (`videoshare-prod`) separating production resources. |
| [`01-configmap.yaml`](file:///home/haku/Documents/University/CourseDocuments/ScalableAdvancedSoftwareSolution/Assessment&Feedback/TestWebApp-main/k8s/01-configmap.yaml) | `ConfigMap` | Non-sensitive configurations: ports, database hostnames, container names, and SSL flags. |
| [`02-secret.yaml`](file:///home/haku/Documents/University/CourseDocuments/ScalableAdvancedSoftwareSolution/Assessment&Feedback/TestWebApp-main/k8s/02-secret.yaml) | `Secret` | Encrypted/Base64 database credentials, session keys, and Azure storage connection strings. |
| [`03-pvc.yaml`](file:///home/haku/Documents/University/CourseDocuments/ScalableAdvancedSoftwareSolution/Assessment&Feedback/TestWebApp-main/k8s/03-pvc.yaml) | `PersistentVolumeClaim` | 10Gi persistent block storage claim for local high-speed video cache and transcoding buffers. |
| [`04-deployment.yaml`](file:///home/haku/Documents/University/CourseDocuments/ScalableAdvancedSoftwareSolution/Assessment&Feedback/TestWebApp-main/k8s/04-deployment.yaml) | `Deployment` | 3-replica multi-pod deployment with `RollingUpdate`, resource limits, and health probes. |
| [`05-service.yaml`](file:///home/haku/Documents/University/CourseDocuments/ScalableAdvancedSoftwareSolution/Assessment&Feedback/TestWebApp-main/k8s/05-service.yaml) | `Service` | Dual-mode networking: internal `ClusterIP` (port 80) and cloud `LoadBalancer` (ports 80 & 443). |
| [`06-ingress.yaml`](file:///home/haku/Documents/University/CourseDocuments/ScalableAdvancedSoftwareSolution/Assessment&Feedback/TestWebApp-main/k8s/06-ingress.yaml) | `Ingress` | NGINX/Azure Application Gateway ingress controller with SSL redirect, rate-limiting, and proxy buffers. |
| [`07-hpa.yaml`](file:///home/haku/Documents/University/CourseDocuments/ScalableAdvancedSoftwareSolution/Assessment&Feedback/TestWebApp-main/k8s/07-hpa.yaml) | `HorizontalPodAutoscaler` | Dynamic autoscaling based on CPU (>70%) and Memory (>80%) with a scale bounds of 2 to 10 pods. |
| [`08-pdb.yaml`](file:///home/haku/Documents/University/CourseDocuments/ScalableAdvancedSoftwareSolution/Assessment&Feedback/TestWebApp-main/k8s/08-pdb.yaml) | `PodDisruptionBudget` | Enforces a minimum of 1 available pod during cluster upgrades or voluntary node maintenance. |
| [`kustomization.yaml`](file:///home/haku/Documents/University/CourseDocuments/ScalableAdvancedSoftwareSolution/Assessment&Feedback/TestWebApp-main/k8s/kustomization.yaml) | `Kustomization` | Declarative bundle orchestrating the single-command deployment of all cluster resources. |

---

## 3. High-Availability & Resilience Configurations

### Zero-Downtime Rolling Updates
```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
```
Guarantees that new versions of the application are started, health-checked, and ready before terminating older pods.

### Liveness & Readiness Probes
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 4300
  initialDelaySeconds: 25
  periodSeconds: 15
readinessProbe:
  httpGet:
    path: /health
    port: 4300
  initialDelaySeconds: 10
  periodSeconds: 10
```
Traffic is only routed to pods once the application runtime and database connection pool are fully initialized.

### Dynamic Autoscaling (HPA)
The `HorizontalPodAutoscaler` dynamically scales container replicas from **2 to 10** based on incoming traffic load and FFmpeg video processing demands.

---

## 4. Deployment Instructions

### Deploy via Kustomize (Local or AKS)
```bash
# 1. Apply all Kubernetes manifests declaratively
kubectl apply -k k8s/

# 2. Verify rollout status
kubectl rollout status deployment/videoshare-deployment -n videoshare-prod

# 3. View cluster state
kubectl get pods,services,hpa,ingress -n videoshare-prod

# 4. Access local cluster port-forwarding
kubectl port-forward svc/videoshare-service 8080:80 -n videoshare-prod
```

### Automated Script Deployment
```bash
# Deploy to local cluster
./k8s/deploy-k8s.sh local

# Deploy to Azure Kubernetes Service (AKS)
./k8s/deploy-k8s.sh aks
```

---

## 5. Architectural Synthesis: PaaS vs. Kubernetes (K8s)

| Evaluation Criterion | Azure App Service (PaaS) | Kubernetes / AKS (Container Orchestration) |
| :--- | :--- | :--- |
| **Operational Overhead** | **Low:** Managed OS, automated runtime patching, integrated SSL and continuous deployment. | **Medium-High:** Requires cluster lifecycle management, ingress controllers, CNI networking, and node pool maintenance. |
| **Granular Autoscaling** | Scales entire App Service VM instances (1 to 10). | Scales individual microservice pods within seconds based on fine-grained CPU/Memory metrics. |
| **Multi-Cloud Portability** | Vendor-locked to Microsoft Azure PaaS APIs and App Service configurations. | **100% Cloud-Agnostic:** Standard OCI containers and declarative K8s manifests run on AKS, AWS EKS, GCP GKE, or bare-metal. |
| **Cost Profile at Scale** | Predictable tier-based pricing; higher unit cost at massive concurrent scale. | Highly cost-efficient at scale through tight pod bin-packing and spot node instance pools. |
