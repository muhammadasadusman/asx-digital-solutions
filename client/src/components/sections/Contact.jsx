import React, { useState } from 'react';
import { 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  Calendar, 
  Clock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';

export function Contact({ selectedServiceDefault }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: selectedServiceDefault || 'Full-Stack Web Development',
    budget: '$2,500 - $5,000',
    timeline: 'Within 1 Month',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    try {
      setSubmitting(true);
      const res = await api.submitMessage(form);
      setSuccessMsg(res.message || 'Inquiry received successfully! Our team will contact you within 2 hours.');
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
      setForm({
        name: '',
        email: '',
        phone: '',
        service: 'Full-Stack Web Development',
        budget: '$2,500 - $5,000',
        timeline: 'Within 1 Month',
        subject: '',
        message: '',
      });
      setTimeout(() => setSuccessMsg(''), 6000);
    } catch (err) {
      alert(err.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 bg-dark-900 border-t border-slate-900 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Interactive Inquiry & Consultation Hub</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            Let's Engineer Something Extraordinary
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Have a project in mind or need expert consultation? Send us your requirements and receive a comprehensive proposal within 24 hours.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Contact Information */}
          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-2xl glass-panel p-8 border border-slate-800 space-y-6">
              <h3 className="font-display font-bold text-xl text-white">
                Contact ASX Headquarters
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                We work across timezones with clients in the US, UK, UAE, Europe, and Pakistan. Our engineering squad is ready to deploy.
              </p>

              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">Official Inquiries:</span>
                    <a href="mailto:contact@asxdigital.com" className="text-white hover:text-cyan-400 font-medium">
                      contact@asxdigital.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">Phone / WhatsApp Support:</span>
                    <a href="tel:+923008492019" className="text-white hover:text-emerald-400 font-medium font-mono">
                      +92 300 8492019
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">Locations:</span>
                    <span className="text-white font-medium">
                      Pakistan (Lahore, Islamabad) & Global Cloud Operations
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">Working Hours:</span>
                    <span className="text-white font-medium">
                      Monday - Saturday: 9:00 AM - 10:00 PM PKT (24/7 SLA for Active Retainers)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Action */}
            <a
              href="https://wa.me/923008492019?text=Hello%20ASX%20DIGITAL%20SOLUTIONS%2C%20I%20would%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-emerald-500 text-dark-950">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm group-hover:text-emerald-300">
                      Direct WhatsApp Live Chat
                    </h4>
                    <p className="text-xs text-slate-400">Average response time: &lt; 15 mins</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>

          {/* Right Consultation Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl glass-panel p-8 border border-cyan-500/20 shadow-2xl">
              
              <div className="pb-6 border-b border-slate-800 mb-6">
                <h3 className="font-display font-extrabold text-2xl text-white">
                  Send Project Proposal Request
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  All messages are routed directly to our admin team and engineering leads.
                </p>
              </div>

              {successMsg && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-sm flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Asad Khan"
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. asad@company.com"
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider block mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+92 300 1234567"
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider block mb-1">
                      Service Required *
                    </label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm bg-dark-900"
                    >
                      <option value="Full-Stack Web Development">Full-Stack Web Development (MERN)</option>
                      <option value="Mobile App Development">Mobile App Development (iOS & Android)</option>
                      <option value="Web & UI/UX Design">Web & UI/UX Design (Figma)</option>
                      <option value="Shopify & E-Commerce">Shopify & E-Commerce Solutions</option>
                      <option value="Video Editing & Motion Graphics">Video Editing & Motion Graphics</option>
                      <option value="Custom Enterprise Solution">Custom Enterprise Solution</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider block mb-1">
                      Estimated Budget
                    </label>
                    <select
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm bg-dark-900"
                    >
                      <option value="Under $1,000 / PKR 250,000">Under $1,000 / PKR 250,000</option>
                      <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                      <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                      <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                      <option value="$10,000+ (Enterprise)">$10,000+ (Enterprise)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider block mb-1">
                      Target Timeline
                    </label>
                    <select
                      value={form.timeline}
                      onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm bg-dark-900"
                    >
                      <option value="Immediate (Urgent)">Immediate (Urgent)</option>
                      <option value="Within 2-4 Weeks">Within 2-4 Weeks</option>
                      <option value="1-2 Months">1-2 Months</option>
                      <option value="Flexible / Long Term">Flexible / Long Term</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider block mb-1">
                    Project Subject
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="e.g. MERN Stack E-Commerce Platform with Real-time Chat"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider block mb-1">
                    Project Details & Scope *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your project goals, key features, reference websites, or specific business problems..."
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider text-dark-950 bg-gradient-to-r from-asx-cyan via-teal-300 to-indigo-400 hover:shadow-glow-cyan transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Sending Request...' : 'Submit Inquiry to ASX DIGITAL'}</span>
                  </button>
                </div>

              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
