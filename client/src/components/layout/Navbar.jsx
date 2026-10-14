import React, { useState } from 'react';
import { 
  Terminal, 
  Menu, 
  X, 
  ShieldCheck, 
  Sparkles, 
  CreditCard, 
  Users, 
  Briefcase, 
  MessageSquare,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Navbar({ onOpenLogin, onOpenQuote, onToggleDashboard, showDashboard }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: 'Services', href: '#services', icon: Sparkles },
    { name: 'Portfolio', href: '#portfolio', icon: Briefcase },
    { name: 'Team', href: '#team', icon: Users },
    { name: 'Client Reviews', href: '#reviews', icon: UserCheck },
    { name: 'Billing & Pay', href: '#billing', icon: CreditCard },
    { name: 'Contact Us', href: '#contact', icon: MessageSquare },
  ];

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    if (showDashboard) {
      onToggleDashboard(false);
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => { onToggleDashboard(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[2px] shadow-glow-cyan group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
                <Terminal className="w-6 h-6 text-asx-cyan group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-extrabold text-xl tracking-tight text-white group-hover:text-asx-cyan transition-colors">
                  ASX DIGITAL
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  SOLUTIONS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Enterprise Tech & Creative Studio
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all duration-200"
                >
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-asx-cyan" />
                  <span>{link.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Actions & Admin Button */}
          <div className="hidden sm:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onToggleDashboard(!showDashboard)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                    showDashboard
                      ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-glow-cyan'
                      : 'bg-slate-800/90 hover:bg-slate-700/90 border-slate-700 text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>{showDashboard ? 'Back to Website' : 'Admin Dashboard'}</span>
                </button>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700/80 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all duration-200"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Portal Login</span>
              </button>
            )}

            <button
              onClick={onOpenQuote}
              className="relative group overflow-hidden px-5 py-2.5 rounded-xl font-semibold text-sm text-dark-950 bg-gradient-to-r from-asx-cyan via-teal-300 to-indigo-400 hover:shadow-glow-cyan transition-all duration-300 active:scale-95"
            >
              <span className="relative z-10 flex items-center space-x-1.5 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Get a Quote</span>
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 bg-dark-900/95 border-b border-slate-800 backdrop-blur-2xl">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className="block px-4 py-3 rounded-xl text-base font-medium text-slate-200 hover:bg-slate-800/80 hover:text-asx-cyan transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col space-y-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onToggleDashboard(!showDashboard);
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>{showDashboard ? 'Back to Website' : 'Open Admin Dashboard'}</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-red-500/10 text-red-400 font-medium border border-red-500/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout ({user?.name})</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full py-3 rounded-xl bg-slate-800 text-slate-200 font-semibold border border-slate-700"
              >
                Admin / Staff Portal Login
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-asx-cyan to-indigo-500 text-dark-950 font-bold shadow-glow-cyan"
            >
              Get Free Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
