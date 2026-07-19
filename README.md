# React Portfolio

A modern, responsive portfolio website built with React, Vite, and TailwindCSS — deployed with Netlify CI/CD.

**Live:** [zachbarbarich.net](https://zachbarbarich.net/)

## Features

- **React 19 + Vite** — fast builds and a snappy SPA
- **TailwindCSS** — responsive light/dark UI with teal–indigo branding
- **UX-forward interactions** — canvas node-web background, cursor-tracking Andy hero, glass tech carousel, tilt project cards
- **Netlify CI/CD** — `git push` → build → publish `dist/`
- **Netlify Forms** — contact form with honeypot spam protection

## Technology Stack

**Frontend:** React 19, Vite, TailwindCSS, React Router  
**Hosting / CI/CD:** Netlify (`netlify.toml`), Node 18 build, SPA redirects, Forms

## Setup

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Deployment

Production hosting is **Netlify** only:

1. Connect the GitHub repo in Netlify (or use the Netlify CLI)
2. Build command: `npm run build` · publish directory: `dist` (from `netlify.toml`)
3. Push to `main` to trigger a deploy
4. Configure Form notifications for the `contact` form in the Netlify UI

## Project structure

- `/src/components` — reusable UI (Navbar, Modal, Carousel, TechStack, Andy, etc.)
- `/src/pages` — Home, About, Projects, Contact
- `/src/assets` — images, icons, Andy SVGs
- `/public` — `ZachBarbarichResume2026.pdf`, favicon
- `netlify.toml` — build + SPA redirects

## Author

**Zach Barbarich**  
- Portfolio: [zachbarbarich.net](https://zachbarbarich.net/)  
- LinkedIn: [Zach Barbarich](https://linkedin.com/in/zach-barbarich-193611333)  
- GitHub: [@Zbarbarich](https://github.com/Zbarbarich/)  
- GitLab: [@zachery.barbarich](https://gitlab.com/zachery.barbarich)
