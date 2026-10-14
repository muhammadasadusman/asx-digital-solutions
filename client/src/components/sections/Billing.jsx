import React, { useEffect, useState } from 'react';
import { 
  CreditCard, 
  Building2, 
  Smartphone, 
  Globe2, 
  Copy, 
  Check, 
  Search, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  AlertCircle,
  Download,
  UploadCloud,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';

export function Billing() {
  const [billingMethods, setBillingMethods] = useState(null);
  const [activeTab, setActiveTab] = useState('bank');
  const [copiedKey, setCopiedKey] = useState('');

  // Invoice Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [foundInvoice, setFoundInvoice] = useState(null);
  const [searchError, setSearchError] = useState('');

  // Proof Submission State
  const [proofForm, setProofForm] = useState({
    paymentMethod: 'Bank Transfer',
    transactionId: '',
    senderName: '',
    notes: '',
  });
  const [proofSubmitting, setProofSubmitting] = useState(false);
  const [proofSuccess, setProofSuccess] = useState('');

  // Simulated Card Payment State
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
    amount: '',
  });
  const [cardProcessing, setCardProcessing] = useState(false);
  const [cardReceipt, setCardReceipt] = useState(null);

  useEffect(() => {
    async function loadBilling() {
      try {
        const data = await api.getBillingMethods();
        setBillingMethods(data);
      } catch (err) {
        console.error('Failed to load billing:', err);
      }
    }
    loadBilling();
  }, []);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2500);
  };

  const handleSearchInvoice = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      setSearchError('');
      setFoundInvoice(null);
      const invoice = await api.searchInvoice(searchQuery);
      setFoundInvoice(invoice);
    } catch (err) {
      setSearchError(err.message || 'Invoice not found. Please verify your invoice number.');
    } finally {
      setSearching(false);
    }
  };

  const handleProofSubmit = async (e) => {
    e.preventDefault();
    if (!foundInvoice) return;

    try {
      setProofSubmitting(true);
      await api.submitPaymentProof({
        invoiceNumber: foundInvoice.invoiceNumber,
        paymentMethod: proofForm.paymentMethod,
        transactionId: proofForm.transactionId,
        senderName: proofForm.senderName,
        notes: proofForm.notes,
      });

      setProofSuccess(`Payment verification received for ${foundInvoice.invoiceNumber}. Status updated to 'Under Review'.`);
      setFoundInvoice({ ...foundInvoice, status: 'Under Review' });
      confetti({ particleCount: 70, spread: 60 });
    } catch (err) {
      alert(err.message || 'Failed to submit payment proof');
    } finally {
      setProofSubmitting(false);
    }
  };

  const handleSimulateCardPayment = (e) => {
    e.preventDefault();
    if (!cardForm.cardNumber || !cardForm.cardHolder) return;

    setCardProcessing(true);
    setTimeout(() => {
      setCardProcessing(false);
      const txn = 'TXN-' + Math.floor(10000000 + Math.random() * 90000000);
      setCardReceipt({
        transactionId: txn,
        cardLast4: cardForm.cardNumber.slice(-4) || '4242',
        cardHolder: cardForm.cardHolder,
        amount: cardForm.amount || (foundInvoice ? foundInvoice.amount : 500),
        currency: foundInvoice ? foundInvoice.currency : 'USD',
        date: new Date().toLocaleString(),
        status: 'PAID & VERIFIED',
      });
      confetti({ particleCount: 90, spread: 70 });
    }, 1500);
  };

  return (
    <section id="billing" className="relative py-24 bg-dark-950 border-t border-slate-900 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[400px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Online Billing & Multi-Channel Payment Hub</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            Secure Global & Local Payment Gateways
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            ASX DIGITAL SOLUTIONS provides multiple frictionless payment methods for local Pakistani and international clients. Look up invoices, copy official payment accounts, or pay securely online.
          </p>
        </div>

        {/* Invoice Lookup Banner */}
        <div className="mt-14 max-w-4xl mx-auto rounded-2xl glass-panel p-6 sm:p-8 border border-cyan-500/30 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h3 className="font-display font-bold text-xl text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>Client Invoice Lookup & Payment Verification</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your ASX Invoice ID (e.g. <span className="text-cyan-300 font-mono font-bold">ASX-2026-001</span> or <span className="text-cyan-300 font-mono font-bold">ASX-PK-809</span>) to review deliverables and submit payment confirmation.
              </p>
            </div>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchInvoice} className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Invoice # (e.g. ASX-2026-001) or Client Email..."
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-dark-950 bg-gradient-to-r from-asx-cyan to-indigo-400 hover:shadow-glow-cyan transition-all flex items-center justify-center space-x-2"
            >
              <span>{searching ? 'Searching...' : 'Search Invoice'}</span>
            </button>
          </form>

          {/* Error Message */}
          {searchError && (
            <div className="mt-4 p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {/* Found Invoice Card */}
          {foundInvoice && (
            <div className="mt-6 p-6 rounded-2xl bg-dark-900 border border-cyan-500/40 space-y-6 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {foundInvoice.invoiceNumber}
                  </span>
                  <h4 className="font-display font-extrabold text-xl text-white">
                    {foundInvoice.projectName}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Client: {foundInvoice.clientName} ({foundInvoice.clientEmail})
                  </p>
                </div>

                <div className="text-right">
                  <div className="font-display font-black text-2xl sm:text-3xl text-white">
                    {foundInvoice.currency === 'USD' ? '$' : 'Rs. '}{foundInvoice.amount.toLocaleString()} <span className="text-xs text-slate-400">{foundInvoice.currency}</span>
                  </div>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    foundInvoice.status === 'Paid'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : foundInvoice.status === 'Under Review'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    ● {foundInvoice.status}
                  </span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800 space-y-2 text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block mb-2">
                  Invoice Deliverables:
                </span>
                {foundInvoice.items && foundInvoice.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-300 py-1 border-b border-slate-800/60 last:border-0">
                    <span>{item.description}</span>
                    <span className="font-mono font-bold text-white">
                      {foundInvoice.currency === 'USD' ? '$' : 'Rs. '}{item.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Payment Proof Submission Form (if unpaid) */}
              {foundInvoice.status !== 'Paid' && (
                <div className="pt-4 border-t border-slate-800">
                  <h5 className="font-display font-bold text-sm text-white mb-2 flex items-center space-x-1.5">
                    <UploadCloud className="w-4 h-4 text-cyan-400" />
                    <span>Submit Payment Proof / Transaction ID</span>
                  </h5>
                  <p className="text-xs text-slate-400 mb-4">
                    Already paid using Bank, Easypaisa, JazzCash, Card or Payoneer? Submit your reference ID below for instant admin verification.
                  </p>

                  {proofSuccess ? (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{proofSuccess}</span>
                    </div>
                  ) : (
                    <form onSubmit={handleProofSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
                          Payment Method Used:
                        </label>
                        <select
                          value={proofForm.paymentMethod}
                          onChange={(e) => setProofForm({ ...proofForm, paymentMethod: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-dark-900"
                        >
                          <option value="Bank Transfer">Bank Transfer (IBAN)</option>
                          <option value="Easypaisa">Easypaisa</option>
                          <option value="JazzCash">JazzCash</option>
                          <option value="Credit / Debit Card">Credit / Debit Card</option>
                          <option value="Payoneer">Payoneer</option>
                          <option value="PayPal">PayPal</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
                          Transaction ID / Reference #:
                        </label>
                        <input
                          type="text"
                          required
                          value={proofForm.transactionId}
                          onChange={(e) => setProofForm({ ...proofForm, transactionId: e.target.value })}
                          placeholder="e.g. TID-98234190"
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          type="submit"
                          disabled={proofSubmitting}
                          className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-dark-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:shadow-glow-emerald transition-all flex items-center justify-center space-x-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{proofSubmitting ? 'Verifying...' : 'Submit Verification'}</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Payment Gateways Tabbed Hub */}
        <div className="mt-16">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveTab('bank')}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'bank'
                  ? 'bg-asx-cyan text-dark-950 border-asx-cyan shadow-glow-cyan'
                  : 'bg-dark-900 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Bank Account Transfer</span>
            </button>

            <button
              onClick={() => setActiveTab('easypaisa')}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'easypaisa'
                  ? 'bg-emerald-500 text-dark-950 border-emerald-500 shadow-glow-emerald'
                  : 'bg-dark-900 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Easypaisa</span>
            </button>

            <button
              onClick={() => setActiveTab('jazzcash')}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'jazzcash'
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-dark-900 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4 text-red-400" />
              <span>JazzCash</span>
            </button>

            <button
              onClick={() => setActiveTab('card')}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'card'
                  ? 'bg-indigo-500 text-white border-indigo-500 shadow-glow-purple'
                  : 'bg-dark-900 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4 text-indigo-400" />
              <span>Credit / Debit Card</span>
            </button>

            <button
              onClick={() => setActiveTab('payoneer')}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'payoneer'
                  ? 'bg-amber-500 text-dark-950 border-amber-500'
                  : 'bg-dark-900 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              <Globe2 className="w-4 h-4 text-amber-400" />
              <span>Payoneer</span>
            </button>

            <button
              onClick={() => setActiveTab('paypal')}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'paypal'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-dark-900 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4 text-blue-400" />
              <span>PayPal</span>
            </button>
          </div>

          {/* Tab 1: Bank Transfer */}
          {activeTab === 'bank' && billingMethods?.bankAccount && (
            <div className="max-w-3xl mx-auto rounded-2xl glass-card p-6 sm:p-8 border border-cyan-500/30 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-lg text-white">
                      Official Corporate Bank Account
                    </h4>
                    <p className="text-xs text-slate-400">{billingMethods.bankAccount.bankName}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-400 border border-emerald-700/50">
                  VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Account Title */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold mb-1">Account Title:</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white font-mono">{billingMethods.bankAccount.accountTitle}</span>
                    <button
                      onClick={() => copyToClipboard(billingMethods.bankAccount.accountTitle, 'title')}
                      className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
                      title="Copy"
                    >
                      {copiedKey === 'title' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Account Number */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold mb-1">Account Number:</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white font-mono">{billingMethods.bankAccount.accountNumber}</span>
                    <button
                      onClick={() => copyToClipboard(billingMethods.bankAccount.accountNumber, 'acc')}
                      className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
                      title="Copy"
                    >
                      {copiedKey === 'acc' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* IBAN */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 sm:col-span-2">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold mb-1">IBAN (International Transfer):</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-cyan-300 font-mono break-all">{billingMethods.bankAccount.iban}</span>
                    <button
                      onClick={() => copyToClipboard(billingMethods.bankAccount.iban, 'iban')}
                      className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors shrink-0 ml-2"
                      title="Copy IBAN"
                    >
                      {copiedKey === 'iban' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Swift & Branch */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold mb-1">SWIFT / BIC Code:</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white font-mono">{billingMethods.bankAccount.swiftCode}</span>
                    <button
                      onClick={() => copyToClipboard(billingMethods.bankAccount.swiftCode, 'swift')}
                      className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      {copiedKey === 'swift' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold mb-1">Branch:</div>
                  <span className="text-xs text-slate-300 font-medium">{billingMethods.bankAccount.branch}</span>
                </div>

              </div>

              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-xs text-cyan-200 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{billingMethods.bankAccount.instructions}</span>
              </div>
            </div>
          )}

          {/* Tab 2: Easypaisa */}
          {activeTab === 'easypaisa' && billingMethods?.easypaisa && (
            <div className="max-w-2xl mx-auto rounded-2xl glass-card p-6 sm:p-8 border border-emerald-500/30 space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-white">
                    Easypaisa Mobile Account
                  </h4>
                  <p className="text-xs text-slate-400">Instant Local Payment (Pakistan)</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">Easypaisa Mobile Number:</span>
                    <span className="font-mono font-bold text-xl text-emerald-400">{billingMethods.easypaisa.mobileNumber}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(billingMethods.easypaisa.mobileNumber, 'ep_num')}
                    className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-semibold text-xs flex items-center space-x-1"
                  >
                    {copiedKey === 'ep_num' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey === 'ep_num' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">Account Title:</span>
                  <span className="font-mono font-bold text-base text-white">{billingMethods.easypaisa.accountTitle}</span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-200">
                  {billingMethods.easypaisa.instructions}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: JazzCash */}
          {activeTab === 'jazzcash' && billingMethods?.jazzCash && (
            <div className="max-w-2xl mx-auto rounded-2xl glass-card p-6 sm:p-8 border border-red-500/30 space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
                <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-white">
                    JazzCash Mobile Account
                  </h4>
                  <p className="text-xs text-slate-400">Instant Local Wallet (Pakistan)</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">JazzCash Mobile Number:</span>
                    <span className="font-mono font-bold text-xl text-red-400">{billingMethods.jazzCash.mobileNumber}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(billingMethods.jazzCash.mobileNumber, 'jc_num')}
                    className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 font-semibold text-xs flex items-center space-x-1"
                  >
                    {copiedKey === 'jc_num' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey === 'jc_num' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">Account Title:</span>
                  <span className="font-mono font-bold text-base text-white">{billingMethods.jazzCash.accountTitle}</span>
                </div>

                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-200">
                  {billingMethods.jazzCash.instructions}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Credit / Debit Card Checkout */}
          {activeTab === 'card' && (
            <div className="max-w-2xl mx-auto rounded-2xl glass-card p-6 sm:p-8 border border-indigo-500/30 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-lg text-white">
                      Direct Card Checkout (Visa / Mastercard)
                    </h4>
                    <p className="text-xs text-slate-400">256-bit Encrypted Card Payment Simulator</p>
                  </div>
                </div>
                <div className="flex space-x-2 text-xs font-bold text-slate-400">
                  <span>VISA</span>
                  <span>•</span>
                  <span>MC</span>
                </div>
              </div>

              {cardReceipt ? (
                <div className="p-6 rounded-2xl bg-dark-900 border border-emerald-500/40 space-y-4">
                  <div className="flex items-center space-x-2 text-emerald-400 text-sm font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Payment Processed Successfully!</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs space-y-2 border border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Transaction ID:</span>
                      <span className="text-cyan-400 font-bold">{cardReceipt.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Card:</span>
                      <span className="text-white">•••• •••• •••• {cardReceipt.cardLast4}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cardholder:</span>
                      <span className="text-white">{cardReceipt.cardHolder}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Amount Paid:</span>
                      <span className="text-emerald-400 font-bold">{cardReceipt.currency === 'USD' ? '$' : 'Rs.'} {cardReceipt.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Timestamp:</span>
                      <span className="text-slate-400">{cardReceipt.date}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 flex items-center justify-center space-x-1.5"
                    >
                      <Download className="w-4 h-4" />
                      <span>Print Official Receipt</span>
                    </button>
                    <button
                      onClick={() => setCardReceipt(null)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                    >
                      Pay Another
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSimulateCardPayment} className="space-y-4">
                  <div>
                    <label className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
                      Cardholder Full Name:
                    </label>
                    <input
                      type="text"
                      required
                      value={cardForm.cardHolder}
                      onChange={(e) => setCardForm({ ...cardForm, cardHolder: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
                      Card Number:
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      value={cardForm.cardNumber}
                      onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                      placeholder="4000 1234 5678 9010"
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
                        Expiry (MM/YY):
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={cardForm.expiry}
                        onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                        placeholder="12/28"
                        className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
                        CVV / CVC:
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardForm.cvv}
                        onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                        placeholder="•••"
                        className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
                        Amount ($):
                      </label>
                      <input
                        type="number"
                        value={cardForm.amount}
                        onChange={(e) => setCardForm({ ...cardForm, amount: e.target.value })}
                        placeholder={foundInvoice ? String(foundInvoice.amount) : "500"}
                        className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={cardProcessing}
                    className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-glow-purple transition-all flex items-center justify-center space-x-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{cardProcessing ? 'Authorizing Payment...' : 'Pay Securely Now'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Tab 5: Payoneer */}
          {activeTab === 'payoneer' && billingMethods?.payoneer && (
            <div className="max-w-2xl mx-auto rounded-2xl glass-card p-6 sm:p-8 border border-amber-500/30 space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                  <Globe2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-white">
                    Payoneer Cross-Border Payments
                  </h4>
                  <p className="text-xs text-slate-400">USD, EUR, GBP (0% Fee via Payoneer In-Network)</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">Payoneer Recipient Email:</span>
                    <span className="font-mono font-bold text-base text-amber-400">{billingMethods.payoneer.accountEmail}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(billingMethods.payoneer.accountEmail, 'py_email')}
                    className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-semibold text-xs flex items-center space-x-1"
                  >
                    {copiedKey === 'py_email' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey === 'py_email' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">Account Title:</span>
                  <span className="font-mono font-bold text-base text-white">{billingMethods.payoneer.accountTitle}</span>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200">
                  {billingMethods.payoneer.instructions}
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: PayPal */}
          {activeTab === 'paypal' && billingMethods?.paypal && (
            <div className="max-w-2xl mx-auto rounded-2xl glass-card p-6 sm:p-8 border border-blue-500/30 space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-white">
                    PayPal Global Payments
                  </h4>
                  <p className="text-xs text-slate-400">For International Clients (US, UK, Europe, Australia)</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">PayPal ID / Email:</span>
                    <span className="font-mono font-bold text-base text-blue-400">{billingMethods.paypal.accountEmail}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(billingMethods.paypal.accountEmail, 'pp_email')}
                    className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 font-semibold text-xs flex items-center space-x-1"
                  >
                    {copiedKey === 'pp_email' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey === 'pp_email' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/60 text-xs text-blue-200">
                  {billingMethods.paypal.instructions}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
