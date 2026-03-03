# Orano Med - Frontend Application

A production-ready web application for managing pharmaceutical research data and experiment management.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.1-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.11-646cff.svg)](https://vitejs.dev/)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development](#development)
- [Building](#building)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## ✨ Features

### Core Functionality

- 🧪 **Experiment Data Management** - Efficacy studies, bio-distribution, dose-range finding
- 📊 **Data Upload & Validation** - Multi-format data upload with validation
- 🎲 **Randomization Analysis** - Advanced mouse group randomization and analysis
- 👥 **User Management** - Role-based access control (RBAC)
- 📁 **Master Data CRUD** - Drugs, mice strains, organs, isotopes
- 🔔 **Real-time Notifications** - WebSocket-based notifications
- ✅ **Approval Workflows** - Data review and approval

### Technical Features

- 🎨 **Modern UI/UX** - Tailwind CSS and shadcn/ui components
- 🔐 **Security** - JWT authentication, data sanitization
- 📈 **Performance** - Code splitting, lazy loading
- 🐛 **Error Tracking** - Sentry integration

## 🚀 Tech Stack

See [SYSTEM-ARCHITECTURE.md](./SYSTEM-ARCHITECTURE.md) for detailed architecture.

**Core**: React 19.1.1 • TypeScript 5.9.3 • Vite 7.1.11  
**State**: Redux Toolkit • TanStack Query • React Context  
**UI**: Tailwind CSS • Radix UI • shadcn/ui  
**Forms**: React Hook Form • Zod  
**Data**: Axios • TanStack Table • recharts

## 📦 Prerequisites

- **Node.js**: 20.x or 22.x (LTS)
- **npm**: 10.x+
- **Git**: Latest stable

## 🏁 Getting Started

```bash
# 1. Clone repository
git clone <repository-url>
cd orano_med_frontend_reactjs

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your configuration

# 4. Start development
npm run dev
```

Application runs at `http://localhost:5173`

### Environment Variables

```env
# API Base URL
VITE_API_BASE_URL=

# Version for API
VITE_API_VERSION=

# Socket.IO Configuration
VITE_SOCKET_URL=

# Authentication
VITE_AUTH_TOKEN_KEY=
VITE_AUTH_REFRESH_TOKEN_KEY=

# Feature Flags
VITE_FEATURE_FLAG_EXPERIMENTAL=

# Application Metadata
VITE_APP_NAME=
VITE_APP_VERSION=
VITE_APP_ENV=

# Logging
VITE_LOG_LEVEL=

# Sentry DSN
VITE_SENTRY_DSN=
```

**Note**: All variables must be prefixed with `VITE_`. See `.env.example` for the latest reference.

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev                   # Start dev server
npm run build                 # Production build
npm run preview               # Preview production build

# Code Quality
npm run lint                  # Run ESLint
npm run lint:fix              # Fix ESLint issues
npm run format                # Format with Prettier
npm run type-check            # TypeScript check

# Components
npm run add-component         # Add shadcn/ui component
npm run organize-components   # Organize by atomic design
```

### Project Structure

```
src/
├── api/                      # API integration
├── app/store/                # Redux store
├── components/               # React components (Atomic Design)
│   ├── atoms/                # Basic UI elements
│   ├── molecules/            # Component combinations
│   ├── organisms/            # Complex sections
│   └── layouts/              # Layout wrappers
├── hooks/                    # Custom hooks
├── lib/                      # Utilities & config
├── pages/                    # Page components
├── routes/                   # TanStack Router
├── schemas/                  # Zod schemas
└── types/                    # TypeScript types
```

### Routing

File-based routing with TanStack Router:

- Routes in `src/routes/`
- Auto-generated `routeTree.gen.ts`
- Type-safe navigation

## 🏗️ Building

```bash
# Build
npm run build

# Preview
npm run preview
```

Output in `dist/` folder

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for:

- Branching & PR workflow (development → staging, no production branch)
- TaskId-prefixed branch and commit naming
- Copilot review before reviewer approval
- Squash & merge policy
- Development standards

**Quick steps:**

1. Create a new branch from `development` (use TaskId prefix, e.g. `TASK-123-feature-x`)
2. Make changes and run quality checks
3. Commit with TaskId-prefixed message (e.g. `TASK-123: add new feature`)
4. Push and create PR to `development`
5. Copilot reviews first; after Copilot comments are resolved, a reviewer with approval permission reviews
6. After approval, squash & merge to `development`
7. Raise PR from `development` to `staging` for release

---

**Last Updated**: February 2026
