# KidLife

Monorepo for KidLife EdTech Platform.

## Architecture

This project uses a Feature-Based Modular Architecture combined with Layered Architecture.

### Workspace Structure

- `web/`: ReactJS (Vite) web app — giao diện chính cho Parents, Children, Admin, và Expert.
- `backend/`: NodeJS & Express RESTful API.
- `docs/`: Project documentation.

## Tech Stack (Web)

- **Framework**: React 19 + TypeScript + Vite
- **Routing**: React Router DOM v7
- **State Management**: Redux Toolkit + React Query
- **Styling**: Vanilla CSS with CSS Custom Properties (Design Tokens)
- **Animations**: Framer Motion + CSS Transitions
- **Icons**: React Icons (Ionicons)
- **Fonts**: Inter (Google Fonts)

## Getting Started

```bash
# Install dependencies
cd web
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure (Web)

```
web/src/
├── layouts/           # Layout wrappers (ParentLayout, ChildLayout)
├── modules/
│   ├── admin/         # Admin Dashboard
│   ├── auth/          # Login, Register, Role Selection
│   ├── child/         # Child Home, Tasks
│   ├── lesson/        # Lesson Library
│   ├── parent/        # Parent Home, Tasks, Community, Account
│   └── quiz/          # Quiz, Quiz Result
├── routes/            # React Router configuration
├── shared/
│   └── constants/     # Mock data, shared constants
├── theme/             # Color tokens, design system
├── styles.css         # Global CSS + Design System
├── App.tsx            # Root component
└── main.tsx           # Entry point
```
