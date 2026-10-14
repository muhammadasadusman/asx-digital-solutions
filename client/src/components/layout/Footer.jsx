import React from 'react';
import { Terminal, Mail, Phone, MapPin, Globe, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';

export function Footer({ onOpenQuote, onOpenLogin }) {
  return (
    <footer className="relative bg-dark-900 border-t border-slate-800/80 pt-16 pb-12 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-cyan-500/10 to-transparent blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[2px]">
                <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-asx-cyan" />
                </div>
              </div>
              <div>
                <span className="font-display font-black text-xl tracking-tight text-white">
                  ASX DIGITAL <span className="text-asx-cyan font-semibold">SOLUTIONS</span>
                </span>
                <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                  Engineering Digital Dominance
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              We engineer high-performance web applications, scalable mobile apps, conversion-driven Shopify stores, cinematic video productions, and bespoke UI/UX designs for disruptive brands worldwide.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
                ⚡ MERN Stack
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
                📱 React Native & Flutter
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
                🛍️ Shopify Plus
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
                🎬 4K Motion & VFX
              </span>
            </div>
          </div>

          {/* Core Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#services" className="hover:text-asx-cyan transition-colors">Web Development (MERN)</a></li>
              <li><a href="#services" className="hover:text-asx-cyan transition-colors">Mobile App Development</a></li>
              <li><a href="#services" className="hover:text-asx-cyan transition-colors">Web & UI/UX Design</a></li>
              <li><a href="#services" className="hover:text-asx-cyan transition-colors">Video Editing & 3D Motion</a></li>
              <li><a href="#services" className="hover:text-asx-cyan transition-colors">Shopify & E-Commerce</a></li>
              <li><a href="#services" className="hover:text-asx-cyan transition-colors">Cloud APIs & Integrations</a></li>
            </ul>
          </div>

          {/* Quick Access */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Company & Portal
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#portfolio" className="hover:text-asx-cyan transition-colors">Case Studies & Work</a></li>
              <li><a href="#team" className="hover:text-asx-cyan transition-colors">Verified Team & Experts</a></li>
              <li><a href="#reviews" className="hover:text-asx-cyan transition-colors">Client Testimonials</a></li>
              <li><a href="#billing" className="hover:text-asx-cyan transition-colors">Online Billing & Invoices</a></li>
              <li>
                <button 
                  onClick={onOpenLogin}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin / Staff Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-asx-cyan shrink-0" />
                <span className="text-slate-300">contact@asxdigital.com</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">+92 300 8492019 / +1 (555) ASX-TECH</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-slate-300">Lahore / Islamabad & Global Remote</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={onOpenQuote}
                  className="w-full text-xs font-bold py-2 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center space-x-1 transition-all"
                >
                  <span>Request Instant Consultation</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Accepted Payment Channels Banner */}
        <div className="py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 border-b border-slate-800/60">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              Verified Payment Partners:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/80 text-slate-300 font-mono text-[11px]">
              🏦 Bank Transfer (IBAN)
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-700/50 text-emerald-300 font-semibold text-[11px]">
              🟢 Easypaisa
            </span>
            <span className="px-2.5 py-1 rounded bg-red-950/40 border border-red-700/50 text-red-300 font-semibold text-[11px]">
              🔴 JazzCash
            </span>
            <span className="px-2.5 py-1 rounded bg-blue-950/40 border border-blue-700/50 text-blue-300 font-semibold text-[11px]">
              💳 Visa / Mastercard
            </span>
            <span className="px-2.5 py-1 rounded bg-amber-950/40 border border-amber-700/50 text-amber-300 font-semibold text-[11px]">
              🅿️ Payoneer
            </span>
            <span className="px-2.5 py-1 rounded bg-indigo-950/40 border border-indigo-700/50 text-indigo-300 font-semibold text-[11px]">
              🌐 PayPal
            </span>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} ASX DIGITAL SOLUTIONS. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Engineered with excellence for global innovators</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
