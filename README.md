# MediCheck: AI + Blockchain Medication Verification Platform

**Track:** Healthcare & Supply Chain Innovation  
**Hedera Network:** Testnet

<img width="1472" height="704" alt="Gemini_Generated_Image_ebcrwcebcrwcebcr" src="https://github.com/user-attachments/assets/1b982062-7f1d-40aa-8392-6575dd7eedcf" />



## Project Overview

MediCheck tackles Africa's counterfeit drug crisis by combining Hedera's consensus services with AI-powered verification. The platform enables secure drug traceability from manufacturer to patient, with real-time authenticity verification in local languages, addressing the $200B+ global counterfeit pharmaceutical problem that disproportionately affects developing regions.

---

## Architecture Diagram

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
                    │   └──────────────────────┘   │
                    └────────┬──────────┬──────────┘
                             │          │
              ┌──────────────┘          └────────────────┐
              │                                           │
    ┌─────────▼──────────┐                   ┌───────────▼─────────┐
    │  HEDERA NETWORK    │                   │   GEMINI AI API     │
    │    (Testnet)       │                   │                     │
    │ ┌────────────────┐ │                   │  - Drug Verification│
    │ │ HCS Topic      │ │◄──────────────────┤  - Local Language  │
    │ │ (Immutable Log)│ │     AI Analysis   │    Translation     │
    │ └────────────────┘ │                   │  - Consumer Ed     │
    │ ┌────────────────┐ │                   └─────────────────────┘
    │ │ Consensus      │ │
    │ │ Service        │ │
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
4. Backend submits verification event → HCS Topic (TopicMessageSubmitTransaction)
5. Hedera returns consensus timestamp + transaction ID
6. Backend stores transaction receipt in PostgreSQL
7. Backend queries Gemini AI for drug info + local translation
8. Response flows back: Hedera status + AI insights → Frontend → User
```

---

## Hedera Integration Summary

### Hedera Consensus Service (HCS)

**Why HCS:** We chose HCS for immutable logging of critical supply chain events because its predictable $0.0001 fee guarantees operational cost stability, which is essential for low-margin logistics in Africa. Unlike traditional blockchains with volatile gas fees, HCS enables sustainable operations for pharmaceutical distributors operating on thin margins while providing cryptographic proof of authenticity.

**How It Works:**
- Each drug batch creation, transfer, and verification is recorded as a message to a dedicated HCS Topic
- Messages include: batch ID, timestamp, actor (manufacturer/distributor/hospital), action type, and cryptographic hash of product details
- The consensus timestamp provides an immutable, ordered audit trail
- Mirror Node API queries enable real-time verification without transaction costs

**Transaction Types Used:**
- `TopicMessageSubmitTransaction` – Submit batch creation, transfer, and verification events
- `TopicCreateTransaction` – Initialize organization-specific audit topics (during onboarding)

**Economic Impact:** At $0.0001 per transaction, a distributor processing 10,000 drug units monthly pays just $1/month for blockchain verification—a 99.9% cost reduction compared to Ethereum-based solutions, making the platform financially viable for African healthcare systems.

---

## Deployed Hedera IDs (Testnet)

**Critical Infrastructure IDs:**
- **Operator Account ID:** `0.0.5140687`
- **Primary HCS Topic ID:** `0.0.5140925` (Main audit log for all supply chain events)
- **Secondary HCS Topic ID:** `0.0.5141106` (Organization-specific events)

**Note:** All transactions visible on HashScan Testnet Explorer: `https://hashscan.io/testnet/topic/0.0.5140925`

---

## Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend/Backend** | Next.js 15 | Full-stack React framework |
| **Authentication** | Clerk | Secure user/role management |
| **Database** | PostgreSQL + Prisma ORM | Off-chain data (user profiles, analytics) |
| **Blockchain** | Hedera Testnet | Immutable supply chain audit trail |
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
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/medicheck"
POSTGRES_URL="postgresql://user:password@localhost:5432/medicheck"

# Hedera Testnet
HEDERA_OPERATOR_ID="0.0.5140687"
HEDERA_OPERATOR_KEY="302e020100300506032b6570042204..." # Test key provided separately

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Application
QR_SECRET="your-secure-random-string-for-qr-generation"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# AI Services
GEMINI_API_KEY="AIzaSy..." # Google Gemini API key
```

**JUDGE ACCESS:** Test credentials for Hedera Operator Account are provided in the DoraHacks submission text field for verification purposes only.

**4. Initialize Database**
```bash
pnpm prisma generate
pnpm prisma db push
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

---

## Code Quality & Auditability

**Clean Code Practices:**
- ESLint + Prettier configured for consistent formatting
- TypeScript strict mode enabled for type safety
- Clear function naming conventions (e.g., `createBatchOnHedera()`, `verifyDrugAuthenticity()`)
- Inline comments for complex business logic
- Standardized commit history with conventional commits

**Core Logic Files (for Judge Review):**
- `/lib/hedera.ts` – All Hedera SDK interactions (HCS topic submissions, account queries)
- `/app/api/batches/route.ts` – Batch creation logic + blockchain integration
- `/app/api/verify/route.ts` – Drug verification flow (Hedera query + AI analysis)
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
- **Hedera HCS:** $0.0001 per transaction → $1/month for 10,000 verifications
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

## Transaction Flow Examples

**Batch Creation by Manufacturer:**
1. Manufacturer submits batch details via API (`POST /api/batches`)
2. Backend generates unique batch ID + cryptographic hash
3. `TopicMessageSubmitTransaction` → HCS Topic 0.0.5140925
4. Transaction receipt stored in PostgreSQL with consensus timestamp
5. QR codes generated for individual units

**Consumer Verification:**
1. Consumer scans QR code via mobile app
2. Frontend extracts unit ID → Backend API (`POST /api/verify`)
3. Backend queries PostgreSQL for batch metadata
4. Mirror Node query verifies HCS transaction exists
5. Gemini AI translates drug info to consumer's language (e.g., Hausa, Swahili)
6. Response: Authentic + supply chain journey OR Counterfeit alert

**Batch Transfer (Distributor → Hospital):**
1. Distributor initiates transfer (`POST /api/transfers`)
2. `TopicMessageSubmitTransaction` logs transfer event on Hedera
3. Ownership updated in PostgreSQL (triggers notification to hospital)
4. Hospital confirms receipt → Second HCS message (immutable proof of delivery)

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


**Thank you for reviewing MediCheck!** We're excited to demonstrate how Hedera's unique economics and performance enable real-world impact in African healthcare. 🚀
