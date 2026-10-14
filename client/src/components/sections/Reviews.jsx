import React, { useEffect, useState } from 'react';
import { 
  Star, 
  Sparkles, 
  CheckCircle2, 
  MessageSquarePlus, 
  X, 
  Send, 
  ShieldCheck,
  Quote
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';

export function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({
    clientName: '',
    clientRole: '',
    serviceUsed: 'Web Development',
    rating: 5,
    review: '',
  });

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await api.getReviews();
        setReviews(data);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.clientName || !form.review) return;

    try {
      setSubmitting(true);
      await api.submitReview(form);
      setSuccessMsg('Your review and rating has been submitted successfully! Thank you for trusting ASX DIGITAL SOLUTIONS.');
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
      setForm({
        clientName: '',
        clientRole: '',
        serviceUsed: 'Web Development',
        rating: 5,
        review: '',
      });
      setTimeout(() => {
        setSuccessMsg('');
        setModalOpen(false);
      }, 3000);
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="relative py-24 bg-dark-900 border-t border-slate-900 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-72 bg-cyan-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Heading & Stat Overview */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-slate-800">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Client Testimonials</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              Trusted by Ambitious Brands Worldwide
            </h2>
            <p className="text-slate-400 text-base">
              See what global founders, CEOs, and product directors say about their engineering journey with ASX DIGITAL SOLUTIONS.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Aggregate Score Card */}
            <div className="p-4 rounded-2xl glass-panel border border-cyan-500/30 flex items-center space-x-4">
              <div className="font-display font-black text-4xl text-white">
                5.0
              </div>
              <div>
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">
                  100% Positive Client Rating
                </div>
              </div>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-3.5 rounded-xl text-xs font-bold text-dark-950 bg-gradient-to-r from-asx-cyan to-indigo-400 hover:shadow-glow-cyan transition-all flex items-center space-x-2"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Leave Your Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-2xl glass-card p-8 border border-slate-800 flex flex-col justify-between relative group hover:border-cyan-500/40"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  {/* Star Rating */}
                  <div className="flex items-center space-x-1 text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-800">
                    {rev.serviceUsed}
                  </span>
                </div>

                <Quote className="w-8 h-8 text-cyan-500/30 mb-2" />

                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "{rev.review}"
                </p>
              </div>

              {/* Client Info */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={rev.avatar}
                    alt={rev.clientName}
                    className="w-11 h-11 rounded-full object-cover border border-slate-700 bg-slate-800"
                  />
                  <div>
                    <h4 className="font-display font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                      {rev.clientName}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {rev.clientRole}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-[11px] text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Client</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Submit Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl glass-panel p-6 sm:p-8 border border-cyan-500/30 shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 mb-6">
              <h3 className="font-display font-black text-2xl text-white">
                Rate ASX DIGITAL SOLUTIONS
              </h3>
              <p className="text-xs text-slate-400">
                Your feedback empowers us to continuously engineer high-standard digital products.
              </p>
            </div>

            {successMsg ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-sm flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Rating Stars Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Your Rating (1 to 5 Stars):
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setForm({ ...form, rating: star })}
                        className="p-1 focus:outline-none transition-transform hover:scale-125"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= form.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm font-bold text-amber-400 pl-2">
                      {form.rating} / 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Your Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                    placeholder="e.g. Marcus Sterling"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Your Role & Company:
                  </label>
                  <input
                    type="text"
                    required
                    value={form.clientRole}
                    onChange={(e) => setForm({ ...form, clientRole: e.target.value })}
                    placeholder="e.g. CEO at Sterling Logistics UK"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Service Rendered:
                  </label>
                  <select
                    value={form.serviceUsed}
                    onChange={(e) => setForm({ ...form, serviceUsed: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm bg-dark-900"
                  >
                    <option value="Web Development">Web Development (MERN Stack)</option>
                    <option value="App Development">Mobile App Development</option>
                    <option value="Web & UI/UX Design">Web & UI/UX Design</option>
                    <option value="Shopify & E-Commerce">Shopify & E-Commerce</option>
                    <option value="Video Editing & Motion Graphics">Video Editing & Motion Graphics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Your Feedback / Review:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.review}
                    onChange={(e) => setForm({ ...form, review: e.target.value })}
                    placeholder="How was your experience working with ASX DIGITAL SOLUTIONS? Describe the quality, speed, and results..."
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-dark-950 bg-gradient-to-r from-asx-cyan to-indigo-400 hover:shadow-glow-cyan transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Submitting...' : 'Submit Verified Feedback'}</span>
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
