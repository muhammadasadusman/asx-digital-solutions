import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Code2, 
  Smartphone, 
  ShoppingBag, 
  Film, 
  Palette, 
  ShieldCheck, 
  CheckCircle2, 
  Layers
} from 'lucide-react';

export function Hero({ onOpenQuote, onSelectService }) {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-600/20 via-indigo-600/20 to-purple-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-72 h-72 bg-cyan-500/15 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Cyber grid overlay */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tag badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 shadow-glow-cyan text-xs font-semibold tracking-wide uppercase">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span>ASX DIGITAL SOLUTIONS • 2026 Innovation</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
              Architecting <span className="text-gradient-primary">Next-Gen Software</span>, Mobile Apps & High-Growth Brands
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              We empower modern businesses with cutting-edge <strong className="text-white font-semibold">MERN Stack Web Development</strong>, <strong className="text-white font-semibold">iOS & Android Apps</strong>, bespoke <strong className="text-white font-semibold">UI/UX Design</strong>, viral <strong className="text-white font-semibold">4K Video Editing</strong>, and high-converting <strong className="text-white font-semibold">Shopify Stores</strong>.
            </p>

            {/* Trust checkmarks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Enterprise MERN Architecture</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Specialist Team</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Secure Multi-Channel Billing</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
              <button
                onClick={onOpenQuote}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-dark-950 bg-gradient-to-r from-asx-cyan via-teal-300 to-indigo-400 hover:shadow-glow-cyan transition-all duration-300 active:scale-95 flex items-center justify-center space-x-2 group"
              >
                <span>Launch Your Project</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#services"
                className="w-full sm:w-auto px-7 py-4 rounded-xl font-semibold text-sm text-white glass-card hover:border-cyan-500/50 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Explore Services</span>
              </a>

              <a
                href="#billing"
                className="w-full sm:w-auto px-6 py-4 rounded-xl font-medium text-xs text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-center space-x-1.5"
              >
                <span>Pay Client Bill</span>
              </a>
            </div>

            {/* Agency Live Metrics Counter */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
              <div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                  150<span className="text-cyan-400">+</span>
                </div>
                <div className="text-xs text-slate-400 font-medium">Delivered Projects</div>
              </div>
              <div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-emerald-400">
                  99.4<span className="text-white">%</span>
                </div>
                <div className="text-xs text-slate-400 font-medium">Client Satisfaction</div>
              </div>
              <div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-indigo-400">
                  15<span className="text-white">+</span>
                </div>
                <div className="text-xs text-slate-400 font-medium">Senior Engineers</div>
              </div>
              <div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-asx-cyan">
                  24/7
                </div>
                <div className="text-xs text-slate-400 font-medium">SLA Support</div>
              </div>
            </div>

          </div>

          {/* Right Interactive Agency Feature Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-2xl glass-panel p-6 border border-cyan-500/20 shadow-2xl">
              
              {/* Header card indicator */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="text-[11px] font-mono text-slate-400 pl-2">asx-digital-engine.js</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800">
                  LIVE v2.4
                </span>
              </div>

              {/* Service Cards Showcase */}
              <div className="space-y-3 pt-5">
                
                <div 
                  onClick={() => onSelectService('Web Development')}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300">Web Development</h4>
                      <p className="text-[11px] text-slate-400">MERN Stack • Next.js • Cloud APIs</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 group-hover:translate-x-1 transition-transform">→</span>
                </div>

                <div 
                  onClick={() => onSelectService('App Development')}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300">Mobile App Development</h4>
                      <p className="text-[11px] text-slate-400">React Native • Flutter • iOS/Android</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-indigo-400 group-hover:translate-x-1 transition-transform">→</span>
                </div>

                <div 
                  onClick={() => onSelectService('Web & UI/UX Design')}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                      <Palette className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-purple-300">Web & UI/UX Design</h4>
                      <p className="text-[11px] text-slate-400">Figma • Interactive Systems • Brand</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
                </div>

                <div 
                  onClick={() => onSelectService('Shopify & E-Commerce')}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-300">Shopify & E-Commerce</h4>
                      <p className="text-[11px] text-slate-400">Shopify 2.0 • CRO • Payment Integrations</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
                </div>

                <div 
                  onClick={() => onSelectService('Video Editing & Motion Graphics')}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
                      <Film className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-rose-300">Video Editing & 3D Motion</h4>
                      <p className="text-[11px] text-slate-400">Cinematic Ads • 3D VFX • Viral Reels</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-rose-400 group-hover:translate-x-1 transition-transform">→</span>
                </div>

              </div>

              {/* Verified Badge footer inside card */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Full-Stack Quality Guaranteed</span>
                </div>
                <span className="text-cyan-400 font-medium">ASX SOLUTIONS</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
