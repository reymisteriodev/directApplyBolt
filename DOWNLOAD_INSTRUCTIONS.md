# DirectApply Platform - Local Setup Instructions

## Project Structure

This is a full-stack application with both web and mobile components:

```
directapply-platform/
├── web/                          # Main web application
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── utils/
│   ├── supabase/
│   │   ├── functions/
│   │   └── migrations/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── index.html
└── mobile/                       # React Native mobile app
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── navigation/
    │   ├── screens/
    │   └── utils/
    ├── package.json
    ├── app.json
    └── App.tsx
```

## Step 1: Create Project Directory

```bash
mkdir directapply-platform
cd directapply-platform
```

## Step 2: Set Up Web Application

### Create web directory and files:

```bash
mkdir web
cd web

# Copy all the files from the project
# You'll need to create each file manually with the content shown in the file browser
```

### Key files to create:

1. **package.json** - Contains all dependencies
2. **src/App.tsx** - Main React application
3. **src/main.tsx** - Entry point
4. **index.html** - HTML template
5. **vite.config.ts** - Vite configuration
6. **tailwind.config.js** - Tailwind CSS config
7. **src/index.css** - Global styles

### All source files in src/:
- **components/** - Reusable UI components
- **contexts/** - React contexts (Auth, Theme)
- **pages/** - All page components
- **lib/** - Supabase configuration
- **utils/** - Utility functions

### Supabase files:
- **supabase/migrations/** - Database migrations
- **supabase/functions/** - Edge functions

## Step 3: Set Up Mobile Application

```bash
cd ../
mkdir mobile
cd mobile

# Copy all mobile app files
```

### Key mobile files:
1. **package.json** - Mobile dependencies
2. **App.tsx** - Main mobile app
3. **app.json** - Expo configuration
4. **src/** - All mobile source code

## Step 4: Install Dependencies

### Web application:
```bash
cd web
npm install
```

### Mobile application:
```bash
cd ../mobile
npm install
```

## Step 5: Environment Setup

### Web (.env file):
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Set up Supabase:
1. Create a Supabase project at https://supabase.com
2. Get your project URL and anon key
3. Run the database migrations
4. Deploy the edge functions

## Step 6: Run the Applications

### Web application:
```bash
cd web
npm run dev
```

### Mobile application:
```bash
cd mobile
npm start
```

## Complete File List

You need to copy the following files with their exact content:

### Web Application Files:
- package.json
- vite.config.ts
- tailwind.config.js
- postcss.config.js
- tsconfig.json
- tsconfig.app.json
- tsconfig.node.json
- index.html
- src/main.tsx
- src/App.tsx
- src/index.css
- src/vite-env.d.ts
- src/lib/supabase.ts
- src/contexts/AuthContext.tsx
- src/contexts/ThemeContext.tsx
- src/components/Header.tsx
- src/components/JobCard.tsx
- src/components/VerificationBadge.tsx
- src/components/FeatureShowcase.tsx
- src/pages/LandingPage.tsx
- src/pages/CompanyLandingPage.tsx
- src/pages/JobSeekerLogin.tsx
- src/pages/CompanyLogin.tsx
- src/pages/CVWelcomeGate.tsx
- src/pages/CVNewGate.tsx
- src/pages/CVBuilder.tsx
- src/pages/CVAnalysis.tsx
- src/pages/CVDashboard.tsx
- src/pages/JobSeekerDashboard.tsx
- src/pages/JobMatchingDashboard.tsx
- src/pages/CompanyDashboard.tsx
- src/pages/Profile.tsx
- src/pages/InterviewCoach.tsx
- src/pages/ApplicationTracker.tsx
- src/pages/ApplicantManagement.tsx
- supabase/migrations/20250615191816_crimson_dew.sql
- supabase/migrations/20250617105129_floating_delta.sql
- supabase/functions/parse-cv/index.ts

### Mobile Application Files:
- package.json
- app.json
- App.tsx
- src/utils/supabase.ts
- src/contexts/AuthContext.tsx
- src/contexts/JobContext.tsx
- src/navigation/AuthNavigator.tsx
- src/navigation/TabNavigator.tsx
- src/screens/OnboardingScreen.tsx
- src/screens/CVSetupScreen.tsx
- src/screens/SwipeScreen.tsx
- src/screens/MatchesScreen.tsx
- src/screens/ProfileScreen.tsx
- src/screens/JobDetailsScreen.tsx

## Important Notes:

1. **Supabase Setup**: You must create your own Supabase project and update the configuration
2. **Environment Variables**: Create .env files with your actual Supabase credentials
3. **Database**: Run the migrations to set up the database schema
4. **Edge Functions**: Deploy the parse-cv function to Supabase
5. **Mobile Setup**: The mobile app requires Expo CLI for development

## Features Included:

### Web Platform:
- ✅ Landing pages for job seekers and companies
- ✅ Authentication system
- ✅ CV builder with AI assistance
- ✅ CV analysis and scoring
- ✅ Job matching dashboard
- ✅ Application tracking
- ✅ Company dashboard
- ✅ Interview coach
- ✅ File upload and parsing

### Mobile App:
- ✅ Tinder-style job swiping
- ✅ CV setup flow
- ✅ Application tracking
- ✅ Profile management
- ✅ Onboarding experience

This is a production-ready application with modern architecture, beautiful design, and comprehensive features for both job seekers and companies.