# AI + Blockchain Medication Verification & Traceability Platform

A full-stack application built with **Next.js**, **Prisma ORM**, **PostgreSQL**, and **Clerk Authentication** to tackle the global crisis of **counterfeit drugs** in Africa.

The platform utilizes the **Hedera Consensus Service** for secure, tamper-proof drug traceability and **AI-powered verification** to educate consumers and flag counterfeit drugs in real time, increasing patient safety and supply chain transparency.

---

## Key Features

* **Drug Traceability** – Securely register drug batches and individual units on **Hedera** using QR codes or NFC IDs for unique identification.
* **AI Verification** – Consumers can scan a drug unit to instantly verify its authenticity and supply chain journey, with verification results provided in their **local language**.
* **Immutable Records** – Every critical supply chain event (manufacturer $\to$ distributor $\to$ patient) is recorded as a **cryptographically secure transaction** on the blockchain.
* **Authentication & Role Management** – Robust and secure signup/login workflows handled by **Clerk**.
* **PostgreSQL + Prisma ORM** – Provides a strong, relational backend for managing off-chain data such as user profiles, business details, and analytics.
* **Next.js Full-Stack** – A unified codebase for both API routes and the user interface, ensuring fast development and high performance.

---

## Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend & Backend** | [Next.js 15](https://nextjs.org/) | Full-stack React framework for rapid development. |
| **Authentication** | [Clerk](https://clerk.com/) | Secure, drop-in user management. |
| **Database** | PostgreSQL | Robust, open-source relational database. |
| **ORM** | [Prisma](https://www.prisma.io/) | Next-generation ORM for type-safe database access. |
| **Blockchain** | [Hashgraphonline SDK](hashgraphonline.com/) | Integration for fast, low-cost decentralized consensus and data storage. |
| **AI/LLM** | Gemini | Used for local-language drug verification and consumer education. |
| **Styling** | **Tailwind CSS** | Utility-first CSS framework for rapid UI building. |

---

## Requirements

To run the project locally, you will need:

* **Node.js** $\ge 18.x$
* **pnpm** (latest versions)
* **Prisma CLI** (`npm install -g prisma`)

---

## Environment Variables

Create a file named **`.env`** at the root of your project and it should contain the following:

```env
DATABASE_URL=VALUE
# Direct connection URL (non-pooled) for migrations and schema operations
POSTGRES_URL=VALUE

# HEDERA
HEDERA_OPERATOR_ID=VALUE
HEDERA_OPERATOR_KEY=VAUE

# CLERK
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=VALUE
CLERK_SECRET_KEY=VALUUE

QR_SECRET=VALUE
NEXT_PUBLIC_APP_URL="http://localhost:3000"

NODE_ENV=development

# GEMINI
GEMINI_API_KEY=VALUE

```

## Local Development Setup

1. Clone the repository Bash

    ```
        git clone "https://github.com/Derojuu/MediCheck/" medicheck 
    ```

2. cd medicheck 
3. Install dependencies
    ```
        pnpm install
        # or
        yarn install
    ```

4. Configure environment variables
Create a .env.local file in the project root as shown in the section above.

5. Run the development server
    ```
        npm run dev
        # or
        yarn dev
    ```

Visit http://localhost:3000 to see the application.

---

## API Documentation

MediCheck provides comprehensive API documentation using **Swagger/OpenAPI 3.0**. The interactive documentation allows you to explore all endpoints, view request/response schemas, and understand the complete API surface.

### Accessing the Documentation

Once your development server is running (`pnpm dev`), access the API documentation at:

- **Interactive Swagger UI**: [http://localhost:3000/docs](http://localhost:3000/docs)
- **OpenAPI JSON Spec**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### Features

- 📚 **50+ Documented Endpoints** across 14 feature categories
- 🔍 **Searchable Interface** - quickly find the endpoint you need
- 📋 **Complete Schemas** - request/response examples for all endpoints
- 🏷️ **Organized by Tags** - Authentication, Organizations, Batches, Transfers, Verification, Hospital, Regulator, Consumer, Analytics, AI Services, and more
- 🔐 **Security Documented** - Clerk authentication requirements clearly marked
- 📥 **Import to Tools** - Export OpenAPI JSON for use in Postman, Insomnia, or API client generators

### API Categories

| Category | Description | Endpoints |
| :--- | :--- | :--- |
| **Authentication** | User registration and team member login | 2 |
| **Organizations** | Organization management and info | 4 |
| **Team Members** | Invite, manage, and remove team members | 3 |
| **Batches** | Create and manage medication batches | 3 |
| **Products** | Product registration and catalog | 2 |
| **Transfers** | Batch ownership transfers | 3 |
| **Verification** | Verify batch and unit authenticity | 2 |
| **Hospital** | Hospital-specific endpoints | 6 |
| **Regulator** | Regulatory authority management | 12 |
| **Consumer** | Consumer profile and scan history | 2 |
| **Dashboard** | Statistics and analytics | 5 |
| **Analytics** | Advanced analytics and reporting | 2 |
| **AI Services** | Chat, translation, ML predictions | 3 |
| **Hotspots** | Counterfeit hotspot predictions | 2 |

### Using with External Tools

**Import to Postman:**
1. Open Postman
2. Click **Import** → **Link**
3. Paste: `http://localhost:3000/api-docs`
4. Click **Continue** and **Import**

**Generate API Client:**
```bash
# Install OpenAPI Generator
npm install -g @openapitools/openapi-generator-cli

# Generate TypeScript client
openapi-generator-cli generate -i http://localhost:3000/api-docs -g typescript-axios -o ./generated-client
```

### Updating the Documentation

The API documentation is defined in `lib/openapi.ts`. When you add or modify endpoints:

1. Update the corresponding path in `lib/openapi.ts`
2. Add/update request/response schemas in the `components.schemas` section
3. Restart the dev server - changes will be reflected immediately at `/docs`

**Example: Adding a new endpoint**
```typescript
// In lib/openapi.ts
"/api/your-new-endpoint": {
  post: {
    tags: ["YourCategory"],
    summary: "Brief description",
    description: "Detailed description",
    requestBody: { /* schema */ },
    responses: { /* response schemas */ },
    security: [{ clerkAuth: [] }]
  }
}
```