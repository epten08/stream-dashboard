# 🎯 Stream Dashboard - Sports Streaming Platform

A comprehensive sports streaming management dashboard built with React, TypeScript, Redux Toolkit, and Appwrite. This platform provides complete management capabilities for live sports streaming, user subscriptions, analytics, and content administration.

## 🚀 Features

### 📊 **Analytics Dashboard**
- **Real-time viewer tracking** across all channels with live count updates
- **Subscription growth analytics** (Free, Basic, Premium) with trend visualization
- **Match and team popularity metrics** based on viewership and engagement
- **Comment engagement tracking** with moderation status monitoring
- **Revenue analytics** with conversion rate and churn analysis
- **Device and location analytics** for viewer behavior insights

### 👥 **User Management**
- **Complete user administration** with view, edit, and status management
- **Subscription tracking** showing which channels users are subscribed to
- **Block/unblock functionality** for access control
- **User activity monitoring** with last active timestamps
- **Role-based access control** (Admin/User)

### 💳 **Payment & Subscription System**
- **Mock EcoCash payment integration** (EcoCash, OneMoney, TeleCash)
- **Transaction history** with status tracking (Pending, Completed, Failed)
- **Subscription management** with automatic renewal handling
- **Revenue tracking** with detailed transaction reporting
- **Multiple payment gateway support** with realistic processing simulation

### 🏆 **Sports Management**
- **League administration** with hierarchical organization
- **Team management** with player roster support
- **Fixture scheduling** with venue and date management
- **Results tracking** with goal scorers and card records
- **Live standings calculation** with automatic updates based on results
- **Match statistics** including viewership and engagement metrics

### 📺 **Streaming & Content**
- **HLS video player** integration for live streaming
- **Channel management** (Free/Paid) with pricing controls
- **Camera feed monitoring** with status tracking
- **Multi-channel support** with subscriber access control
- **Content categorization** by league, team, and match type

### 📈 **Advanced Analytics**
- **Live viewer metrics** per channel with peak viewer tracking
- **Engagement analytics** including comments per hour and active users
- **Content performance** showing most-watched matches and popular teams
- **Subscription conversion tracking** from free to paid plans
- **Geographic viewer distribution** and device usage analytics

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Heroicons** for consistent iconography
- **Vite** for fast development and building

### Backend & Database
- **Appwrite** for backend services and real-time database
- **Authentication** with role-based access control
- **File storage** for media and assets
- **Real-time subscriptions** for live data updates

### Development Tools
- **TypeScript** for type safety and better DX
- **ESLint** with TypeScript support
- **Hot Module Replacement** for fast development
- **Mock data generation** utilities for testing

## 🏗️ Project Structure

```
src/
├── components/
│   ├── HLSPlayer.tsx          # Video streaming component
│   ├── ProtectedRoute.tsx     # Route protection
│   └── layout/
│       ├── DashboardLayout.tsx
│       └── Sidebar.tsx
├── hooks/
│   ├── redux.ts               # Typed Redux hooks
│   ├── useStandingsAutoUpdate.ts
│   └── analytics hooks
├── lib/
│   └── appwrite.ts            # Appwrite configuration
├── pages/
│   ├── Analytics.tsx          # Analytics dashboard
│   ├── Dashboard.tsx          # Main dashboard
│   ├── UsersSubscriptions.tsx # User management
│   ├── Standings.tsx          # League standings
│   ├── Fixtures.tsx           # Match fixtures
│   ├── Results.tsx            # Match results
│   ├── Teams.tsx              # Team management
│   ├── Leagues.tsx            # League management
│   └── auth/Login.tsx         # Authentication
├── store/
│   ├── index.ts               # Store configuration
│   ├── authSlice.ts
│   ├── analyticsSlice.ts      # Analytics state
│   ├── usersSlice.ts          # User management
│   ├── subscriptionsSlice.ts  # Subscription handling
│   ├── transactionsSlice.ts   # Payment processing
│   ├── standingsSlice.ts      # League standings
│   └── other slices...
├── types/
│   └── index.ts               # TypeScript definitions
└── utils/
    └── mockAnalytics.ts       # Mock data generation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Appwrite server instance

### Installation

1. **Clone the repository**
```bash
git clone [repository-url]
cd stream-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file with your Appwrite configuration:

```env
VITE_APPWRITE_ENDPOINT=https://your-appwrite-endpoint.com/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id

# Collection IDs
VITE_APPWRITE_LEAGUES_COLLECTION_ID=leagues
VITE_APPWRITE_TEAMS_COLLECTION_ID=teams
VITE_APPWRITE_FIXTURES_COLLECTION_ID=fixtures
VITE_APPWRITE_RESULTS_COLLECTION_ID=results
VITE_APPWRITE_USERS_COLLECTION_ID=users
VITE_APPWRITE_SUBSCRIPTIONS_COLLECTION_ID=subscriptions
VITE_APPWRITE_TRANSACTIONS_COLLECTION_ID=transactions
VITE_APPWRITE_CHANNELS_COLLECTION_ID=channels
VITE_APPWRITE_VIEWER_SESSIONS_COLLECTION_ID=viewer_sessions
VITE_APPWRITE_MATCH_POPULARITY_COLLECTION_ID=match_popularity
VITE_APPWRITE_COMMENTS_COLLECTION_ID=comments
```

4. **Start development server**
```bash
npm run dev
```

### Appwrite Setup

1. **Create Collections** in your Appwrite database:
   - `leagues`, `teams`, `fixtures`, `results`
   - `users`, `subscriptions`, `transactions`  
   - `channels`, `viewer_sessions`, `comments`
   - `match_popularity`

2. **Set up Authentication** with email/password
3. **Configure Permissions** for each collection
4. **Create Admin User** for initial access

## 📱 Usage

### Admin Dashboard
1. **Login** with admin credentials
2. **Analytics Overview** - View real-time metrics and trends
3. **User Management** - Monitor and manage user accounts
4. **Content Management** - Set up leagues, teams, and matches
5. **Payment Tracking** - Monitor transactions and subscriptions

### Key Workflows

**Setting up a Match Stream:**
1. Create League → Add Teams → Schedule Fixture → Record Result → View Updated Standings

**User & Subscription Management:**
1. View Users → Check Subscriptions → Process Payments → Monitor Analytics

**Analytics Monitoring:**
1. View Live Metrics → Track Popular Content → Monitor Engagement → Generate Reports

## 🔧 Configuration

### Redux Store
The application uses Redux Toolkit for state management with the following slices:
- `auth`: User authentication and authorization
- `analytics`: Real-time viewer and engagement metrics  
- `users`: User management and profiles
- `subscriptions`: Subscription and billing management
- `transactions`: Payment processing and history
- `standings`: League standings with auto-calculation
- Sports data slices for leagues, teams, fixtures, results

### Mock Data
For development and demonstration, the system includes comprehensive mock data generators:
- **Viewer sessions** with realistic engagement patterns
- **Comments and engagement** metrics
- **Payment transactions** with success/failure simulation
- **User subscriptions** across different tiers

## 🔐 Security Features

- **Role-based access control** (Admin/User)
- **Protected routes** requiring authentication
- **Input validation** and sanitization
- **Secure payment processing** simulation
- **User session management**
- **Content access control** based on subscription status

## 📊 Analytics & Reporting

### Real-time Metrics
- Live viewer counts per channel
- Active user sessions and engagement
- Comment activity and moderation queue
- Revenue and subscription conversions

### Historical Analytics
- Subscription growth trends over time
- Match and team popularity rankings
- User engagement patterns and retention
- Payment success rates and revenue tracking

### Business Intelligence
- Conversion rate optimization data
- Churn analysis and retention metrics
- Content performance insights
- Geographic and demographic analytics

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deployment Options
- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag and drop `dist` folder or connect repo
- **Traditional hosting**: Upload `dist` folder contents

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For questions and support:
- Create an issue on GitHub
- Check the documentation
- Review the code examples in the components

---

**Built with ❤️ for sports streaming management**