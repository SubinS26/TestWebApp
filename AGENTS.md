# SYSTEM PROTOCOL: CLOUD-NATIVE INSTAGRAM REELS CLONE

## 1. Project Objective & Core Architecture
Build and deploy a scalable, advanced, cloud-native web application optimized for video-sharing capabilities, conceptually mapping to platforms like TikTok or Instagram Reels. 

* **Frontend Delivery:** Static web file hosting interacting exclusively with the backend architecture via standard REST API calls.
* **Backend Delivery:** A hosted REST API endpoint providing the operational application logic, route handlers, and data stream connections.
* **Data Persistence:** Persistent storage architecture partitioning structured information across scalable hosted databases and multi-media assets within block/object storage pools.

## 2. Identity Management & Functional Role Constraints
Implement strict Role-Based Access Control (RBAC) to enforce distinct account partitions using standard authentication mechanisms:

### Creator Accounts ("Influencers")
* **Privileges:** Exclusively permitted to upload video content to the platform.
* **Data Schema:** Every upload must explicitly configure and bind video metadata tracking fields including: Title, Publisher, Producer, Genre, and Age Rating (e.g., PG, 18).
* **Enrollment Scope:** Do NOT construct a public user sign-up page for this tier; seed or configure these accounts directly in the persistence layer.

### Consumer Accounts ("Followers")
* **Privileges:** Public registration and sign-up flows must be functional. Consumers must be able to load the primary dashboard, search/filter video profiles, stream files, submit text comments, and apply numerical ratings or likes.
* **Restrictions:** Completely block and deny consumer identity claims from interacting with any video upload paths or endpoints.

## 3. Core Interface & Infrastructure Requirements
* **Primary Feed:** Provide a centralized user dashboard view highlighting and serving the latest uploaded videos.
* **Caching Layer:** Deliver scalability mechanisms by deploying a caching network to decrease lookup times and offload recurring read traffic from the core database engine.
* **Routing Architecture:** Configure dynamic DNS routing to smoothly manage incoming traffic profiles.

## 4. Advanced Technical Integrations (Distinction Level)
Incorporate a minimum of three advanced software engineering integrations to fulfill the maximum grading rubric bracket:
* **Identity Protection:** Fully integrate a standard cloud identity provider and framework to handle verification, security sessions, and authorization tokens.
* **Cognitive Sentiment Engine:** Implement a real-time natural language processing service to intercept consumer comment submissions and analyze text sentiment prior to storage.
* **Media Processing Pipeline:** Configure an event-driven media conversion engine using tools like FFmpeg to transcode or standardize raw uploaded assets into web-optimized resolutions.
* **Automated CI/CD Workflows:** Deliver a structured codebase with an automated deployment pipeline tracking the main source branches.

## 5. Deployment Framework
* **Platform Target:** Completely implement, test, and deploy the functioning architecture to the designated cloud platform (Microsoft Azure).
* **Design Pattern Synthesis:** Code and document the stack to highlight a distinct PaaS/Cloud-Native delivery model, providing comparative architecture justifications against a self-contained containerized approach.
