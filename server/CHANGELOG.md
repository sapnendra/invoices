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
    "message": "Payment amount (₹30,000) cannot exceed balance due (₹25,000)",
    "statusCode": 400
  }
}
```

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

**Scenario 1: Partial Payment**
```json
{
  "amount": 10000,
  "paymentDate": "2026-02-15"
}
```
Expected: Payment accepted, status remains "DRAFT"

**Scenario 2: Full Payment**
```json
{
  "amount": 50000,
  "paymentDate": "2026-02-15"
}
```
Expected: Payment accepted, status changes to "PAID"

**Scenario 3: Overpayment (Should Fail)**
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

After running `npm run seed`, you'll have 12 invoices with various statuses:

### Invoice for Partial Payment Testing
- **Invoice Number:** INV-2026-001
- **Balance Due:** ₹50,000
- **Good for:** Testing partial payments

### Invoice for Overpayment Testing
- **Invoice Number:** INV-2026-003
- **Balance Due:** ₹45,000
- **Good for:** Testing overpayment validation

### Fully Paid Invoice
- **Invoice Number:** INV-2026-002
- **Balance Due:** ₹0
- **Good for:** Testing payment addition failure

### Archived Invoice
- **Invoice Number:** INV-2025-099
- **Status:** PAID (Archived)
- **Good for:** Testing archive/restore operations

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
      "name": "Archive Invoice",
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

- All monetary amounts are in **Indian Rupees (₹)**
- All dates are stored in **ISO 8601 format**
- Invoice IDs are **MongoDB ObjectIds** (24-character hexadecimal strings)
- API uses **RESTful conventions**
- All responses include `success` boolean field
- Error messages include **rupee symbol (₹)** where applicable
- Server runs on **port 5000** by default
- Frontend runs on **port 3000** (CORS enabled)

---

## Version History

### Version 2.0 (February 2026)
- Updated to Next.js 16
- Currency changed to Indian Rupees (₹)
- Enhanced validation messages with currency symbols
- Added transaction safety for payment operations
- Improved error handling and response formatting

---

**Last Updated:** February 17, 2026
