# Migration Guide: React + Express → Next.js

This document outlines the migration from the original React (Vite) + Express backend to a unified Next.js application.

## What Changed

### Architecture
- **Before**: Separate frontend (React/Vite) and backend (Express) servers
- **After**: Unified Next.js application with API routes

### Key Improvements
1. ✅ **Single Application** - No more CORS issues
2. ✅ **Server-Side Rendering** - Better SEO and performance
3. ✅ **API Routes** - Backend integrated into Next.js
4. ✅ **shadcn/ui** - Modern, accessible UI components
5. ✅ **Improved DX** - Better developer experience

## Migration Steps Completed

### 1. Project Setup
- Created Next.js project with pages router
- Configured Tailwind CSS
- Added shadcn/ui components
- Set up TypeScript support (optional)

### 2. Backend Migration
All Express routes migrated to Next.js API routes:

| Original Route | New API Route |
|---------------|--------------|
| `POST /api/v1/auth/register` | `POST /api/auth/register` |
| `POST /api/v1/auth/send-otp` | `POST /api/auth/send-otp` |
| `POST /api/v1/auth/verify-otp` | `POST /api/auth/verify-otp` |
| `GET /api/v1/property/latest` | `GET /api/property/latest` |
| `GET /api/v1/property/get/:id` | `GET /api/property/[id]` |
| `POST /api/v1/property/search` | `POST /api/property/search` |
| `POST /api/v1/user/me` | `GET /api/user/me` |
| `POST /api/v1/contact` | `POST /api/contact` |

### 3. Database & Models
- ✅ Migrated Mongoose models to `/models`
- ✅ Created database connection utility (`lib/db.js`)
- ✅ Maintained all schema definitions

### 4. Frontend Migration
| Original Page | New Page |
|--------------|----------|
| `/src/pages/Home.jsx` | `/pages/index.js` |
| `/src/pages/Login.jsx` | `/pages/login.js` |
| `/src/pages/Register.jsx` | `/pages/register.js` |
| `/src/pages/BrowseProperty.jsx` | `/pages/browse.js` |
| `/src/pages/PropertyDetails.jsx` | `/pages/property/[id].js` |
| `/src/pages/About.jsx` | `/pages/about.js` |
| `/src/pages/Contact.jsx` | `/pages/contact.js` |
| `/src/pages/Agents.jsx` | `/pages/agents.js` |

### 5. Components Enhancement
All components upgraded with:
- ✅ shadcn/ui components
- ✅ Modern design patterns
- ✅ Responsive layouts
- ✅ Accessibility improvements

### 6. State Management
- ✅ Redux Toolkit maintained
- ✅ All slices migrated
- ✅ API calls updated for new routes

## How to Use

### Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Production
```bash
# Build the application
npm run build

# Start production server
npm start
```

## Breaking Changes

### 1. Import Paths
```javascript
// Before
import { Button } from '../components/Button'

// After
import { Button } from '@/components/ui/button'
```

### 2. Routing
```javascript
// Before (React Router)
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate()
navigate('/login')

// After (Next.js)
import { useRouter } from 'next/router'
const router = useRouter()
router.push('/login')
```

### 3. API Calls
```javascript
// Before
axios.get('http://localhost:4000/api/v1/property/latest')

// After
axios.get('/api/property/latest')
```

### 4. Environment Variables
```bash
# Before
VITE_API_URL=http://localhost:4000

# After
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## File Upload Changes

### Before (Express with Multer)
```javascript
// Handled by multer middleware on Express server
```

### After (Next.js with formidable)
```javascript
// API route handles multipart form data
export const config = {
  api: { bodyParser: false }
}
```

## Authentication Changes

### Before
- Separate backend JWT handling
- CORS configuration needed

### After
- Integrated authentication in API routes
- HTTP-only cookies for security
- No CORS issues

## Database Connection

### Before
```javascript
// Connected once on server start
connectDB(MONGO_URI)
```

### After
```javascript
// Connected per API route with caching
await connectDB()
```

## Middleware

### Before (Express)
```javascript
app.use(isAuthenticated)
app.use(adminOnly)
```

### After (Next.js)
```javascript
// Higher-order function
export default withAuth(handler, requireAdmin)
```

## Deployment Differences

### Before
- Deploy frontend to Vercel/Netlify
- Deploy backend to Heroku/Railway
- Manage two deployments

### After
- Single deployment to Vercel
- API routes included
- Environment variables in one place

## Performance Improvements

1. **Server-Side Rendering**: Better initial load
2. **API Co-location**: Reduced latency
3. **Image Optimization**: Next.js Image component
4. **Code Splitting**: Automatic by Next.js

## SEO Improvements

1. **Meta Tags**: Easy to add per page
2. **Dynamic Meta**: Server-side rendering
3. **Sitemap**: Generate automatically
4. **Performance**: Better Core Web Vitals

## Maintenance

### Old Structure
- Update two separate codebases
- Maintain two deployment pipelines
- Handle CORS and API versioning

### New Structure
- Single codebase
- One deployment
- Simplified updates

## Future Enhancements

Possible additions:
- [ ] Add App Router (Next.js 13+)
- [ ] Implement tRPC for type-safe APIs
- [ ] Add Prisma ORM
- [ ] Server Components
- [ ] Streaming SSR

## Troubleshooting

### Common Issues

**Issue**: API routes not working
```bash
# Solution: Check API route file naming
# Must be in /pages/api/
```

**Issue**: Images not loading
```bash
# Solution: Add domain to next.config.js
images: {
  domains: ['res.cloudinary.com']
}
```

**Issue**: Environment variables not available
```bash
# Solution: Prefix with NEXT_PUBLIC_ for client-side
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Support

For issues or questions:
1. Check Next.js documentation
2. Review shadcn/ui docs
3. Open an issue on GitHub

---

**Migration completed successfully!** 🎉
