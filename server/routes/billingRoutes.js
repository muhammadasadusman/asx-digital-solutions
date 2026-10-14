const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { requireAuth, requirePermission } = require('../middleware/auth');

// Public endpoints
router.get('/methods', billingController.getBillingMethods);
router.get('/invoices/search', billingController.searchInvoice);
router.post('/invoices/verify-proof', billingController.submitPaymentProof);

// Admin / Billing manager endpoints
router.put('/methods', requireAuth, requirePermission('can_manage_billing'), billingController.updateBillingMethods);
router.get('/invoices', requireAuth, requirePermission('can_manage_billing'), billingController.getInvoices);
router.post('/invoices', requireAuth, requirePermission('can_manage_billing'), billingController.createInvoice);
router.put('/invoices/:id', requireAuth, requirePermission('can_manage_billing'), billingController.updateInvoice);
router.delete('/invoices/:id', requireAuth, requirePermission('can_manage_billing'), billingController.deleteInvoice);

module.exports = router;
