# MediCheck: AI + Blockchain Medication Verification Platform

**Track:** AI & DePIN 

**Hedera Network:** Testnet

<img width="1297" height="704" alt="Gemini_Generated_Image_ebcrwcebcrwcebcr" src="https://github.com/user-attachments/assets/76913b90-5af2-49c0-a9e5-523215bb92fd" />

## Project Overview

MediCheck tackles Africa's counterfeit drug crisis by combining Hedera's consensus services with AI-powered verification. The platform enables secure drug traceability from manufacturer to patient, with real-time authenticity verification in local languages, addressing the $200B+ global counterfeit pharmaceutical problem that disproportionately affects developing regions.

---

## Dual-Layer Architecture: HCS-2 + HCS-10

### Overview

MediCheck is a medication verification and traceability platform leveraging Hedera's Distributed Ledger Technology (DLT). The platform utilizes **both HCS-2 and HCS-10** working together to create a comprehensive trust system: **HCS-2 provides immutable event logging** while **HCS-10 enables secure, intelligent communication** between organizations.

### What is HCS-10?

HCS-10 defines a decentralized protocol for agent communication across organizations. Agents represent organizations like manufacturers, distributors, pharmacies, and hospitals, interacting via Hedera Consensus Service topics for verifiable communication.

**In Simple Terms:** HCS-10 enables organizations to "talk" to each other through blockchain-verified messages, creating a living network where every interaction is transparent, traceable, and tamper-proof.

### Why Use HCS-2 and HCS-10 Together?

**HCS-2 (Event Ledger):** Provides immutable logging of all critical supply chain events—batch creation, transfers, flagging, and recalls. Every action is permanently recorded with cryptographic proof.

**HCS-10 (Communication Layer):** Enables real-time, verifiable communication between organizations. Transfer confirmations, authenticity handshakes, and event announcements happen through dedicated agent topics.

**Combined Power:** HCS-2 logs what happened (immutable history), while HCS-10 coordinates how it happens (verifiable communication). Together, they create complete transparency and trust across the pharmaceutical supply chain.

### Key Components

1. **Agent Creation:** Creates HCS-10 agents with inbound/outbound topics for each organization
2. **Managed Registry:** Each organization has a registry for announcements like "Batch Created" or "Batch Flagged"
3. **Agent Connections:** Enables secure, traceable communication between two organizations
4. **Batch Transfer Updates:** Adds HCS-10 announcements for transfers between sender and receiver
5. **Unit Verification:** Broadcasts scan results to manufacturers for authenticity checks
6. **SafeSendHcs10 Helper:** Provides fault-tolerant message dispatch to correct HCS topics
7. **Agent Message Logging:** Keeps a verifiable audit trail of all HCS-10 communications

### Security Benefits

With the combined HCS-2 + HCS-10 architecture, MediCheck benefits from:

- **Improved Data Authenticity:** Two-layer verification (HCS-2 logs + HCS-10 confirmations)
- **Complete Communication Auditability:** Every message between organizations is permanently recorded
- **Real-time Attack Detection:** Suspicious communication patterns trigger immediate alerts
- **Fully Traceable Event Histories:** Complete provenance from manufacturer to patient

### System Flow Summary

1. **Organization registers** → HCS-10 agent is automatically created
2. **Manufacturer creates a batch** → Event logged on HCS-2 + broadcast via HCS-10 managed registry
3. **Batch transfers** → Sender and receiver agents communicate via HCS-10 connection topic + permanent log on HCS-2
4. **Consumer scans a drug unit** → Authenticity verified from HCS-2 logs + scan event broadcast to manufacturer via HCS-10

**Result:** The dual-layer architecture transforms MediCheck into an intelligent, interactive verification network where each organization operates a verifiable agent, enabling real-time, ledger-backed communication across the healthcare supply chain.

---

## Architecture: HCS-2 + HCS-10 Working Together

### Visual Architecture

**Before (Single-Layer Approach)**

<img width="1266" height="502" alt="Untitled diagram-2025-10-29-224752" src="https://github.com/user-attachments/assets/f8344828-3867-423e-a9c4-e133fc77b460" />

Single topic for all events. No direct communication between organizations—just reading shared logs.

**MediCheck (Dual-Layer Architecture)**

<img width="472" height="625" alt="Screenshot 2025-10-29 234930" src="https://github.com/user-attachments/assets/276d7501-f8c4-4dc2-abc7-2dada3dbf55e" />

**How They Work Together:**
- **HCS-2** serves as the immutable event ledger (batch registry, logs, and public record)
- **HCS-10** operates as the real-time communication and validation layer between organizations
- Each organization gets a managedRegistry (HCS-10 topic) for announcements
- Agents have inboundTopic, outboundTopic, and optional connectionTopic fields
- The organization agent mediates between HCS-2 (permanent logs) and HCS-10 (direct comms)

---

## Complete Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                           │
│                     http://localhost:3000                            │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ QR Scanner │  │ Verification│  │  Dashboard   │  │  Transfer  │ │
│  │   (NFC)    │  │     UI      │  │  Analytics   │  │  Management│ │
│  └─────┬──────┘  └──────┬──────┘  └──────┬───────┘  └─────┬──────┘ │
└────────┼─────────────────┼────────────────┼─────────────────┼────────┘
         │                 │                │                 │
         └─────────────────┼────────────────┼─────────────────┘
                           │                │
                    ┌──────▼────────────────▼──────┐
                    │    BACKEND (Next.js API)     │
                    │   ┌──────────────────────┐   │
                    │   │   Clerk Auth         │   │
                    │   │   (User Management)  │   │
                    │   └──────────────────────┘   │
                    │   ┌──────────────────────┐   │
                    │   │  Prisma ORM          │   │
                    │   │  (PostgreSQL)        │   │
                    │   └──────────────────────┘   │
                    │   ┌──────────────────────┐   │
                    │   │  Business Logic      │   │
                    │   │  - Batch Creation    │   │
                    │   │  - Transfer Logic    │   │
                    │   │  - Verification      │   │
                    │   │  - HCS-10 Agents     │   │
                    │   └──────────────────────┘   │
                    └────────┬──────────┬──────────┘
                             │          │
              ┌──────────────┴──────┐   └────────────────┐
              │                     │                     │
    ┌─────────▼──────────┐ ┌───────▼─────────┐ ┌────────▼──────────┐
    │  HEDERA HCS-2      │ │  HEDERA HCS-10  │ │   GEMINI AI API   │
    │    (Testnet)       │ │    (Testnet)    │ │                   │
    │ ┌────────────────┐ │ │ ┌─────────────┐ │ │ - Drug Verification│
    │ │ Registry Topic │ │ │ │   Agents    │ │ │ - Local Language  │
    │ │(Immutable Log) │ │ │ │Managed Reg. │ │ │   Translation     │
    │ └────────────────┘ │ │ │ Connection  │ │ │ - Consumer Ed     │
    │ ┌────────────────┐ │ │ │   Topics    │ │ └───────────────────┘
    │ │ Consensus      │ │ │ └─────────────┘ │
    │ │ Service        │ │ └─────────────────┘
    │ └────────────────┘ │
    │ ┌────────────────┐ │
    │ │ Mirror Node    │ │
    │ │ (Query Layer)  │ │
    │ └────────────────┘ │
    └────────────────────┘

DATA FLOW:
1. User scans QR/NFC → Frontend captures unit ID
2. Frontend → Backend API (auth via Clerk)
3. Backend queries PostgreSQL for batch metadata
4. Backend submits verification event → HCS-2 Topic (immutable log)
5. HCS-10 agent broadcasts scan event to manufacturer's managed registry
6. Hedera returns consensus timestamp + transaction ID
7. Backend stores transaction receipt in PostgreSQL
8. Backend queries Gemini AI for drug info + local translation
9. Response flows back: Hedera status + AI insights → Frontend → User
```

<img width="1193" height="628" alt="Screenshot 2025-10-29 235536" src="https://github.com/user-attachments/assets/a4f2d6ef-e207-430a-b5af-fb7c76e83e4f" />

---

## Hedera Integration Summary

### Dual-Layer Architecture: HCS-2 + HCS-10

**HCS-2 (Hedera Consensus Service):**
- **Purpose:** Immutable event ledger for critical supply chain records
- **What it stores:** Batch creation, ownership transfers, flagging, recalls
- **Why HCS-2:** Provides permanent, tamper-proof audit trail with predictable $0.0001 fee

**HCS-10 (Intelligent Communication Layer):**
- **Purpose:** Real-time, verifiable communication between organization agents
- **What it enables:** Transfer confirmations, authenticity handshakes, event announcements
- **Why HCS-10:** Adds interactive coordination while maintaining cryptographic verification

**Combined Power:**
- HCS-2 guarantees integrity (permanent record)
- HCS-10 guarantees communication (real-time coordination)
- Together, they guarantee trust across the entire supply chain

### Why HCS Over Traditional Blockchain?

**Cost Efficiency:**
- **Hedera HCS:** $0.0001 per transaction → $1-2/month for 10,000 verifications + inter-org communications
- **Ethereum Alternative:** ~$2-5 per transaction → $20,000-50,000/month (prohibitive for Africa)
- **Traditional Centralized DB:** Free transactions but lacks auditability, immutability, and trust

**Performance:**
- Hedera's 10,000 TPS throughput supports national-scale rollout without congestion
- 3-5 second finality enables real-time QR code verification at pharmacy counters
- ABFT consensus ensures no forking or rollbacks (critical for regulatory compliance)

**Africa-Specific Impact:**
- Low, predictable fees make the platform sustainable for underfunded healthcare systems
- Fast finality reduces patient wait times in high-volume clinics
- Immutable audit trail builds trust in regions with weak regulatory enforcement

---

## Deployed Hedera IDs (Testnet)

**Critical Infrastructure IDs:**
- **Operator Account ID:** `0.0.6621805`

**Note:** All transactions visible on HashScan Testnet Explorer: `https://hashscan.io/testnet/topic/0.0.6621805`

---

## Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend/Backend** | Next.js 15 | Full-stack React framework |
| **Authentication** | Clerk | Secure user/role management |
| **Database** | PostgreSQL + Prisma ORM | Off-chain data (user profiles, analytics) |
| **Blockchain (HCS-2)** | Hedera Testnet | Immutable supply chain audit trail |
| **Communication (HCS-10)** | Hedera Testnet | Agent-to-agent verifiable messaging |
| **AI/LLM** | Google Gemini | Local-language verification + education |
| **Styling** | Tailwind CSS | Responsive UI components |

---

## Deployment & Setup Instructions

**Prerequisites:**
- Node.js ≥ 18.x
- pnpm (or npm/yarn)
- PostgreSQL database (local or cloud)

**Expected Running State:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3000/api/*`
- Database: PostgreSQL connection on port 5432
- Hedera Network: Testnet (no local node required)

### Step-by-Step Setup (< 10 minutes)

**1. Clone the Repository**
```bash
git clone https://github.com/Derojuu/MediCheck.git
cd MediCheck
```

**2. Install Dependencies**
```bash
pnpm install
# or: npm install / yarn install
```

**3. Configure Environment Variables**

Create a `.env` file in the project root with the following structure (see `.env.example` for template):

```env
# ===============================================
# DATABASE CONFIGURATION
# ===============================================
# Prisma Accelerate connection URL (for pooled connections)
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_PRISMA_ACCELERATE_API_KEY"

# Direct PostgreSQL connection URL (non-pooled) for migrations and schema operations
POSTGRES_URL="postgres://USERNAME:PASSWORD@HOST:5432/DATABASE_NAME?sslmode=require"

# ===============================================
# HEDERA NETWORK CONFIGURATION (Testnet)
# ===============================================
# Your Hedera testnet account ID (format: 0.0.XXXXXX)
HEDERA_OPERATOR_ID=0.0.XXXXXX

# Your Hedera testnet account private key (64-character hex string with 0x prefix)
HEDERA_OPERATOR_KEY=0xYOUR_HEDERA_PRIVATE_KEY_HERE

# HCS Topic ID for batch registry (created during initial setup)
HEDERA_BATCH_REGISTRY_TOPIC_ID=0.0.XXXXXX

# ===============================================
# CLERK AUTHENTICATION
# ===============================================
# Get these from your Clerk Dashboard: https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
CLERK_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# ===============================================
# APPLICATION CONFIGURATION
# ===============================================
# Secret key for QR code generation and encryption (generate with: openssl rand -hex 32)
QR_SECRET="YOUR_RANDOM_SECRET_KEY_HERE"

# Base URL for your application
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Environment mode (development | production | test)
NODE_ENV=development

# ===============================================
# AI SERVICES
# ===============================================
# Google Gemini API key from https://makersuite.google.com/app/apikey
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# ===============================================
# SECURITY & ENCRYPTION
# ===============================================
# Agent encryption secret for HCS-10 communications (generate with: openssl rand -base64 32)
AGENT_ENCRYPTION_SECRET=YOUR_BASE64_ENCODED_SECRET_HERE

# ===============================================
# SETUP INSTRUCTIONS
# ===============================================
# 1. Copy this file to .env: cp .env.example .env
# 2. Fill in all placeholder values with your actual credentials
# 3. Never commit .env to version control
# 4. For production, use environment variables instead of .env file
#
# Quick Setup:
# - Hedera Account: Create at https://portal.hedera.com
# - Clerk Auth: Sign up at https://clerk.com
# - Gemini API: Get key at https://makersuite.google.com
# - Database: Use Neon, Supabase, or local PostgreSQL
# - Generate secrets: openssl rand -hex 32 (QR_SECRET)
#                     openssl rand -base64 32 (AGENT_ENCRYPTION_SECRET)
```

**JUDGE ACCESS:** Test credentials for Hedera Operator Account are provided in the DoraHacks submission text field for verification purposes only.

**4. Initialize Database**
```bash
npx prisma generate
npx prisma db push
```

**5. Run the Development Server**
```bash
pnpm dev
```

Visit `http://localhost:3000` to access the application.

**6. Verify Setup**
- Navigate to `/docs` for interactive API documentation (Swagger UI)
- Test authentication by creating an account via Clerk
- Access the dashboard to view sample data

---

## API Documentation

Comprehensive API documentation with 50+ endpoints available at:
- **Interactive UI:** `http://localhost:3000/docs`
- **OpenAPI Spec:** `http://localhost:3000/api-docs`

**Key Endpoint Categories:**
- Authentication (2 endpoints)
- Organizations (4 endpoints)
- Batches (3 endpoints)
- Transfers (3 endpoints)
- Verification (2 endpoints)
- Hospital Management (6 endpoints)
- Regulator Dashboard (12 endpoints)
- Consumer Profile (2 endpoints)
- Analytics & Dashboards (7 endpoints)
- AI Services (3 endpoints)
- **HCS-10 Agent Management (5 endpoints)**

---

## Transaction Flow Examples

### Batch Creation by Manufacturer (HCS-2 + HCS-10)

1. Manufacturer submits batch details via API (`POST /api/batches`)
2. Backend generates unique batch ID + cryptographic hash
3. **HCS-2:** `TopicMessageSubmitTransaction` → Registry topic (permanent log)
4. **HCS-10:** Broadcast announcement to organization's managed registry
5. Transaction receipt stored in PostgreSQL with consensus timestamp
6. QR codes generated for individual units

### Consumer Verification (Dual-Layer Validation)

1. Consumer scans QR code via mobile app
2. Frontend extracts unit ID → Backend API (`POST /api/verify`)
3. Backend queries PostgreSQL for batch metadata
4. **HCS-2:** Mirror Node query verifies official transaction exists
5. **HCS-10:** Broadcast scan event to manufacturer's agent for real-time monitoring
6. Gemini AI translates drug info to consumer's language (e.g., Hausa, Swahili)
7. Response: Authentic + supply chain journey OR Counterfeit alert

### Batch Transfer (Distributor → Hospital) with Agent Confirmation

1. Distributor initiates transfer (`POST /api/transfers`)
2. **HCS-10:** Distributor agent sends transfer intent to hospital agent
3. **HCS-10:** Hospital agent confirms receipt and acknowledgment
4. **HCS-2:** `TopicMessageSubmitTransaction` logs verified transfer event
5. Ownership updated in PostgreSQL (triggers notification to hospital)
6. Both agents log confirmation in their managed registries

**Result:** Two-layer proof — HCS-2 provides immutable record, HCS-10 provides interactive confirmation between parties.

---

## Impact Summary: Dual-Layer Architecture Benefits

| Capability | Single Layer | HCS-2 + HCS-10 |
|------------|-----------|----------------|
| **Event Logging** | Immutable | Immutable (HCS-2) |
| **Org-to-Org Communication** | Off-chain | On-chain, verifiable (HCS-10) |
| **Transfer Confirmation** | One-sided | Two-way handshake (HCS-10) |
| **Real-time Alerts** | Manual polling | Agent-based broadcasts (HCS-10) |
| **Authenticity Verification** | Log-based only | Dual-source validation (HCS-2 + HCS-10) |
| **Scalability** | Single topic congestion | Multi-topic architecture |
| **Audit Trail** | Events only | Events + communications |

---

## Code Quality & Auditability

**Clean Code Practices:**
- ESLint + Prettier configured for consistent formatting
- TypeScript strict mode enabled for type safety
- Clear function naming conventions (e.g., `createBatchOnHedera()`, `verifyDrugAuthenticity()`, `safeSendHcs10()`)
- Inline comments for complex business logic
- Standardized commit history with conventional commits

**Core Logic Files (for Judge Review):**
- `/lib/hedera.ts` – All Hedera SDK interactions (HCS-2 + HCS-10)
- `/lib/hcs10-agent.ts` – HCS-10 agent creation and management
- `/app/api/batches/route.ts` – Batch creation logic + dual-layer blockchain integration
- `/app/api/verify/route.ts` – Drug verification flow (HCS-2 query + HCS-10 broadcast + AI analysis)
- `/app/api/transfers/route.ts` – Transfer logic with agent confirmation
- `/lib/prisma.ts` – Database client configuration
- `/lib/openapi.ts` – Complete API specification

**No Sensitive Data:** All private keys excluded via `.gitignore`. Use `.env.example` as reference.

---

## Security & Secrets

**CRITICAL SECURITY NOTICE:**
- **NO** private keys, `.env` files, or sensitive credentials are committed to this repository
- All secrets are managed via environment variables
- Test credentials for judges are provided **ONLY** in the DoraHacks submission notes
- Production deployment uses Hedera Mainnet with hardware-secured keys

**Environment Template:** See `.env.example` for required variable structure without sensitive values.

---

## Economic Justification: Why Hedera?

**Cost Efficiency:**
- **Hedera HCS (Combined):** $0.0001 per transaction → $1-2/month for 10,000 verifications + inter-org communications
- **Ethereum Alternative:** ~$2-5 per transaction → $20,000-50,000/month (prohibitive for Africa)
- **Traditional Centralized DB:** Free transactions but lacks auditability, immutability, and trust

**Performance:**
- Hedera's 10,000 TPS throughput supports national-scale rollout without congestion
- 3-5 second finality enables real-time QR code verification at pharmacy counters
- ABFT consensus ensures no forking or rollbacks (critical for regulatory compliance)

**Africa-Specific Impact:**
- Low, predictable fees make the platform sustainable for underfunded healthcare systems
- Fast finality reduces patient wait times in high-volume clinics
- Immutable audit trail builds trust in regions with weak regulatory enforcement

**User Adoption:** By eliminating blockchain complexity (users only scan QR codes), we leverage Hedera's performance without requiring crypto literacy—essential for African consumer adoption.

---

## Requirements

- **Node.js** ≥ 18.x
- **pnpm** (or npm/yarn)
- **PostgreSQL** (local or hosted)
- **Hedera Testnet Account** (provided credentials in submission)

---

## Support & Contact

For judge inquiries or setup issues:
- **GitHub Issues:** https://github.com/Derojuu/MediCheck/issues
- **Documentation:** In-code comments + `/docs` Swagger UI
- **Demo Video:** [Link provided in DoraHacks submission]

---

## Summary

The dual-layer architecture transforms MediCheck into an **intelligent, interactive verification network**. Each organization operates a verifiable agent, enabling real-time, ledger-backed communication across the healthcare supply chain. 

**The Result:** A two-layer trust architecture where HCS-2 guarantees integrity and HCS-10 guarantees communication — together creating an unbreakable chain of custody from manufacturer to patient.

**Thank you for reviewing MediCheck!** We're excited to demonstrate how Hedera's unique economics and performance enable real-world impact in African healthcare.
