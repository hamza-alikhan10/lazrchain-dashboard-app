# LazrChain - Crypto Earnings Dashboard

A beautiful, fully functional cryptocurrency dashboard application for earning USDT through bandwidth sharing. Built with React, TypeScript, and modern web technologies.

![LazrChain Dashboard](https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop)

## ✨ Features

- **💰 Real-time USDT Earnings** - Track your daily cryptocurrency earnings
- **📊 Analytics Dashboard** - Beautiful charts and performance metrics
- **👥 Referral Program** - Earn 10% commission from referred users
- **🎁 Rewards System** - Daily bonuses and milestone achievements
- **📱 Responsive Design** - Works perfectly on all devices
- **🔐 Secure Authentication** - User account management and security
- **💸 Deposit/Withdrawal** - TRC20 USDT transactions with QR codes
- **🌐 Network Speed Testing** - Real-time bandwidth monitoring

## 🛠️ Technologies Used

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Components**: Shadcn/ui component library
- **Charts**: Chart.js with React integration
- **QR Codes**: QRCode.react for payment QR generation
- **Icons**: Lucide React icon library
- **Build Tool**: Vite for fast development and building
- **State Management**: React hooks and local state

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm installed
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lazrchain-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080` to see the application

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎨 Design System

The application features a comprehensive design system with:

- **Color Palette**: Crypto-themed green and blue gradients
- **Typography**: Clean, modern fonts with proper hierarchy
- **Components**: Reusable UI components with consistent styling
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design approach

### Color Tokens

- `--primary`: Main brand green (#10B981)
- `--secondary`: Brand blue (#3B82F6)
- `--accent`: Purple accent (#8B5CF6)
- `--success`: Success green (#059669)
- `--warning`: Warning yellow (#F59E0B)

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Shadcn/ui components
│   ├── Dashboard.tsx   # Main dashboard component
│   ├── ReferralProgram.tsx
│   └── Rewards.tsx
├── hooks/              # Custom React hooks
│   ├── useUserData.ts  # User data management
│   └── use-toast.ts    # Toast notifications
├── lib/                # Utility functions
├── pages/              # Page components
└── styles/             # CSS and styling
```

## 🔧 Key Components

### Dashboard
The main application interface featuring:
- Balance overview cards
- Real-time earnings display
- Network speed testing
- Transaction history
- Interactive charts

### Referral Program
Complete referral system with:
- Unique referral codes and links
- QR code generation for sharing
- Referral tracking table
- Commission calculations

### Rewards System
Gamified reward system including:
- Daily login bonuses
- Milestone achievements
- Progress tracking
- Reward claiming interface

## 📊 Mock Data

The application uses realistic mock data for demonstration:
- **User Balance**: $250.75 USDT
- **Daily Earnings**: Real-time calculated earnings
- **Referrals**: Sample referred users with earnings
- **Transactions**: Deposit/withdrawal history
- **Rewards**: Achievement system with various tiers

## 🔐 Security Features

- Email validation with regex patterns
- Password strength requirements (8+ characters)
- Secure wallet connection simulation
- Protected routes and authentication state
- Input sanitization and validation

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Collapsible sidebar navigation
- Touch-friendly interface elements
- Optimized layouts for all screen sizes
- Smooth animations and transitions

## 🎯 User Experience

- **Intuitive Navigation**: Clear sidebar with section indicators
- **Real-time Updates**: Live earnings and network speed monitoring
- **Visual Feedback**: Toast notifications for all user actions
- **Loading States**: Smooth loading animations and skeletons
- **Error Handling**: Comprehensive error messages and validation

## 🚀 Performance

- **Fast Loading**: Optimized with Vite build system
- **Code Splitting**: Efficient component loading
- **Image Optimization**: Proper image handling and lazy loading
- **Bundle Size**: Minimized JavaScript bundle
- **Caching**: Browser caching strategies implemented

## 📈 Future Enhancements

Potential areas for expansion:
- Real blockchain integration
- Additional cryptocurrency support
- Advanced analytics and reporting
- Social features and community
- Mobile app development
- Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Shadcn/ui for the beautiful component library
- Lucide for the comprehensive icon set
- Chart.js for powerful charting capabilities
- Tailwind CSS for the utility-first styling approach

---

**Note**: This is a demonstration application with mock data for portfolio purposes. All cryptocurrency transactions and earnings are simulated.
