# Meru Technosoft - Invoice Details Module

A full-stack MERN application for managing invoices and processing payments with a clean, modern UI.

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** Passport.js, Google OAuth 2.0, Session-based Auth
- **Session Storage:** express-session with MongoDB (connect-mongo)
- **Frontend:** React.js(Next.js 16+), Tailwind CSS
- **Validation:** Joi (backend)
- **Architecture:** Service Layer Pattern, Transaction-based Payments
- **Currency:** Multi-Currency Support (INR, USD, EUR, GBP, JPY, AUD)
- **PDF Generation:** PDFKit for professional invoice PDFs

## Project Structure

```
invoice-details-page/
├── server/          # Backend API
│   ├── src/
│   │   ├── config/      # Database & constants
│   │   ├── models/      # Mongoose models
│   │   ├── services/    # Business logic
│   │   ├── controllers/ # Request handlers
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Validation & error handling
│   │   └── utils/       # Helper functions
│   └── scripts/     # Seed data
├── client/          # Frontend (Next.js)
│   └── src/
│       ├── app/         # Next.js app router
│       ├── components/  # React components
│       └── lib/         # API client & utilities
└── README.md
```

## Features

### Authentication & Security
- **Google OAuth 2.0 Authentication** - Secure login with Google accounts
- **Session-based Authentication** - Persistent sessions stored in MongoDB
- **Protected Routes** - All invoice operations require authentication
- **User Profile Management** - Display user name, email, and picture
- **Automatic Session Expiry** - 7-day session duration
- **Secure Cookie Management** - httpOnly, sameSite protection

### Core Functionality
- View invoice details with line items
- **Tax Calculations** with currency-specific rates (GST, VAT, Sales Tax)
- Display tax breakdown (Subtotal, Tax, Total)
- Display payment history
- Add new payments with validation
- Automatic balance calculation
- Status management (DRAFT → PAID)
- Archive/restore invoices
- MongoDB transactions for data integrity
- Generate and download professional PDF invoices with tax details
- **Multi-Currency Support** (INR, USD, EUR, GBP, JPY, AUD)
- Currency-aware formatting and calculations

### UI Features
- Fully responsive design
- Clean, modern interface with authentication flow
- Beautiful login page with Google OAuth button
- User profile display in header
- Logout functionality
- Optimistic UI updates
- Loading states and error handling
- Payment progress visualization
- Multi-currency display with proper locale formatting
- Currency-specific symbols and number formats
- Server-side rendering for performance

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn
- Git

## Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/sapnendra/invoices.git
cd invoices
```

### Step 2: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../client
npm install
```

### Step 4: Configure Environment

Create a `.env` file in the `server/` directory with the following settings:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/invoice_db
CLIENT_URL=http://localhost:3000

# Session Secret (generate a random string)
SESSION_SECRET=your-32-char-random-string-here

# Google OAuth Credentials (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

**Generate SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" OR openssl rand -base64 32 -> Terminal
```

**Get Google OAuth Credentials:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Create **OAuth client ID** → **Web application**
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

### Step 5: Start MongoDB

Ensure MongoDB is running on your system:

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

**macOS:**
```bash
brew services start mongodb-community
brew services list
```

**Windows:**
```bash
net start MongoDB
```

### Step 6: Seed Sample Data

From the `server/` directory, run:

```bash
npm run seed
```

This will create 12 sample invoices with various payment scenarios. Note the Invoice IDs displayed in the console output for testing.

## How to Run Backend

Navigate to the server directory and start the development server:

```bash
cd server
npm run dev
```

The backend API will run on `http://localhost:5000`

### Available Backend Scripts

- `npm run dev` - Start development server with nodemon (auto-restart on changes)
- `npm start` - Start production server
- `npm run seed` - Populate database with sample data

### Backend Endpoints

The API will be available at `http://localhost:5000/api`

**Key Endpoints:**
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice details
- `GET /api/invoices/:id/download-pdf` - Download invoice as PDF
- `POST /api/invoices/:id/payments` - Add a payment
- `POST /api/invoices/:id/archive` - Archive an invoice
- `POST /api/invoices/:id/restore` - Restore an archived invoice

## How to Run Frontend

Open a new terminal, navigate to the client directory, and start the development server:

```bash
cd client
npm run dev
```

The frontend application will run on `http://localhost:3000`

### Available Frontend Scripts

- `npm run dev` - Start Next.js development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Access the Application

Open your browser and navigate to:
- **Homepage:** `http://localhost:3000` - View invoice dashboard
- **Invoice Details:** `http://localhost:3000/invoices/{INVOICE_ID}` - View specific invoice

## Seed Data

The seed script creates 12 diverse sample invoices with various payment scenarios:

### Invoice Overview

**1. INV-2026-001** - Acme Enterprise (INR)
- Status: DRAFT (partially paid)
- Subtotal: ₹85,000 | GST (18%): ₹15,300
- Total: ₹100,300
- Amount Paid: ₹35,000
- Balance Due: ₹65,300

**2. INV-2026-002** - Tech Solutions Inc (USD)
- Status: PAID (fully paid)
- Subtotal: $1,500 | Sales Tax (10%): $150
- Total: $1,650
- Balance: $0

**3. INV-2026-003** - Global Innovations Ltd (EUR)
- Status: DRAFT (no payment yet)
- Subtotal: €420 | VAT (20%): €84
- Total: €504
- Balance Due: €504

**4. INV-2026-004** - Quantum Systems Pvt Ltd (INR)
- Status: DRAFT (large invoice, partial payment)
- Subtotal: ₹2,50,000 | GST (18%): ₹45,000
- Total: ₹2,95,000
- Balance Due: ₹1,95,000

**5. INV-2026-005** - Startup Hub India (GBP)
- Status: PAID
- Subtotal: £185 | VAT (20%): £37
- Total: £222
- Balance: £0

**6. INV-2026-006** - Digital Marketing Pro (USD)
- Status: DRAFT (almost paid)
- Subtotal: $810 | Sales Tax (10%): $81
- Total: $891
- Balance Due: $171

**7. INV-2026-007** - Enterprise Corp (INR)
- Status: DRAFT (large project)
- Subtotal: ₹3,50,000 | GST (18%): ₹63,000
- Total: ₹4,13,000
- Balance Due: ₹2,38,000

**8. INV-2026-008** - Consulting Group LLC (JPY)
- Status: PAID
- Subtotal: ¥142,500 | Consumption Tax (10%): ¥14,250
- Total: ¥156,750
- Balance: ¥0

**9. INV-2025-099** - Legacy Systems Inc (AUD)
- Status: PAID (ARCHIVED)
- Subtotal: A$1,170 | GST (10%): A$117
- Total: A$1,287
- Balance: A$0

**10-12.** Three additional invoices with various statuses

### Seed Data Features
- Multiple realistic line items per invoice
- **Tax calculations** with currency-specific rates
- **Tax rates:** INR 18% GST, USD 10% Sales Tax, EUR/GBP 20% VAT, JPY 10% Consumption Tax, AUD 10% GST
- Proper tax terminology per region (GST, VAT, Sales Tax)
- Various payment histories (single, installments, none)
- Different invoice sizes across various currencies
- **Multi-currency data:** INR, USD, EUR, GBP, JPY, AUD
- Currency-appropriate amounts (e.g., $1,500 vs ₹1,50,000)
- One archived invoice for testing
- Locale-specific number formatting

After seeding, the console displays all Invoice IDs with their currencies for testing.

## API Endpoints

### Authentication Endpoints

#### Initiate Google OAuth Login
```http
GET /api/auth/google
```
Redirects to Google's OAuth consent screen.

#### OAuth Callback
```http
GET /api/auth/google/callback
```
Handles Google OAuth callback. Redirects to:
- Success: `http://localhost:3000/?auth=success`
- Failure: `http://localhost:3000/login?error=auth_failed`

#### Get Current User
```http
GET /api/auth/user
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "googleId": "google_id",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/...",
    "lastLogin": "2026-02-18T10:30:00.000Z"
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "message": "Not authenticated"
}
```

#### Logout
```http
POST /api/auth/logout
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### Invoice Endpoints

**Note:** All invoice endpoints require authentication. Include session cookie in requests.

#### Get Invoice Details
```http
GET /api/invoices/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invoice": { },
    "lineItems": [ ],
    "payments": [ ],
    "calculated": {
      "total": 85000,
      "amountPaid": 35000,
      "balanceDue": 50000
    }
  }
}
```

#### Add Payment
```http
POST /api/invoices/:id/payments
Content-Type: application/json

{
  "amount": 25000,
  "paymentDate": "2026-02-15"
}
```

**Validation Rules:**
- Amount must be greater than 0
- Amount cannot exceed balance due
- Payment date cannot be in the future
- Cannot add payment to archived invoice
- Cannot add payment to fully paid invoice

#### Archive Invoice
```http
POST /api/invoices/:id/archive
```

#### Restore Invoice
```http
POST /api/invoices/:id/restore
```

## Testing the Application

### 0. Authentication Flow

**First-time Access:**
1. Navigate to `http://localhost:3000`
2. You'll be automatically redirected to `/login`
3. Click **"Continue with Google"** button
4. Sign in with your Google account
5. Grant permissions (email and profile)
6. You'll be redirected back to the homepage with a success message
7. Your profile picture, name, and email appear in the header

**Logout:**
1. Click the **Logout** button in the header
2. You'll be redirected to the login page
3. Your session is destroyed

**Session Persistence:**
- Sessions last 7 days
- Closing the browser doesn't log you out
- Refreshing the page keeps you logged in
- Sessions are stored in MongoDB

### 1. View Invoice Dashboard
Navigate to: `http://localhost:3000` (requires authentication)

The homepage displays invoice cards with different statuses:
- Partial payments (invoices with balance due)
- Fully paid invoices
- Unpaid invoices
- Archived invoices

Click any card to view full invoice details.

### 2. View Invoice Details
Navigate to: `http://localhost:3000/invoices/{INVOICE_ID}`

Replace `{INVOICE_ID}` with one of the IDs from the seed script output.

### 3. Add a Payment
1. Click "Add Payment" button
2. Enter amount (try partial payment: ₹25,000)
3. Use quick amount buttons (25%, 50%, or Full Amount)
4. Select payment date
5. Click "Add Payment"
6. Observe real-time updates to totals and progress bar

### 4. Test Validation
- Try paying more than balance due → Shows error: "Amount cannot exceed balance due"
- Try entering ₹0 or negative → Shows error: "Amount must be greater than 0"
- Try future date → Shows error: "Payment date cannot be in the future"
- Try adding payment to fully paid invoice → "Add Payment" button is hidden

### 5. Test Full Payment
1. Add payment equal to remaining balance
2. Status should change from DRAFT to "PAID"
3. "Add Payment" button should disappear
4. Progress bar shows 100%
5.# 6. Download Invoice as PDF
1. Click "Download PDF" button in the invoice header
2. Wait for PDF generation (shows "Generating PDF..." during processing)
3. PDF automatically downloads with filename "Invoice-{InvoiceNumber}.pdf"
4. Open the PDF and verify:
   - Professional formatting with header and footer
   - Invoice details (number, dates, status)
   - Customer information
   - Line items table with quantities, prices, and totals
   - Payment summary box
   - Payment history (if payments exist)
   - Notes section (if notes exist)

## "Fully Paid" message appears

## Design Reference

The UI is inspired by modern invoice management systems with:
- Clean white cards with subtle shadows
- Green primary color (#22c55e)
- Professional typography hierarchy
- Responsive grid layout (mobile, tablet, desktop)
- Hover states and smooth transitions
- Multi-currency formatting with locale-aware separators
- Currency-specific symbols (₹, $, €, £, ¥, A$)
- Visual payment progress indicators

## Architecture Highlights

### Backend Architecture
- **Authentication Layer:** Google OAuth 2.0 strategy
- **Session Management:** express-session with MongoDB store (connect-mongo)
- **Protected Routes:** Authentication middleware on all invoice endpoints
- **User Model:** MongoDB schema for storing Google profile data
- **Service Layer Pattern:** Business logic separated from controllers
- **MongoDB Transactions:** Atomic payment + invoice updates
- **Error Handling:** Centralized error handler with custom error classes
- **Validation:** Joi schemas for request validation
- **Calculation Helpers:** Reusable utility functions

### Frontend Architecture
- **Authentication Context:** React Context API for user state management
- **Protected Routes:** Client-side route protection with automatic redirects
- **Session Verification:** Automatic auth check on app load
- **React.js(Next.js 16+ App Router):** Server components with async params handling
- **Server Components:** Initial data fetching for performance
- **Client Components:** Interactive features (modals, forms, auth)
- **Optimistic Updates:** Immediate UI feedback
- **Component Composition:** Small, focused components
- **Custom Formatting:** Manual currency/date formatting for SSR reliability

## Business Rules Enforced

1. **Overpayment Prevention:** Cannot pay more than balance due
2. **Status Automation:** Status changes to PAID when balance = 0
3. **Archived Protection:** Cannot modify archived invoices
4. **Calculation Integrity:** Line totals = quantity × unit price
5. **Transaction Safety:** All payment operations are atomic
6. **Concurrent Safety:** Race condition protection via transactions

## Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list            # macOS

# Start MongoDB
sudo systemctl start mongod   # Linux
brew services start mongodb-community  # macOS
net start MongoDB             # Windows
```

### Port Already in Use
```bash
# Kill process on port 5000 (Linux/macOS)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (Linux/macOS)
lsof -ti:3000 | xargs kill -9
```

### CORS Errors
Verify `CLIENT_URL` in `server/.env` matches your frontend URL (default: `http://localhost:3000`)

### Cannot Find Invoice
Make sure you are using a valid Invoice ID from the seed script output.

## Production Deployment

### Overview
This application requires special configuration for production deployment due to cross-origin cookie requirements for authentication.

### ⚠️ Critical: Cookie and Cross-Origin Setup

**Problem:** Modern browsers block third-party cookies by default. When your frontend and backend are on different domains (e.g., `app.example.com` and `api-backend.onrender.com`), session cookies won't work.

**Solution:** Use subdomains under the same root domain:
- ✅ **Frontend:** `invoices.yourdomain.com`
- ✅ **Backend:** `invoices-api.yourdomain.com`
- ❌ **Don't:** Use completely different domains

### Backend Deployment (Render/Heroku/Railway)

#### 1. Environment Variables

Set these in your production environment:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/invoice_db

# Session Secret (use a strong random string)
SESSION_SECRET=your-secure-random-64-char-string

# IMPORTANT: Use subdomain approach
CLIENT_URL=https://invoices.yourdomain.com

# Google OAuth with production URLs
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=https://invoices-api.yourdomain.com/api/auth/google/callback
```

#### 2. Custom Domain Setup (Render Example)

**Step 1:** Add custom domain in Render dashboard
- Go to your service → Settings → Custom Domains
- Add: `invoices-api.yourdomain.com`

**Step 2:** Configure DNS (at your domain provider)
```
Type: CNAME
Name: invoices-api
Value: your-app.onrender.com
TTL: 3600
```

**Step 3:** Wait for SSL certificate verification (5-10 minutes)

#### 3. Required Code Configuration

The application already includes production-ready configuration:

**Trust Proxy** ([server/src/app.js](server/src/app.js)):
```javascript
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // Required for Render/Heroku
}
```

**Session Cookie for Subdomains** ([server/src/app.js](server/src/app.js)):
```javascript
cookie: {
  secure: true, // HTTPS only
  sameSite: 'lax', // Works for same root domain
  domain: '.yourdomain.com', // Share across subdomains
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}
```

**CORS Configuration** ([server/src/app.js](server/src/app.js)):
```javascript
cors({
  origin: process.env.CLIENT_URL,
  credentials: true, // Allow cookies
})
```

#### 4. Update Google OAuth Console

[Google Cloud Console](https://console.cloud.google.com/apis/credentials):

**Authorized JavaScript origins:**
- `https://invoices.yourdomain.com`
- `https://invoices-api.yourdomain.com`

**Authorized redirect URIs:**
- `https://invoices-api.yourdomain.com/api/auth/google/callback`

### Frontend Deployment (Vercel/Netlify)

#### 1. Environment Variables

Update `.env.local` or add in deployment dashboard:

```env
NEXT_PUBLIC_API_URL=https://invoices-api.yourdomain.com
```

#### 2. Custom Domain Setup

**Vercel:** Settings → Domains → Add `invoices.yourdomain.com`

**Netlify:** Domain settings → Custom domains → Add domain

**DNS Configuration:**
```
Type: CNAME
Name: invoices
Value: cname.vercel-dns.com (or netlify equivalent)
```

#### 3. Build and Deploy

```bash
cd client
npm run build
# Deploy based on your platform
```

### Testing Production Setup

#### 1. Verify Cookie Configuration
```bash
curl -I https://invoices-api.yourdomain.com/api/auth/test-cookie
# Look for: Set-Cookie: connect.sid=...; Domain=.yourdomain.com; Secure; HttpOnly; SameSite=Lax
```

#### 2. Test Authentication Flow
1. Visit `https://invoices.yourdomain.com`
2. Click "Continue with Google"
3. Complete OAuth flow
4. Should redirect back and show invoice dashboard
5. Refresh page - should stay logged in

#### 3. Verify Session Persistence
- Close browser completely
- Reopen and visit the app
- Should still be logged in (session persists)

### Troubleshooting Production Issues

#### Problem: "Not authenticated" after login

**Symptoms:**
- OAuth succeeds but user gets redirected to login
- Session doesn't persist between requests

**Causes & Solutions:**

1. **Different Root Domains**
   - ❌ Wrong: `myapp.vercel.app` + `myapi.onrender.com`
   - ✅ Fix: Use subdomains like `app.domain.com` + `api.domain.com`

2. **Missing Trust Proxy**
   ```javascript
   app.set('trust proxy', 1); // Add this!
   ```

3. **Wrong Cookie Domain**
   ```javascript
   domain: '.yourdomain.com' // Must start with dot
   ```

4. **CORS Not Allowing Credentials**
   ```javascript
   cors({ credentials: true }) // Must be set
   ```

5. **Third-Party Cookie Blocking**
   - Only happens with different domains
   - Fix: Use subdomain approach

#### Problem: CORS Errors

**Check:**
- `CLIENT_URL` environment variable matches frontend URL exactly
- CORS includes `credentials: true`
- Frontend includes `credentials: 'include'` in fetch requests

#### Problem: SSL/HTTPS Issues

**Solution:**
- Both frontend and backend must use HTTPS in production
- Wait for SSL certificate verification in Render/Vercel
- Don't use `secure: true` cookies with HTTP

### Architecture: Production Setup

```
┌─────────────────────────────────────────────────┐
│  Browser                                        │
│  ├─ Cookies: connect.sid                       │
│  └─ Domain: .sapnendra.tech (shared)           │
└─────────────────────────────────────────────────┘
           │                    │
           │                    │
     (HTTPS)              (HTTPS + Cookie)
           │                    │
           ▼                    ▼
┌────────────────┐    ┌────────────────────┐
│   Frontend      │    │   Backend API      │
│ invoices.       │    │ invoices-api.      │
│ sapnendra.tech  │    │ sapnendra.tech     │
│                 │    │                    │
│ (Vercel/Netlify)│    │ (Render/Railway)   │
└────────────────┘    └────────────────────┘
                               │
                               │
                               ▼
                      ┌────────────────┐
                      │   MongoDB      │
                      │   Atlas        │
                      │  (Sessions +   │
                      │   Data)        │
                      └────────────────┘
```

### Deployment Checklist

**Backend:**
- [ ] MongoDB Atlas cluster created
- [ ] All environment variables set
- [ ] Custom domain configured (e.g., `invoices-api.yourdomain.com`)
- [ ] DNS CNAME record added
- [ ] SSL certificate verified
- [ ] `trust proxy` enabled in code
- [ ] Cookie domain set to `.yourdomain.com`
- [ ] Deploy and verify server starts

**Frontend:**
- [ ] `NEXT_PUBLIC_API_URL` updated to backend subdomain
- [ ] Custom domain configured (e.g., `invoices.yourdomain.com`)
- [ ] DNS record added
- [ ] Build successful
- [ ] Deployed to production

**Google OAuth:**
- [ ] Production redirect URI added
- [ ] JavaScript origins updated
- [ ] Callback URL matches backend subdomain

**Testing:**
- [ ] Login flow works
- [ ] Session persists after refresh
- [ ] Session persists after browser restart
- [ ] All API calls succeed
- [ ] No CORS errors in console
- [ ] Cookies visible in DevTools

### MongoDB Atlas Setup

1. Create a production cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Network Access: Add `0.0.0.0/0` (or specific IPs)
3. Database Access: Create user with read/write permissions
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`
5. Update `MONGODB_URI` in production environment

### Performance Considerations

- Enable MongoDB indexes on frequently queried fields
- Use connection pooling (already configured)
- Enable gzip compression in Express
- Monitor session store size in MongoDB
- Set up monitoring/logging (e.g., Sentry, LogRocket)

## Recent Updates

- **Production Authentication Fixes:**
  - Fixed cross-origin cookie issues for production deployment
  - Added `trust proxy` configuration for Render/Heroku compatibility
  - Implemented subdomain-based cookie sharing (`.sapnendra.tech`)
  - Changed `sameSite` from `none` to `lax` for same-root-domain approach
  - Added explicit session save in OAuth callback
  - Replaced HTTP 302 redirect with HTML intermediate page for better cookie persistence
- **Session Configuration:**
  - Added `proxy: true` for production reverse-proxy compatibility
  - Explicit cookie `path: '/'` configuration
  - Cookie domain set to `.sapnendra.tech` for subdomain sharing
  - Enhanced CORS configuration with explicit methods and headers
- **Debugging Enhancements:**
  - Added comprehensive session and cookie logging
  - New test endpoint `/api/auth/test-cookie` for debugging cookie behavior
  - Enhanced authentication flow logging (serialize/deserialize)
  - Request-level middleware logging for session tracking
- **Documentation:**
  - Comprehensive production deployment guide
  - Troubleshooting section for common production issues
  - Architecture diagrams for production setup
  - Deployment checklist for backend and frontend
  - Cookie and cross-origin setup explanation
- **Tax Calculation System:** Comprehensive tax support for all invoices
  - Added `subtotal`, `taxRate`, and `taxAmount` fields to Invoice model
  - Currency-specific tax rates (GST, VAT, Sales Tax, Consumption Tax)
  - Tax rates: INR 18% GST, USD 10% Sales Tax, EUR/GBP 20% VAT, JPY 10%, AUD 10% GST
  - Proper tax terminology per region (GST for India/Australia, VAT for EU/UK, etc.)
  - Automatic tax calculation in backend services
  - Tax-inclusive totals: Total = Subtotal + Tax Amount
- **Calculation Utilities:**
  - `calculateInvoiceSubtotal()` - Sum of all line item totals
  - `calculateTaxAmount()` - Tax calculation with proper rounding
  - `calculateInvoiceTotal()` - Subtotal + Tax
  - 2 decimal place precision for all currencies
- **Frontend Tax Display:**
  - Tax breakdown in TotalsSection (Subtotal, Tax Rate %, Tax Amount, Total)
  - Dynamic tax label based on currency ("GST (18%)", "VAT (20%)", etc.)
  - Conditional display (only shows tax if taxRate > 0)
  - Color-coded tax information
- **PDF Generation Updates:**
  - Tax breakdown in PDF invoices (Subtotal, Tax, Total)
  - Currency-specific tax labels in PDFs
  - Professional formatting with tax separator line
  - Tax details in payment summary section
- **Updated Seed Data:**
  - All 12 invoices now include realistic tax calculations
  - Tax rates match regional standards
  - Payment amounts updated to reflect tax-inclusive totals
  - Console output shows tax breakdown for each invoice
- **Backward Compatibility:**
  - Default taxRate of 0 for existing invoices without tax
  - Optional tax fields with smart defaults
  - Existing invoices continue to work without modification
- **Google OAuth Authentication:** Complete authentication system
  - Passport.js integration with Google OAuth 2.0
  - Session-based authentication with MongoDB storage
  - Protected API routes requiring authentication
  - User model with Google profile data
  - Frontend authentication context provider
  - Protected route wrapper for Next.js pages
  - Beautiful login page with Google OAuth button
  - User profile display in header with logout
  - Session persistence across browser sessions
  - 7-day session expiration
  - Automatic auth state management
- **Security Enhancements:**
  - httpOnly cookies for session security
  - CORS configuration for cross-origin requests
  - Session validation on every request
  - Secure cookie settings for production
  - MongoDB session store for persistence
- **UI/UX Improvements:**
  - Custom SVG favicon with invoice logo
  - Apple touch icons for iOS devices
  - PWA manifest for installable app
  - Theme color configuration
  - Loading states during authentication
  - Error handling for auth failures
  - Success messages after login

## License

MIT

## Author

**Sapnendra Jaiswal** - Built as part of the MeruTechnoSoft Invoice Details Module assignment.

---

## Quick Start Summary

### Terminal 1 - Backend
```bash
git clone https://github.com/sapnendra/invoices.git
cd invoices/server
npm install

# Configure .env file with MongoDB URI and Google OAuth credentials
# See AUTHENTICATION_SETUP.md for detailed instructions

npm run seed
npm run dev
```

### Terminal 2 - Frontend
```bash
cd invoices/client
npm install
npm run dev
```

### Access Application
Open your browser and navigate to `http://localhost:3000`

### Key Testing Scenarios

1. **Tax Calculations (INR + GST):** INV-2026-001 (₹85,000 subtotal + ₹15,300 tax = ₹100,300 total)
2. **Fully Paid with Tax (USD):** INV-2026-002 ($1,500 + $150 tax = $1,650)
3. **VAT Invoice (EUR):** INV-2026-003 (€420 + €84 VAT = €504)
4. **Large Invoice with GST (INR):** INV-2026-004 (₹2,50,000 + ₹45,000 tax = ₹2,95,000)
5. **Multi-Currency with Tax:** Test all currencies with their respective tax rates
6. **Archived with Tax (AUD):** INV-2025-099 (A$1,170 + A$117 GST = A$1,287)

**Tax Rate Reference:**
- INR: 18% GST (Indian Goods & Services Tax)
- USD: 10% Sales Tax
- EUR: 20% VAT (Value Added Tax)
- GBP: 20% VAT
- JPY: 10% Consumption Tax
- AUD: 10% GST (Australian Goods & Services Tax)
