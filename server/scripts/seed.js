require('dotenv').config();
const mongoose = require('mongoose');
const Invoice = require('../src/models/Invoice.model');
const InvoiceLine = require('../src/models/InvoiceLine.model');
const Payment = require('../src/models/Payment.model');
const { INVOICE_STATUS } = require('../src/config/constants');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Invoice.deleteMany({});
    await InvoiceLine.deleteMany({});
    await Payment.deleteMany({});
    console.log('Cleared existing data');

    // Create sample invoices
    const invoices = [];

    // Invoice 1 - Partial Payment - INR
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-001',
      customerName: 'Acme Enterprise',
      currency: 'INR',
      issueDate: new Date('2026-01-15'),
      dueDate: new Date('2026-02-15'),
      status: INVOICE_STATUS.DRAFT,
      total: 85000,
      amountPaid: 35000,
      balanceDue: 50000,
      isArchived: false,
    }));

    // Invoice 2 - Fully Paid - USD
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-002',
      customerName: 'Tech Solutions Inc',
      currency: 'USD',
      issueDate: new Date('2026-01-20'),
      dueDate: new Date('2026-02-20'),
      status: INVOICE_STATUS.PAID,
      total: 1500,
      amountPaid: 1500,
      balanceDue: 0,
      isArchived: false,
    }));

    // Invoice 3 - No Payment Yet - EUR
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-003',
      customerName: 'Global Innovations Ltd',
      currency: 'EUR',
      issueDate: new Date('2026-02-01'),
      dueDate: new Date('2026-03-01'),
      status: INVOICE_STATUS.DRAFT,
      total: 420,
      amountPaid: 0,
      balanceDue: 420,
      isArchived: false,
    }));

    // Invoice 4 - Large Invoice, Partial Payment - INR
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-004',
      customerName: 'Quantum Systems Pvt Ltd',
      currency: 'INR',
      issueDate: new Date('2026-01-10'),
      dueDate: new Date('2026-02-10'),
      status: INVOICE_STATUS.DRAFT,
      total: 250000,
      amountPaid: 100000,
      balanceDue: 150000,
      isArchived: false,
    }));

    // Invoice 5 - Small Invoice, Fully Paid - GBP
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-005',
      customerName: 'Startup Hub India',
      currency: 'GBP',
      issueDate: new Date('2026-02-05'),
      dueDate: new Date('2026-02-19'),
      status: INVOICE_STATUS.PAID,
      total: 185,
      amountPaid: 185,
      balanceDue: 0,
      isArchived: false,
    }));

    // Invoice 6 - Medium Invoice, Almost Paid - USD
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-006',
      customerName: 'Digital Marketing Pro',
      currency: 'USD',
      issueDate: new Date('2026-01-25'),
      dueDate: new Date('2026-02-25'),
      status: INVOICE_STATUS.DRAFT,
      total: 810,
      amountPaid: 720,
      balanceDue: 90,
      isArchived: false,
    }));

    // Invoice 7 - Large Project, Multiple Services - INR
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-007',
      customerName: 'Enterprise Corp',
      currency: 'INR',
      issueDate: new Date('2026-01-05'),
      dueDate: new Date('2026-02-05'),
      status: INVOICE_STATUS.DRAFT,
      total: 350000,
      amountPaid: 175000,
      balanceDue: 175000,
      isArchived: false,
    }));

    // Invoice 8 - Consulting Services, Paid - JPY
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-008',
      customerName: 'Consulting Group LLC',
      currency: 'JPY',
      issueDate: new Date('2026-02-08'),
      dueDate: new Date('2026-02-22'),
      status: INVOICE_STATUS.PAID,
      total: 142500,
      amountPaid: 142500,
      balanceDue: 0,
      isArchived: false,
    }));

    // Invoice 9 - Archived Invoice - AUD
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2025-099',
      customerName: 'Legacy Systems Inc',
      currency: 'AUD',
      issueDate: new Date('2025-12-15'),
      dueDate: new Date('2026-01-15'),
      status: INVOICE_STATUS.PAID,
      total: 1170,
      amountPaid: 1170,
      balanceDue: 0,
      isArchived: true,
    }));

    // Invoice 10 - Recent Invoice, Small Balance - INR
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-010',
      customerName: 'Creative Studios',
      currency: 'INR',
      issueDate: new Date('2026-02-10'),
      dueDate: new Date('2026-03-10'),
      status: INVOICE_STATUS.DRAFT,
      total: 32000,
      amountPaid: 25000,
      balanceDue: 7000,
      isArchived: false,
    }));

    // Invoice 11 - UI/UX Design Project - EUR
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-011',
      customerName: 'Design First Agency',
      currency: 'EUR',
      issueDate: new Date('2026-02-12'),
      dueDate: new Date('2026-03-12'),
      status: INVOICE_STATUS.DRAFT,
      total: 515,
      amountPaid: 0,
      balanceDue: 515,
      isArchived: false,
    }));

    // Invoice 12 - Development Sprint, Paid - USD
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-012',
      customerName: 'Agile Works Ltd',
      currency: 'USD',
      issueDate: new Date('2026-01-28'),
      dueDate: new Date('2026-02-28'),
      status: INVOICE_STATUS.PAID,
      total: 1680,
      amountPaid: 1680,
      balanceDue: 0,
      isArchived: false,
    }));

    console.log('Created 12 invoices');

    // Create line items for all invoices
    // Invoice 1 - Line Items
    await InvoiceLine.create([
      { invoiceId: invoices[0]._id, description: 'Website Development', quantity: 1, unitPrice: 50000, lineTotal: 50000 },
      { invoiceId: invoices[0]._id, description: 'SEO Optimization', quantity: 1, unitPrice: 20000, lineTotal: 20000 },
      { invoiceId: invoices[0]._id, description: 'Content Creation', quantity: 1, unitPrice: 15000, lineTotal: 15000 },
    ]);

    // Invoice 2 - Line Items (USD)
    await InvoiceLine.create([
      { invoiceId: invoices[1]._id, description: 'E-commerce Platform Development', quantity: 1, unitPrice: 1020, lineTotal: 1020 },
      { invoiceId: invoices[1]._id, description: 'Payment Gateway Integration', quantity: 1, unitPrice: 300, lineTotal: 300 },
      { invoiceId: invoices[1]._id, description: 'Admin Dashboard', quantity: 1, unitPrice: 180, lineTotal: 180 },
    ]);

    // Invoice 3 - Line Items (EUR)
    await InvoiceLine.create([
      { invoiceId: invoices[2]._id, description: 'Mobile App Design', quantity: 1, unitPrice: 280, lineTotal: 280 },
      { invoiceId: invoices[2]._id, description: 'Prototype Development', quantity: 1, unitPrice: 140, lineTotal: 140 },
    ]);

    // Invoice 4 - Line Items
    await InvoiceLine.create([
      { invoiceId: invoices[3]._id, description: 'Enterprise Software Development', quantity: 1, unitPrice: 180000, lineTotal: 180000 },
      { invoiceId: invoices[3]._id, description: 'Database Architecture', quantity: 1, unitPrice: 40000, lineTotal: 40000 },
      { invoiceId: invoices[3]._id, description: 'API Development', quantity: 1, unitPrice: 30000, lineTotal: 30000 },
    ]);

    // Invoice 5 - Line Items (GBP)
    await InvoiceLine.create([
      { invoiceId: invoices[4]._id, description: 'Landing Page Design', quantity: 1, unitPrice: 125, lineTotal: 125 },
      { invoiceId: invoices[4]._id, description: 'Logo Design', quantity: 1, unitPrice: 60, lineTotal: 60 },
    ]);

    // Invoice 6 - Line Items (USD)
    await InvoiceLine.create([
      { invoiceId: invoices[5]._id, description: 'Social Media Marketing', quantity: 3, unitPrice: 180, lineTotal: 540 },
      { invoiceId: invoices[5]._id, description: 'Content Strategy', quantity: 1, unitPrice: 270, lineTotal: 270 },
    ]);

    // Invoice 7 - Line Items
    await InvoiceLine.create([
      { invoiceId: invoices[6]._id, description: 'Cloud Infrastructure Setup', quantity: 1, unitPrice: 120000, lineTotal: 120000 },
      { invoiceId: invoices[6]._id, description: 'DevOps Implementation', quantity: 1, unitPrice: 80000, lineTotal: 80000 },
      { invoiceId: invoices[6]._id, description: 'Security Audit', quantity: 1, unitPrice: 50000, lineTotal: 50000 },
      { invoiceId: invoices[6]._id, description: 'Training Sessions', quantity: 2, unitPrice: 50000, lineTotal: 100000 },
    ]);

    // Invoice 8 - Line Items (JPY)
    await InvoiceLine.create([
      { invoiceId: invoices[7]._id, description: 'Business Consulting', quantity: 10, unitPrice: 11250, lineTotal: 112500 },
      { invoiceId: invoices[7]._id, description: 'Strategy Planning', quantity: 1, unitPrice: 30000, lineTotal: 30000 },
    ]);

    // Invoice 9 - Line Items (AUD)
    await InvoiceLine.create([
      { invoiceId: invoices[8]._id, description: 'System Migration', quantity: 1, unitPrice: 750, lineTotal: 750 },
      { invoiceId: invoices[8]._id, description: 'Data Transfer', quantity: 1, unitPrice: 420, lineTotal: 420 },
    ]);

    // Invoice 10 - Line Items
    await InvoiceLine.create([
      { invoiceId: invoices[9]._id, description: 'Video Editing', quantity: 4, unitPrice: 5000, lineTotal: 20000 },
      { invoiceId: invoices[9]._id, description: 'Motion Graphics', quantity: 1, unitPrice: 12000, lineTotal: 12000 },
    ]);

    // Invoice 11 - Line Items (EUR)
    await InvoiceLine.create([
      { invoiceId: invoices[10]._id, description: 'UI/UX Research', quantity: 1, unitPrice: 140, lineTotal: 140 },
      { invoiceId: invoices[10]._id, description: 'Wireframe Design', quantity: 1, unitPrice: 187.5, lineTotal: 187.5 },
      { invoiceId: invoices[10]._id, description: 'User Testing', quantity: 1, unitPrice: 187.5, lineTotal: 187.5 },
    ]);

    // Invoice 12 - Line Items (USD)
    await InvoiceLine.create([
      { invoiceId: invoices[11]._id, description: 'Backend Development Sprint', quantity: 2, unitPrice: 600, lineTotal: 1200 },
      { invoiceId: invoices[11]._id, description: 'Frontend Development Sprint', quantity: 2, unitPrice: 240, lineTotal: 480 },
    ]);

    console.log('Created line items');

    // Create payments
    // Invoice 1 - Partial payments (INR)
    await Payment.create([
      { invoiceId: invoices[0]._id, amount: 20000, paymentDate: new Date('2026-01-25') },
      { invoiceId: invoices[0]._id, amount: 15000, paymentDate: new Date('2026-02-05') },
    ]);

    // Invoice 2 - Full payment (USD)
    await Payment.create([
      { invoiceId: invoices[1]._id, amount: 1500, paymentDate: new Date('2026-02-10') },
    ]);

    // Invoice 3 - No payment (EUR)

    // Invoice 4 - Multiple payments (INR)
    await Payment.create([
      { invoiceId: invoices[3]._id, amount: 50000, paymentDate: new Date('2026-01-20') },
      { invoiceId: invoices[3]._id, amount: 50000, paymentDate: new Date('2026-02-01') },
    ]);

    // Invoice 5 - Full payment (GBP)
    await Payment.create([
      { invoiceId: invoices[4]._id, amount: 185, paymentDate: new Date('2026-02-12') },
    ]);

    // Invoice 6 - Multiple payments (USD)
    await Payment.create([
      { invoiceId: invoices[5]._id, amount: 360, paymentDate: new Date('2026-02-05') },
      { invoiceId: invoices[5]._id, amount: 240, paymentDate: new Date('2026-02-12') },
      { invoiceId: invoices[5]._id, amount: 120, paymentDate: new Date('2026-02-15') },
    ]);

    // Invoice 7 - Multiple large payments (INR)
    await Payment.create([
      { invoiceId: invoices[6]._id, amount: 100000, paymentDate: new Date('2026-01-15') },
      { invoiceId: invoices[6]._id, amount: 75000, paymentDate: new Date('2026-02-01') },
    ]);

    // Invoice 8 - Full payment (JPY)
    await Payment.create([
      { invoiceId: invoices[7]._id, amount: 142500, paymentDate: new Date('2026-02-15') },
    ]);

    // Invoice 9 - Full payment archived (AUD)
    await Payment.create([
      { invoiceId: invoices[8]._id, amount: 1170, paymentDate: new Date('2025-12-28') },
    ]);

    // Invoice 10 - Partial payment (INR)
    await Payment.create([
      { invoiceId: invoices[9]._id, amount: 25000, paymentDate: new Date('2026-02-14') },
    ]);

    // Invoice 11 - No payment (EUR)

    // Invoice 12 - Full payment in installments (USD)
    await Payment.create([
      { invoiceId: invoices[11]._id, amount: 840, paymentDate: new Date('2026-02-10') },
      { invoiceId: invoices[11]._id, amount: 840, paymentDate: new Date('2026-02-20') },
    ]);

    console.log('Created payments');

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📊 Sample Invoice Summary:');
    console.log('════════════════════════════════════════════');
    invoices.forEach((inv, index) => {
      const statusEmoji = inv.status === INVOICE_STATUS.PAID ? '✅' : '⏳';
      const archivedTag = inv.isArchived ? ' [ARCHIVED]' : '';
      const currencySymbol = inv.currency === 'INR' ? '₹' : 
                             inv.currency === 'USD' ? '$' : 
                             inv.currency === 'EUR' ? '€' : 
                             inv.currency === 'GBP' ? '£' : 
                             inv.currency === 'JPY' ? '¥' : 'A$';
      console.log(`${index + 1}. ${inv.invoiceNumber} - ${inv.customerName}${archivedTag}`);
      console.log(`   ${statusEmoji} Status: ${inv.status} | Currency: ${inv.currency} | Total: ${currencySymbol}${inv.total.toLocaleString()} | Balance: ${currencySymbol}${inv.balanceDue.toLocaleString()}`);
      console.log(`   ID: ${inv._id}`);
      console.log('');
    });
    console.log('\n💡 Use any Invoice ID above to test the application');
    console.log('\n🌐 Multi-Currency Support: INR, USD, EUR, GBP, JPY, AUD');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
