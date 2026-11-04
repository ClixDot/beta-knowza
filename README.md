# Knowza — Brand Website & Experience

A modern, high-performance web experience for Knowza, built with React, TypeScript, Tailwind CSS, Framer Motion, and Lenis smooth scrolling.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, pnpm, or yarn

### Installation

```bash
npm install
```

### Development

Run the local development server:

```bash
npm run dev
```

### Production Build

Build the project for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## 📁 Project Structure

```text
knowza/
├── public/              # Static assets, brand logos, and imagery
│   └── images/
├── src/
│   ├── components/      # UI components and layouts
│   ├── pages/           # Application views/routes
│   ├── styles/          # Tailwind & custom CSS
│   ├── App.tsx          # Main application entry
│   └── main.tsx         # Root rendering
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind theme configurations
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## 🗂️ Admin & CMS

The website content is managed at `/admin`, backed by MongoDB and Cloudinary. Copy `.env.example` to `.env.local`, fill in the values, run `npm run dev` and open <http://localhost:5173/admin>.

Create a login with `node scripts/create-admin.mjs you@example.com "Your Name" admin`.

- [How the CMS works](docs/cms/ARCHITECTURE.md)
- [Backend and deployment](docs/cms/BACKEND_MIGRATION.md)

## 📄 License

Private repository. All rights reserved by Knowza.
