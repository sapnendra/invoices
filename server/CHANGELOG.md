# API Documentation

Complete API reference for the Invoice Details Module backend services.

**Base URL:** `http://localhost:5000/api`

**Content-Type:** `application/json`

---

## Table of Contents

1. [Get Invoice Details](#1-get-invoice-details)
2. [Add Payment to Invoice](#2-add-payment-to-invoice)
3. [Archive Invoice](#3-archive-invoice)
4. [Restore Invoice](#4-restore-invoice)
5. [Download Invoice as PDF](#5-download-invoice-as-pdf)

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

## Notes for Developers

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
