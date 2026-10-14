import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Services } from './components/sections/Services';
import { Portfolio } from './components/sections/Portfolio';
import { Team } from './components/sections/Team';
import { Reviews } from './components/sections/Reviews';
import { Billing } from './components/sections/Billing';
import { Contact } from './components/sections/Contact';
import { QuickChatModal } from './components/common/QuickChatModal';
import { LoginModal } from './components/auth/LoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

function MainApp() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedService, setSelectedService] = useState('Full-Stack Web Development');
  const { isAuthenticated } = useAuth();

  const handleOpenQuote = (serviceName) => {
    if (serviceName && typeof serviceName === 'string') {
      setSelectedService(serviceName);
    }
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleDashboard = (val) => {
    if (val && !isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setShowDashboard(val);
  };

  if (showDashboard && isAuthenticated) {
    return <AdminDashboard onClose={() => setShowDashboard(false)} />;
  }

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-dark-950">
      
      {/* Navbar */}
      <Navbar
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenQuote={() => handleOpenQuote()}
        onToggleDashboard={handleToggleDashboard}
        showDashboard={showDashboard}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero
          onOpenQuote={() => handleOpenQuote()}
          onSelectService={(srv) => handleOpenQuote(srv)}
        />

        <Services
          onSelectService={(srv) => handleOpenQuote(srv)}
        />

        <Portfolio
          onOpenQuote={(projectTitle) => handleOpenQuote(`Inquiry regarding ${projectTitle}`)}
        />

        <Team
          onOpenQuote={(target) => handleOpenQuote(target)}
          onToggleDashboard={handleToggleDashboard}
        />

        <Reviews />

        <Billing />

        <Contact
          selectedServiceDefault={selectedService}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenQuote={() => handleOpenQuote()}
        onOpenLogin={() => setShowLoginModal(true)}
      />

      {/* Floating Interactive Inquiries Chat Bubble */}
      <QuickChatModal />

      {/* Admin / Staff Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => setShowDashboard(true)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
