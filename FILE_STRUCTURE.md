# 📁 DevFlow.AI - Complete File Structure

> **Total Files**: 100+ files | **Lines of Code**: 10,000+ lines

---

## 🗂️ Root Directory

```
devflow-ai/
├── README.md                          # Main documentation
├── SETUP_GUIDE.md                     # Complete setup instructions
├── HOW_TO_BUILD_LOCALLY.md            # Local build guide
├── FILE_STRUCTURE.md                  # This file
├── package.json                       # Dependencies and scripts
├── tsconfig.json                      # TypeScript configuration
├── tailwind.config.ts                 # Tailwind CSS configuration
├── next.config.ts                     # Next.js configuration
├── postcss.config.mjs                 # PostCSS configuration
├── components.json                    # ShadCN UI configuration
└── .gitignore                         # Git ignore rules
```

---

## 📂 Public Directory

```
public/
└── .well-known/
    └── farcaster.json                 # Farcaster mini-app config (auto-generated)
```

---

## 📂 Source Directory

### 🎨 App Directory (`src/app/`)

#### Root Files
```
src/app/
├── layout.tsx                         # Root layout with metadata, fonts
├── page.tsx                           # Landing page with hero, features, demo
├── not-found.tsx                      # 404 error page
├── globals.css                        # Global styles, Tailwind directives
└── favicon.ico                        # App icon
```

#### Fonts
```
src/app/fonts/
├── GeistVF.woff                       # Sans-serif font (Vercel Geist)
└── GeistMonoVF.woff                   # Monospace font (Vercel Geist Mono)
```

#### Dashboard Page
```
src/app/dashboard/
└── page.tsx                           # Interactive dashboard
                                       # - Code Fixer
                                       # - Live Activity Feed
                                       # - Analytics Charts
                                       # - Export Report
```

---

### 🔌 API Routes (`src/app/api/`)

```
src/app/api/
├── fix-bug/
│   └── route.ts                       # 🔥 MAIN AI ENDPOINT
│                                      # - POST /api/fix-bug
│                                      # - Uses OpenAI GPT-4o Mini
│                                      # - Returns fixed code + confidence
│                                      # - 150 lines
│
├── health/
│   └── route.ts                       # Health check endpoint
│                                      # - GET /api/health
│                                      # - Returns system status
│
├── logger/
│   └── route.ts                       # Logging endpoint
│                                      # - POST /api/logger
│                                      # - Server-side logging
│
├── me/
│   └── route.ts                       # User info endpoint
│                                      # - GET /api/me
│                                      # - Farcaster integration
│
└── proxy/
    └── route.ts                       # API proxy (auto-generated)
                                       # - POST /api/proxy
                                       # - Proxies external API calls
```

---

### 🧩 Components Directory (`src/components/`)

#### Main Components
```
src/components/
├── code-fixer.tsx                     # 🔥 MAIN COMPONENT (250 lines)
│                                      # - Code input with syntax highlighting
│                                      # - Language selector
│                                      # - 8 pre-loaded examples
│                                      # - AI fix button
│                                      # - Before/after comparison
│
├── hero-section.tsx                   # Landing page hero
│                                      # - Animated headline
│                                      # - Stats display
│                                      # - CTA buttons
│                                      # - Terminal demo
│
├── features-grid.tsx                  # Features showcase
│                                      # - 8 feature cards
│                                      # - Icons with colors
│                                      # - Hover effects
│
├── demo-section.tsx                   # Demo video section
│                                      # - Video placeholder
│                                      # - Timeline highlights
│                                      # - Full screen button
│
├── stats-section.tsx                  # Statistics display
│                                      # - 4 stat cards
│                                      # - Animated numbers
│                                      # - Icons
│
├── architecture-diagram.tsx           # System architecture
│                                      # - 7-step pipeline
│                                      # - Tech stack badges
│                                      # - Responsive layout
│
├── live-activity-feed.tsx             # Real-time activity feed
│                                      # - Mock live updates
│                                      # - Activity animations
│                                      # - Status badges
│
├── enhanced-live-activity-feed.tsx    # Enhanced activity feed
│                                      # - Search & filter
│                                      # - Pagination
│                                      # - Click to view details
│
├── activity-detail-modal.tsx          # Activity detail popup
│                                      # - Full error traceback
│                                      # - Code diff viewer
│                                      # - Commit info
│
├── code-diff-viewer.tsx               # Code comparison
│                                      # - Side-by-side diff
│                                      # - Syntax highlighting
│                                      # - Copy to clipboard
│                                      # - Stats (lines changed)
│
├── analytics-charts.tsx               # Dashboard charts (220 lines)
│                                      # - Time series chart
│                                      # - Pie chart (error distribution)
│                                      # - Bar chart (weekly comparison)
│                                      # - Pure CSS/SVG (no libraries)
│
├── export-report-dialog.tsx           # Export functionality
│                                      # - Date range selector
│                                      # - Format options (PDF, CSV, JSON)
│                                      # - Mock export
│
├── mobile-nav.tsx                     # Mobile navigation
│                                      # - Hamburger menu
│                                      # - Responsive drawer
│
├── ready-notifier.tsx                 # Auto-generated helper
├── response-logger.tsx                # Auto-generated helper
├── FarcasterWrapper.tsx               # Auto-generated wrapper
├── FarcasterManifestSigner.tsx        # Auto-generated signer
└── FarcasterToastManager.tsx          # Auto-generated toast manager
```

---

### 🎨 UI Components (`src/components/ui/`)

> **ShadCN UI Components** - 65+ files

```
src/components/ui/
├── accordion.tsx                      # Collapsible sections
├── alert-dialog.tsx                   # Confirmation dialogs
├── alert.tsx                          # Notification alerts
├── aspect-ratio.tsx                   # Responsive containers
├── avatar.tsx                         # User avatars
├── badge.tsx                          # Status badges
├── breadcrumb.tsx                     # Navigation breadcrumbs
├── button.tsx                         # 🔥 Button component
├── calendar.tsx                       # Date picker
├── card.tsx                           # 🔥 Card containers
├── carousel.tsx                       # Image carousel
├── chart.tsx                          # Chart wrapper
├── checkbox.tsx                       # Checkbox input
├── collapsible.tsx                    # Collapsible content
├── command.tsx                        # Command palette
├── context-menu.tsx                   # Right-click menu
├── dialog.tsx                         # 🔥 Modal dialogs
├── drawer.tsx                         # Side drawer
├── dropdown-menu.tsx                  # Dropdown menus
├── form.tsx                           # Form wrapper
├── hover-card.tsx                     # Hover popups
├── index.tsx                          # UI exports
├── input-otp.tsx                      # OTP input
├── input.tsx                          # 🔥 Text input
├── label.tsx                          # Form labels
├── menubar.tsx                        # Menu bar
├── navigation-menu.tsx                # Navigation menus
├── pagination.tsx                     # Page navigation
├── popover.tsx                        # Popover tooltips
├── progress.tsx                       # Progress bars
├── radio-group.tsx                    # Radio buttons
├── resizable.tsx                      # Resizable panels
├── scroll-area.tsx                    # 🔥 Scrollable areas
├── select.tsx                         # 🔥 Select dropdown
├── separator.tsx                      # Visual dividers
├── sheet.tsx                          # Side sheets
├── sidebar.tsx                        # Sidebar layout
├── skeleton.tsx                       # Loading skeletons
├── slider.tsx                         # Range slider
├── sonner.tsx                         # Toast notifications
├── switch.tsx                         # Toggle switch
├── table.tsx                          # Data tables
├── tabs.tsx                           # 🔥 Tab navigation
├── textarea.tsx                       # 🔥 Multi-line input
├── toggle-group.tsx                   # Toggle button group
├── toggle.tsx                         # Toggle button
└── tooltip.tsx                        # Hover tooltips
```

---

### 🪝 Hooks Directory (`src/hooks/`)

```
src/hooks/
├── use-mobile.tsx                     # Mobile detection hook
├── useAddMiniApp.ts                   # Farcaster mini-app hook (auto-generated)
├── useIsInFarcaster.ts                # Farcaster context detection (auto-generated)
├── useManifestStatus.ts               # Manifest status hook (auto-generated)
└── useQuickAuth.tsx                   # Quick Auth hook (auto-generated)
```

---

### 📚 Library Directory (`src/lib/`)

```
src/lib/
├── buggy-examples.ts                  # 🔥 8 BUGGY CODE EXAMPLES (140 lines)
│                                      # - Division by Zero
│                                      # - Syntax Error
│                                      # - Type Mismatch
│                                      # - Index Error
│                                      # - Undefined Variable
│                                      # - Infinite Loop
│                                      # - Null Reference
│                                      # - File Not Found
│
├── utils.ts                           # Utility functions
│                                      # - cn() for className merging
│                                      # - Tailwind CSS helper
│
└── logger.ts                          # Logging utilities (auto-generated)
```

---

### 🛠️ Utils Directory (`src/utils/`)

```
src/utils/
└── manifestStatus.ts                  # Manifest status utils (auto-generated)
```

---

### 🔧 Root Middleware

```
src/
└── middleware.ts                      # Next.js middleware (auto-generated)
```

---

## 📊 File Statistics

### Lines of Code by Category

| Category              | Files | Lines  |
|-----------------------|-------|--------|
| **API Routes**        | 5     | ~500   |
| **Main Components**   | 15    | ~2,500 |
| **UI Components**     | 65    | ~5,000 |
| **Hooks**             | 5     | ~300   |
| **Library**           | 3     | ~200   |
| **Pages**             | 3     | ~800   |
| **Config**            | 6     | ~200   |
| **Auto-generated**    | 10    | ~500   |
| **TOTAL**             | ~112  | ~10,000|

---

## 🔥 Most Important Files

### Must-Have Files (Top 10)

1. **`src/app/api/fix-bug/route.ts`** - AI bug fixing endpoint (OpenAI integration)
2. **`src/components/code-fixer.tsx`** - Main code fixing UI component
3. **`src/lib/buggy-examples.ts`** - 8 pre-loaded buggy code examples
4. **`src/app/page.tsx`** - Landing page with hero & features
5. **`src/app/dashboard/page.tsx`** - Interactive dashboard
6. **`src/components/code-diff-viewer.tsx`** - Before/after comparison
7. **`src/components/analytics-charts.tsx`** - Dashboard charts
8. **`src/components/hero-section.tsx`** - Landing page hero
9. **`src/components/features-grid.tsx`** - Features showcase
10. **`src/app/layout.tsx`** - Root layout & metadata

---

## 🎯 Key Dependencies

### Production
- **`openai`** - OpenAI API client
- **`next`** - Next.js framework
- **`react`** - React library
- **`framer-motion`** - Animations
- **`lucide-react`** - Icons
- **`sonner`** - Toast notifications
- **`@radix-ui/*`** - UI primitives
- **`tailwindcss`** - Styling

### Development
- **`typescript`** - Type checking
- **`@types/*`** - Type definitions
- **`autoprefixer`** - CSS vendor prefixing

---

## 📝 File Naming Conventions

- **Pages**: `page.tsx` (Next.js App Router)
- **Layouts**: `layout.tsx`
- **API Routes**: `route.ts`
- **Components**: `kebab-case.tsx` (e.g., `code-fixer.tsx`)
- **Hooks**: `use*.tsx` or `use*.ts` (e.g., `use-mobile.tsx`)
- **Utils**: `kebab-case.ts` (e.g., `buggy-examples.ts`)
- **Config**: `*.config.ts` (e.g., `tailwind.config.ts`)

---

## 🚀 Getting Started

1. Read `README.md` for overview
2. Follow `SETUP_GUIDE.md` for detailed setup
3. Use `HOW_TO_BUILD_LOCALLY.md` to build from scratch
4. Reference this file for understanding structure

---

## 📧 Support

- **GitHub**: github.com/mrbrightsides
- **Docs**: github.com/mrbrightsides/devflow
- **Discord**: discordapp.com/users/khudri_61362

---

**DevFlow.AI** - Complete File Structure Reference 🚀
