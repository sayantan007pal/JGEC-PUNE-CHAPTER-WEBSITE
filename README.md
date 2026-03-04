# JGEC Pune Chapter Website

A dedicated platform for the JGEC Alumni Association Pune Chapter to connect alumni, share achievements, organize events, and foster a strong community.

**Live Demo:** [https://jgec-pune-chapter-website.vercel.app/](https://jgec-pune-chapter-website.vercel.app/)

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v3](https://tailwindcss.com/) |
| **UI Components** | [Shadcn UI](https://ui.shadcn.com/) (Radix UI) |
| **Database** | [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) |
| **Auth** | JWT (via [jose](https://github.com/panva/jose)) + HTTP-only cookies |
| **Email** | [Nodemailer](https://nodemailer.com/) (OTP-based email verification) |
| **Data Fetching** | [TanStack Query v5](https://tanstack.com/query/latest) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## ✨ Features

### 🌐 Public Pages
All routes under `/(public)` are accessible without authentication.

| Page | Route | Description |
|---|---|---|
| Home | `/` | Landing page with chapter overview |
| About | `/about` | Chapter history and mission |
| Achievements | `/achievements` | Alumni success stories |
| Benefits | `/benefits` | Membership advantages |
| Events | `/events` | Upcoming and past chapter events |
| Gallery | `/gallery` | Photo collection from events |
| Contact | `/contact` | Contact form |
| Donate | `/donate` | Support the chapter financially |

### 🔐 Authentication (`/(auth)`)
Full authentication flow with email verification and password recovery.

| Page | Route | Description |
|---|---|---|
| Sign Up | `/signup` | New member registration |
| Login | `/login` | Member login |
| Verify Email | `/verify-email` | OTP-based email verification after signup |
| Forgot Password | `/forgot-password` | Request a password reset link |
| Reset Password | `/reset-password` | Set a new password via token |

### 🔒 Private Pages (`/(private)`)
Accessible only to authenticated members. Unauthenticated users are redirected to `/login`.

| Page | Route | Description |
|---|---|---|
| Dashboard | `/dashboard` | Member-only dashboard |

---

## 🛡️ Middleware & Route Protection

The `src/middleware.ts` uses JWT verification to guard routes:

- **Protected routes** (`/dashboard`, `/profile`) → redirect to `/login` if not authenticated.
- **Guest-only routes** (`/login`, `/signup`, `/verify-email`, `/forgot-password`, `/reset-password`) → redirect to `/dashboard` if already authenticated.

Authentication state is tracked via an HTTP-only cookie (`jgec-auth-token`).

---

## 🔌 API Routes (`/api/auth/`)

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/signup` | `POST` | Register a new user, send verification OTP |
| `/api/auth/verify-email` | `POST` | Verify email with OTP |
| `/api/auth/resend-otp` | `POST` | Resend the email verification OTP |
| `/api/auth/login` | `POST` | Authenticate user, issue JWT cookie |
| `/api/auth/logout` | `POST` | Clear auth cookie |
| `/api/auth/me` | `GET` | Get current authenticated user |
| `/api/auth/forgot-password` | `POST` | Send password reset email |
| `/api/auth/reset-password` | `POST` | Reset password using token |

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [npm](https://www.npmjs.com/) (or your preferred package manager)
- A [MongoDB](https://www.mongodb.com/) connection URI
- SMTP credentials for email (Nodemailer)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/sayantan007pal/JGEC-PUNE-CHAPTER-WEBSITE.git
    cd JGEC-PUNE-CHAPTER-WEBSITE
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root and add the following:

    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_strong_jwt_secret
    SMTP_HOST=your_smtp_host
    SMTP_PORT=587
    SMTP_USER=your_smtp_user
    SMTP_PASS=your_smtp_password
    SMTP_FROM=your_sender_email
    NEXT_PUBLIC_APP_URL=http://localhost:3001
    ```

### Running Locally

Start the development server (runs on port 3001 with Turbopack):

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Building for Production

```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
src/
├── app/
│   ├── (public)/         # Public-facing pages (Home, About, Events, etc.)
│   ├── (auth)/           # Auth pages (Login, Signup, Verify Email, etc.)
│   ├── (private)/        # Protected pages (Dashboard)
│   └── api/auth/         # Auth API route handlers
├── components/           # Reusable UI components (layout, sections, shadcn)
├── hooks/                # Custom React hooks
├── lib/                  # Utilities (DB connection, auth helpers, etc.)
├── models/               # Mongoose schemas/models
├── types/                # TypeScript type definitions
└── middleware.ts         # JWT-based route protection middleware
```

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a Pull Request.

---

## 📄 License

This project is maintained by the JGEC Alumni Association Pune Chapter.
