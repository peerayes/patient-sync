# 🏥 PatientSync

Real-time patient input form and staff monitoring system built with Next.js, Supabase, and TailwindCSS.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-green?logo=supabase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38B2AC?logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)

## 📋 Overview

PatientSync is a responsive, real-time patient registration system consisting of two synchronized interfaces:

- **Patient Form** (`/patient`) - A responsive form where patients enter their personal information
- **Staff View** (`/staff`) - A real-time dashboard for staff to monitor patient submissions instantly

The two interfaces synchronize in real-time using Supabase Realtime, reflecting patient input immediately on the staff view without page refresh.

## ✨ Features

- ✅ Real-time data synchronization between patient and staff views
- ✅ Responsive design for mobile and desktop
- ✅ Form validation (required fields, email, phone number)
- ✅ Status indicators (filling, submitted, inactive)
- ✅ TypeScript for type safety
- ✅ Modern UI with TailwindCSS

## 🛠️ Tech Stack

| Technology                                    | Purpose                                      |
| --------------------------------------------- | -------------------------------------------- |
| [Next.js 16](https://nextjs.org/)             | React framework with App Router              |
| [React 19](https://react.dev/)                | UI library                                   |
| [Supabase](https://supabase.com/)             | PostgreSQL database + Realtime subscriptions |
| [TailwindCSS 4](https://tailwindcss.com/)     | Utility-first CSS framework                  |
| [TypeScript](https://www.typescriptlang.org/) | Type safety                                  |

## 📁 Project Structure

```
patient-sync/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home page (redirect)
│   │   ├── patient/
│   │   │   └── page.tsx          # Patient form
│   │   └── staff/
│   │       └── page.tsx          # Staff monitoring view
│   ├── components/
│   │   ├── PatientForm.tsx       # Form component
│   │   ├── PatientCard.tsx       # Patient display card
│   │   └── StatusBadge.tsx       # Status indicator
│   ├── lib/
│   │   └── supabase.ts           # Supabase client
│   ├── hooks/
│   │   ├── usePatientForm.ts     # Form state management
│   │   └── useRealtimePatients.ts # Realtime subscription
│   └── types/
│       └── patient.ts            # TypeScript types
├── .env.local                    # Environment variables
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account

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

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up Supabase database**

Run this SQL in your Supabase SQL Editor:

```sql
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
```

5. **Run the development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

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

## 🌐 Deployment

### Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/peerayes/patient-sync)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Peerayes Warisapaweerote**

- GitHub: [@peerayes](https://github.com/peerayes)

---

Made with ❤️ using Next.js and Supabase
