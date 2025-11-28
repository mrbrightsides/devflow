# 🚀 DevFlow.AI

<div align="center">

![DevFlow.AI Banner](https://img.shields.io/badge/DevFlow.AI-Autonomous%20Debugging-blue?style=for-the-badge)

**Autonomous AI-Powered Debugging Platform for Modern Developers**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-green?style=flat&logo=openai)](https://openai.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](#) · [Report Bug](https://github.com/mrbrightsides/devflow/issues) · [Request Feature](https://github.com/mrbrightsides/devflow/issues)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)
- [Dashboard Features](#dashboard-features)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [Contact](#contact)

---

## 🎯 About

**DevFlow.AI** is an intelligent productivity platform designed to revolutionize how developers approach debugging. By leveraging cutting-edge AI technology, DevFlow.AI autonomously monitors your codebase, detects bugs in real-time, generates intelligent patches, and automates the entire debugging workflow—allowing developers to focus on what matters most: building great software.

### 🏆 Built for Galuxium Nexus Hackathon

DevFlow.AI was created to showcase the power of AI-driven automation in software development, demonstrating how artificial intelligence can significantly enhance developer productivity and code quality.

---

## ✨ Key Features

### 🤖 **AI-Powered Bug Detection & Fixing**
- **Automated Code Analysis**: Intelligent detection of syntax errors, logical bugs, and runtime issues
- **Smart Patch Generation**: AI generates optimized fixes using GPT-4o-mini
- **Multi-Language Support**: Python, JavaScript, TypeScript, Java, C++, and more
- **Confidence Scoring**: Each fix comes with a confidence score for transparency

### 📊 **Real-Time Dashboard**
- **Live Activity Feed**: Monitor all debugging activities in real-time
- **Productivity Analytics**: Track bugs fixed, time saved, and success rates
- **Interactive Visualizations**: Beautiful charts and metrics
- **Activity History**: Detailed logs of all AI actions and outcomes

### 🛠️ **Developer-First Experience**
- **Code Diff Viewer**: Side-by-side comparison of original and fixed code
- **Example Library**: Pre-loaded buggy code examples for testing
- **Export Reports**: Download detailed debugging reports
- **Responsive Design**: Works seamlessly on desktop and mobile

### 🎨 **Modern UI/UX**
- **Dark Mode**: Eye-friendly interface for long coding sessions
- **Smooth Animations**: Pure CSS animations for performance
- **Accessible**: Built with accessibility best practices
- **Fast & Lightweight**: No heavy dependencies, optimized for speed

---

## 🛠 Tech Stack

### **Frontend**
- **Framework**: [Next.js 15.3.4](https://nextjs.org/) (React 19.1.0)
- **Language**: [TypeScript 5.8.3](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.4.1](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + Custom Components
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

### **Backend & AI**
- **API Routes**: Next.js API Routes
- **AI Engine**: [OpenAI GPT-4o-mini](https://openai.com/)
- **Logging**: [Winston](https://github.com/winstonjs/winston)

### **Development Tools**
- **Package Manager**: npm
- **Code Quality**: TypeScript strict mode
- **Build Tool**: Next.js built-in compiler

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **OpenAI API Key** (for AI functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mrbrightsides/devflow.git
   cd devflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up API Key** (Optional - Already configured)
   
   The OpenAI API key is already integrated into the application. However, if you want to use your own key:
   - Open `src/app/api/fix-bug/route.ts`
   - Replace the API key in the OpenAI client initialization

### Running the App

1. **Development Mode**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

2. **Production Build**
   ```bash
   npm run build
   npm start
   ```

3. **Lint Code**
   ```bash
   npm run lint
   ```

---

## 📁 Project Structure

```
devflow/
├── public/                           # Static assets
│   └── .well-known/
│       └── farcaster.json            # Farcaster configuration
│
├── src/
│   ├── app/                          # Next.js app directory
│   │   ├── api/                      # API routes (12 endpoints)
│   │   │   ├── analyze-context/      # ✨ Context analysis (Phase 2)
│   │   │   │   └── route.ts
│   │   │   ├── explain-code/         # ✨ Code explanation (Option 3)
│   │   │   │   └── route.ts
│   │   │   ├── fix-bug/              # AI bug fixing endpoint
│   │   │   │   └── route.ts
│   │   │   ├── generate-suggestions/ # ✨ Multiple fixes (Option 3)
│   │   │   │   └── route.ts
│   │   │   ├── health/               # Health check endpoint
│   │   │   │   └── route.ts
│   │   │   ├── logger/               # Logging endpoint
│   │   │   │   └── route.ts
│   │   │   ├── me/                   # User endpoint (Farcaster)
│   │   │   │   └── route.ts
│   │   │   ├── proxy/                # API proxy
│   │   │   │   └── route.ts
│   │   │   ├── save-feedback/        # ✨ Feedback system (Phase 2)
│   │   │   │   └── route.ts
│   │   │   └── scan-security/        # ✨ Security scanner (Option 3)
│   │   │       └── route.ts
│   │   │
│   │   ├── dashboard/                # Dashboard page
│   │   │   └── page.tsx
│   │   │
│   │   ├── fonts/                    # Custom fonts
│   │   │   ├── GeistMonoVF.woff
│   │   │   └── GeistVF.woff
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Landing page
│   │   ├── not-found.tsx             # 404 page
│   │   ├── globals.css               # Global styles
│   │   └── favicon.ico               # Favicon
│   │
│   ├── components/                   # React components (35+ files)
│   │   ├── ui/                       # ShadCN UI components (50+ files)
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── aspect-ratio.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── button.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── card.tsx
│   │   │   ├── carousel.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── command.tsx
│   │   │   ├── context-menu.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── hover-card.tsx
│   │   │   ├── index.tsx
│   │   │   ├── input-otp.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── menubar.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── resizable.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toggle-group.tsx
│   │   │   ├── toggle.tsx
│   │   │   └── tooltip.tsx
│   │   │
│   │   ├── FarcasterManifestSigner.tsx    # Farcaster integration
│   │   ├── FarcasterToastManager.tsx      # Toast notifications
│   │   ├── FarcasterWrapper.tsx           # Farcaster wrapper
│   │   ├── activity-detail-modal.tsx      # Activity details
│   │   ├── analytics-charts.tsx           # Analytics visualizations
│   │   ├── analytics-dashboard.tsx        # ✨ Analytics hub (Option 2)
│   │   ├── architecture-diagram.tsx       # Architecture visualization
│   │   ├── bug-statistics-chart.tsx       # ✨ Bug stats (Option 2)
│   │   ├── code-diff-viewer.tsx           # Basic diff viewer
│   │   ├── code-explanation.tsx           # ✨ Bug explanation (Option 3)
│   │   ├── code-fixer.tsx                 # 🎯 Main AI code fixer
│   │   ├── context-analyzer.tsx           # ✨ Context analysis (Phase 2)
│   │   ├── demo-section.tsx               # Demo section
│   │   ├── enhanced-code-diff-viewer.tsx  # ✨ Split view diff (Option 1)
│   │   ├── enhanced-live-activity-feed.tsx # Live activity feed
│   │   ├── export-report-dialog.tsx       # Export dialog
│   │   ├── features-grid.tsx              # Features grid
│   │   ├── feedback-system.tsx            # ✨ User feedback (Phase 2)
│   │   ├── fix-history.tsx                # ✨ Fix history (Option 1)
│   │   ├── hero-section.tsx               # Hero section
│   │   ├── language-breakdown-chart.tsx   # ✨ Language stats (Option 2)
│   │   ├── live-activity-feed.tsx         # Activity feed
│   │   ├── mobile-nav.tsx                 # Mobile navigation
│   │   ├── model-selector.tsx             # ✨ AI model config (Phase 2)
│   │   ├── multi-file-uploader.tsx        # ✨ Multi-file upload (Phase 2)
│   │   ├── multiple-suggestions.tsx       # ✨ Multiple fixes (Option 3)
│   │   ├── ready-notifier.tsx             # Ready state notifier
│   │   ├── response-logger.tsx            # Response logger
│   │   ├── security-scanner.tsx           # ✨ Security scan (Option 3)
│   │   ├── stats-section.tsx              # Stats section
│   │   ├── success-metrics.tsx            # ✨ Success tracking (Option 2)
│   │   └── time-saved-calculator.tsx      # ✨ Time savings (Option 2)
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-mobile.tsx            # Mobile detection
│   │   ├── useAddMiniApp.ts          # Farcaster mini-app
│   │   ├── useIsInFarcaster.ts       # Farcaster context
│   │   ├── useManifestStatus.ts      # Manifest status
│   │   └── useQuickAuth.tsx          # Quick auth
│   │
│   ├── lib/                          # Utility libraries
│   │   ├── analytics.ts              # ✨ Analytics engine (Option 2)
│   │   ├── buggy-examples.ts         # Example buggy code (8 examples)
│   │   ├── error-handler.ts          # ✨ Error handling (Option 1)
│   │   ├── logger.ts                 # Logging utility
│   │   └── utils.ts                  # Helper functions
│   │
│   ├── utils/                        # Additional utilities
│   │   └── manifestStatus.ts         # Manifest status utility
│   │
│   └── middleware.ts                 # Next.js middleware
│
├── .gitignore                        # Git ignore rules
├── .eslintrc.json                    # ESLint configuration
├── components.json                   # ShadCN components config
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies
├── postcss.config.mjs                # PostCSS configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── README.md                         # Main documentation
├── DOCUMENTATION_INDEX.md            # Documentation index
├── SETUP_GUIDE.md                    # Setup guide
├── HOW_TO_BUILD_LOCALLY.md           # Local build guide
└── FILE_STRUCTURE.md                 # File structure guide
```

---

## 🔌 API Documentation

### `POST /api/fix-bug`

Analyzes and fixes buggy code using AI.

**Request Body:**
```json
{
  "code": "def divide(a, b):\n    return a / b",
  "language": "python",
  "errorType": "ZeroDivisionError",
  "errorMessage": "division by zero"
}
```

**Response:**
```json
{
  "success": true,
  "fixedCode": "def divide(a, b):\n    if b == 0:\n        return 0\n    return a / b",
  "confidence": 0.85,
  "analysis": "Analyzed 2 lines of code. Detected ZeroDivisionError. Generated fix with 4 lines. Modified 2 lines.",
  "model": "gpt-4o-mini",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Parameters:**
- `code` (string, required): The buggy code to fix
- `language` (string, optional): Programming language (default: python)
- `errorType` (string, optional): Type of error encountered
- `errorMessage` (string, optional): Error message from runtime

**Response Fields:**
- `success` (boolean): Whether the fix was successful
- `fixedCode` (string): The AI-generated fixed code
- `confidence` (number): Confidence score (0.0 - 1.0)
- `analysis` (string): Detailed analysis of the fix
- `model` (string): AI model used
- `timestamp` (string): ISO timestamp of the fix

---

### `GET /api/health`

Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600
}
```

---

## 📖 Usage Guide

### 1. **Landing Page**
Navigate to the homepage to learn about DevFlow.AI features and benefits.

### 2. **Dashboard**
Access the main dashboard at `/dashboard` to:
- View real-time activity feed
- Monitor debugging statistics
- Check productivity metrics

### 3. **AI Code Fixer**
Use the Code Fixer component to:

1. **Input Code**
   - Paste your buggy code into the text area
   - Select the programming language
   - Optionally specify error type and message

2. **Try Examples**
   - Click "Load example..." dropdown
   - Select from pre-loaded buggy code examples
   - Test the AI with common bug types

3. **Fix Bugs**
   - Click "Fix Bug with AI" button
   - Wait for AI analysis (typically 2-5 seconds)
   - Review the fixed code and analysis

4. **View Results**
   - See side-by-side code comparison
   - Check confidence score
   - Read detailed analysis

### 4. **Example Bug Types**
- **Division by Zero**: Arithmetic errors
- **Syntax Error**: Code syntax issues
- **Type Mismatch**: Type conversion problems
- **Index Error**: Array/list access issues
- **Undefined Variable**: Variable scope issues
- **Infinite Loop**: Loop condition problems
- **Null Reference**: Null pointer issues
- **File Not Found**: File I/O errors

---

## 📊 Dashboard Features

### **Real-Time Activity Feed**
Monitor all debugging activities as they happen:
- Bug detection events
- Fix generation progress
- Test execution results
- Commit status updates

### **Analytics Charts**
Visualize your debugging data:
- **Bugs Fixed Over Time**: Track daily bug resolution
- **Success Rate**: Monitor fix success percentage
- **Time Saved**: Calculate productivity gains
- **Bug Categories**: Distribution of bug types

### **Productivity Metrics**
Key performance indicators:
- Total bugs fixed
- Average fix time
- Success rate percentage
- Time saved vs manual debugging

### **Export Reports**
Generate detailed reports:
- PDF export of activity logs
- Custom date range selection
- Detailed bug analysis
- Fix recommendations

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### **Ways to Contribute**
- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests

### **Development Guidelines**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Style**
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write descriptive commit messages
- Add comments for complex logic
- Ensure all tests pass

---

## 🗺 Roadmap

### **Phase 1: Core Features** ✅
- [x] AI-powered bug detection
- [x] Code fix generation
- [x] Real-time dashboard
- [x] Activity feed
- [x] Code diff viewer

### **Phase 2: Enhanced AI** 🚧
- [ ] Multi-file bug detection
- [ ] Context-aware fixes
- [ ] Custom AI models
- [ ] Learning from user feedback

### **Phase 3: Integration** 📅
- [ ] GitHub integration
- [ ] VS Code extension
- [ ] CI/CD pipeline integration
- [ ] Slack notifications

### **Phase 4: Collaboration** 📅
- [ ] Team workspaces
- [ ] Shared debugging sessions
- [ ] Code review automation
- [ ] Knowledge base

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

**Developer**: Khudri (mrbrightsides)

- **GitHub**: [@mrbrightsides](https://github.com/mrbrightsides)
- **Discord**: [khudri_61362](http://discordapp.com/users/khudri_61362)
- **Documentation**: [DevFlow Docs](https://github.com/mrbrightsides/devflow)

### **Links**
- 🌐 **Website**: [DevFlow.AI](#)
- 📚 **Documentation**: [github.com/mrbrightsides/devflow](https://github.com/mrbrightsides/devflow)
- 🐛 **Issues**: [Report a bug](https://github.com/mrbrightsides/devflow/issues)
- 💬 **Discussions**: [Join the conversation](https://github.com/mrbrightsides/devflow/discussions)

---

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT-4o-mini model
- **Vercel** for Next.js framework
- **Radix UI** for accessible components
- **Tailwind CSS** for styling utilities
- **Galuxium Nexus** for hosting the hackathon

---

## 🌟 Star History

If you find DevFlow.AI helpful, please consider giving it a star ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=mrbrightsides/devflow&type=Date)](https://star-history.com/#mrbrightsides/devflow&Date)

---

<div align="center">

**Built with ❤️ by developers, for developers**

[⬆ Back to Top](#-devflowai)

</div>
