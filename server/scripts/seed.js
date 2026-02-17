require('dotenv').config();
const mongoose = require('mongoose');
const Invoice = require('../src/models/Invoice.model');
const InvoiceLine = require('../src/models/InvoiceLine.model');
const Payment = require('../src/models/Payment.model');
const { INVOICE_STATUS } = require('../src/config/constants');

// Helper to calculate tax
const calculateTax = (subtotal, taxRate) => {
  return Math.round((subtotal * taxRate) / 100 * 100) / 100;
};

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

    // Invoice 1 - Partial Payment - INR (18% GST)
    const inv1Subtotal = 85000;
    const inv1TaxRate = 18;
    const inv1Tax = calculateTax(inv1Subtotal, inv1TaxRate);
    const inv1Total = inv1Subtotal + inv1Tax;
    const inv1Paid = 35000;
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-001',
      customerName: 'Acme Enterprise',
      currency: 'INR',
      issueDate: new Date('2026-01-15'),
      dueDate: new Date('2026-02-15'),
      status: INVOICE_STATUS.DRAFT,
      subtotal: inv1Subtotal,
      taxRate: inv1TaxRate,
      taxAmount: inv1Tax,
      total: inv1Total,
      amountPaid: inv1Paid,
      balanceDue: inv1Total - inv1Paid,
      isArchived: false,
    }));

    // Invoice 2 - Fully Paid - USD (10% Sales Tax)
    const inv2Subtotal = 1500;
    const inv2TaxRate = 10;
    const inv2Tax = calculateTax(inv2Subtotal, inv2TaxRate);
    const inv2Total = inv2Subtotal + inv2Tax;
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-002',
      customerName: 'Tech Solutions Inc',
      currency: 'USD',
      issueDate: new Date('2026-01-20'),
      dueDate: new Date('2026-02-20'),
      status: INVOICE_STATUS.PAID,
      subtotal: inv2Subtotal,
      taxRate: inv2TaxRate,
      taxAmount: inv2Tax,
      total: inv2Total,
      amountPaid: inv2Total,
      balanceDue: 0,
      isArchived: false,
    }));

    // Invoice 3 - No Payment Yet - EUR (20% VAT)
    const inv3Subtotal = 420;
    const inv3TaxRate = 20;
    const inv3Tax = calculateTax(inv3Subtotal, inv3TaxRate);
    const inv3Total = inv3Subtotal + inv3Tax;
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-003',
      customerName: 'Global Innovations Ltd',
      currency: 'EUR',
      issueDate: new Date('2026-02-01'),
      dueDate: new Date('2026-03-01'),
      status: INVOICE_STATUS.DRAFT,
      subtotal: inv3Subtotal,
      taxRate: inv3TaxRate,
      taxAmount: inv3Tax,
      total: inv3Total,
      amountPaid: 0,
      balanceDue: inv3Total,
      isArchived: false,
    }));

    // Invoice 4 - Large Invoice, Partial Payment - INR (18% GST)
    const inv4Subtotal = 250000;
    const inv4TaxRate = 18;
    const inv4Tax = calculateTax(inv4Subtotal, inv4TaxRate);
    const inv4Total = inv4Subtotal + inv4Tax;
    const inv4Paid = 100000;
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-004',
      customerName: 'Quantum Systems Pvt Ltd',
      currency: 'INR',
      issueDate: new Date('2026-01-10'),
      dueDate: new Date('2026-02-10'),
      status: INVOICE_STATUS.DRAFT,
      subtotal: inv4Subtotal,
      taxRate: inv4TaxRate,
      taxAmount: inv4Tax,
      total: inv4Total,
      amountPaid: inv4Paid,
      balanceDue: inv4Total - inv4Paid,
      isArchived: false,
    }));

    // Invoice 5 - Small Invoice, Fully Paid - GBP (20% VAT)
    const inv5Subtotal = 185;
    const inv5TaxRate = 20;
    const inv5Tax = calculateTax(inv5Subtotal, inv5TaxRate);
    const inv5Total = inv5Subtotal + inv5Tax;
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-005',
      customerName: 'Startup Hub India',
      currency: 'GBP',
      issueDate: new Date('2026-02-05'),
      dueDate: new Date('2026-02-19'),
      status: INVOICE_STATUS.PAID,
      subtotal: inv5Subtotal,
      taxRate: inv5TaxRate,
      taxAmount: inv5Tax,
      total: inv5Total,
      amountPaid: inv5Total,
      balanceDue: 0,
      isArchived: false,
    }));

    // Invoice 6 - Medium Invoice, Almost Paid - USD (10% Sales Tax)
    const inv6Subtotal = 810;
    const inv6TaxRate = 10;
    const inv6Tax = calculateTax(inv6Subtotal, inv6TaxRate);
    const inv6Total = inv6Subtotal + inv6Tax;
    const inv6Paid = 720;
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-006',
      customerName: 'Digital Marketing Pro',
      currency: 'USD',
      issueDate: new Date('2026-01-25'),
      dueDate: new Date('2026-02-25'),
      status: INVOICE_STATUS.DRAFT,
      subtotal: inv6Subtotal,
      taxRate: inv6TaxRate,
      taxAmount: inv6Tax,
      total: inv6Total,
      amountPaid: inv6Paid,
      balanceDue: inv6Total - inv6Paid,
      isArchived: false,
    }));

    // Invoice 7 - Large Project, Multiple Services - INR (18% GST)
    const inv7Subtotal = 350000;
    const inv7TaxRate = 18;
    const inv7Tax = calculateTax(inv7Subtotal, inv7TaxRate);
    const inv7Total = inv7Subtotal + inv7Tax;
    const inv7Paid = 175000;
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-007',
      customerName: 'Enterprise Corp',
      currency: 'INR',
      issueDate: new Date('2026-01-05'),
      dueDate: new Date('2026-02-05'),
      status: INVOICE_STATUS.DRAFT,
      subtotal: inv7Subtotal,
      taxRate: inv7TaxRate,
      taxAmount: inv7Tax,
      total: inv7Total,
      amountPaid: inv7Paid,
      balanceDue: inv7Total - inv7Paid,
      isArchived: false,
    }));

    // Invoice 8 - Consulting Services, Paid - JPY (10% Consumption Tax)
    const inv8Subtotal = 142500;
    const inv8TaxRate = 10;
    const inv8Tax = calculateTax(inv8Subtotal, inv8TaxRate);
    const inv8Total = inv8Subtotal + inv8Tax;
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-008',
      customerName: 'Consulting Group LLC',
      currency: 'JPY',
      issueDate: new Date('2026-02-08'),
      dueDate: new Date('2026-02-22'),
      status: INVOICE_STATUS.PAID,
      subtotal: inv8Subtotal,
      taxRate: inv8TaxRate,
      taxAmount: inv8Tax,
      total: inv8Total,
      amountPaid: inv8Total,
      balanceDue: 0,
      isArchived: false,
    }));

    // Invoice 9 - Archived Invoice - AUD (10% GST)
    const inv9Subtotal = 1170;
    const inv9TaxRate = 10;
    const inv9Tax = calculateTax(inv9Subtotal, inv9TaxRate);
    const inv9Total = inv9Subtotal + inv9Tax;
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2025-099',
      customerName: 'Legacy Systems Inc',
      currency: 'AUD',
      issueDate: new Date('2025-12-15'),
      dueDate: new Date('2026-01-15'),
      status: INVOICE_STATUS.PAID,
      subtotal: inv9Subtotal,
      taxRate: inv9TaxRate,
      taxAmount: inv9Tax,
      total: inv9Total,
      amountPaid: inv9Total,
      balanceDue: 0,
      isArchived: true,
    }));

    // Invoice 10 - Recent Invoice, Small Balance - INR (18% GST)
    const inv10Subtotal = 32000;
    const inv10TaxRate = 18;
    const inv10Tax = calculateTax(inv10Subtotal, inv10TaxRate);
    const inv10Total = inv10Subtotal + inv10Tax;
    const inv10Paid = 25000;
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-010',
      customerName: 'Creative Studios',
      currency: 'INR',
      issueDate: new Date('2026-02-10'),
      dueDate: new Date('2026-03-10'),
      status: INVOICE_STATUS.DRAFT,
      subtotal: inv10Subtotal,
      taxRate: inv10TaxRate,
      taxAmount: inv10Tax,
      total: inv10Total,
      amountPaid: inv10Paid,
      balanceDue: inv10Total - inv10Paid,
      isArchived: false,
    }));

    // Invoice 11 - UI/UX Design Project - EUR (20% VAT)
    const inv11Subtotal = 515;
    const inv11TaxRate = 20;
    const inv11Tax = calculateTax(inv11Subtotal, inv11TaxRate);
    const inv11Total = inv11Subtotal + inv11Tax;
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-011',
      customerName: 'Design First Agency',
      currency: 'EUR',
      issueDate: new Date('2026-02-12'),
      dueDate: new Date('2026-03-12'),
      status: INVOICE_STATUS.DRAFT,
      subtotal: inv11Subtotal,
      taxRate: inv11TaxRate,
      taxAmount: inv11Tax,
      total: inv11Total,
      amountPaid: 0,
      balanceDue: inv11Total,
      isArchived: false,
    }));

    // Invoice 12 - Development Sprint, Paid - USD (10% Sales Tax)
    const inv12Subtotal = 1680;
    const inv12TaxRate = 10;
    const inv12Tax = calculateTax(inv12Subtotal, inv12TaxRate);
    const inv12Total = inv12Subtotal + inv12Tax;
    invoices.push(await Invoice.create({
      invoiceNumber: 'INV-2026-012',
      customerName: 'Agile Works Ltd',
      currency: 'USD',
      issueDate: new Date('2026-01-28'),
      dueDate: new Date('2026-02-28'),
      status: INVOICE_STATUS.PAID,
      subtotal: inv12Subtotal,
      taxRate: inv12TaxRate,
      taxAmount: inv12Tax,
      total: inv12Total,
      amountPaid: inv12Total,
      balanceDue: 0,
      isArchived: false,
    }));

    console.log('Created 12 invoices with tax calculations');

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

    console.log('Created line items for all invoices');

    // Create payments
    // Invoice 1 - Partial payments
    await Payment.create([
      { invoiceId: invoices[0]._id, amount: 25000, paymentDate: new Date('2026-01-20') },
      { invoiceId: invoices[0]._id, amount: 10000, paymentDate: new Date('2026-02-05') },
    ]);

    // Invoice 2 - Full payment
    await Payment.create([
      { invoiceId: invoices[1]._id, amount: inv2Total, paymentDate: new Date('2026-01-25') },
    ]);

    // Invoice 4 - Partial payment
    await Payment.create([
      { invoiceId: invoices[3]._id, amount: 100000, paymentDate: new Date('2026-01-15') },
    ]);

    // Invoice 5 - Full payment
    await Payment.create([
      { invoiceId: invoices[4]._id, amount: inv5Total, paymentDate: new Date('2026-02-10') },
    ]);

    // Invoice 6 - Multiple payments
    await Payment.create([
      { invoiceId: invoices[5]._id, amount: 450, paymentDate: new Date('2026-02-01') },
      { invoiceId: invoices[5]._id, amount: 270, paymentDate: new Date('2026-02-15') },
    ]);

    // Invoice 7 - Partial payment
    await Payment.create([
      { invoiceId: invoices[6]._id, amount: 175000, paymentDate: new Date('2026-01-12') },
    ]);

    // Invoice 8 - Full payment
    await Payment.create([
      { invoiceId: invoices[7]._id, amount: inv8Total, paymentDate: new Date('2026-02-15') },
    ]);

    // Invoice 9 - Full payment (archived)
    await Payment.create([
      { invoiceId: invoices[8]._id, amount: inv9Total, paymentDate: new Date('2026-01-10') },
    ]);

    // Invoice 10 - Partial payment
    await Payment.create([
      { invoiceId: invoices[9]._id, amount: 25000, paymentDate: new Date('2026-02-14') },
    ]);

    // Invoice 12 - Full payment
    await Payment.create([
      { invoiceId: invoices[11]._id, amount: inv12Total, paymentDate: new Date('2026-02-05') },
    ]);

    console.log('Created payment records');
    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Sample Invoice IDs (for testing):');
    
    invoices.forEach((invoice, index) => {
      const taxLabel = invoice.currency === 'INR' ? 'GST' : 
                       invoice.currency === 'EUR' || invoice.currency === 'GBP' ? 'VAT' :
                       invoice.currency === 'JPY' ? 'Consumption Tax' : 
                       invoice.currency === 'AUD' ? 'GST' : 'Sales Tax';
      const statusEmoji = invoice.status === 'PAID' ? '✅' : '⏳';
      const archivedTag = invoice.isArchived ? ' [ARCHIVED]' : '';
      
      console.log(`\n${index + 1}. ${invoice.invoiceNumber} (${invoice.currency}) ${statusEmoji}${archivedTag}`);
      console.log(`   Customer: ${invoice.customerName}`);
      console.log(`   Subtotal: ${invoice.subtotal} | ${taxLabel} (${invoice.taxRate}%): ${invoice.taxAmount}`);
      console.log(`   Total: ${invoice.total} | Paid: ${invoice.amountPaid} | Balance: ${invoice.balanceDue}`);
      console.log(`   ID: ${invoice._id}`);
    });
    
    console.log('\n💡 Tax Rates by Currency:');
    console.log('   • INR: 18% GST (Indian Goods & Services Tax)');
    console.log('   • USD: 10% Sales Tax');
    console.log('   • EUR: 20% VAT (Value Added Tax)');
    console.log('   • GBP: 20% VAT');
    console.log('   • JPY: 10% Consumption Tax');
    console.log('   • AUD: 10% GST (Australian Goods & Services Tax)');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  }
};

seedData();
