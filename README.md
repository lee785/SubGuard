# SubGuard 

**AI-Powered Subscription Protection on Arc Testnet**

SubGuard is a next-generation dApp that protects users from subscription fraud and overspending using AI agents, Circle's programmable wallets, and burner virtual cards.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Circle](https://img.shields.io/badge/Circle-Arc%20Testnet-00D4AA?logo=circle)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)

---

## ✨ Features

- Circle Programmable Wallets - Secure USDC wallets on Arc Testnet
- Burner Virtual Cards - Per-merchant disposable cards with spend limits
- AI Guard Agent - Google Gemini-powered fraud detection
- Just-In-Time Liquidity - Cards funded only when transactions occur
- Real-Time Dashboard - Monitor subscriptions and spending
- Shield Configuration - Per-subscription spend caps and sensitivity settings

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│  Backend API    │────▶│  Circle SDK     │
│   (Frontend)    │     │                 │     │  (Arc Testnet)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  Privy Auth     │     │    ---------      │
└─────────────────┘     └─────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Circle Developer Account (wallet's and more)
- Privy Account (for authentication)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/SubGuard.git
cd SubGuard

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---


## 📁 Project Structure

```
SubGuard/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── api/             # API routes
│   │   └── page.tsx         # Main dashboard
│   ├── components/          # React components
│   │   └── dashboard/       # Dashboard UI components
│   └── lib/                 # Utilities & integrations
│       ├── circle/          # Circle SDK wrapper
│       └── gemini/          # AI agent logic
├── public/                  # Static assets
└── package.json
```

---

## 🎯 Tier System

| Tier | Cards | Monthly Limit | Price |
|------|-------|---------------|-------|
| Free | 1 | $50 | $0 |
| Tier 1 | 5 | $500 | 5 USDC |
| Tier 2 | Unlimited | Unlimited | 15 USDC |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS
- **Authentication:** Privy
- **Blockchain:** Circle Programmable Wallets (Arc Testnet)
- **AI Agent:** Google Gemini

---

## 📦 Deployment

### Frontend (Vercel)
```bash
# Push to GitHub, then connect to Vercel
vercel --prod
```


---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🔗 Links

- **Live Demo:** [Coming Soon]

---

Built with 💜 for the Circle Arc Hackathon
