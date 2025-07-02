================================================================================
🚀 KOSTFINDER - COMPLETE SETUP GUIDE WITH LIBRARY INSTALLATION
================================================================================

📋 PREREQUISITES
- Node.js 18+ installed
- MongoDB Atlas account (free)
- Git installed
- Code editor (VS Code recommended)

================================================================================
🔧 STEP 1: CLONE & INSTALL DEPENDENCIES
================================================================================

# Clone the project
git clone <your-repo-url>
cd kostfinder

# Install all dependencies
npm install

# Or if you prefer yarn
yarn install

================================================================================
📦 STEP 2: MANUAL LIBRARY INSTALLATION (if needed)
================================================================================

If npm install doesn't work or you're setting up from scratch:

CORE DEPENDENCIES:
npm install next@14.0.4 react@^18 react-dom@^18
npm install @radix-ui/react-alert-dialog@^1.0.5
npm install @radix-ui/react-avatar@^1.0.4
npm install @radix-ui/react-checkbox@^1.0.4
npm install @radix-ui/react-dropdown-menu@^2.0.6
npm install @radix-ui/react-label@^2.0.2
npm install @radix-ui/react-select@^2.0.0
npm install @radix-ui/react-slider@^1.1.2
npm install @radix-ui/react-slot@^1.0.2
npm install @radix-ui/react-tabs@^1.0.4
npm install @radix-ui/react-toast@^1.1.5
npm install class-variance-authority@^0.7.0
npm install clsx@^2.0.0
npm install tailwind-merge@^2.1.0
npm install tailwindcss-animate@^1.0.7
npm install bcryptjs@^2.4.3
npm install jsonwebtoken@^9.0.2
npm install mongoose@^8.0.3
npm install leaflet@^1.9.4
npm install react-leaflet@^4.2.1
npm install lucide-react@^0.294.0
npm install framer-motion@^10.16.16

DEVELOPMENT DEPENDENCIES:
npm install -D typescript@^5
npm install -D @types/node@^20
npm install -D @types/react@^18
npm install -D @types/react-dom@^18
npm install -D @types/bcryptjs@^2.4.6
npm install -D @types/jsonwebtoken@^9.0.5
npm install -D @types/leaflet@^1.9.8
npm install -D tailwindcss@^3.3.0
npm install -D autoprefixer@^10.0.1
npm install -D postcss@^8
npm install -D eslint@^8
npm install -D eslint-config-next@14.0.4

ONE-LINER FOR ALL DEPENDENCIES:
npm install next@14.0.4 react@^18 react-dom@^18 @radix-ui/react-alert-dialog@^1.0.5 @radix-ui/react-avatar@^1.0.4 @radix-ui/react-checkbox@^1.0.4 @radix-ui/react-dropdown-menu@^2.0.6 @radix-ui/react-label@^2.0.2 @radix-ui/react-select@^2.0.0 @radix-ui/react-slider@^1.1.2 @radix-ui/react-slot@^1.0.2 @radix-ui/react-tabs@^1.0.4 @radix-ui/react-toast@^1.1.5 class-variance-authority@^0.7.0 clsx@^2.0.0 tailwind-merge@^2.1.0 tailwindcss-animate@^1.0.7 bcryptjs@^2.4.3 jsonwebtoken@^9.0.2 mongoose@^8.0.3 leaflet@^1.9.4 react-leaflet@^4.2.1 lucide-react@^0.294.0 framer-motion@^10.16.16

DEV DEPENDENCIES ONE-LINER:
npm install -D typescript@^5 @types/node@^20 @types/react@^18 @types/react-dom@^18 @types/bcryptjs@^2.4.6 @types/jsonwebtoken@^9.0.5 @types/leaflet@^1.9.8 tailwindcss@^3.3.0 autoprefixer@^10.0.1 postcss@^8 eslint@^8 eslint-config-next@14.0.4

================================================================================
🗄️ STEP 3: DATABASE SETUP (MONGODB ATLAS)
================================================================================

Create MongoDB Atlas Account:
1. Go to mongodb.com/atlas
2. Sign up for free account
3. Create new cluster (free tier)
4. Create database user with password
5. Whitelist IP address (0.0.0.0/0 for development)
6. Get connection string

Connection String Format:
mongodb+srv://username:password@cluster.mongodb.net/kostfinder

================================================================================
⚙️ STEP 4: ENVIRONMENT VARIABLES
================================================================================

Create .env.local file in root directory:

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kostfinder

# JWT Secret (generate random string)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name

GENERATE JWT SECRET:
# Option 1: Use Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Use online generator
# Visit: https://generate-secret.vercel.app/64

================================================================================
🎨 STEP 5: SETUP TAILWIND CSS
================================================================================

Create tailwind.config.js:
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

Create postcss.config.js:
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

================================================================================
📝 STEP 6: TYPESCRIPT CONFIGURATION
================================================================================

Create tsconfig.json:
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
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
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

================================================================================
🔧 STEP 7: NEXT.JS CONFIGURATION
================================================================================

Create next.config.mjs:
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['res.cloudinary.com', 'via.placeholder.com', 'picsum.photos'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      }
    ],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  }
}

export default nextConfig

================================================================================
📦 STEP 8: PACKAGE.JSON SCRIPTS
================================================================================

Update package.json scripts:
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "create-admin": "node scripts/create-admin.js",
    "seed-kosts": "node scripts/seed-kosts.js",
    "test-connection": "node scripts/test-connection.js"
  }
}

================================================================================
🖼️ STEP 9: CLOUDINARY SETUP (OPTIONAL)
================================================================================

If you want real image uploads:
1. Go to cloudinary.com
2. Sign up for free account
3. Go to Dashboard → Settings → Upload
4. Create upload preset named kostfinder_preset
5. Set it to "Unsigned"
6. Copy credentials to .env.local

If you skip Cloudinary:
- System will use beautiful placeholder images from Picsum Photos
- Everything still works perfectly!

================================================================================
🚀 STEP 10: INITIALIZE DATABASE
================================================================================

# Test MongoDB connection
npm run test-connection

# Create admin user
npm run create-admin

# Seed sample data
npm run seed-kosts

DEFAULT ADMIN CREDENTIALS:
- Email: admin@kostfinder.com
- Password: admin123

================================================================================
🏃‍♂️ STEP 11: RUN DEVELOPMENT SERVER
================================================================================

npm run dev

Visit: http://localhost:3000

================================================================================
🎯 STEP 12: TEST EVERYTHING
================================================================================

TEST CHECKLIST:
1. Homepage: Should load with sample kosts
2. Login: Use admin credentials
3. Admin Panel: http://localhost:3000/admin
4. Add Kost: Try creating new kost
5. Images: Test placeholder images
6. Search: Try search functionality
7. Ratings: Test rating system
8. Favorites: Test favorites system

================================================================================
🚨 TROUBLESHOOTING
================================================================================

LIBRARY INSTALLATION ISSUES:
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Use yarn if npm fails
npm install -g yarn
yarn install

MONGODB CONNECTION ISSUES:
# Check connection
npm run test-connection

# Common fixes:
# 1. Check username/password in connection string
# 2. Whitelist IP address in MongoDB Atlas
# 3. Ensure database name is correct

TYPESCRIPT ERRORS:
# Generate types
npx next build

# Skip TypeScript errors during development
# (already configured in next.config.mjs)

TAILWIND CSS NOT WORKING:
# Ensure Tailwind is properly configured
# Check if globals.css imports are correct
# Restart development server

PORT ALREADY IN USE:
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001

================================================================================
📁 FINAL PROJECT STRUCTURE
================================================================================

kostfinder/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin panel
│   ├── login/             # Auth pages
│   ├── globals.css        # Global styles
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # UI components
│   └── ...               # Custom components
├── lib/                   # Utilities
├── models/               # MongoDB models
├── scripts/              # Database scripts
├── .env.local            # Environment variables
├── next.config.mjs       # Next.js config
├── tailwind.config.js    # Tailwind config
├── tsconfig.json         # TypeScript config
├── package.json          # Dependencies
└── README.md             # Documentation

================================================================================
🌐 PRODUCTION DEPLOYMENT
================================================================================

VERCEL (RECOMMENDED):
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

ENVIRONMENT VARIABLES FOR PRODUCTION:
- Same as development
- Ensure MongoDB allows connections from Vercel IPs
- Use strong JWT_SECRET

================================================================================
📱 FEATURES INCLUDED
================================================================================

- Authentication: Login/Register/Logout
- Admin Panel: CRUD operations for kosts
- Search & Filter: Advanced search functionality
- Image Upload: With fallback to placeholders
- Rating System: User reviews and ratings
- Favorites: Save favorite kosts
- Maps Integration: Location display
- Responsive Design: Mobile-friendly
- Real-time Updates: Dynamic content

================================================================================
🎉 YOU'RE READY!
================================================================================

Your KostFinder project should now be running perfectly with all libraries installed!

QUICK START URLS:
- Homepage: http://localhost:3000
- Login: http://localhost:3000/login
- Admin: http://localhost:3000/admin
- Search: http://localhost:3000/search

Need help? Check the console logs for detailed error messages!

================================================================================
END OF SETUP GUIDE
================================================================================