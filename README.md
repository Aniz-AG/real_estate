# 🏡 EstateHub - Next.js Real Estate Platform

A modern, full-stack real estate platform built with **Next.js**, featuring property listings, user authentication, and an admin dashboard. Enhanced with **shadcn/ui** components for a beautiful, professional user interface.

## ✨ Features

### User Features
- 🔐 **Authentication System** - OTP-based login via Fast2SMS
- 🏠 **Property Browsing** - Advanced search and filtering
- ❤️ **Favorites** - Save and manage favorite properties
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS

### Admin Features
- 📊 **Dashboard** - Comprehensive admin panel
- ➕ **Property Management** - Add, edit, and delete listings
- 👥 **User Management** - Manage registered users
- 📧 **Contact Management** - Handle customer inquiries
- 📸 **Image Upload** - Cloudinary integration for media

### Technical Features
- ⚡ **Next.js Pages Router** - Server-side rendering and API routes
- 🗄️ **MongoDB** - NoSQL database with Mongoose ODM
- 🔄 **Redux Toolkit** - State management
- ☁️ **Cloudinary** - Image hosting and optimization
- 📱 **Fast2SMS** - SMS/OTP authentication
- 🎯 **TypeScript Ready** - Type-safe development

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- MongoDB (local or Atlas)
- Cloudinary account
- Fast2SMS account (for SMS/OTP)
- Redis (optional, for OTP caching)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd "Real Estate"
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/estatehub
# or use MongoDB Atlas
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/estatehub

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Fast2SMS (for OTP)
FAST2SMS_API_KEY=your_fast2sms_api_key

# Redis (optional)
REDIS_URI=redis://localhost:6379

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
Real Estate/
├── components/          # Reusable React components
│   ├── ui/             # shadcn/ui components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Layout.jsx
│   └── ...
├── pages/              # Next.js pages (routes)
│   ├── api/           # API routes
│   │   ├── auth/      # Authentication endpoints
│   │   ├── property/  # Property endpoints
│   │   ├── user/      # User endpoints
│   │   └── contact/   # Contact endpoints
│   ├── admin/         # Admin pages
│   ├── property/      # Property pages
│   ├── index.js       # Home page
│   ├── login.js       # Login page
│   ├── register.js    # Registration page
│   ├── browse.js      # Browse properties
│   ├── about.js       # About page
│   └── contact.js     # Contact page
├── models/            # Mongoose models
│   ├── userModel.js
│   ├── propertyModel.js
│   ├── ContactModel.js
│   └── otpModel.js
├── redux/             # Redux store and slices
│   ├── store.js
│   └── slices/
├── lib/               # Utility functions
│   ├── db.js         # Database connection
│   ├── helpers.js    # Helper functions
│   ├── middleware.js # Auth middleware
│   └── utils.js      # Utility functions
├── styles/           # Global styles
│   └── globals.css
├── public/           # Static files
├── .env.example     # Environment variables template
├── next.config.js   # Next.js configuration
├── tailwind.config.js
└── package.json
```

## 🔑 API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and login

### Properties
- `GET /api/property/latest` - Get latest properties
- `GET /api/property/top-cities` - Get top cities
- `GET /api/property/[id]` - Get single property
- `POST /api/property/search` - Search properties
- `GET /api/property/agents` - Get all agents

### User (Protected)
- `GET /api/user/me` - Get current user profile
- `POST /api/user/like/[pid]/[uid]` - Toggle property like

### Contact
- `POST /api/contact` - Submit contact form

## 🎨 UI Components (shadcn/ui)

The project uses shadcn/ui components for a consistent, accessible UI:

- ✅ Button
- ✅ Card
- ✅ Input
- ✅ Label
- ✅ Dialog/Modal
- ✅ Avatar
- ✅ Separator

## 🔒 Authentication Flow

1. User enters phone number
2. OTP sent via Fast2SMS
3. User enters OTP
4. JWT token generated and stored
5. Protected routes accessible

## 📦 Database Models

### User
- Username, email, phone
- Photo (Cloudinary)
- City, state
- Role (admin/user)
- Liked properties

### Property
- Address details
- Property type (apartment/house/villa)
- Price, bedrooms, bathrooms
- Photos (Cloudinary)
- Status (available/sold/rented)
- Usage type (rent/sale)
- Uploaded by (agent reference)

### Contact
- Name, email, phone
- Message
- Status (pending/fulfilled/rejected)

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

## 🛠️ Development

### Run development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Start production server
```bash
npm start
```

### Lint code
```bash
npm run lint
```

## 📝 Environment Variables

Copy `.env.example` to `.env` and fill in your values:

- **MONGO_URI**: MongoDB connection string
- **JWT_SECRET**: Secret key for JWT tokens
- **CLOUDINARY_***: Cloudinary credentials
- **FAST2SMS_***: Fast2SMS credentials for SMS/OTP
- **REDIS_URI**: Redis connection (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@estatehub.com or join our Slack channel.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- shadcn for the beautiful UI components
- Vercel for hosting solutions

---

Built with ❤️ using Next.js and shadcn/ui
