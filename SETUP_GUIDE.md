# DevFlow.AI - Complete Setup Guide

## 📁 Project Structure

```
devflow-ai/
├── public/
│   └── .well-known/
│       └── farcaster.json
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── fix-bug/
│   │   │   │   └── route.ts           # Main AI bug fixing endpoint
│   │   │   ├── health/
│   │   │   │   └── route.ts           # Health check endpoint
│   │   │   ├── logger/
│   │   │   │   └── route.ts           # Logging endpoint
│   │   │   ├── me/
│   │   │   │   └── route.ts           # User info endpoint
│   │   │   └── proxy/
│   │   │       └── route.ts           # API proxy (auto-generated)
│   │   ├── dashboard/
│   │   │   └── page.tsx               # Dashboard page
│   │   ├── fonts/
│   │   │   ├── GeistMonoVF.woff      # Monospace font
│   │   │   └── GeistVF.woff          # Sans-serif font
│   │   ├── favicon.ico
│   │   ├── globals.css                # Global styles
│   │   ├── layout.tsx                 # Root layout
│   │   ├── not-found.tsx              # 404 page
│   │   └── page.tsx                   # Landing page
│   ├── components/
│   │   ├── ui/                        # ShadCN UI components (65+ files)
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── ... (and 50+ more)
│   │   ├── FarcasterManifestSigner.tsx
│   │   ├── FarcasterToastManager.tsx
│   │   ├── FarcasterWrapper.tsx
│   │   ├── activity-detail-modal.tsx
│   │   ├── analytics-charts.tsx      # Time series, pie charts
│   │   ├── architecture-diagram.tsx  # Pipeline visualization
│   │   ├── code-diff-viewer.tsx      # Before/after code comparison
│   │   ├── code-fixer.tsx            # Main code fixing component
│   │   ├── demo-section.tsx          # Demo video section
│   │   ├── enhanced-live-activity-feed.tsx
│   │   ├── export-report-dialog.tsx
│   │   ├── features-grid.tsx         # Features showcase
│   │   ├── hero-section.tsx          # Landing page hero
│   │   ├── live-activity-feed.tsx    # Real-time activity feed
│   │   ├── mobile-nav.tsx            # Mobile navigation
│   │   ├── ready-notifier.tsx
│   │   ├── response-logger.tsx
│   │   └── stats-section.tsx         # Statistics display
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   ├── useAddMiniApp.ts
│   │   ├── useIsInFarcaster.ts
│   │   ├── useManifestStatus.ts
│   │   └── useQuickAuth.tsx
│   ├── lib/
│   │   ├── buggy-examples.ts         # 8 buggy code examples
│   │   ├── logger.ts
│   │   └── utils.ts                  # Utility functions
│   ├── utils/
│   │   └── manifestStatus.ts
│   └── middleware.ts
├── .gitignore
├── README.md
├── components.json                    # ShadCN config
├── next.config.ts                     # Next.js config
├── package.json                       # Dependencies
├── postcss.config.mjs                 # PostCSS config
├── tailwind.config.ts                 # Tailwind config
└── tsconfig.json                      # TypeScript config
```

---

## 🚀 Quick Start

### 1. Prerequisites

```bash
Node.js 18+ or 20+
npm or yarn or pnpm
```

### 2. Initialize Project

```bash
# Create Next.js project
npx create-next-app@latest devflow-ai --typescript --tailwind --app --no-src

# Navigate to project
cd devflow-ai

# Delete src directory
rm -rf src

# Create new src structure
mkdir -p src/{app/{api/{fix-bug,health,logger,me,proxy},dashboard,fonts},components/ui,hooks,lib,utils}
```

### 3. Install Dependencies

```bash
npm install openai
npm install lucide-react
npm install sonner
npm install framer-motion
npm install @radix-ui/react-select
npm install @radix-ui/react-dialog
npm install @radix-ui/react-tabs
npm install @radix-ui/react-scroll-area
npm install @radix-ui/react-avatar
npm install @radix-ui/react-accordion
npm install @radix-ui/react-alert-dialog
npm install clsx tailwind-merge
npm install class-variance-authority

# Dev dependencies
npm install -D @types/node @types/react @types/react-dom
```

### 4. Environment Setup

Create `.env.local` (optional, API key is already in code):

```bash
# Optional: If you want to change the API key
OPENAI_API_KEY=your_api_key_here
```

### 5. Configure Files

#### `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

#### `tsconfig.json`

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### `next.config.ts`

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Your config here
};

export default nextConfig;
```

#### `postcss.config.mjs`

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

#### `.gitignore`

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

---

## 📝 Key Files to Create

### 1. `src/app/api/fix-bug/route.ts`

This is the **main AI endpoint**. Full code is in the project - it:
- Accepts buggy code via POST request
- Uses OpenAI GPT-4o Mini to fix bugs
- Returns fixed code with confidence score
- Already has API key hardcoded

### 2. `src/app/page.tsx` (Landing Page)

Contains:
- Hero section with terminal demo
- Stats showcase
- Features grid
- Architecture diagram
- Demo video section
- Footer with links

### 3. `src/app/dashboard/page.tsx`

Interactive dashboard with:
- Code Fixer component
- Live Activity Feed
- Analytics charts
- Export report functionality

### 4. `src/components/code-fixer.tsx`

Main component that:
- Accepts user input (code, language, error details)
- Calls `/api/fix-bug` endpoint
- Shows before/after comparison
- Includes 8 pre-loaded buggy examples

### 5. `src/lib/buggy-examples.ts`

Contains 8 buggy code examples:
- Division by Zero
- Syntax Error
- Type Mismatch
- Index Error
- Undefined Variable
- Infinite Loop
- Null Reference
- File Not Found

---

## 🎨 Styling

### Global CSS (`src/app/globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

## 🔧 ShadCN UI Components

Install ShadCN components:

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add select
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add scroll-area
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add avatar
```

Or manually copy UI components from the repository.

---

## 🧪 Testing

```bash
# Development server
npm run dev

# Open browser
http://localhost:3000

# Test the Code Fixer
1. Go to http://localhost:3000/dashboard
2. Click "Load example..." dropdown
3. Select "Division by Zero"
4. Click "Fix Bug with AI"
5. Wait for AI to fix the code
6. See before/after comparison
```

---

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel
vercel --prod

# Or connect GitHub repo to Vercel for auto-deploy
```

---

## 🔑 API Key Configuration

The OpenAI API key is currently hardcoded in `src/app/api/fix-bug/route.ts`:

```typescript
const openai = new OpenAI({
  apiKey: 'sk-proj-your-actual-key-here',
});
```

**For production**, replace with environment variable:

```typescript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

---

## 🛠️ Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### TypeScript errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Styling not working
```bash
# Make sure Tailwind is configured
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## 📚 Full File Links

All source code files are available in the repository. Key files:

1. **API Endpoint**: `src/app/api/fix-bug/route.ts` (300+ lines)
2. **Landing Page**: `src/app/page.tsx` (200+ lines)
3. **Dashboard**: `src/app/dashboard/page.tsx` (150+ lines)
4. **Code Fixer**: `src/components/code-fixer.tsx` (250+ lines)
5. **Examples**: `src/lib/buggy-examples.ts` (140+ lines)
6. **Analytics**: `src/components/analytics-charts.tsx` (220+ lines)

---

## 🎯 Next Steps

1. ✅ Clone this structure locally
2. ✅ Install all dependencies
3. ✅ Copy source files from repository
4. ✅ Run `npm run dev`
5. ✅ Test the Code Fixer
6. ✅ Customize for your needs
7. ✅ Deploy to Vercel/Netlify

---

## 🤝 Contributing

Want to contribute? Check out the [README.md](./README.md) for guidelines.

---

## 📧 Support

- **GitHub**: github.com/mrbrightsides
- **Docs**: github.com/mrbrightsides/devflow
- **Discord**: discordapp.com/users/khudri_61362

---

**DevFlow.AI** - Autonomous Debugging That Never Sleeps 🚀
