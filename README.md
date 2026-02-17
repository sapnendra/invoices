# Invoice Details Module

A full-stack MERN application for managing invoices and processing payments with a clean, modern UI.

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** Next.js 16 (with App Router), React, Tailwind CSS
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

### Core Functionality
- View invoice details with line items
- Display payment history
- Add new payments with validation
- Automatic balance calculation
- Status management (DRAFT → PAID)
- Archive/restore invoices
- MongoDB transactions for data integrity
- Generate and download professional PDF invoices
- **Multi-Currency Support** (INR, USD, EUR, GBP, JPY, AUD)
- Currency-aware formatting and calculations

### UI Features
- Fully responsive design
- Clean, modern interface
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

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/invoice_db
CLIENT_URL=http://localhost:3000
```

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
- Total: ₹85,000
- Amount Paid: ₹35,000
- Balance Due: ₹50,000

**2. INV-2026-002** - Tech Solutions Inc (USD)
- Status: PAID (fully paid)
- Total: $1,500
- Balance: $0

**3. INV-2026-003** - Global Innovations Ltd (EUR)
- Status: DRAFT (no payment yet)
- Total: €420
- Balance Due: €420

**4. INV-2026-004** - Quantum Systems Pvt Ltd (INR)
- Status: DRAFT (large invoice, partial payment)
- Total: ₹2,50,000
- Balance Due: ₹1,50,000

**5. INV-2026-005** - Startup Hub India (GBP)
- Status: PAID
- Total: £185
- Balance: £0

**6. INV-2026-006** - Digital Marketing Pro (USD)
- Status: DRAFT (almost paid)
- Total: $810
- Balance Due: $90

**7. INV-2026-007** - Enterprise Corp (INR)
- Status: DRAFT (large project)
- Total: ₹3,50,000
- Balance Due: ₹1,75,000

**8. INV-2026-008** - Consulting Group LLC (JPY)
- Status: PAID
- Total: ¥142,500
- Balance: ¥0

**9. INV-2025-099** - Legacy Systems Inc (AUD)
- Status: PAID (ARCHIVED)
- Total: A$1,170
- Balance: A$0

**10-12.** Three additional invoices with various statuses

### Seed Data Features
- Multiple realistic line items per invoice
- Various payment histories (single, installments, none)
- Different invoice sizes across various currencies
- **Multi-currency data:** INR, USD, EUR, GBP, JPY, AUD
- Currency-appropriate amounts (e.g., $1,500 vs ₹1,50,000)
- One archived invoice for testing
- Locale-specific number formatting

After seeding, the console displays all Invoice IDs with their currencies for testing.

## API Endpoints

### Invoice Endpoints

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

### 1. View Invoice Dashboard
Navigate to: `http://localhost:3000`

The homepage displays 9 invoice cards with different statuses:
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
- **Service Layer Pattern:** Business logic separated from controllers
- **MongoDB Transactions:** Atomic payment + invoice updates
- **Error Handling:** Centralized error handler with custom error classes
- **Validation:** Joi schemas for request validation
- **Calculation Helpers:** Reusable utility functions

### Frontend Architecture
- **Next.js 16 App Router:** Server components with async params handling
- **Server Components:** Initial data fetching for performance
- **Client Components:** Interactive features (modals, forms)
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

### Backend
1.Email invoice PDFs to customers
- Bulk PDF generation for multiple invoices
- Custom PDF templates with company brandingto production database
3. Update `CLIENT_URL` to production frontend URL
4. Deploy to service like Heroku, Railway, or DigitalOcean

### Frontend
1. Update `NEXT_PUBLIC_API_URL` in `.env.local`
2. Run `npm run build`
3. Deploy to Vercel, Netlify, or similar platforms

## Additional Features (Optional Enhancements)

Future enhancements you can add:
- PDF invoice export (with ₹ formatting)
- Email payment receipts
- Invoice search and filtering
- Bulk operations
- Payment method tracking (UPI, Card, Bank Transfer)
- GST/Tax calculations
- Dark mode
- Invoice templates
- Recurring invoices
- **Implemented PDF generation and download**
  - Professional PDF invoices with proper formatting
  - Includes all invoice details, line items, and payments
  - Download button on invoice detail page
  - Automatic file naming based on invoice number
- Payment reminders via email/SMS

## Recent Updates

### Version 3.0 (February 2026)
- **Multi-Currency Support:** Added support for 6 currencies (INR, USD, EUR, GBP, JPY, AUD)
- Currency-aware formatting with locale-specific number formats
- Currency field in Invoice model with enum validation
- Updated PDF generation to use invoice-specific currency
- Frontend components dynamically display currency symbols
- Currency-specific payment input with appropriate symbols
- Seed data with diverse currencies and realistic amounts
- Proper handling of JPY (no decimal places)

### Version 2.0 (February 2026)
- Updated to Next.js 16 (with async params support)
- Currency changed from USD ($) to Indian Rupees (₹)
- Expanded seed data from 2 to 12 invoices
- Added realistic Indian business scenarios
- Fixed MongoDB driver deprecation warnings
- Improved currency formatting for Indian numbering system
- Enhanced homepage with invoice dashboard grid
- Added quick payment buttons (25%, 50%, Full)
- PDF generation and download functionality

## Contributing

This is a demo project. Feel free to fork and enhance!

## License

MIT

## Author

Built as part of the MeruTechnoSoft Invoice Details Module assignment.

---

## Quick Start Summary

### Terminal 1 - Backend
```bash
git clone https://github.com/sapnendra/invoices.git
cd invoices/server
npm install
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

1. **Partial Payment (INR):** INV-2026-001 (₹50,000 balance)
2. **Fully Paid (USD):** INV-2026-002 ($0 balance)
3. **No Payment (EUR):** INV-2026-003 (€420 balance)
4. **Large Invoice (INR):** INV-2026-004 (₹2,50,000 total)
5. **Multi-Currency:** Test USD, EUR, GBP, JPY, AUD invoices
6. **Archived (AUD):** INV-2025-099 (cannot modify)
