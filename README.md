# JGEC Pune Chapter Website

A dedicated platform for the JGEC Alumni Association Pune Chapter to connect alumni, share achievements, organize events, and foster a strong community.

**Live Demo:** [https://jgec-pune-chapter.onrender.com/](https://jgec-pune-chapter.onrender.com/)

## 🚀 Tech Stack

-   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [Shadcn UI](https://ui.shadcn.com/) (Radix UI)
-   **Runtime & Package Manager:** [Bun](https://bun.sh/)
-   **Deployment:** [Render](https://render.com/)

## ✨ Features

-   **Public Pages:**
    -   **Home:** Landing page with overview.
    -   **About:** Information about the chapter.
    -   **Achievements:** Showcasing alumni success stories.
    -   **Chapters:** Details about other chapters or sub-groups.
    -   **Events:** Upcoming and past events.
    -   **Gallery:** Photo collection from events.
    -   **Contact:** Get in touch form.
    -   **Donate:** Support the chapter.
-   **Authentication:**
    -   **Login:** Secure access for members `(src/app/(auth)/login)`.

## 🛠️ Getting Started

### Prerequisites

Ensure you have [Bun](https://bun.sh/) installed on your machine.

```bash
# Install Bun (macOS/Linux/WSL)
curl -fsSL https://bun.sh/install | bash
```

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/sayantan007pal/JGEC-PUNE-CHAPTER-WEBSITE.git
    cd JGEC-PUNE-CHAPTER-WEBSITE
    ```

2.  **Install dependencies:**

    ```bash
    bun install
    ```

### Running Locally

Start the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

To create an optimized production build:

```bash
bun run build
```

To start the production server:

```bash
bun start
```

## 📂 Project Structure

-   `src/app/(public)`: Contains public-facing pages (About, Contact, Events, etc.).
-   `src/app/(auth)`: Contains authentication-related pages (Login).
-   `src/components`: Reusable UI components.
-   `public`: Static assets.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
