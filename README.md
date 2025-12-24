# 🏥 PatientSync

Real-time patient input form and staff monitoring system built with Next.js 16 (Turbopack), Supabase, and TailwindCSS.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js&style=flat-square)
![React](https://img.shields.io/badge/React-19-blue?logo=react&style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-green?logo=supabase&style=flat-square)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwind-css&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&style=flat-square)
![Lucide](https://img.shields.io/badge/Lucide-Icons-orange?logo=lucide&style=flat-square)

## 📋 Overview

PatientSync is a robust, clean-architecture demonstration of a real-time medical data system. It synchronizes patient registration data instantly with a staff dashboard, allowing for seamless workflow monitoring.

**Key Architecture**: The project separates concerns strictly into **Services** (API), **Hooks** (Logic), and **Components** (UI), ensuring maintainability and scalability.

## ✨ Key Features

- **⚡ Real-time Synchronization**: Data reflects instantly on the Staff Dashboard as the patient types.
- **🛡️ Clean Architecture**:
  - **Service Layer**: Centralized API logic with strict type safety.
  - **Custom Hooks**: Encapsulated form logic (`usePatientForm`) and validation.
- **💾 Auto-Save**: Form data is automatically saved to Supabase (debounced) to prevent data loss.
- **👩‍⚕️ Staff Dashboard**:
  - Categorized views: **Filling** (Real-time), **Submitted**, and **Inactive**.
  - Live status indicators.
- **🎨 Modern UI**:
  - Built with **TailwindCSS 4**.
  - Beautiful icons from **Lucide React**.
  - Responsive design for Tablet/Mobile/Desktop.
- **🔒 Security**:
  - Row Level Security (RLS) configured (Demo/Public mode).
  - Client-side validation for Phone (format), Email, and Required fields.

## 🛠️ Tech Stack

| Technology                                    | Purpose                                |
| --------------------------------------------- | -------------------------------------- |
| [Next.js 16](https://nextjs.org/)             | Framework (App Router, Turbopack)      |
| [Supabase](https://supabase.com/)             | Database (PostgreSQL) + Realtime + RLS |
| [TailwindCSS 4](https://tailwindcss.com/)     | Styling System                         |
| [Lucide React](https://lucide.dev/)           | Iconography                            |
| [TypeScript](https://www.typescriptlang.org/) | Strict Type Safety                     |

## 📁 Project Structure

```
patient-sync/
├── src/
│   ├── app/
│   │   ├── services/
│   │   │   └── patientService.ts # API Layer (Supabase Interactions)
│   │   ├── hooks/
│   │   │   └── usePatientForm.ts # Logic Layer (State, Validation, Auto-save)
│   │   ├── components/
│   │   │   ├── PatientForm.tsx   # UI Layer (Pure Component)
│   │   │   ├── PatientCard.tsx   # Dashboard Card
│   │   │   └── PortalCard.tsx    # Selection Menu
│   │   ├── constants/
│   │   │   └── portalCards.tsx   # Config Data
│   │   ├── patient/              # Patient Route
│   │   └── staff/                # Staff Route
│   ├── lib/
│   │   └── supabase.ts           # Supabase Client Configuration
│   └── types/                    # Strict TypeScript Definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/peerayes/patient-sync.git
   cd patient-sync
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Database Setup**
   Run in Supabase SQL Editor:

   ```sql
   -- Create Table
   CREATE TABLE patients (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     session_id TEXT UNIQUE NOT NULL,
     first_name TEXT,
     middle_name TEXT,
     last_name TEXT,
     date_of_birth DATE,
     gender TEXT,
     phone TEXT,
     email TEXT,
     address TEXT,
     preferred_language TEXT,
     nationality TEXT,
     emergency_contact_name TEXT,
     emergency_contact_relationship TEXT,
     religion TEXT,
     status TEXT DEFAULT 'filling',
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Enable Realtime
   ALTER PUBLICATION supabase_realtime ADD TABLE patients;

   -- Enable Security (RLS)
   ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
   ```

5. **Run Development Server**

   ```bash
   pnpm dev
   ```

## 📱 Usage

| Route      | Description                |
| ---------- | -------------------------- |
| `/patient` | Patient registration form  |
| `/staff`   | Staff monitoring dashboard |

### How it works

1. Patient opens `/patient` and fills in the form
2. Data syncs to Supabase in real-time as they type
3. Staff viewing `/staff` sees updates instantly
4. Status indicators show: 🟢 Filling, ✅ Submitted, ⚪ Inactive

## 🔄 Real-Time Synchronization Flow

```
Patient Form ──► Supabase Database ──► Staff View
   (input)         (realtime)         (subscribe)
```

## 👨‍💻 Author

**Peerayes Varitpaveeradit**

- GitHub: [@peerayes](https://github.com/peerayes)

---

Made with ❤️ using Next.js 16 & Supabase
