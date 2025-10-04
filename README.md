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