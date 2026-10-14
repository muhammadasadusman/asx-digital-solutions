const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { collections } = require('../config/db');

async function seedData() {
  const salt = await bcrypt.genSalt(10);
  const adminHashedPassword = await bcrypt.hash('Admin@ASX2026', salt);
  const managerHashedPassword = await bcrypt.hash('Manager@ASX2026', salt);

  // 1. Initial Users (Admin & Sub-admin/Manager)
  if (!fs.existsSync(collections.users) || JSON.parse(fs.readFileSync(collections.users, 'utf8')).length === 0) {
    const initialUsers = [
      {
        id: 'usr_superadmin_01',
        name: 'ASX Super Admin',
        email: 'admin@asxdigital.com',
        password: adminHashedPassword,
        role: 'superadmin',
        title: 'Founder & Head of Operations',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        permissions: {
          can_manage_services: true,
          can_manage_portfolio: true,
          can_manage_team: true,
          can_manage_reviews: true,
          can_manage_messages: true,
          can_manage_billing: true,
          can_manage_users: true,
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr_manager_02',
        name: 'Hamza Malik',
        email: 'manager@asxdigital.com',
        password: managerHashedPassword,
        role: 'manager',
        title: 'Senior Operations Lead',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        permissions: {
          can_manage_services: false,
          can_manage_portfolio: true,
          can_manage_team: false,
          can_manage_reviews: true,
          can_manage_messages: true,
          can_manage_billing: false,
          can_manage_users: false,
        },
        createdAt: new Date().toISOString(),
      },
    ];
    fs.writeFileSync(collections.users, JSON.stringify(initialUsers, null, 2));
  }

  // 2. Services
  if (!fs.existsSync(collections.services) || JSON.parse(fs.readFileSync(collections.services, 'utf8')).length === 0) {
    const initialServices = [
      {
        id: 'srv_1',
        title: 'Full-Stack Web Development',
        slug: 'web-development',
        icon: 'Code2',
        description: 'Scalable web applications engineered with MERN stack, Next.js, TypeScript, and modern cloud microservices.',
        features: [
          'Custom React & Next.js Frontends',
          'Robust Node.js / Express REST & GraphQL APIs',
          'High Performance Database Architecture (MongoDB, PostgreSQL)',
          'Secure Authentication & Role-Based Access Controls',
          'Cloud CI/CD & AWS/Vercel Deployment',
        ],
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Next.js', 'Tailwind CSS'],
        popular: true,
      },
      {
        id: 'srv_2',
        title: 'Mobile App Development',
        slug: 'app-development',
        icon: 'Smartphone',
        description: 'Cross-platform and native iOS & Android applications with fluid 60FPS animations, offline sync, and real-time features.',
        features: [
          'Cross-Platform iOS & Android apps (React Native / Flutter)',
          'Push Notifications & In-App Messaging',
          'Payment Gateway & In-App Purchases',
          'Biometric Security & Encrypted Local Storage',
          'App Store & Google Play Store Submission',
        ],
        technologies: ['React Native', 'Flutter', 'Firebase', 'Redux', 'Swift', 'Kotlin'],
        popular: true,
      },
      {
        id: 'srv_3',
        title: 'Web & UI/UX Design',
        slug: 'web-design',
        icon: 'Palette',
        description: 'Data-driven UI/UX design, interactive prototypes, and design systems crafted for high conversion and unforgettable brand experience.',
        features: [
          'High-Fidelity Figma Prototypes & Wireframing',
          'Comprehensive Design Systems & Component Libraries',
          'Mobile-First & Responsive UX Architecture',
          'User Journey Mapping & Usability Testing',
          'Micro-Interactions & Motion Design',
        ],
        technologies: ['Figma', 'Adobe XD', 'Illustrator', 'Tailwind', 'Framing'],
        popular: false,
      },
      {
        id: 'srv_4',
        title: 'Video Editing & Motion Graphics',
        slug: 'video-editing',
        icon: 'Film',
        description: 'High-impact promotional videos, social reels, 3D motion graphics, and cinematic commercial editing that captivates audiences.',
        features: [
          'Cinematic Commercials & Brand Storytelling',
          'Viral Short-Form Content (Reels, TikTok, YouTube Shorts)',
          '3D Motion Graphics & Visual Effects (VFX)',
          'Color Grading, Sound Design & Audio Mastering',
          'Product Showcase & Explainer Animations',
        ],
        technologies: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Blender', 'Cinema 4D'],
        popular: false,
      },
      {
        id: 'srv_5',
        title: 'Shopify & E-Commerce Solutions',
        slug: 'shopify-ecommerce',
        icon: 'ShoppingBag',
        description: 'High-converting custom Shopify stores, headless e-commerce, automated fulfillment workflows, and payment gateway setups.',
        features: [
          'Bespoke Shopify Liquid Theme Development',
          'Conversion Rate Optimization (CRO) & Upsell Funnels',
          'Payment Gateway Integration (Stripe, JazzCash, Easypaisa, PayPal)',
          'Inventory & Shipping ERP Sync',
          'Speed Optimization (Sub-2s page load)',
        ],
        technologies: ['Shopify Liquid', 'Headless React', 'Stripe', 'PayPal', 'Klaviyo'],
        popular: true,
      },
    ];
    fs.writeFileSync(collections.services, JSON.stringify(initialServices, null, 2));
  }

  // 3. Portfolio Projects
  if (!fs.existsSync(collections.portfolio) || JSON.parse(fs.readFileSync(collections.portfolio, 'utf8')).length === 0) {
    const initialPortfolio = [
      {
        id: 'port_1',
        title: 'ApexFlow - Cloud ERP & Logistics Platform',
        category: 'Web Development',
        client: 'Apex Global Logistics UK',
        year: '2026',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80',
        description: 'Enterprise resource planning platform handling 50k+ daily freight shipments, real-time GPS fleet tracking, and automated client invoicing.',
        tags: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Tailwind'],
        liveUrl: 'https://asxdigital.com/demos/apexflow',
        featured: true,
      },
      {
        id: 'port_2',
        title: 'VoltPulse - Smart EV Charging Mobile App',
        category: 'App Development',
        client: 'VoltPulse Mobility UAE',
        year: '2026',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&auto=format&fit=crop&q=80',
        description: 'React Native iOS & Android application allowing electric vehicle drivers to reserve charging spots, monitor charging telemetry, and pay seamlessly.',
        tags: ['React Native', 'TypeScript', 'Node.js', 'Stripe Gateway'],
        liveUrl: 'https://asxdigital.com/demos/voltpulse',
        featured: true,
      },
      {
        id: 'port_3',
        title: 'Aura Luxe - Haute Horlogerie Shopify Experience',
        category: 'Shopify & E-Commerce',
        client: 'Aura Swiss Timepieces',
        year: '2026',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80',
        description: 'Custom Shopify 2.0 store with 3D product visualizer, multi-currency checkout, and integrated international payment gateways.',
        tags: ['Shopify Liquid', 'Three.js', 'Tailwind', 'Stripe', 'PayPal'],
        liveUrl: 'https://asxdigital.com/demos/auraluxe',
        featured: true,
      },
      {
        id: 'port_4',
        title: 'CyberMatrix Brand Identity & UI/UX System',
        category: 'Web & UI/UX Design',
        client: 'CyberMatrix AI Labs',
        year: '2026',
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=900&auto=format&fit=crop&q=80',
        description: 'Complete UI/UX design overhaul, 150+ component design system in Figma, and interactive micro-animations for an AI cybersecurity company.',
        tags: ['Figma', 'UI/UX', 'Design System', 'Prototyping'],
        liveUrl: 'https://asxdigital.com/demos/cybermatrix',
        featured: true,
      },
      {
        id: 'port_5',
        title: 'HyperMotion 3D Tech Commercial & Reels Campaign',
        category: 'Video Editing & Motion Graphics',
        client: 'HyperPulse Audio USA',
        year: '2026',
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=900&auto=format&fit=crop&q=80',
        description: 'High-energy 4K product launch video featuring 3D product renders, dynamic particle effects, and viral sound design generating 1.2M+ views.',
        tags: ['After Effects', 'Premiere Pro', 'Blender', 'Sound Design'],
        liveUrl: 'https://asxdigital.com/demos/hypermotion',
        featured: false,
      },
      {
        id: 'port_6',
        title: 'MediCare Pulse - Telehealth Portal & Clinic Booking',
        category: 'Web Development',
        client: 'MediCare Health Group',
        year: '2026',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&auto=format&fit=crop&q=80',
        description: 'Full-stack patient booking management system with video consultations, encrypted medical records, and digital payment receipts.',
        tags: ['React', 'Express', 'MongoDB', 'WebRTC', 'Tailwind'],
        liveUrl: 'https://asxdigital.com/demos/medicare',
        featured: false,
      },
    ];
    fs.writeFileSync(collections.portfolio, JSON.stringify(initialPortfolio, null, 2));
  }

  // 4. Team & Employees
  if (!fs.existsSync(collections.team) || JSON.parse(fs.readFileSync(collections.team, 'utf8')).length === 0) {
    const initialTeam = [
      {
        id: 'team_1',
        name: 'Ali Raza',
        role: 'Chief Technology Officer (CTO)',
        department: 'Engineering',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        bio: 'Full-stack software architect with 8+ years leading enterprise web and cloud systems.',
        skills: ['MERN Stack', 'System Architecture', 'Cloud Infrastructure', 'Next.js'],
        email: 'ali.raza@asxdigital.com',
        portfolioItems: ['ApexFlow ERP', 'MediCare Pulse'],
        verified: true,
      },
      {
        id: 'team_2',
        name: 'Zainab Fatima',
        role: 'Lead UI/UX Designer & Art Director',
        department: 'Design',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
        bio: 'Award-winning digital product designer specializing in modern interfaces, design systems, and conversion-focused UX.',
        skills: ['Figma', 'Design Systems', 'Micro-Interactions', 'Prototyping'],
        email: 'zainab.f@asxdigital.com',
        portfolioItems: ['CyberMatrix Design System', 'Aura Luxe UI'],
        verified: true,
      },
      {
        id: 'team_3',
        name: 'Bilal Ahmed',
        role: 'Senior Mobile App Engineer',
        department: 'Mobile Development',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
        bio: 'React Native & Flutter specialist with over 20 published applications on App Store and Google Play.',
        skills: ['React Native', 'Flutter', 'iOS / Android Native', 'APIs'],
        email: 'bilal.ahmed@asxdigital.com',
        portfolioItems: ['VoltPulse EV App', 'FinTech Express Wallet'],
        verified: true,
      },
      {
        id: 'team_4',
        name: 'Danyal Siddiqui',
        role: 'Lead Video Editor & 3D Motion Artist',
        department: 'Creative & Media',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80',
        bio: 'Cinematic video editor and 3D motion animator delivering top-tier brand commercials and viral social content.',
        skills: ['After Effects', 'Premiere Pro', 'Cinema 4D', 'Sound Engineering'],
        email: 'danyal.s@asxdigital.com',
        portfolioItems: ['HyperMotion 3D Commercial', 'ASX Brand Showreel'],
        verified: true,
      },
      {
        id: 'team_5',
        name: 'Saad Farooq',
        role: 'Senior Shopify & E-Commerce Developer',
        department: 'E-Commerce',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
        bio: 'Shopify Plus developer experienced in high-volume stores, headless frontends, custom apps, and payment integrations.',
        skills: ['Shopify Liquid', 'Headless Commerce', 'Payment Gateways', 'CRO'],
        email: 'saad.farooq@asxdigital.com',
        portfolioItems: ['Aura Luxe Store', 'UrbanStyle Fashion App'],
        verified: true,
      },
    ];
    fs.writeFileSync(collections.team, JSON.stringify(initialTeam, null, 2));
  }

  // 5. Client Reviews & Ratings
  if (!fs.existsSync(collections.reviews) || JSON.parse(fs.readFileSync(collections.reviews, 'utf8')).length === 0) {
    const initialReviews = [
      {
        id: 'rev_1',
        clientName: 'Marcus Sterling',
        clientRole: 'CEO at Sterling Logistics (UK)',
        rating: 5,
        review: 'ASX DIGITAL SOLUTIONS completely transformed our freight operations. Their full-stack MERN platform automated 80% of our manual dispatches. Flawless communication, modern code quality, and on-time delivery!',
        serviceUsed: 'Web Development',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
        date: '2026-03-12',
        status: 'approved',
        featured: true,
      },
      {
        id: 'rev_2',
        clientName: 'Elena Rostova',
        clientRole: 'Founder, Aura Timepieces (Dubai)',
        rating: 5,
        review: 'Our custom Shopify store built by ASX achieved a 38% increase in conversion rate within the first month. The 3D product view and seamless payment gateway setup were pure art. Highly recommended!',
        serviceUsed: 'Shopify & E-Commerce',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        date: '2026-03-28',
        status: 'approved',
        featured: true,
      },
      {
        id: 'rev_3',
        clientName: 'Khurram Shehzad',
        clientRole: 'Managing Director, CyberMatrix Labs',
        rating: 5,
        review: 'Zainab and the ASX design team created a futuristic, ultra-clean UI/UX that made our complex cybersecurity SaaS easy to navigate. Their attention to animations and micro-interactions is world class.',
        serviceUsed: 'Web & UI/UX Design',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
        date: '2026-04-02',
        status: 'approved',
        featured: true,
      },
      {
        id: 'rev_4',
        clientName: 'David Chen',
        clientRole: 'VP Product, HyperPulse Audio (California)',
        rating: 5,
        review: 'The commercial video edited by ASX DIGITAL blew our expectations away! 3D animation, sound design, and color grading were Hollywood-grade. Our Kickstarter hit 250% funded in 48 hours.',
        serviceUsed: 'Video Editing & Motion Graphics',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
        date: '2026-04-05',
        status: 'approved',
        featured: true,
      },
    ];
    fs.writeFileSync(collections.reviews, JSON.stringify(initialReviews, null, 2));
  }

  // 6. Billing Accounts & Payment Gateways
  if (!fs.existsSync(collections.billing) || !fs.readFileSync(collections.billing, 'utf8').trim()) {
    const initialBilling = {
      bankAccount: {
        enabled: true,
        bankName: 'Meezan Bank Limited / Standard Chartered',
        accountTitle: 'ASX DIGITAL SOLUTIONS (PVT) LTD',
        accountNumber: '02010108927891',
        iban: 'PK45MEZN0002010108927891',
        swiftCode: 'MEZNPKKAXXX',
        branch: 'Digital Corporate Branch, Main Boulevard',
        instructions: 'Please include your Invoice # or Project ID in the transaction reference.',
      },
      easypaisa: {
        enabled: true,
        accountTitle: 'ASX DIGITAL SOLUTIONS - ACCOUNTS',
        mobileNumber: '0300-8492019',
        instructions: 'Send via Easypaisa App or Agent and upload the transaction screenshot or Txn ID below.',
      },
      jazzCash: {
        enabled: true,
        accountTitle: 'ASX DIGITAL SOLUTIONS PVT',
        mobileNumber: '0301-7654321',
        instructions: 'Transfer to JazzCash Wallet and save the 11-digit TID for instant invoice confirmation.',
      },
      cardPayment: {
        enabled: true,
        gatewayName: 'ASX Secure Card Checkout (Visa / Mastercard)',
        supportCurrencies: ['USD', 'PKR', 'AED', 'GBP', 'EUR'],
        feePercent: 0,
        instructions: 'Instant automatic payment processing with 256-bit SSL encryption and instant invoice receipt.',
      },
      payoneer: {
        enabled: true,
        accountEmail: 'billing@asxdigital.com',
        accountTitle: 'ASX Digital Solutions LLC',
        receivingAccounts: 'USD, EUR, GBP supported via Payoneer In-Network Transfer (0% fee).',
        instructions: 'Send payment to our Payoneer email or request a direct Payoneer payment link from your account manager.',
      },
      paypal: {
        enabled: true,
        accountEmail: 'payments@asxdigital.com',
        paypalMeLink: 'https://paypal.me/asxdigitalsolutions',
        instructions: 'For international clients. Direct credit card or PayPal balance transfer accepted.',
      },
    };
    fs.writeFileSync(collections.billing, JSON.stringify(initialBilling, null, 2));
  }

  // 7. Initial Invoices
  if (!fs.existsSync(collections.invoices) || JSON.parse(fs.readFileSync(collections.invoices, 'utf8')).length === 0) {
    const initialInvoices = [
      {
        id: 'inv_1',
        invoiceNumber: 'ASX-2026-001',
        clientName: 'Apex Global Logistics UK',
        clientEmail: 'billing@apexlogistics.co.uk',
        projectName: 'Enterprise Logistics ERP & Fleet Portal',
        service: 'Web Development',
        amount: 3200,
        currency: 'USD',
        status: 'Paid',
        dueDate: '2026-04-15',
        paymentMethod: 'Bank Transfer',
        items: [
          { description: 'Phase 1: React Dashboard & Core API Integration', amount: 1800 },
          { description: 'Phase 2: GPS Telemetry, Cloud DB & Socket.io Live Sync', amount: 1400 },
        ],
        createdAt: '2026-03-25T10:00:00Z',
      },
      {
        id: 'inv_2',
        invoiceNumber: 'ASX-2026-002',
        clientName: 'Aura Swiss Timepieces',
        clientEmail: 'elena@aurawatches.ch',
        projectName: 'Custom Shopify 2.0 Luxe Store Development',
        service: 'Shopify & E-Commerce',
        amount: 2400,
        currency: 'USD',
        status: 'Unpaid',
        dueDate: '2026-04-20',
        paymentMethod: 'Pending',
        items: [
          { description: 'Shopify Liquid Custom Theme Development & 3D Viewer', amount: 1600 },
          { description: 'Payment Gateways & Multi-currency Checkout Setup', amount: 800 },
        ],
        createdAt: '2026-04-01T12:00:00Z',
      },
      {
        id: 'inv_3',
        invoiceNumber: 'ASX-PK-809',
        clientName: 'TechVibe PK',
        clientEmail: 'contact@techvibepk.com',
        projectName: 'Commercial Promo Video & Motion Graphics Package',
        service: 'Video Editing & Motion Graphics',
        amount: 145000,
        currency: 'PKR',
        status: 'Unpaid',
        dueDate: '2026-04-25',
        paymentMethod: 'Pending',
        items: [
          { description: '4K Commercial Video Editing & 3D Motion Graphics', amount: 105000 },
          { description: 'Sound Design & 10 Social Media Viral Reels Pack', amount: 40000 },
        ],
        createdAt: '2026-04-08T09:30:00Z',
      },
    ];
    fs.writeFileSync(collections.invoices, JSON.stringify(initialInvoices, null, 2));
  }

  // 8. Contact Inquiries & Messages
  if (!fs.existsSync(collections.messages) || JSON.parse(fs.readFileSync(collections.messages, 'utf8')).length === 0) {
    const initialMessages = [
      {
        id: 'msg_1',
        name: 'Zeeshan Tariq',
        email: 'zeeshan@primeventures.pk',
        phone: '+92 321 4455667',
        service: 'Web Development',
        budget: '$2,500 - $5,000',
        timeline: '1-2 Months',
        subject: 'Custom Real Estate Portal with CRM and Map Integration',
        message: 'AOA, we need a complete MERN stack web portal for our real estate firm in Islamabad. We love your agency designs and want to discuss project timeline and quotation.',
        status: 'New',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'msg_2',
        name: 'Sophie Laurent',
        email: 'sophie@fashionavenue.fr',
        phone: '+33 6 12 34 56 78',
        service: 'Shopify & E-Commerce',
        budget: '$5,000+',
        timeline: 'Immediate',
        subject: 'Shopify Store Redesign & Global Payment Setup',
        message: 'Hello ASX team! We want to migrate our existing boutique store to a high speed custom Shopify 2.0 store with PayPal and Stripe. Can we arrange a consultation call this week?',
        status: 'In Progress',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
    fs.writeFileSync(collections.messages, JSON.stringify(initialMessages, null, 2));
  }

  console.log('✅ ASX DIGITAL SOLUTIONS database successfully initialized and seeded.');
}

module.exports = { seedData };
