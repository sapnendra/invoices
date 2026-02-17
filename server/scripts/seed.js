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

    // Invoice 1 - Partial Payment
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-001',
      customerName: 'Acme Enterprise',
      issueDate: new Date('2026-01-15'),
      dueDate: new Date('2026-02-15'),
      status: INVOICE_STATUS.DRAFT,
      total: 85000,
      amountPaid: 35000,
      balanceDue: 50000,
      isArchived: false,
    }));

    // Invoice 2 - Fully Paid
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-002',
      customerName: 'Tech Solutions Inc',
      issueDate: new Date('2026-01-20'),
      dueDate: new Date('2026-02-20'),
      status: INVOICE_STATUS.PAID,
      total: 125000,
      amountPaid: 125000,
      balanceDue: 0,
      isArchived: false,
    }));

    // Invoice 3 - No Payment Yet
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-003',
      customerName: 'Global Innovations Ltd',
      issueDate: new Date('2026-02-01'),
      dueDate: new Date('2026-03-01'),
      status: INVOICE_STATUS.DRAFT,
      total: 45000,
      amountPaid: 0,
      balanceDue: 45000,
      isArchived: false,
    }));

    // Invoice 4 - Large Invoice, Partial Payment
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-004',
      customerName: 'Quantum Systems Pvt Ltd',
      issueDate: new Date('2026-01-10'),
      dueDate: new Date('2026-02-10'),
      status: INVOICE_STATUS.DRAFT,
      total: 250000,
      amountPaid: 100000,
      balanceDue: 150000,
      isArchived: false,
    }));

    // Invoice 5 - Small Invoice, Fully Paid
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-005',
      customerName: 'Startup Hub India',
      issueDate: new Date('2026-02-05'),
      dueDate: new Date('2026-02-19'),
      status: INVOICE_STATUS.PAID,
      total: 18500,
      amountPaid: 18500,
      balanceDue: 0,
      isArchived: false,
    }));

    // Invoice 6 - Medium Invoice, Almost Paid
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-006',
      customerName: 'Digital Marketing Pro',
      issueDate: new Date('2026-01-25'),
      dueDate: new Date('2026-02-25'),
      status: INVOICE_STATUS.DRAFT,
      total: 67500,
      amountPaid: 60000,
      balanceDue: 7500,
      isArchived: false,
    }));

    // Invoice 7 - Large Project, Multiple Services
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-007',
      customerName: 'Enterprise Corp',
      issueDate: new Date('2026-01-05'),
      dueDate: new Date('2026-02-05'),
      status: INVOICE_STATUS.DRAFT,
      total: 350000,
      amountPaid: 175000,
      balanceDue: 175000,
      isArchived: false,
    }));

    // Invoice 8 - Consulting Services, Paid
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-008',
      customerName: 'Consulting Group LLC',
      issueDate: new Date('2026-02-08'),
      dueDate: new Date('2026-02-22'),
      status: INVOICE_STATUS.PAID,
      total: 95000,
      amountPaid: 95000,
      balanceDue: 0,
      isArchived: false,
    }));

    // Invoice 9 - Archived Invoice
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2025-099',
      customerName: 'Legacy Systems Inc',
      issueDate: new Date('2025-12-15'),
      dueDate: new Date('2026-01-15'),
      status: INVOICE_STATUS.PAID,
      total: 78000,
      amountPaid: 78000,
      balanceDue: 0,
      isArchived: true,
    }));

    // Invoice 10 - Recent Invoice, Small Balance
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-010',
      customerName: 'Creative Studios',
      issueDate: new Date('2026-02-10'),
      dueDate: new Date('2026-03-10'),
      status: INVOICE_STATUS.DRAFT,
      total: 32000,
      amountPaid: 25000,
      balanceDue: 7000,
      isArchived: false,
    }));

    // Invoice 11 - UI/UX Design Project
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-011',
      customerName: 'Design First Agency',
      issueDate: new Date('2026-02-12'),
      dueDate: new Date('2026-03-12'),
      status: INVOICE_STATUS.DRAFT,
      total: 55000,
      amountPaid: 0,
      balanceDue: 55000,
      isArchived: false,
    }));

    // Invoice 12 - Development Sprint, Paid
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-012',
      customerName: 'Agile Works Ltd',
      issueDate: new Date('2026-01-28'),
      dueDate: new Date('2026-02-28'),
      status: INVOICE_STATUS.PAID,
      total: 140000,
      amountPaid: 140000,
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

    // Invoice 2 - Line Items
    await InvoiceLine.create([
      { invoiceId: invoices[1]._id, description: 'E-commerce Platform Development', quantity: 1, unitPrice: 85000, lineTotal: 85000 },
      { invoiceId: invoices[1]._id, description: 'Payment Gateway Integration', quantity: 1, unitPrice: 25000, lineTotal: 25000 },
      { invoiceId: invoices[1]._id, description: 'Admin Dashboard', quantity: 1, unitPrice: 15000, lineTotal: 15000 },
    ]);

    // Invoice 3 - Line Items
    await InvoiceLine.create([
      { invoiceId: invoices[2]._id, description: 'Mobile App Design', quantity: 1, unitPrice: 30000, lineTotal: 30000 },
      { invoiceId: invoices[2]._id, description: 'Prototype Development', quantity: 1, unitPrice: 15000, lineTotal: 15000 },
    ]);

    // Invoice 4 - Line Items
    await InvoiceLine.create([
      { invoiceId: invoices[3]._id, description: 'Enterprise Software Development', quantity: 1, unitPrice: 180000, lineTotal: 180000 },
      { invoiceId: invoices[3]._id, description: 'Database Architecture', quantity: 1, unitPrice: 40000, lineTotal: 40000 },
      { invoiceId: invoices[3]._id, description: 'API Development', quantity: 1, unitPrice: 30000, lineTotal: 30000 },
    ]);

    // Invoice 5 - Line Items
    await InvoiceLine.create([
      { invoiceId: invoices[4]._id, description: 'Landing Page Design', quantity: 1, unitPrice: 12500, lineTotal: 12500 },
      { invoiceId: invoices[4]._id, description: 'Logo Design', quantity: 1, unitPrice: 6000, lineTotal: 6000 },
    ]);

    // Invoice 6 - Line Items
    await InvoiceLine.create([
      { invoiceId: invoices[5]._id, description: 'Social Media Marketing', quantity: 3, unitPrice: 15000, lineTotal: 45000 },
      { invoiceId: invoices[5]._id, description: 'Content Strategy', quantity: 1, unitPrice: 22500, lineTotal: 22500 },
    ]);

    // Invoice 7 - Line Items
    await InvoiceLine.create([
      { invoiceId: invoices[6]._id, description: 'Cloud Infrastructure Setup', quantity: 1, unitPrice: 120000, lineTotal: 120000 },
      { invoiceId: invoices[6]._id, description: 'DevOps Implementation', quantity: 1, unitPrice: 80000, lineTotal: 80000 },
      { invoiceId: invoices[6]._id, description: 'Security Audit', quantity: 1, unitPrice: 50000, lineTotal: 50000 },
      { invoiceId: invoices[6]._id, description: 'Training Sessions', quantity: 2, unitPrice: 50000, lineTotal: 100000 },
    ]);

    // Invoice 8 - Line Items
    await InvoiceLine.create([
      { invoiceId: invoices[7]._id, description: 'Business Consulting', quantity: 10, unitPrice: 7500, lineTotal: 75000 },
      { invoiceId: invoices[7]._id, description: 'Strategy Planning', quantity: 1, unitPrice: 20000, lineTotal: 20000 },
    ]);

    // Invoice 9 - Line Items
    await InvoiceLine.create([
      { invoiceId: invoices[8]._id, description: 'System Migration', quantity: 1, unitPrice: 50000, lineTotal: 50000 },
      { invoiceId: invoices[8]._id, description: 'Data Transfer', quantity: 1, unitPrice: 28000, lineTotal: 28000 },
    ]);

    // Invoice 10 - Line Items
    await InvoiceLine.create([
      { invoiceId: invoices[9]._id, description: 'Video Editing', quantity: 4, unitPrice: 5000, lineTotal: 20000 },
      { invoiceId: invoices[9]._id, description: 'Motion Graphics', quantity: 1, unitPrice: 12000, lineTotal: 12000 },
    ]);

    // Invoice 11 - Line Items
    await InvoiceLine.create([
      { invoiceId: invoices[10]._id, description: 'UI/UX Research', quantity: 1, unitPrice: 15000, lineTotal: 15000 },
      { invoiceId: invoices[10]._id, description: 'Wireframe Design', quantity: 1, unitPrice: 20000, lineTotal: 20000 },
      { invoiceId: invoices[10]._id, description: 'User Testing', quantity: 1, unitPrice: 20000, lineTotal: 20000 },
    ]);

    // Invoice 12 - Line Items
    await InvoiceLine.create([
      { invoiceId: invoices[11]._id, description: 'Backend Development Sprint', quantity: 2, unitPrice: 50000, lineTotal: 100000 },
      { invoiceId: invoices[11]._id, description: 'Frontend Development Sprint', quantity: 2, unitPrice: 20000, lineTotal: 40000 },
    ]);

    console.log('Created line items');

    // Create payments
    // Invoice 1 - Partial payments
    await Payment.create([
      { invoiceId: invoices[0]._id, amount: 20000, paymentDate: new Date('2026-01-25') },
      { invoiceId: invoices[0]._id, amount: 15000, paymentDate: new Date('2026-02-05') },
    ]);

    // Invoice 2 - Full payment
    await Payment.create([
      { invoiceId: invoices[1]._id, amount: 125000, paymentDate: new Date('2026-02-10') },
    ]);

    // Invoice 3 - No payment

    // Invoice 4 - Multiple payments
    await Payment.create([
      { invoiceId: invoices[3]._id, amount: 50000, paymentDate: new Date('2026-01-20') },
      { invoiceId: invoices[3]._id, amount: 50000, paymentDate: new Date('2026-02-01') },
    ]);

    // Invoice 5 - Full payment
    await Payment.create([
      { invoiceId: invoices[4]._id, amount: 18500, paymentDate: new Date('2026-02-12') },
    ]);

    // Invoice 6 - Multiple payments
    await Payment.create([
      { invoiceId: invoices[5]._id, amount: 30000, paymentDate: new Date('2026-02-05') },
      { invoiceId: invoices[5]._id, amount: 20000, paymentDate: new Date('2026-02-12') },
      { invoiceId: invoices[5]._id, amount: 10000, paymentDate: new Date('2026-02-15') },
    ]);

    // Invoice 7 - Multiple large payments
    await Payment.create([
      { invoiceId: invoices[6]._id, amount: 100000, paymentDate: new Date('2026-01-15') },
      { invoiceId: invoices[6]._id, amount: 75000, paymentDate: new Date('2026-02-01') },
    ]);

    // Invoice 8 - Full payment
    await Payment.create([
      { invoiceId: invoices[7]._id, amount: 95000, paymentDate: new Date('2026-02-15') },
    ]);

    // Invoice 9 - Full payment (archived)
    await Payment.create([
      { invoiceId: invoices[8]._id, amount: 78000, paymentDate: new Date('2025-12-28') },
    ]);

    // Invoice 10 - Partial payment
    await Payment.create([
      { invoiceId: invoices[9]._id, amount: 25000, paymentDate: new Date('2026-02-14') },
    ]);

    // Invoice 11 - No payment

    // Invoice 12 - Full payment in installments
    await Payment.create([
      { invoiceId: invoices[11]._id, amount: 70000, paymentDate: new Date('2026-02-10') },
      { invoiceId: invoices[11]._id, amount: 70000, paymentDate: new Date('2026-02-20') },
    ]);

    console.log('Created payments');

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📊 Sample Invoice Summary:');
    console.log('════════════════════════════════════════════');
    invoices.forEach((inv, index) => {
      const statusEmoji = inv.status === INVOICE_STATUS.PAID ? '✅' : '⏳';
      const archivedTag = inv.isArchived ? ' [ARCHIVED]' : '';
      console.log(`${index + 1}. ${inv.invoiceNumber} - ${inv.customerName}${archivedTag}`);
      console.log(`   ${statusEmoji} Status: ${inv.status} | Total: ₹${inv.total.toLocaleString('en-IN')} | Balance: ₹${inv.balanceDue.toLocaleString('en-IN')}`);
      console.log(`   ID: ${inv._id}`);
      console.log('');
    });
    console.log('\n💡 Use any Invoice ID above to test the application');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
