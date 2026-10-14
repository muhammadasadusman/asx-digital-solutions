const { v4: uuidv4 } = require('uuid');
const { readCollection, writeCollection } = require('../config/db');

// --- PAYMENT METHODS ---

exports.getBillingMethods = (req, res) => {
  try {
    const billing = readCollection('billing');
    res.json(billing);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching billing methods' });
  }
};

exports.updateBillingMethods = (req, res) => {
  try {
    const billing = readCollection('billing');
    const updatedBilling = {
      ...billing,
      ...req.body,
      lastUpdated: new Date().toISOString(),
      updatedBy: req.user.email,
    };

    writeCollection('billing', updatedBilling);
    res.json({
      message: 'Payment accounts and gateways updated successfully.',
      billing: updatedBilling,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating billing methods' });
  }
};

// --- INVOICES & PAYMENT VERIFICATION ---

exports.getInvoices = (req, res) => {
  try {
    const invoices = readCollection('invoices');
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching invoices' });
  }
};

exports.searchInvoice = (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Invoice number or email query is required.' });
    }

    const invoices = readCollection('invoices');
    const invoice = invoices.find(inv => 
      inv.invoiceNumber.toLowerCase() === query.trim().toLowerCase() ||
      inv.clientEmail.toLowerCase() === query.trim().toLowerCase()
    );

    if (!invoice) {
      return res.status(404).json({ message: 'No invoice found matching the given Invoice # or Email.' });
    }

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Error searching invoice' });
  }
};

exports.createInvoice = (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      projectName,
      service,
      amount,
      currency,
      dueDate,
      items,
      customNotes,
    } = req.body;

    if (!clientName || !clientEmail || !amount) {
      return res.status(400).json({ message: 'Client name, email, and amount are required.' });
    }

    const invoices = readCollection('invoices');
    const invCount = invoices.length + 1;
    const invNumber = `ASX-${new Date().getFullYear()}-${String(invCount).padStart(3, '0')}`;

    const newInvoice = {
      id: 'inv_' + uuidv4().slice(0, 8),
      invoiceNumber: invNumber,
      clientName,
      clientEmail,
      projectName: projectName || 'Digital Engineering & Design Project',
      service: service || 'Web Development',
      amount: Number(amount),
      currency: currency || 'USD',
      status: 'Unpaid',
      dueDate: dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'Pending',
      items: items && items.length > 0 ? items : [{ description: 'Project Milestone Deliverable', amount: Number(amount) }],
      customNotes: customNotes || 'Thank you for partnering with ASX DIGITAL SOLUTIONS.',
      createdAt: new Date().toISOString(),
      createdBy: req.user.email,
    };

    invoices.unshift(newInvoice);
    writeCollection('invoices', invoices);

    res.status(201).json({
      message: `Invoice ${newInvoice.invoiceNumber} created successfully.`,
      invoice: newInvoice,
    });
  } catch (err) {
    console.error('Create invoice error:', err);
    res.status(500).json({ message: 'Error creating invoice' });
  }
};

exports.updateInvoice = (req, res) => {
  try {
    const { id } = req.params;
    const invoices = readCollection('invoices');
    const index = invoices.findIndex(i => i.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    invoices[index] = {
      ...invoices[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    writeCollection('invoices', invoices);
    res.json({ message: 'Invoice updated successfully', invoice: invoices[index] });
  } catch (err) {
    res.status(500).json({ message: 'Error updating invoice' });
  }
};

exports.submitPaymentProof = (req, res) => {
  try {
    const { invoiceNumber, paymentMethod, transactionId, senderName, proofScreenshotUrl, notes } = req.body;
    if (!invoiceNumber || !paymentMethod) {
      return res.status(400).json({ message: 'Invoice number and payment method are required.' });
    }

    const invoices = readCollection('invoices');
    const index = invoices.findIndex(i => i.invoiceNumber.toLowerCase() === invoiceNumber.trim().toLowerCase());

    if (index === -1) {
      return res.status(404).json({ message: 'Invoice not found.' });
    }

    invoices[index].status = 'Under Review';
    invoices[index].paymentProof = {
      paymentMethod,
      transactionId: transactionId || 'N/A',
      senderName: senderName || 'Client',
      proofScreenshotUrl: proofScreenshotUrl || '',
      notes: notes || '',
      submittedAt: new Date().toISOString(),
    };

    writeCollection('invoices', invoices);

    res.json({
      message: 'Payment verification submitted successfully! Our billing team will verify and confirm your invoice.',
      invoice: invoices[index],
    });
  } catch (err) {
    console.error('Submit payment proof error:', err);
    res.status(500).json({ message: 'Error submitting payment proof' });
  }
};

exports.deleteInvoice = (req, res) => {
  try {
    const { id } = req.params;
    let invoices = readCollection('invoices');
    invoices = invoices.filter(i => i.id !== id);
    writeCollection('invoices', invoices);
    res.json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting invoice' });
  }
};
