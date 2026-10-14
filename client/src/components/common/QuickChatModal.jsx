import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';

export function QuickChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    try {
      setSending(true);
      await api.submitMessage({
        name: form.name,
        email: form.email,
        message: form.message,
        subject: 'Quick Website Chat Inquiry',
        service: 'General Inquiry',
      });
      setSent(true);
      confetti({ particleCount: 50, spread: 50 });
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => {
        setSent(false);
        setIsOpen(false);
      }, 3000);
    } catch (err) {
      alert(err.message || 'Failed to send quick message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-asx-cyan to-indigo-500 text-dark-950 font-bold text-xs shadow-glow-cyan hover:scale-105 transition-all group"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 fill-dark-950" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span>Chat with ASX</span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 rounded-2xl glass-panel p-5 border border-cyan-500/40 shadow-2xl animate-fade-in">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <h4 className="font-display font-bold text-sm text-white">
                  ASX Live Inquiry Desk
                </h4>
                <p className="text-[10px] text-slate-400">Online & Ready to Help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {sent ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-xs font-semibold text-white">Message Dispatched!</p>
              <p className="text-[11px] text-slate-400">Our duty officer will reply to your email shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-3 pt-3">
              <div>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Your Email"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>
              <div>
                <textarea
                  rows={3}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can ASX DIGITAL SOLUTIONS help you today?..."
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-dark-950 bg-gradient-to-r from-asx-cyan to-indigo-400 hover:shadow-glow-cyan transition-all flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{sending ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          )}

        </div>
      )}
    </div>
  );
}
