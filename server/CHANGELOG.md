# API Documentation

Complete API reference for the Invoice Details Module backend services.

**Base URL:** `http://localhost:5000/api`

**Content-Type:** `application/json`

---

## Table of Contents

### Authentication
0. [Authentication Overview](#0-authentication-overview)
   - [Google OAuth Login](#google-oauth-login)
   - [Get Current User](#get-current-user)
   - [Logout](#logout)

### Invoice Operations
1. [Get Invoice Details](#1-get-invoice-details)
2. [Add Payment to Invoice](#2-add-payment-to-invoice)
3. [Archive Invoice](#3-archive-invoice)
4. [Restore Invoice](#4-restore-invoice)
5. [Download Invoice as PDF](#5-download-invoice-as-pdf)

---

## 0. Authentication Overview

All invoice-related API endpoints require authentication. Users must log in with their Google account before accessing any invoice data.

### Authentication Flow

1. User visits application → Redirected to `/login`
2. User clicks "Continue with Google" → Redirected to `/api/auth/google`
3. Google OAuth consent screen → User approves
4. Google redirects to `/api/auth/google/callback`
5. Session created and stored in MongoDB
6. User redirected to application with session cookie
7. Session cookie included in all subsequent requests
8. Server validates session on each request

### Session Management

- **Session Storage:** MongoDB (persistent across server restarts)
- **Session Duration:** 7 days
- **Cookie Settings:** httpOnly, secure (in production), sameSite: lax
- **Session Data:** User ID, Google profile information

---

### Google OAuth Login

Initiate the Google OAuth authentication flow.

#### Endpoint

```
GET /api/auth/google
```

#### Access

**Public** - No authentication required

#### Description

Redirects the user to Google's OAuth consent screen. Google will ask the user to:
- Select their Google account
- Grant permission to access email and profile information

#### Success Flow

After successful authentication, Google redirects to the callback URL with an authorization code.

#### Browser Example

```
http://localhost:5000/api/auth/google
```

#### Testing

1. Open the URL in a browser
2. You'll be redirected to Google's login page
3. Sign in with your Google account
4. Grant the requested permissions
5. You'll be redirected back to the application

---

### OAuth Callback

Handles the OAuth callback from Google after user authentication.

#### Endpoint

```
GET /api/auth/google/callback
```

#### Access

**Public** - Called by Google OAuth

#### Description

Google redirects here with an authorization code. The server:
1. Exchanges the code for user profile information
2. Creates or updates user in database
3. Creates a session
4. Sets session cookie
5. Redirects to frontend

#### Success Response

**Redirect:** `http://localhost:3000/?auth=success`

The session cookie is automatically set in the response headers:
```
Set-Cookie: connect.sid=s%3A....; Path=/; HttpOnly; SameSite=Lax
```

#### Error Response

**Redirect:** `http://localhost:3000/login?error=auth_failed`

#### Note

This endpoint is not called directly by the client. It's configured in Google Cloud Console as the authorized redirect URI.

---

### Get Current User

Retrieve information about the currently authenticated user.

#### Endpoint

```
GET /api/auth/user
```

#### Access

**Private** - Requires active session

#### Headers

Session cookie must be included (automatically sent by browser):
```
Cookie: connect.sid=s%3A....;
```

#### Success Response (200 OK)

```json
{
  "user": {
    "id": "65f8a4b2c1e5a3d4f6e7b8c9",
    "googleId": "1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/a/default-user",
    "lastLogin": "2026-02-18T10:30:00.000Z"
  }
}
```

#### Error Response (401 Unauthorized)

```json
{
  "message": "Not authenticated"
}
```

#### cURL Example

```bash
# After logging in via browser, copy the session cookie
curl -X GET http://localhost:5000/api/auth/user \
  -H "Cookie: connect.sid=s%3A...."
```

#### Frontend Usage

The frontend calls this endpoint on app load to check authentication status:

```javascript
const response = await fetch('http://localhost:5000/api/auth/user', {
  credentials: 'include' // Important: sends cookies
});

if (response.ok) {
  const data = await response.json();
  console.log('Logged in as:', data.user.name);
} else {
  console.log('Not authenticated');
}
```

#### Testing Steps

1. Log in via browser: `http://localhost:3000`
2. Open browser DevTools → Application → Cookies
3. Copy the `connect.sid` cookie value
4. Use cURL with the cookie to test the endpoint
5. Verify user information is returned

---

### Logout

Destroy the current user session and clear the session cookie.

#### Endpoint

```
POST /api/auth/logout
```

#### Access

**Private** - Requires active session (but returns success even if not logged in)

#### Headers

No special headers required. Session cookie is automatically included.

#### Success Response (200 OK)

```json
{
  "message": "Logged out successfully"
}
```

The session cookie is cleared in the response:
```
Set-Cookie: connect.sid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT
```

#### cURL Example

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Cookie: connect.sid=s%3A...."
```

#### Frontend Usage

```javascript
const response = await fetch('http://localhost:5000/api/auth/logout', {
  method: 'POST',
  credentials: 'include'
});

if (response.ok) {
  // Redirect to login page
  window.location.href = '/login';
}
```

#### Testing Steps

1. Log in via browser
2. Verify you can access invoice pages
3. Click logout button (or call endpoint via cURL)
4. Try accessing invoice pages → Should redirect to login
5. Check browser cookies → Session cookie should be deleted

---

## Protected Endpoints

All endpoints below require authentication. If a request is made without a valid session, the server responds with:

**401 Unauthorized:**
```json
{
  "message": "Authentication required"
}
```

**How to Authenticate:**
1. Log in via browser: `http://localhost:3000`
2. Session cookie is automatically set
3. All subsequent requests include the cookie
4. API validates the session on each request

**Testing with cURL:**
```bash
# 1. Log in via browser first
# 2. Copy session cookie from DevTools
# 3. Include cookie in cURL requests:

curl -X GET http://localhost:5000/api/invoices/INVOICE_ID \
  -H "Cookie: connect.sid=YOUR_SESSION_COOKIE_HERE"
```

---

## 1. Get Invoice Details

Retrieve complete invoice information including line items, payments, and calculated totals.

### Endpoint

```
GET /api/invoices/:id
```

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | String | Yes | MongoDB ObjectId of the invoice |

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "invoice": {
      "_id": "699456682ce7e48234def28b",
      "invoiceNumber": "INV-2026-001",
      "customerName": "Acme Enterprise",
      "customerEmail": "contact@acme-enterprise.com",
      "currency": "INR",
      "issueDate": "2026-01-15T00:00:00.000Z",
      "dueDate": "2026-02-14T00:00:00.000Z",
      "status": "DRAFT",
      "notes": "Thank you for your business!",
      "total": 85000,
      "amountPaid": 35000,
      "balanceDue": 50000,
      "isArchived": false,
      "createdAt": "2026-02-17T10:30:00.000Z",
      "updatedAt": "2026-02-17T10:30:00.000Z"
    },
    "lineItems": [
      {
        "_id": "699456682ce7e48234def28c",
        "invoiceId": "699456682ce7e48234def28b",
        "description": "Website Design & Development",
        "quantity": 1,
        "unitPrice": 50000,
        "total": 50000
      },
      {
        "_id": "699456682ce7e48234def28d",
        "invoiceId": "699456682ce7e48234def28b",
        "description": "SEO Optimization",
        "quantity": 5,
        "unitPrice": 7000,
        "total": 35000
      }
    ],
    "payments": [
      {
        "_id": "699456682ce7e48234def28e",
        "invoiceId": "699456682ce7e48234def28b",
        "amount": 25000,
        "paymentDate": "2026-01-20T00:00:00.000Z",
        "createdAt": "2026-02-17T10:30:00.000Z"
      },
      {
        "_id": "699456682ce7e48234def28f",
        "invoiceId": "699456682ce7e48234def28b",
        "amount": 10000,
        "paymentDate": "2026-02-01T00:00:00.000Z",
        "createdAt": "2026-02-17T10:30:00.000Z"
      }
    ],
    "calculated": {
      "total": 85000,
      "amountPaid": 35000,
      "balanceDue": 50000
    }
  }
}
```

### Error Responses

**Invoice Not Found (404)**
```json
{
  "success": false,
  "error": {
    "message": "Invoice not found",
    "statusCode": 404
  }
}
```

**Invalid Invoice ID (400)**
```json
{
  "success": false,
  "error": {
    "message": "Invalid invoice ID format",
    "statusCode": 400
  }
}
```

### cURL Example

```bash
# Replace {INVOICE_ID} with actual invoice ID from seed data
curl -X GET http://localhost:5000/api/invoices/{INVOICE_ID}
```

### Postman Example

```
Method: GET
URL: http://localhost:5000/api/invoices/699456682ce7e48234def28b
Headers: (none required)
```

### Testing Steps

1. Run seed script to get invoice IDs: `npm run seed`
2. Copy one of the invoice IDs from console output
3. Replace `{INVOICE_ID}` in the URL with the copied ID
4. Send GET request
5. Verify response contains invoice, lineItems, and payments

---

## 2. Add Payment to Invoice

Add a new payment to an existing invoice. This updates the invoice's payment status automatically.

### Endpoint

```
POST /api/invoices/:id/payments
```

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | String | Yes | MongoDB ObjectId of the invoice |

### Request Body

```json
{
  "amount": 25000,
  "paymentDate": "2026-02-15"
}
```

### Request Body Parameters

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| amount | Number | Yes | > 0, <= balanceDue | Payment amount in rupees |
| paymentDate | String | Yes | Valid date, not future | Date in YYYY-MM-DD format |

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "payment": {
      "_id": "699456682ce7e48234def290",
      "invoiceId": "699456682ce7e48234def28b",
      "amount": 25000,
      "paymentDate": "2026-02-15T00:00:00.000Z",
      "createdAt": "2026-02-17T11:00:00.000Z",
      "updatedAt": "2026-02-17T11:00:00.000Z"
    },
    "invoice": {
      "_id": "699456682ce7e48234def28b",
      "invoiceNumber": "INV-2026-001",
      "status": "DRAFT",
      "currency": "INR",
      "total": 85000,
      "amountPaid": 60000,
      "balanceDue": 25000
    }
  }
}
```

### Error Responses

**Invalid Amount (400)**
```json
{
  "success": false,
  "error": {
    "message": "Amount must be greater than 0",
    "statusCode": 400
  }
}
```

**Amount Exceeds Balance (400)**
```json
{
  "success": false,
  "error": {
    "message": "Payment amount cannot exceed balance due",
    "statusCode": 400
  }
}
```

**Note:** Error messages display amounts with the invoice's currency symbol (e.g., ₹30,000 for INR, $300 for USD, €250 for EUR).

**Future Date (400)**
```json
{
  "success": false,
  "error": {
    "message": "Payment date cannot be in the future",
    "statusCode": 400
  }
}
```

**Invoice Already Paid (400)**
```json
{
  "success": false,
  "error": {
    "message": "Invoice is already fully paid",
    "statusCode": 400
  }
}
```

**Archived Invoice (400)**
```json
{
  "success": false,
  "error": {
    "message": "Cannot add payment to archived invoice",
    "statusCode": 400
  }
}
```

**Invoice Not Found (404)**
```json
{
  "success": false,
  "error": {
    "message": "Invoice not found",
    "statusCode": 404
  }
}
```

### cURL Example

```bash
# Add partial payment
curl -X POST http://localhost:5000/api/invoices/{INVOICE_ID}/payments \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 25000,
    "paymentDate": "2026-02-15"
  }'

# Add full payment (balance due)
curl -X POST http://localhost:5000/api/invoices/{INVOICE_ID}/payments \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000,
    "paymentDate": "2026-02-17"
  }'
```

### Postman Example

```
Method: POST
URL: http://localhost:5000/api/invoices/699456682ce7e48234def28b/payments

Headers:
  Content-Type: application/json

Body (raw JSON):
{
  "amount": 25000,
  "paymentDate": "2026-02-15"
}
```

### Testing Steps

1. Get invoice details to check current balance: `GET /api/invoices/{INVOICE_ID}`
2. Note the `balanceDue` amount
3. Add payment with amount less than balance due
4. Verify response shows updated `amountPaid` and `balanceDue`
5. Check invoice status remains "DRAFT"
6. Add another payment equal to remaining balance
7. Verify invoice status changes to "PAID"
8. Try adding another payment - should fail with "already fully paid" error

### Testing Scenarios

**Scenario 1: Partial Payment (INR)**
```json
{
  "amount": 10000,
  "paymentDate": "2026-02-15"
}
```
Expected: Payment accepted, status remains "DRAFT"

**Scenario 2: Full Payment (USD)**
For invoice with $90 balance:
```json
{
  "amount": 90,
  "paymentDate": "2026-02-15"
}
```
Expected: Payment accepted, status changes to "PAID"

**Scenario 3: Payment in EUR**
For invoice with €420 balance:
```json
{
  "amount": 210,
  "paymentDate": "2026-02-15"
}
```
Expected: Payment accepted, €210 remaining balance

**Scenario 3: Overpayment (Should Fail)**
For any currency, attempting to pay more than balance:
```json
{
  "amount": 100000,
  "paymentDate": "2026-02-15"
}
```
Expected: Error 400 - Amount exceeds balance due

**Scenario 4: Future Date (Should Fail)**
```json
{
  "amount": 25000,
  "paymentDate": "2026-12-31"
}
```
Expected: Error 400 - Payment date cannot be in the future

**Scenario 5: Zero Amount (Should Fail)**
```json
{
  "amount": 0,
  "paymentDate": "2026-02-15"
}
```
Expected: Error 400 - Amount must be greater than 0

**Scenario 6: Negative Amount (Should Fail)**
```json
{
  "amount": -5000,
  "paymentDate": "2026-02-15"
}
```
Expected: Error 400 - Amount must be greater than 0

---

## 3. Archive Invoice

Archive an invoice to remove it from active view. Archived invoices cannot be modified.

### Endpoint

```
POST /api/invoices/:id/archive
```

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | String | Yes | MongoDB ObjectId of the invoice |

### Request Body

No body required for this endpoint.

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "invoice": {
      "_id": "699456682ce7e48234def28b",
      "invoiceNumber": "INV-2026-001",
      "customerName": "Acme Enterprise",
      "status": "DRAFT",
      "total": 85000,
      "amountPaid": 60000,
      "balanceDue": 25000,
      "isArchived": true,
      "updatedAt": "2026-02-17T12:00:00.000Z"
    }
  }
}
```

### Error Responses

**Already Archived (400)**
```json
{
  "success": false,
  "error": {
    "message": "Invoice is already archived",
    "statusCode": 400
  }
}
```

**Invoice Not Found (404)**
```json
{
  "success": false,
  "error": {
    "message": "Invoice not found",
    "statusCode": 404
  }
}
```

### cURL Example

```bash
curl -X POST http://localhost:5000/api/invoices/{INVOICE_ID}/archive
```

### Postman Example

```
Method: POST
URL: http://localhost:5000/api/invoices/699456682ce7e48234def28b/archive
Headers: (none required)
Body: (none required)
```

### Testing Steps

1. Get invoice to verify it's not archived: `GET /api/invoices/{INVOICE_ID}`
2. Archive the invoice: `POST /api/invoices/{INVOICE_ID}/archive`
3. Verify response shows `isArchived: true`
4. Try to add payment - should fail with "archived invoice" error
5. Try to archive again - should fail with "already archived" error

---

## 4. Restore Invoice

Restore an archived invoice to active status, allowing modifications again.

### Endpoint

```
POST /api/invoices/:id/restore
```

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | String | Yes | MongoDB ObjectId of the invoice |

### Request Body

No body required for this endpoint.

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "invoice": {
      "_id": "699456682ce7e48234def28b",
      "invoiceNumber": "INV-2026-001",
      "customerName": "Acme Enterprise",
      "status": "DRAFT",
      "total": 85000,
      "amountPaid": 60000,
      "balanceDue": 25000,
      "isArchived": false,
      "updatedAt": "2026-02-17T12:30:00.000Z"
    }
  }
}
```

### Error Responses

**Not Archived (400)**
```json
{
  "success": false,
  "error": {
    "message": "Invoice is not archived",
    "statusCode": 400
  }
}
```

**Invoice Not Found (404)**
```json
{
  "success": false,
  "error": {
    "message": "Invoice not found",
    "statusCode": 404
  }
}
```

### cURL Example

```bash
curl -X POST http://localhost:5000/api/invoices/{INVOICE_ID}/restore
```

### Postman Example

```
Method: POST
URL: http://localhost:5000/api/invoices/699456682ce7e48234def28b/restore
Headers: (none required)
Body: (none required)
```

### Testing Steps

1. Archive an invoice first: `POST /api/invoices/{INVOICE_ID}/archive`
2. Restore the invoice: `POST /api/invoices/{INVOICE_ID}/restore`
3. Verify response shows `isArchived: false`
4. Try adding payment - should work now
5. Try to restore again - should fail with "not archived" error

---

## 5. Download Invoice as PDF

Generate and download a professional PDF version of the invoice with all details, line items, and payment history.

### Endpoint

```
GET /api/invoices/:id/download-pdf
```

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | String | Yes | MongoDB ObjectId of the invoice |

### Success Response (200 OK)

Returns a PDF file with proper headers for download.

**Response Headers:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="Invoice-INV-2026-001.pdf"
```

### PDF Features

The generated PDF includes:
- **Professional Header:** Invoice number, dates, and status badge
- **Customer Information:** Bill To and From details
- **Currency Display:** All amounts shown in invoice's currency
- **Line Items Table:** Itemized list with quantities, prices, and totals
- **Payment Summary Box:** Total, Amount Paid, and Balance Due with color coding
- **Payment History:** Chronological list of all payments made
- **Notes Section:** Any additional notes from the invoice
- **Professional Footer:** Thank you message and generation timestamp
- **Multi-Currency Support:** Proper formatting for INR, USD, EUR, GBP, JPY, AUD

### Error Responses

**Invoice Not Found (404)**
```json
{
  "success": false,
  "error": {
    "message": "Invoice not found",
    "statusCode": 404
  }
}
```

**Invalid Invoice ID (400)**
```json
{
  "success": false,
  "error": {
    "message": "Invalid invoice ID format",
    "statusCode": 400
  }
}
```

### cURL Example

```bash
# Download PDF to current directory
curl -X GET http://localhost:5000/api/invoices/{INVOICE_ID}/download-pdf \
  --output Invoice.pdf

# Download with custom filename
curl -X GET http://localhost:5000/api/invoices/{INVOICE_ID}/download-pdf \
  --output "INV-2026-001.pdf"
```

### Postman Example

```
Method: GET
URL: http://localhost:5000/api/invoices/699456682ce7e48234def28b/download-pdf

Send and Save Response > Save to a file
```

### Browser Example

Simply navigate to the URL in your browser:
```
http://localhost:5000/api/invoices/699456682ce7e48234def28b/download-pdf
```

The PDF will automatically download with the filename `Invoice-{InvoiceNumber}.pdf`

### Testing Steps

1. Get invoice details to verify it exists: `GET /api/invoices/{INVOICE_ID}`
2. Copy the invoice ID from the response
3. Open browser or use cURL to download PDF
4. Verify PDF contains:
   - Invoice header with number and status
   - Customer details
   - All line items with correct calculations
   - Payment summary showing totals
   - Payment history (if any payments exist)
   - Notes section (if notes exist)
5. Check PDF is properly formatted and readable

### Frontend Integration

The invoice detail page includes a "Download PDF" button that:
- Fetches the PDF from the API
- Shows loading state during generation
- Automatically downloads the file with proper filename
- Handles errors gracefully with user-friendly messages

### Testing Different Invoice Types

**Scenario 1: INR Invoice (Partially Paid)**
- Use INV-2026-001 (has partial payments in INR)
- PDF should show amounts as Rs. 85,000, Rs. 35,000, etc.
- Payment history and remaining balance in INR

**Scenario 2: USD Invoice (Fully Paid)**
- Use INV-2026-002 (fully paid in USD)
- PDF should show amounts as $ 1,500.00
- Balance due as $0.00 in green with "Fully Paid" indicator

**Scenario 3: EUR Invoice (Unpaid)**
- Use INV-2026-003 (no payments in EUR)
- PDF should show amounts as EUR 420.00
- No payment history section, full balance due

**Scenario 4: JPY Invoice (No Decimals)**
- Use INV-2026-008 (Japanese Yen)
- PDF should show amounts as JPY 142,500 (no decimal places)
- Proper Japanese number formatting

**Scenario 5: GBP Invoice**
- Use INV-2026-005 (British Pounds)
- PDF should show amounts with £ symbol
- Proper UK locale formatting

**Scenario 6: AUD Invoice (Archived)**
- Use INV-2025-099 (Australian Dollars, archived)
- PDF should show amounts as AUD 1,170.00
- Archived status should be visible

---

## Complete Testing Workflow

### Step 1: Setup

```bash
# Start MongoDB
sudo systemctl start mongod

# Navigate to server directory
cd server

# Install dependencies (if not done)
npm install

# Seed database
npm run seed

# Copy invoice IDs from output
# Example: 699456682ce7e48234def28b
```

### Step 2: Get Invoice Details

```bash
export INVOICE_ID="699456682ce7e48234def28b"

curl -X GET http://localhost:5000/api/invoices/$INVOICE_ID | jq
```

### Step 3: Add Partial Payment

```bash
curl -X POST http://localhost:5000/api/invoices/$INVOICE_ID/payments \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10000,
    "paymentDate": "2026-02-15"
  }' | jq
```

### Step 4: Verify Updated Balance

```bash
curl -X GET http://localhost:5000/api/invoices/$INVOICE_ID | jq '.data.invoice.balanceDue'
```

### Step 5: Add Full Payment

```bash
curl -X POST http://localhost:5000/api/invoices/$INVOICE_ID/payments \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 40000,
    "paymentDate": "2026-02-17"
  }' | jq
```

### Step 6: Verify Status Changed to PAID

```bash
curl -X GET http://localhost:5000/api/invoices/$INVOICE_ID | jq '.data.invoice.status'
# Should output: "PAID"
```

### Step 7: Archive Invoice

```bash
curl -X POST http://localhost:5000/api/invoices/$INVOICE_ID/archive | jq
```

### Step 8: Restore Invoice

```bash
curl -X POST http://localhost:5000/api/invoices/$INVOICE_ID/restore | jq
```

### Step 9: Download Invoice as PDF

```bash
# Download PDF
curl -X GET http://localhost:5000/api/invoices/$INVOICE_ID/download-pdf \
  --output "Invoice-Test.pdf"

# Open the downloaded PDF to verify contents
# Linux: xdg-open Invoice-Test.pdf
# macOS: open Invoice-Test.pdf
```

---

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400
  }
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success - Request completed successfully |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or business rule violation |
| 404 | Not Found - Resource does not exist |
| 500 | Internal Server Error - Server-side error |

---

## Business Rules

### Payment Rules

1. **Overpayment Prevention:** Payment amount cannot exceed invoice balance due
2. **Date Validation:** Payment date cannot be in the future
3. **Status Updates:** Invoice status automatically changes to "PAID" when balance = 0
4. **Archive Protection:** Cannot add payments to archived invoices
5. **Paid Invoice Protection:** Cannot add payments to fully paid invoices

### Invoice Status

- **DRAFT:** Invoice has outstanding balance (balanceDue > 0)
- **PAID:** Invoice is fully paid (balanceDue = 0)

### Calculations

- **Total:** Sum of all line items (quantity × unitPrice)
- **Amount Paid:** Sum of all payments
- **Balance Due:** Total - Amount Paid

---

## Sample Test Data

After running `npm run seed`, you'll have 12 invoices with various currencies:

### Multi-Currency Invoice Set
- **INR (Indian Rupee):** INV-2026-001, INV-2026-004, INV-2026-007, INV-2026-010
  - Good for: Testing rupee symbol (₹), Indian number formatting
- **USD (US Dollar):** INV-2026-002, INV-2026-006, INV-2026-012
  - Good for: Testing dollar symbol ($), US formatting
- **EUR (Euro):** INV-2026-003, INV-2026-011
  - Good for: Testing euro symbol (€), European formatting
- **GBP (British Pound):** INV-2026-005
  - Good for: Testing pound symbol (£), UK formatting
- **JPY (Japanese Yen):** INV-2026-008
  - Good for: Testing yen symbol (¥), no decimal places
- **AUD (Australian Dollar):** INV-2025-099 (Archived)
  - Good for: Testing Australian dollar (A$), archived status

### Invoice for Partial Payment Testing
- **Invoice Number:** INV-2026-001
- **Currency:** INR
- **Balance Due:** ₹50,000
- **Good for:** Testing partial payments in rupees

### Invoice for Overpayment Testing
- **Invoice Number:** INV-2026-003
- **Currency:** EUR
- **Balance Due:** €420
- **Good for:** Testing overpayment validation

### Fully Paid Invoice (USD)
- **Invoice Number:** INV-2026-002
- **Currency:** USD
- **Balance Due:** $0
- **Good for:** Testing payment addition failure

### Small Currency Amount Invoice (GBP)
- **Invoice Number:** INV-2026-005
- **Currency:** GBP
- **Balance Due:** £0
- **Good for:** Testing British Pound formatting

### No Decimal Currency (JPY)
- **Invoice Number:** INV-2026-008
- **Currency:** JPY
- **Total:** ¥142,500
- **Good for:** Testing Yen without decimal places

### Archived Invoice
- **Invoice Number:** INV-2025-099
- **Currency:** AUD
- **Status:** PAID (Archived)
- **Good for:** Testing archive/restore operations and Australian Dollar

---

## Postman Collection

Import this collection to test all endpoints:

```json
{
  "info": {
    "name": "Invoice API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "invoiceId",
      "value": "YOUR_INVOICE_ID_HERE"
    }
  ],
  "item": [
    {
      "name": "Get Invoice Details",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/invoices/{{invoiceId}}"
      }
    },
    {
      "name": "Add Payment",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/invoices/{{invoiceId}}/payments",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"amount\": 25000,\n  \"paymentDate\": \"2026-02-15\"\n}"
        }
      }
    },
    {
     ,
    {
      "name": "Download Invoice PDF",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/invoices/{{invoiceId}}/download-pdf"
      }
    } "name": "Archive Invoice",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/invoices/{{invoiceId}}/archive"
      }
    },
    {
      "name": "Restore Invoice",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/invoices/{{invoiceId}}/restore"
      }
    }
  ]
}
```

---

## Transaction Safety

All payment operations use MongoDB transactions to ensure data integrity:

1. Payment record is created
2. Invoice totals are updated
3. Invoice status is recalculated
4. All changes are committed together
5. On any error, all changes are rolled back

This prevents scenarios where payment is recorded but invoice is not updated.

---

## Authentication Testing

### Complete Auth Flow Test

```bash
# Test 1: Check user endpoint without auth (should fail)
curl -X GET http://localhost:5000/api/auth/user
# Expected: {"message":"Not authenticated"}

# Test 2: Access invoice without auth (should fail)
curl -X GET http://localhost:5000/api/invoices/INVOICE_ID
# Expected: {"message":"Authentication required"}

# Test 3: Login via browser
# 1. Open http://localhost:3000 in browser
# 2. Click "Continue with Google"
# 3. Complete Google OAuth flow
# 4. Copy session cookie from DevTools

# Test 4: Check user endpoint with auth (should succeed)
export SESSION="connect.sid=YOUR_SESSION_COOKIE"
curl -X GET http://localhost:5000/api/auth/user \
  -H "Cookie: $SESSION"
# Expected: User object with name, email, picture

# Test 5: Access invoice with auth (should succeed)
curl -X GET http://localhost:5000/api/invoices/INVOICE_ID \
  -H "Cookie: $SESSION"
# Expected: Invoice data

# Test 6: Logout
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Cookie: $SESSION"
# Expected: {"message":"Logged out successfully"}

# Test 7: Verify logout (should fail)
curl -X GET http://localhost:5000/api/auth/user \
  -H "Cookie: $SESSION"
# Expected: {"message":"Not authenticated"}
```

### Session Persistence Test

1. Log in via browser
2. Note the time
3. Close the browser completely
4. Wait a few minutes
5. Open browser and go to `http://localhost:3000`
6. You should still be logged in (session persists)
7. Session expires after 7 days of inactivity

### Multiple Browser Test

1. Log in using Chrome
2. Copy the session cookie
3. Open Firefox
4. Manually set the same session cookie
5. Access the application
6. Both browsers share the same session
7. Logging out from one logs out from both

---

## Notes for Developers

### Authentication Requirements
- **All invoice endpoints** require authentication via session cookie
- Session cookies are automatically handled by browsers
- For API testing, include `Cookie` header with session ID
- Sessions are stored in MongoDB for persistence and scalability
- User data from Google: email, name, profile picture, Google ID
- `lastLogin` timestamp tracked for each user

### Security Considerations
- Session secret must be a long random string (32+ characters)
- In production, enable `secure: true` for HTTPS-only cookies
- CORS is configured to allow credentials from frontend origin
- Google OAuth credentials should never be committed to version control
- Session duration can be adjusted in `app.js` (`maxAge` property)

### Multi-Currency Support
- All monetary amounts support **6 currencies:** INR, USD, EUR, GBP, JPY, AUD
- **Currency field** is required in Invoice model (defaults to INR)
- **JPY (Japanese Yen)** has no decimal places
- All other currencies use 2 decimal places
- Currency symbols: ₹ (INR), $ (USD), € (EUR), £ (GBP), ¥ (JPY), A$ (AUD)
- **Locale-aware formatting:** Each currency uses its appropriate locale
- All dates are stored in **ISO 8601 format**
- Invoice IDs are **MongoDB ObjectIds** (24-character hexadecimal strings)
- API uses **RESTful conventions**
- All responses include `success` boolean field
- Error messages include **currency symbols** where applicable
- Server runs on **port 5000** by default
- Frontend runs on **port 3000** (CORS enabled)

---

## Version History

### Version 5.0 (February 2026)
- **Tax Calculation System:**
  - Added `subtotal`, `taxRate` (0-100%), and `taxAmount` fields to Invoice model
  - Automatic tax calculation in invoice service (`calculateInvoiceSubtotal`, `calculateTaxAmount`, `calculateInvoiceTotal`)
  - Currency-specific tax rates:
    - INR: 18% GST (Goods & Services Tax)
    - USD: 10% Sales Tax
    - EUR: 20% VAT (Value Added Tax)
    - GBP: 20% VAT
    - JPY: 10% Consumption Tax
    - AUD: 10% GST
  - Tax amount rounded to 2 decimal places for precision
  - Total calculation: `total = subtotal + taxAmount`
- **API Response Updates:**
  - Invoice GET endpoint now returns calculated tax breakdown
  - Response includes: `subtotal`, `taxRate`, `taxAmount`, `total`, `amountPaid`, `balanceDue`
  - Tax information included in all invoice operations
- **PDF Generation Enhancements:**
  - Tax breakdown displayed in PDF invoices (Subtotal → Tax → Total)
  - Dynamic tax labels based on currency ("GST (18%)", "VAT (20%)", "Sales Tax (10%)")
  - Professional formatting with tax separator line
  - Tax details in payment summary section
- **Seed Data Updates:**
  - All 12 sample invoices include realistic tax calculations
  - Payment amounts updated to match tax-inclusive totals
  - Console output displays tax breakdown for each invoice
  - Tax rates match regional standards and regulations
- **Calculation Utilities:**
  - New `calculateInvoiceSubtotal()` function for line items sum
  - New `calculateTaxAmount()` function with proper rounding
  - Updated `calculateInvoiceTotal()` to use subtotal + tax
  - All calculations maintain 2 decimal precision
- **Backward Compatibility:**
  - Existing invoices without tax fields continue to work
  - Default taxRate of 0 for invoices without tax
  - Optional fields with smart defaults
  - No breaking changes to existing API contracts

### Version 4.0 (February 2026)
- **Google OAuth Authentication System:**
  - Passport.js integration with Google OAuth 2.0 strategy
  - Session-based authentication with MongoDB session store
  - User model for storing Google profile data (email, name, picture)
  - Protected API routes with authentication middleware
  - Session persistence across server restarts (stored in MongoDB)
  - 7-day session expiration with automatic cleanup
  - Secure cookie configuration (httpOnly, sameSite)
- **New Authentication Endpoints:**
  - `GET /api/auth/google` - Initiate OAuth flow
  - `GET /api/auth/google/callback` - Handle OAuth callback
  - `GET /api/auth/user` - Get current authenticated user
  - `POST /api/auth/logout` - Destroy session and logout
- **Security Enhancements:**
  - All invoice endpoints now require authentication
  - CORS configuration for frontend-backend communication
  - Cookie security with httpOnly and sameSite settings
  - Session secret environment variable
  - MongoDB session storage for scalability
- **Frontend Authentication:**
  - React Context API for authentication state management
  - Protected route wrappers for Next.js pages
  - Login page with Google OAuth button
  - User profile display in header
  - Logout functionality
  - Automatic session verification on app load
  - Loading states during authentication
  - Error handling for authentication failures

### Version 3.0 (February 2026)
- **Multi-Currency Support:** 6 currencies (INR, USD, EUR, GBP, JPY, AUD)
- Currency field added to Invoice model
- Currency-aware API responses
- Locale-specific number formatting
- PDF generation with currency-specific symbols
- Updated validation to handle different currencies
- JPY special handling (no decimal places)
- Seed data with diverse currencies

### Version 2.0 (February 2026)
- Added PDF generation and download functionality
  - Professional invoice PDF with proper formatting
  - Includes line items, payment history, and totals
  - Automatic file naming based on invoice number
  - Download button on invoice detail page
- Updated to Next.js 16
- Currency changed to Indian Rupees (₹)
- Enhanced validation messages with currency symbols
- Added transaction safety for payment operations
- Improved error handling and response formatting

---

**Last Updated:** February 18, 2026
