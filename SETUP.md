# Quick Setup Guide

## Prerequisites Installation

### 1. Install Node.js
Download and install Node.js (v18 or higher) from https://nodejs.org/

Verify installation:
```bash
node --version
npm --version
```

### 2. Install MongoDB

#### Option A: MongoDB Atlas (Cloud - Recommended for beginners)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string
5. Add to `.env` as `MONGO_URI`

#### Option B: Local MongoDB
**Windows:**
```bash
# Download from https://www.mongodb.com/try/download/community
# Install and start MongoDB service
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 3. Set up Cloudinary

1. Go to https://cloudinary.com
2. Sign up for free account
3. Get Cloud Name, API Key, API Secret from Dashboard
4. Add to `.env`

### 4. Set up Twilio (for SMS/OTP)

1. Go to https://www.twilio.com
2. Sign up for free trial
3. Get Account SID, Auth Token, Phone Number
4. Add to `.env`

## Installation Steps

### Step 1: Install Dependencies
```bash
cd "Real Estate"
npm install
```

This will install all required packages:
- Next.js and React
- MongoDB and Mongoose
- Tailwind CSS
- shadcn/ui components
- Redux Toolkit
- Axios
- And more...

### Step 2: Environment Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` with your credentials:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/estatehub
JWT_SECRET=your_random_secret_key_minimum_32_characters
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Generate JWT Secret:**
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Step 3: Start Development Server
```bash
npm run dev
```

The application will start on http://localhost:3000

### Step 4: Create Admin User

Since you need an admin user to access the dashboard:

1. Register a new user through the UI
2. Manually update the user in MongoDB:

```javascript
// Using MongoDB Compass or mongo shell
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

Or use this script (create `scripts/createAdmin.js`):
```javascript
const mongoose = require('mongoose');
require('dotenv').config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const User = require('../models/userModel').User;
  
  await User.updateOne(
    { email: 'admin@example.com' },
    { $set: { role: 'admin' } }
  );
  
  console.log('Admin user created!');
  process.exit();
}

createAdmin();
```

## Verification Checklist

- [ ] Node.js installed (v18+)
- [ ] MongoDB running
- [ ] Dependencies installed (`node_modules` folder exists)
- [ ] `.env` file configured
- [ ] Development server starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can register a new user
- [ ] Can login with OTP
- [ ] Can browse properties

## Common Issues & Solutions

### Issue: "Cannot find module 'next'"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "MongoDB connection failed"
**Solution:**
- Check if MongoDB is running
- Verify MONGO_URI in `.env`
- Check network/firewall settings

### Issue: "Twilio authentication failed"
**Solution:**
- Verify Twilio credentials
- Check phone number format
- Ensure trial account has verified numbers

### Issue: "Images not uploading"
**Solution:**
- Verify Cloudinary credentials
- Check API limits
- Ensure correct folder paths

### Issue: Port 3000 already in use
**Solution:**
```bash
# Kill the process using port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill
```

## Next Steps

1. **Customize Branding**: Update logo, colors in `tailwind.config.js`
2. **Add Content**: Create properties through admin dashboard
3. **Test Features**: Browse, search, and manage properties
4. **Deploy**: Follow deployment guide in README.md

## Development Workflow

```bash
# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Getting Help

- 📖 [Next.js Documentation](https://nextjs.org/docs)
- 🎨 [shadcn/ui Documentation](https://ui.shadcn.com)
- 🗄️ [MongoDB Documentation](https://docs.mongodb.com)
- ☁️ [Cloudinary Documentation](https://cloudinary.com/documentation)
- 📱 [Twilio Documentation](https://www.twilio.com/docs)

## Support

If you encounter issues:
1. Check the error message carefully
2. Review the documentation
3. Check environment variables
4. Clear cache and rebuild
5. Create an issue on GitHub

---

Happy Coding! 🚀
