# DirectApply Platform

A comprehensive job search platform with both web and mobile applications.

## Project Structure

```
directapply-platform/
├── web/                          # Web application (React + Vite)
│   ├── src/
│   ├── supabase/
│   ├── package.json
│   └── ...
├── mobile-app/                   # Mobile application (React Native + Expo)
│   ├── src/
│   ├── package.json
│   └── ...
├── mobile-pwa/                   # Progressive Web App version
└── mobile/                       # Alternative mobile implementation
```

## Quick Start

### Web Application
```bash
cd web
npm install
npm run dev
```

### Mobile Application
```bash
cd mobile-app
npm install
npm start
```

## Features

### Web Platform
- Landing pages for job seekers and companies
- Authentication system
- CV builder with AI assistance
- Job matching dashboard
- Application tracking
- Company dashboard
- Interview coach

### Mobile App
- Tinder-style job swiping
- Application tracking
- Profile management
- Native mobile experience

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Mobile**: React Native, Expo
- **Backend**: Supabase
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage

## Environment Setup

Create a `.env` file in the `web/` directory:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

### Web
- Build: `npm run build`
- Deploy to any static hosting service

### Mobile
- Development: Use Expo Go app
- Production: Build with `expo build`

## License

MIT License