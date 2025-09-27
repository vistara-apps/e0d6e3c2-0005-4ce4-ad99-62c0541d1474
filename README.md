# SudoPath - AI Co-Founder for Solo Founders

An AI-powered conversational assistant that guides solo founders from idea to revenue-generating MVP launch with clear steps and revenue projections, specifically for Base Wallet MiniApps.

## 🚀 Features

### Core Features
- **AI-Powered Idea Framing**: Conversational flow to deeply understand problems, target audiences, and willingness to pay
- **Instant MVP Generation**: Suggests 3 distinct, low-effort MVP ideas (buildable in 1-3 days) with revenue models
- **MECE Pain Point Breakdown**: Decomposes problems into mutually exclusive, collectively exhaustive categories
- **80/20 Focus Engine**: Identifies highest-impact pain points to prioritize development effort
- **Minimal Launch Blueprint**: Lean strategy for user acquisition, payments, and product-market fit signals
- **Self-Critique & Validation Loop**: Highlights riskiest assumptions with 24-hour validation tests
- **Goal-Oriented Resource Hub**: Contextual templates, tutorials, and expert advice
- **Smart Requirement Elicitation**: AI-powered conversational prompts for requirement gathering
- **Automated 'Next-Step' Planning**: Generates actionable timelines based on gathered information

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **AI**: OpenAI GPT-4 for conversational AI
- **Blockchain**: Base Network integration
- **Wallet**: Coinbase Wallet SDK
- **State Management**: React hooks with local storage
- **UI Components**: Custom component library with Framer Motion animations

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sudopath
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your API keys:
   ```env
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
   NEXT_PUBLIC_FARCASTER_HUB_URL=https://hub.snapshot.org/graphql
   NEXT_PUBLIC_COINBASE_APP_ID=your_coinbase_app_id_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

### Color Palette
- **Background**: Dark theme optimized for Base ecosystem
- **Accent**: Orange (#F97316) for CTAs and highlights
- **Primary**: Blue (#2563EB) for main actions
- **Surface**: Dark gray (#1F2937) for cards and surfaces

### Typography
- **Display**: 2xl font size, bold weight for headings
- **Heading**: xl font size, semibold for section headers
- **Body**: Base font size, normal weight for content
- **Caption**: sm font size, medium weight for metadata

### Motion
- **Easing**: ease-out for smooth transitions
- **Duration**: 200ms base, 100ms fast, 300ms slow
- **Animations**: Subtle hover effects and loading states

## 🏗️ Architecture

### Data Models
- **UserSession**: Manages conversation state and user progress
- **User**: Stores user preferences and wallet information
- **BusinessIdea**: Captures refined business concepts
- **MVP**: Defines minimum viable products with specifications

### User Flow
1. **Welcome**: Initial interaction options
2. **Idea Framing**: Deep problem understanding
3. **MVP Suggestions**: Revenue-generating product ideas
4. **Pain Analysis**: MECE framework application
5. **Focus Selection**: 80/20 principle implementation
6. **Launch Planning**: Go-to-market strategy
7. **Validation Testing**: Risk mitigation
8. **Resource Hub**: Contextual guidance

### API Integrations
- **OpenAI**: Conversational AI and content generation
- **Base Network**: Blockchain interactions and payments
- **Farcaster**: Social graph and identity primitives
- **Coinbase Wallet**: Wallet connectivity and transactions

## 🚀 Business Model

### Revenue Streams
- **Micro-transactions**: Small payments for advanced AI analysis ($4.99)
- **Tiered Access**: Free basic features, premium advanced tools
- **Token Integration**: $DEGEN and other social tokens
- **Subscription**: Monthly access to premium features ($19.99/mo)

### Target Users
- Solo founders building Base MiniApps
- Entrepreneurs seeking rapid MVP validation
- Developers needing AI-assisted product development
- Founders focused on revenue-generating products

## 📱 Base MiniApp Integration

This app is designed as a Base MiniApp with:
- Wallet-native user experience
- On-chain payment capabilities
- Social token integration
- Seamless blockchain interactions

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Project Structure
```
sudopath/
├── app/
│   ├── components/          # React components
│   ├── lib/                 # Utilities and helpers
│   ├── types/               # TypeScript type definitions
│   └── page.tsx            # Main page component
├── public/                  # Static assets
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built for the Base ecosystem
- Powered by OpenAI's GPT-4
- Inspired by solo founder journeys
- Designed for rapid MVP development

---

**Ready to turn your idea into revenue? Start your conversation with SudoPath today!** 🚀

