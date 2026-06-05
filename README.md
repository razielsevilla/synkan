# Synkan 🚀

**[View Landing Page](https://synkan-landing-page.vercel.app/)** | **[Launch Live App](https://synkan-app.vercel.app/)**

A high-performance, local-first, peer-to-peer (P2P) collaborative Kanban engine built entirely without a centralized database or server infrastructure. 

Traditional collaboration tools rely heavily on cloud servers to arbitrate state and resolve user conflicts. **Synkan** flips this architecture by making the user's local device the primary source of truth. By utilizing Conflict-Free Replicated Data Types (CRDTs) and WebRTC data channels, team members can manage tasks, restructure columns, and update project scopes fully offline, synchronizing their states seamlessly the moment a peer connection is established.

---

## 🏛️ Core Architectural Pillars

* **Offline-First & Local-First:** All application state is stored locally on the user's machine using high-speed client-side storage. The application is fully functional with zero network connectivity.
* **Serverless P2P Sync:** State propagation occurs directly browser-to-browser via WebRTC. No central database, API gateways, or external cloud infrastructure are used to manage project records.
* **Deterministic Conflict Resolution:** State mutations are modeled through state-of-the-art CRDTs (Conflict-Free Replicated Data Types), ensuring that concurrent, conflicting edits (e.g., two users moving the same card simultaneously while offline) automatically resolve to an identical, mathematically consistent state across all nodes.

---

## ⚠️ The Problem: Centralized Cloud Dependency & Data Vulnerability

Modern productivity and collaboration ecosystems (e.g., Trello, Jira, Notion, Asana) are structurally tethered to the **Client-Server-Database** paradigm. This structural centralized dependency introduces three severe critical system vulnerabilities:

### 1. Hard Network Interdependence & Latency Spikes
Standard applications require an active internet connection to execute even minor state updates (such as moving a card or appending a comment). If a user experiences network degradation, a spotty commute, or a complete Wi-Fi outage, the application degrades or locks completely. Every interaction incurs a round-trip network latency penalty, resulting in heavy UI spinners and non-instant experiences.

### 2. Corporate Surveillance, Data Leaks, and Lost Autonomy
When teams host project plans, architectural specs, and roadmaps on cloud vendors, they relinquish physical ownership of their proprietary operational data. This data sits in central multi-tenant cloud databases, exposing organizations to external data breaches, cloud service provider outages, and controversial changes in service terms—such as automated model training on confidential data repositories.

### 3. The Centralized Infrastructure Scaling Tax
For developers and small organizations, building a collaborative platform requires hosting, managing, and maintaining high-availability servers. Real-time synchronizations typically dictate extensive configurations of persistent WebSocket connections, Redis message brokers, API gateways, and relational or document databases. As the user base expands linearly, the operational infrastructure cost scales exponentially, making staging and running software deeply expensive.

---

## 💡 The Solution: True Local-First Autonomy

**Synkan** systematically dismantles this paradigm by implementing a **Local-First software architecture**. It decouples application execution from the cloud, providing an architecture that treats the network purely as an opportunistic synchronization layer rather than a hard constraint.

### 1. Network-Agnostic, 60fps Execution
Because data is read from and written directly to the host machine's hardware, the application executes operations with immediate zero-latency feedback. The software runs completely offline by default. Turning on airplane mode or entering a dead zone has no impact on data entry, structural configuration, or interface performance.

### 2. Cryptographic Privacy & Total Data Ownership
By migrating the data repository onto the user's physical drive, your strategic project assets remain under your strict local jurisdiction. Data synchronization travels exclusively through secure, end-to-end encrypted paths between connected peers. If a team operates within a localized network or a private perimeter, their intellectual property never leaves their physical devices.

### 3. Infinite Scales at Zero Hosting Infrastructure Costs
Synkan transitions the burden of computation, storage, and networking away from centralized nodes and out to the edge. The application scales to infinity for **zero dollars in database or backend server hosting costs**. Because every client acts as an active computing node, the source code can be bundled into static assets (HTML/JS/TS) and served for free via static edge routers (like GitHub Pages).

---

## 🛠️ How It Is Solved: Technical Architecture Deep-Dive

To achieve true serverless collaboration without a central coordinator to act as a source of truth, Synkan combines local high-speed persistence engines, state-of-the-art replication primitives, and ad-hoc networking protocols.

### 1. State Modeling via Conflict-Free Replicated Data Types (CRDTs)
Instead of mutating standard mutable objects or writing raw SQL rows, Synkan records the board's history as an immutable, append-only, log-structured distributed document managed by a CRDT library (**Automerge/Yjs**). 
* When a card is modified, the operation is logged locally as a cryptographic delta node.
* When disconnected users make concurrent modifications, CRDT math ensures that the state vectors automatically and deterministically converge to an identical state across all devices when a sync occurs, without requiring a central server to break ties.

### 2. Solving the "Concurrent Move" Problem via Fractional Indexing
In a distributed board, traditional integer-based indices ($0, 1, 2$) cause arrays to collapse during simultaneous offline re-ordering. Synkan solves this by employing **Fractional Indexing (Lexical Positioning)**.
* Every card is assigned a string-based fractional index (e.g., position `"A"` and `"B"`).
* If a user inserts a card between them offline, it is given the deterministic string midpoint `"AI"`.
* This ensures that two users dragging different items into the same relative slot offline will resolve into clean, mathematically logical positions without shifting, dropping, or duplicating records.

### 3. Hybrid Persistence & Local Storage Rehydration
The current state of the active CRDT graph is instantly and reactively mirrored to the browser's fast, structured storage engine (**IndexedDB** or **Wasm-compiled SQLite**). Every single keystroke or drag event triggers an atomic local flush. When a user closes the application, reopens it, or reboots their system, the document state rehydrates instantly into active RAM memory directly from disk, requiring no initial network handshake.

### 4. Serverless Peer Discovery and Transport
Binary state vectors and delta changes are propagated between active client nodes using **WebRTC Data Channels**. 
* Nodes exchange lightweight cryptographic state vectors representing their current version timeline (*"I am on change log version #301"*).
* The receiving node checks its local graph, identifies the missing deltas, and streams only the precise increment changes required to bring the peer up to speed, dramatically compressing network bandwidth overhead.

---

## 🛠️ Planned Tech Stack

* **State & CRDT Engine:** Automerge / Yjs (Log-structured distributed documents)
* **Local Storage Layer:** IndexedDB / Wasm-compiled SQLite (Instant persistence and rehydration)
* **Networking Protocol:** WebRTC Data Channels (Peer discovery and direct binary streaming)
* **Interface Layer:** TypeScript + React / Vite (For highly modular, strictly typed, reactive UI layout component states)

---

## 🎛️ Planned Key Technical Challenges Addressed

1.  **The Concurrent Move Problem:** Implementing fractional indexing and lexical positioning to handle the reordering of nested array elements (cards within columns) across distributed systems without structural degradation.
2.  **State Rehydration & Delta Compression:** Leveraging state vectors to calculate missing cryptographic deltas between peers, minimizing network bandwidth by transmitting only incremental mutations rather than full document states.
3.  **Tombstone Management & Data Retention:** Mitigating data loss risks caused by concurrent delete-and-edit actions across isolated nodes through a robust event-log and soft-deletion tracking architecture.