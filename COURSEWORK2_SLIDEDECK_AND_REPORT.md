# COM769 Scalable Advanced Software Solutions — Coursework 2
## Scalable Cloud-Native Video Sharing Platform (Instagram Reels Clone)

**Author:** Subin Shrestha (`rtr.shrestha.subin@gmail.com`)  
**Repository:** [https://github.com/SubinS26/TestWebApp](https://github.com/SubinS26/TestWebApp)  
**Cloud Deployment Target:** Microsoft Azure (PaaS Delivery Model)  
**Target Grade Bracket:** Distinction (70–100%)

---

## 1. Executive Summary & Problem Definition

### 1.1 The Scalability Challenge in Video-Sharing Architectures
Modern short-form video streaming platforms (e.g., Instagram Reels, TikTok) experience intense, bursty traffic patterns characterized by high read-to-write ratios, massive concurrent multimedia streams, real-time social interactions (likes, shares, nested comments), and compute-intensive media ingestion workloads.

Traditional monolithic, single-server architectures fail under these workloads due to:
* **Storage Bottlenecks:** Storing multi-gigabyte video files on local server filesystems exhausts disk space and locks file I/O operations.
* **Database Connection Saturation:** High concurrent read queries for feeds, comments, and profile stats exhaust database connection pools.
* **Compute Contention:** Video encoding and media transformations run on the same thread/server as the HTTP request lifecycle, causing request timeouts.
* **Global Latency & Jitter:** Serving high-definition video assets directly from a centralized origin server results in high buffering latency for geographically dispersed consumers.

### 1.2 The Cloud-Native Solution
To resolve these challenges, this application adopts a **decoupled, scalable PaaS (Platform as a Service) cloud-native architecture** deployed on Microsoft Azure. By partitioning frontend delivery, RESTful API computation, relational metadata persistence, and block/blob media storage into specialized managed services, the platform achieves horizontal auto-scaling, low latency, and 99.95% cloud availability.

---

## 2. System Architecture & Component Design

```
+----------------------------------------------------------------------------------------------------+
|                                    AZURE CLOUD INFRASTRUCTURE                                      |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|   +---------------------------------------+         +------------------------------------------+   |
|   |         CLIENT INTERACTION            |         |            EDGE & ROUTING LAYER          |   |
|   |                                       |         |                                          |   |
|   |  [ Web Browser / Mobile Web Client ]  |-------->|  [ Azure Static Web Apps (Edge CDN) ]    |   |
|   |   - React 16 Single Page App (SPA)    |         |   - Distributed Static HTML/JS/CSS Host  |   |
|   |   - Redux State Management            |         |   - Global Edge Caching                  |   |
|   |   - HTML5 Video Streaming Engine      |         |   - Dynamic DNS Routing                  |   |
|   +---------------------------------------+         +------------------------------------------+   |
|                      |                                                    |                        |
|                      | REST API Requests (CORS + Cookies)                 |                        |
|                      v                                                    v                        |
|   +--------------------------------------------------------------------------------------------+   |
|   |                           APPLICATION BACKEND LAYER (Compute)                              |   |
|   |                                                                                            |   |
|   |  [ Azure App Service (cw2-videoshare-api) - Node.js 18 LTS ]                               |   |
|   |   ├── Express REST API Controllers & Middleware                                            |   |
|   |   ├── RBAC Engine (Superadmin / Creator Influencer / Consumer Follower)                     |   |
|   |   ├── Cognitive Sentiment Analysis Engine (Azure Cognitive Services / NLP)                 |   |
|   |   └── Auto-Scaling Controller (Horizontal instance scaling based on CPU / HTTP queue)     |   |
|   +--------------------------------------------------------------------------------------------+   |
|                      |                                                    |                        |
|                      v                                                    v                        |
|   +---------------------------------------+         +------------------------------------------+   |
|   |       RELATIONAL DATA PERSISTENCE     |         |          CLOUD OBJECT PERSISTENCE        |   |
|   |                                       |         |                                          |   |
|   |  [ Azure Database for MySQL Server ]  |         |  [ Azure Blob Storage Container ]        |   |
|   |   ├── cw2-videoshare-db               |         |   ├── cw2videostorage01 / posts          |   |
|   |   ├── Resilient Connection Pool (10)  |         |   ├── Video Assets (.mp4, .webm, .mov)   |   |
|   |   ├── Strict SSL (DigiCert Baltimore) |         |   ├── HTTP Byte-Range Seeking Stream     |   |
|   |   └── Automated Indexing & Foreign Key|         |   └── Global Block Blob Replication      |   |
|   +---------------------------------------+         +------------------------------------------+   |
|                                                                                                    |
+----------------------------------------------------------------------------------------------------+
```

---

## 3. Advanced Features Breakdown (Distinction Bracket)

| Feature | Technology | Architectural Role & Implementation Details |
| :--- | :--- | :--- |
| **1. Cloud Object Storage** | Azure Blob Storage SDK (`@azure/storage-blob`) | Decouples video storage from web server disk. Uploads videos directly to Azure Blob containers (`posts`) and streams them globally via CDN-ready URLs. |
| **2. Cognitive Sentiment Analysis** | Azure Cognitive Services Text Analytics API + Local NLP Engine | Intercepts consumer comment submissions in real-time. Analyzes sentiment polarity (Positive, Neutral, Negative) and confidence scores prior to storage. |
| **3. Identity & RBAC Framework** | Client Sessions + Password Hashing + RBAC Middleware | Strict Role-Based Access Control partitioning: <br>• **Superadmin:** Full user management, role elevation, global deletion.<br>• **Creator (Influencer):** Exclusively permitted to upload videos with metadata (Title, Publisher, Producer, Genre, Age Rating).<br>• **Consumer (Follower):** Public registration, dashboard browsing, streaming, rating, commenting. Blocked from uploads. |
| **4. Media Processing Pipeline** | Client-Side Video Introspection + `handy-image-processor` | Standardizes uploaded media, enforces maximum 5-minute video duration rules, extracts video metadata, and optimizes compression. |
| **5. Automated CI/CD Workflows** | GitHub Actions (`azure-static-web-apps` & `azure-app-service`) | Automated build, test, package, and continuous deployment tracking `main` branch to Azure Static Web Apps and Azure App Service. |

---

## 4. Coursework 2 Presentation Script & Slide Outline (12 Slides)

This outline maps directly to the recommended 12-slide format for the **5-minute video demonstration**:

### Slide 0: Title Slide
* **Title:** Scalable Cloud-Native Video Sharing Platform (Reels Clone)
* **Subtitle:** COM769 Scalable Advanced Software Solutions — Coursework 2
* **Student Name:** Subin Shrestha
* **Student Email:** `rtr.shrestha.subin@gmail.com`
* **GitHub Repository:** `https://github.com/SubinS26/TestWebApp`

### Slides 1–2: Problem Definition & Scalability Issues
* **Context:** Video-sharing applications demand high throughput, scalable data persistence, and resilient streaming under sudden viral traffic surges.
* **Core Issues Identified:**
  1. High I/O overhead on origin web servers when streaming video files.
  2. Database concurrency degradation during rapid social interactions.
  3. Single point of failure (SPOF) in monolithic deployments.
* **Why Cloud-Native PaaS:** Horizontal auto-scaling, managed database high availability, decoupled blob storage, and reduced operational overhead compared to self-managed IaaS VMs.

### Slides 3–6: Technical Solution Architecture
* **Frontend:** Single Page Application (React, Redux, SCSS) hosted on Azure Static Web Apps with global edge distribution.
* **Backend:** Node.js/Express REST API hosted on Azure App Service (`cw2-videoshare-api`) with health probes and auto-scaling rules.
* **Persistence:** Azure Database for MySQL Flexible Server with resilient connection pooling (`mysql.createPool`) and SSL encryption.
* **Media Storage:** Azure Blob Storage (`cw2videostorage01`) for zero-loss video streaming and persistent block storage.
* **Control Flows:** Sequence diagrams showing the video upload workflow from Creator client -> REST API -> Azure Blob Storage -> MySQL metadata insertion.

### Slides 7–8: Advanced Features Overview
* **Cognitive Sentiment Analysis Engine:** Demonstration of consumer comment interception and natural language processing scoring.
* **RBAC & Identity Security:** Creator vs Consumer account constraints. Demonstration showing Creators uploading video content with Title, Publisher, Producer, Genre, and Age Rating (PG, 18), while Consumer accounts stream, rate, and comment.
* **Automated CI/CD Workflows:** Automated deployment pipelines executing builds and pushing releases to Azure on every git push.

### Slides 9–10: Limitations & Scalability Assessment
* **Limitations Identified:**
  1. Synchronous video processing at high file sizes can be improved using asynchronous serverless Azure Functions (Queue-based event processing).
  2. In-memory session tracking across multiple server instances requires distributed Redis cache (Azure Cache for Redis).
* **Scaling Strategies & Roadmap:**
  1. Integration of Azure CDN / Azure Front Door for global edge-cached video streaming.
  2. Database read replicas to offload read-heavy dashboard and search traffic.
  3. Azure Media Services for multi-bitrate adaptive HLS/DASH transcoding.

### Slides 11–12: Concluding Comments & Reflection
* **Summary:** Successfully built, containerized, tested, and deployed an end-to-end cloud-native video sharing platform adhering to all distinction criteria.
* **Key Learning Outcomes:** Gained deep practical mastery of cloud PaaS architectures, connection pool resilience, RESTful micro-architectures, and automated CI/CD pipelines.
* **References:** Academic and technical literature cited adhering to Harvard referencing standards.

---

## 5. Verification & Deployment Commands

```bash
# Initialize and seed the Azure Database for MySQL
npm run init-db

# Compile the production Webpack bundle
npm run build

# Deploy all services to Azure
npm run deploy:azure
```
