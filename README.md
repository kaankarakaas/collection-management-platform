This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

# 🧱 Collection Management Platform

A web-based product collection management system built with **Next.js**, **TypeScript**, **TailwindCSS**, and **dnd-kit** for drag-and-drop interaction. This project also supports Docker-based deployment for consistency across environments.

---

## 🚀 Features

- Drag-and-drop product sorting with pagination
- Grid/List/Table view toggle
- Modal dialogs for confirmation and alerts
- Responsive layout with Tailwind CSS
- Responsive elements with Material UI
- Fully containerized using Docker

---

## 📦 Project Structure

- [/components](https://github.com/kaankarakaas/collection-management-platform/tree/master/components) # UI components (Modal, Grid, ViewSelector, etc.)
- [/pages](https://github.com/kaankarakaas/collection-management-platform/tree/master/pages) # Next.js routing (includes _app.tsx, index.tsx, etc.)
- [/public](https://github.com/kaankarakaas/collection-management-platform/tree/master/public) # Static assets
- [/styles](https://github.com/kaankarakaas/collection-management-platform/tree/master/styles) # TailwindCSS and custom styles
- [/next.config.ts](https://github.com/kaankarakaas/collection-management-platform/tree/master/next.config.ts) # Next.js configuration
- [/Dockerfile](https://github.com/kaankarakaas/collection-management-platform/tree/master/Dockerfile) # Docker build instructions
- [/docker-compose.yml](https://github.com/kaankarakaas/collection-management-platform/tree/master/docker-compose.yml) # Multi-container orchestration

---
## 🐳 Run With Docker

### 1. Clone the repository

```bash
git clone https://github.com/kaankarakaas/collection-management-platform.git
cd collection-management-platform
```

### 2. Build & Start with Docker Compose

```bash
docker-compose build --no-cache && docker-compose up
```

If port `3000` is already in use, you can change it in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"
```
## 🔧 Development (Local)

First, run the development server:

```bash
npm install --legacy-peer-deps # or yarn install --legacy-peer-deps
npm run dev # or pnpm dev # or bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📄 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

---

MIT License. Feel free to use, modify, and distribute.
