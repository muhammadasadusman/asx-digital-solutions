import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CreditCard, 
  Star, 
  MessageSquare, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  X, 
  Upload, 
  Eye, 
  Lock, 
  Unlock,
  AlertTriangle,
  FileText,
  DollarSign,
  Save,
  Check,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export function AdminDashboard({ onClose }) {
  const { user, hasPermission, logout } = useAuth();
  
  // Available tabs
  const [activeTab, setActiveTab] = useState('overview');

  // Overview stats
  const [stats, setStats] = useState({
    messagesCount: 0,
    invoicesCount: 0,
    teamCount: 0,
    portfolioCount: 0,
    reviewsCount: 0,
    unpaidInvoices: 0,
  });

  // Data states
  const [usersList, setUsersList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [portfolioList, setPortfolioList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [invoicesList, setInvoicesList] = useState([]);
  const [messagesList, setMessagesList] = useState([]);
  const [billingConfig, setBillingConfig] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  // Modals
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [editingPermissionsUser, setEditingPermissionsUser] = useState(null);

  // Forms
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'manager',
    title: 'Project Lead',
    permissions: {
      can_manage_services: false,
      can_manage_portfolio: true,
      can_manage_team: false,
      can_manage_reviews: true,
      can_manage_messages: true,
      can_manage_billing: false,
      can_manage_users: false,
    },
  });

  const [teamForm, setTeamForm] = useState({
    name: '',
    role: '',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    bio: '',
    skills: '',
    email: '',
    portfolioItems: '',
  });

  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Web Development',
    client: '',
    year: '2026',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80',
    description: '',
    tags: '',
    liveUrl: '',
    featured: true,
  });

  const [invoiceForm, setInvoiceForm] = useState({
    clientName: '',
    clientEmail: '',
    projectName: '',
    service: 'Web Development',
    amount: '',
    currency: 'USD',
    dueDate: '',
    customNotes: '',
  });

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Initial Data Fetch
  const refreshAllData = async () => {
    try {
      setLoading(true);
      const [teams, portfolio, reviews, billing, invoices, messages] = await Promise.all([
        api.getTeam().catch(() => []),
        api.getPortfolio().catch(() => []),
        api.getAllReviewsAdmin().catch(() => []),
        api.getBillingMethods().catch(() => null),
        api.getInvoices().catch(() => []),
        api.getMessages().catch(() => []),
      ]);

      setTeamList(teams);
      setPortfolioList(portfolio);
      setReviewsList(reviews);
      setBillingConfig(billing);
      setInvoicesList(invoices);
      setMessagesList(messages);

      if (user?.role === 'superadmin' || hasPermission('can_manage_users')) {
        const users = await api.getUsers().catch(() => []);
        setUsersList(users);
      }

      setStats({
        messagesCount: messages.length,
        invoicesCount: invoices.length,
        teamCount: teams.length,
        portfolioCount: portfolio.length,
        reviewsCount: reviews.length,
        unpaidInvoices: invoices.filter(i => i.status !== 'Paid').length,
      });
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const showToast = (msg) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(''), 4000);
  };

  // --- RBAC PERMISSIONS ACTIONS ---
  const handleSavePermissions = async () => {
    if (!editingPermissionsUser) return;
    try {
      await api.updatePermissions(editingPermissionsUser.id, {
        permissions: editingPermissionsUser.permissions,
        role: editingPermissionsUser.role,
        title: editingPermissionsUser.title,
      });
      showToast(`Permissions updated for ${editingPermissionsUser.name}!`);
      setEditingPermissionsUser(null);
      refreshAllData();
    } catch (err) {
      alert(err.message || 'Failed to update permissions');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.createUser(newUserForm);
      showToast(`Staff member ${newUserForm.name} added successfully!`);
      setShowAddUserModal(false);
      setNewUserForm({
        name: '',
        email: '',
        password: '',
        role: 'manager',
        title: 'Project Lead',
        permissions: {
          can_manage_services: false,
          can_manage_portfolio: true,
          can_manage_team: false,
          can_manage_reviews: true,
          can_manage_messages: true,
          can_manage_billing: false,
          can_manage_users: false,
        },
      });
      refreshAllData();
    } catch (err) {
      alert(err.message || 'Failed to create user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    try {
      await api.deleteUser(id);
      showToast('Staff user removed.');
      refreshAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- TEAM PROFILE ACTIONS ---
  const handleCreateTeamMember = async (e) => {
    e.preventDefault();
    try {
      await api.createTeamMember(teamForm);
      showToast(`Team profile for ${teamForm.name} saved!`);
      setShowAddTeamModal(false);
      setTeamForm({
        name: '',
        role: '',
        department: 'Engineering',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        bio: '',
        skills: '',
        email: '',
        portfolioItems: '',
      });
      refreshAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteTeamMember = async (id) => {
    if (!window.confirm('Delete this team member profile?')) return;
    try {
      await api.deleteTeamMember(id);
      showToast('Team member deleted.');
      refreshAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- PORTFOLIO ACTIONS ---
  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.createProject(projectForm);
      showToast(`Project "${projectForm.title}" added to portfolio!`);
      setShowAddProjectModal(false);
      setProjectForm({
        title: '',
        category: 'Web Development',
        client: '',
        year: '2026',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80',
        description: '',
        tags: '',
        liveUrl: '',
        featured: true,
      });
      refreshAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.deleteProject(id);
      showToast('Project deleted.');
      refreshAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- REVIEWS MODERATION ---
  const handleApproveReview = async (id) => {
    try {
      await api.updateReviewStatus(id, { status: 'approved' });
      showToast('Review approved and published to website!');
      refreshAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete review?')) return;
    try {
      await api.deleteReview(id);
      showToast('Review removed.');
      refreshAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- BILLING CONFIG & INVOICES ---
  const handleSaveBillingConfig = async (e) => {
    e.preventDefault();
    try {
      await api.updateBillingMethods(billingConfig);
      showToast('Payment account settings updated successfully!');
      refreshAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      await api.createInvoice(invoiceForm);
      showToast('Client invoice generated!');
      setShowAddInvoiceModal(false);
      setInvoiceForm({
        clientName: '',
        clientEmail: '',
        projectName: '',
        service: 'Web Development',
        amount: '',
        currency: 'USD',
        dueDate: '',
        customNotes: '',
      });
      refreshAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateInvoiceStatus = async (id, status) => {
    try {
      await api.updateInvoice(id, { status });
      showToast(`Invoice marked as ${status}!`);
      refreshAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- MESSAGES / INQUIRIES ---
  const handleUpdateMessageStatus = async (id, status, note) => {
    try {
      await api.updateMessageStatus(id, { status, replyNote: note });
      showToast('Inquiry status updated!');
      setReplyText('');
      refreshAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  // File Upload Helper
  const handleFileUpload = async (e, targetField, setter) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      showToast('Uploading file...');
      const res = await api.uploadFile(file);
      setter(prev => ({ ...prev, [targetField]: res.url }));
      showToast('Image uploaded successfully!');
    } catch (err) {
      alert(err.message || 'File upload failed');
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Admin Header */}
      <div className="bg-dark-900 border-b border-slate-800 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[2px]">
            <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-display font-extrabold text-lg text-white">
                ASX DIGITAL SOLUTIONS
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                {user?.role === 'superadmin' ? 'SUPER ADMIN' : 'STAFF PORTAL'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Logged in as: <strong className="text-slate-200">{user?.name}</strong> ({user?.email})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={refreshAllData}
            title="Refresh Data"
            className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
          >
            Back to Public Site
          </button>

          <button
            onClick={logout}
            className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-800/60"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {actionMsg && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-cyan-950/90 border border-cyan-500 text-cyan-200 text-xs font-medium shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Main Admin Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 space-y-1.5 shrink-0">
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
              activeTab === 'overview'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-cyan-400" />
            <span>Overview & Metrics</span>
          </button>

          {/* RBAC Staff Tab (Superadmin or can_manage_users) */}
          {(user?.role === 'superadmin' || hasPermission('can_manage_users')) && (
            <button
              onClick={() => setActiveTab('rbac')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'rbac'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Staff & Permissions</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-950 text-purple-300 border border-purple-800">
                RBAC
              </span>
            </button>
          )}

          {/* Team Profiles Tab */}
          {(user?.role === 'superadmin' || hasPermission('can_manage_team')) && (
            <button
              onClick={() => setActiveTab('team')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'team'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Team & Portfolios</span>
              </div>
              <span className="text-[10px] text-slate-500">{teamList.length}</span>
            </button>
          )}

          {/* Portfolio Tab */}
          {(user?.role === 'superadmin' || hasPermission('can_manage_portfolio')) && (
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'portfolio'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                <span>Portfolio Manager</span>
              </div>
              <span className="text-[10px] text-slate-500">{portfolioList.length}</span>
            </button>
          )}

          {/* Billing & Invoices Tab */}
          {(user?.role === 'superadmin' || hasPermission('can_manage_billing')) && (
            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'billing'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <CreditCard className="w-4 h-4 text-indigo-400" />
                <span>Billing & Gateways</span>
              </div>
              {stats.unpaidInvoices > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-950 text-amber-300 border border-amber-800">
                  {stats.unpaidInvoices} due
                </span>
              )}
            </button>
          )}

          {/* Client Reviews Moderator */}
          {(user?.role === 'superadmin' || hasPermission('can_manage_reviews')) && (
            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'reviews'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Star className="w-4 h-4 text-amber-400" />
                <span>Reviews & Feedback</span>
              </div>
              <span className="text-[10px] text-slate-500">{reviewsList.length}</span>
            </button>
          )}

          {/* Messages & Inquiries Hub */}
          {(user?.role === 'superadmin' || hasPermission('can_manage_messages')) && (
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'messages'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-4 h-4 text-rose-400" />
                <span>Inquiries & Messages</span>
              </div>
              <span className="text-[10px] text-slate-500">{messagesList.length}</span>
            </button>
          )}

        </aside>

        {/* Content Panel */}
        <main className="flex-1 min-w-0">
          
          {/* TAB 1: OVERVIEW & METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="p-5 rounded-2xl glass-card border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Client Inquiries</span>
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="font-display font-extrabold text-2xl text-white">
                    {stats.messagesCount}
                  </div>
                  <span className="text-[11px] text-slate-500">Live consultation submissions</span>
                </div>

                <div className="p-5 rounded-2xl glass-card border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Client Invoices</span>
                    <CreditCard className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="font-display font-extrabold text-2xl text-white">
                    {stats.invoicesCount}
                  </div>
                  <span className="text-[11px] text-amber-400 font-medium">
                    {stats.unpaidInvoices} pending settlement
                  </span>
                </div>

                <div className="p-5 rounded-2xl glass-card border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Verified Specialists</span>
                    <Users className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-display font-extrabold text-2xl text-white">
                    {stats.teamCount}
                  </div>
                  <span className="text-[11px] text-slate-500">Admin-governed team</span>
                </div>

                <div className="p-5 rounded-2xl glass-card border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Portfolio Projects</span>
                    <Briefcase className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="font-display font-extrabold text-2xl text-white">
                    {stats.portfolioCount}
                  </div>
                  <span className="text-[11px] text-slate-500">Published flagship work</span>
                </div>

              </div>

              {/* Quick Actions & Welcome */}
              <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                  <h3 className="font-display font-extrabold text-lg text-white">
                    Welcome to ASX Administration Core
                  </h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                  You are managing <strong className="text-white">ASX DIGITAL SOLUTIONS</strong>. From this console, you can delegate granular permissions to other staff, edit online billing gateways (Bank, Easypaisa, JazzCash, Card, Payoneer, PayPal), approve client reviews, and manage team members and portfolio items.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('billing')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all"
                  >
                    Manage Payment Gateways
                  </button>
                  <button
                    onClick={() => setActiveTab('team')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all"
                  >
                    Add Team Member & Portfolio
                  </button>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 transition-all"
                  >
                    View Inquiries ({messagesList.length})
                  </button>
                </div>
              </div>

              {/* Recent Inquiries Snippet */}
              <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-white">
                    Latest Client Consultation Requests
                  </h4>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {messagesList.slice(0, 3).map((msg) => (
                    <div
                      key={msg.id}
                      className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-white">{msg.name} ({msg.email})</div>
                        <div className="text-slate-400">{msg.service} • Budget: {msg.budget}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-slate-800 text-cyan-300 border border-slate-700">
                        {msg.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: STAFF & ROLE-BASED ACCESS CONTROL (RBAC) */}
          {activeTab === 'rbac' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-display font-black text-2xl text-white">
                    Staff & Granular Permissions (RBAC)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Admin can create sub-admins or managers and grant specific permissions.
                  </p>
                </div>

                {user?.role === 'superadmin' && (
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-dark-950 bg-gradient-to-r from-asx-cyan to-indigo-400 hover:shadow-glow-cyan transition-all flex items-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Staff Member</span>
                  </button>
                )}
              </div>

              {/* Users List */}
              <div className="space-y-4">
                {usersList.map((usr) => (
                  <div
                    key={usr.id}
                    className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={usr.avatar}
                        alt={usr.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-white text-base">{usr.name}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            usr.role === 'superadmin'
                              ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                              : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                          }`}>
                            {usr.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{usr.email} • {usr.title}</p>
                      </div>
                    </div>

                    {/* Permissions summary */}
                    <div className="flex flex-wrap items-center gap-1.5 max-w-md">
                      {usr.role === 'superadmin' ? (
                        <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800">
                          ⚡ Full Administrative Access
                        </span>
                      ) : (
                        Object.entries(usr.permissions || {}).map(([key, enabled]) => (
                          <span
                            key={key}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                              enabled
                                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                                : 'bg-slate-900 text-slate-600 border-slate-800 line-through'
                            }`}
                          >
                            {key.replace('can_manage_', '')}
                          </span>
                        ))
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {user?.role === 'superadmin' && usr.role !== 'superadmin' && (
                        <>
                          <button
                            onClick={() => setEditingPermissionsUser(usr)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-xs font-semibold flex items-center space-x-1"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>Edit Permissions</span>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(usr.id)}
                            className="p-1.5 rounded-lg bg-red-950/60 text-red-400 hover:bg-red-900/60"
                            title="Delete Staff"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: TEAM & EMPLOYEES */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-display font-black text-2xl text-white">
                    Team & Employee Profiles
                  </h3>
                  <p className="text-xs text-slate-400">
                    Upload employee photos, bios, skills, and portfolio items.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddTeamModal(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-dark-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:shadow-glow-emerald transition-all flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Team Member</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamList.map((member) => (
                  <div
                    key={member.id}
                    className="p-5 rounded-2xl glass-card border border-slate-800 flex justify-between space-x-4"
                  >
                    <div className="flex space-x-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-white text-sm">{member.name}</h4>
                        <p className="text-xs text-cyan-400 font-medium">{member.role}</p>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{member.bio}</p>
                        {member.portfolioItems && member.portfolioItems.length > 0 && (
                          <div className="mt-2 text-[10px] text-slate-300">
                            <strong>Portfolio:</strong> {member.portfolioItems.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteTeamMember(member.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 h-fit"
                      title="Delete profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PORTFOLIO MANAGER */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-display font-black text-2xl text-white">
                    Portfolio & Case Studies
                  </h3>
                  <p className="text-xs text-slate-400">
                    Manage agency deliverables shown on public site.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddProjectModal(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-dark-950 bg-gradient-to-r from-asx-cyan to-indigo-400 hover:shadow-glow-cyan transition-all flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolioList.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-2xl glass-card overflow-hidden border border-slate-800 p-4 space-y-3"
                  >
                    <div className="aspect-video rounded-xl overflow-hidden bg-slate-950">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-cyan-400">{project.category}</span>
                      <h4 className="font-bold text-white text-sm truncate">{project.title}</h4>
                      <p className="text-xs text-slate-400 truncate">{project.client}</p>
                    </div>
                    <div className="flex justify-end pt-2 border-t border-slate-800">
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: BILLING & PAYMENT GATEWAYS */}
          {activeTab === 'billing' && billingConfig && (
            <div className="space-y-8">
              
              {/* Payment Gateways Config Form */}
              <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 space-y-6">
                <div>
                  <h3 className="font-display font-black text-2xl text-white">
                    Payment Gateway Settings
                  </h3>
                  <p className="text-xs text-slate-400">
                    Update Bank Account, Easypaisa, JazzCash, Card, Payoneer, and PayPal information displayed to clients.
                  </p>
                </div>

                <form onSubmit={handleSaveBillingConfig} className="space-y-6">
                  
                  {/* Bank Account Config */}
                  <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                    <h4 className="font-bold text-sm text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Corporate Bank Account</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Bank Name</label>
                        <input
                          type="text"
                          value={billingConfig.bankAccount.bankName}
                          onChange={(e) => setBillingConfig({
                            ...billingConfig,
                            bankAccount: { ...billingConfig.bankAccount, bankName: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Account Title</label>
                        <input
                          type="text"
                          value={billingConfig.bankAccount.accountTitle}
                          onChange={(e) => setBillingConfig({
                            ...billingConfig,
                            bankAccount: { ...billingConfig.bankAccount, accountTitle: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Account Number</label>
                        <input
                          type="text"
                          value={billingConfig.bankAccount.accountNumber}
                          onChange={(e) => setBillingConfig({
                            ...billingConfig,
                            bankAccount: { ...billingConfig.bankAccount, accountNumber: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">IBAN</label>
                        <input
                          type="text"
                          value={billingConfig.bankAccount.iban}
                          onChange={(e) => setBillingConfig({
                            ...billingConfig,
                            bankAccount: { ...billingConfig.bankAccount, iban: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Easypaisa & JazzCash Config */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-slate-900 border border-emerald-900/40 space-y-3">
                      <h4 className="font-bold text-sm text-emerald-400 uppercase tracking-wider">
                        Easypaisa Account
                      </h4>
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Mobile Number</label>
                        <input
                          type="text"
                          value={billingConfig.easypaisa.mobileNumber}
                          onChange={(e) => setBillingConfig({
                            ...billingConfig,
                            easypaisa: { ...billingConfig.easypaisa, mobileNumber: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Account Title</label>
                        <input
                          type="text"
                          value={billingConfig.easypaisa.accountTitle}
                          onChange={(e) => setBillingConfig({
                            ...billingConfig,
                            easypaisa: { ...billingConfig.easypaisa, accountTitle: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                        />
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-slate-900 border border-red-900/40 space-y-3">
                      <h4 className="font-bold text-sm text-red-400 uppercase tracking-wider">
                        JazzCash Account
                      </h4>
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Mobile Number</label>
                        <input
                          type="text"
                          value={billingConfig.jazzCash.mobileNumber}
                          onChange={(e) => setBillingConfig({
                            ...billingConfig,
                            jazzCash: { ...billingConfig.jazzCash, mobileNumber: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Account Title</label>
                        <input
                          type="text"
                          value={billingConfig.jazzCash.accountTitle}
                          onChange={(e) => setBillingConfig({
                            ...billingConfig,
                            jazzCash: { ...billingConfig.jazzCash, accountTitle: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payoneer & PayPal */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-slate-900 border border-amber-900/40 space-y-3">
                      <h4 className="font-bold text-sm text-amber-400 uppercase tracking-wider">
                        Payoneer
                      </h4>
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Email / ID</label>
                        <input
                          type="text"
                          value={billingConfig.payoneer.accountEmail}
                          onChange={(e) => setBillingConfig({
                            ...billingConfig,
                            payoneer: { ...billingConfig.payoneer, accountEmail: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-slate-900 border border-blue-900/40 space-y-3">
                      <h4 className="font-bold text-sm text-blue-400 uppercase tracking-wider">
                        PayPal
                      </h4>
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Email / PayPal.Me Link</label>
                        <input
                          type="text"
                          value={billingConfig.paypal.accountEmail}
                          onChange={(e) => setBillingConfig({
                            ...billingConfig,
                            paypal: { ...billingConfig.paypal, accountEmail: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-dark-950 bg-gradient-to-r from-asx-cyan to-indigo-400 hover:shadow-glow-cyan transition-all flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Payment Gateways</span>
                  </button>
                </form>
              </div>

              {/* Client Invoices Management */}
              <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-black text-2xl text-white">
                      Client Invoices & Settlement
                    </h3>
                    <p className="text-xs text-slate-400">
                      Generate project bills and verify client-submitted payment proofs.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddInvoiceModal(true)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-dark-950 bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Generate Invoice</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {invoicesList.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-5 rounded-2xl bg-dark-900 border border-slate-800 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-cyan-400 text-sm">{inv.invoiceNumber}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              inv.status === 'Paid'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : inv.status === 'Under Review'
                                ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                                : 'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}>
                              {inv.status}
                            </span>
                          </div>
                          <h4 className="font-bold text-white text-base mt-1">{inv.projectName}</h4>
                          <p className="text-xs text-slate-400">Client: {inv.clientName} ({inv.clientEmail})</p>
                        </div>

                        <div className="text-right">
                          <div className="font-display font-extrabold text-xl text-white">
                            {inv.currency === 'USD' ? '$' : 'Rs.'}{inv.amount.toLocaleString()} {inv.currency}
                          </div>
                          <div className="flex gap-2 mt-2">
                            {inv.status !== 'Paid' && (
                              <button
                                onClick={() => handleUpdateInvoiceStatus(inv.id, 'Paid')}
                                className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold"
                              >
                                Mark Paid
                              </button>
                            )}
                            {inv.status === 'Paid' && (
                              <button
                                onClick={() => handleUpdateInvoiceStatus(inv.id, 'Unpaid')}
                                className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs"
                              >
                                Mark Unpaid
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Payment proof verification if submitted by client */}
                      {inv.paymentProof && (
                        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-xs space-y-1">
                          <div className="text-cyan-300 font-bold flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Client Payment Proof Submitted:</span>
                          </div>
                          <p className="text-slate-300">
                            <strong>Method:</strong> {inv.paymentProof.paymentMethod} • <strong>Transaction ID:</strong> <span className="font-mono text-cyan-300">{inv.paymentProof.transactionId}</span>
                          </p>
                          {inv.paymentProof.notes && (
                            <p className="text-slate-400 italic">"{inv.paymentProof.notes}"</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-800">
                <h3 className="font-display font-black text-2xl text-white">
                  Client Reviews & Testimonials Moderation
                </h3>
                <p className="text-xs text-slate-400">
                  Reviews submitted by clients on the website require admin approval before becoming visible.
                </p>
              </div>

              <div className="space-y-4">
                {reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-bold text-white text-sm">{rev.clientName}</span>
                        <span className="text-xs text-slate-400">({rev.clientRole})</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          rev.status === 'approved'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {rev.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 italic">"{rev.review}"</p>
                      <span className="text-[10px] text-cyan-400 mt-1 block">★ {rev.rating} / 5 Stars • Service: {rev.serviceUsed}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {rev.status !== 'approved' && (
                        <button
                          onClick={() => handleApproveReview(rev.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold flex items-center space-x-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Publish</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: MESSAGES & INQUIRIES HUB */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-800">
                <h3 className="font-display font-black text-2xl text-white">
                  Client Inquiries & Consultation Messages
                </h3>
                <p className="text-xs text-slate-400">
                  Read, manage status, and reply to project inquiries submitted via website.
                </p>
              </div>

              <div className="space-y-4">
                {messagesList.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-white text-base">{msg.name}</h4>
                        <p className="text-xs text-slate-400">{msg.email} • {msg.phone || 'No phone'}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <select
                          value={msg.status}
                          onChange={(e) => handleUpdateMessageStatus(msg.id, e.target.value)}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-dark-900 border border-slate-700 text-cyan-300"
                        >
                          <option value="New">● New</option>
                          <option value="In Progress">● In Progress</option>
                          <option value="Contacted">● Contacted</option>
                          <option value="Converted">● Converted</option>
                          <option value="Closed">● Closed</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900 text-xs text-slate-300 space-y-1">
                      <div className="font-semibold text-cyan-400">{msg.subject}</div>
                      <p className="leading-relaxed">{msg.message}</p>
                      <div className="pt-2 text-[10px] text-slate-500 flex gap-4">
                        <span>Service: {msg.service}</span>
                        <span>Budget: {msg.budget}</span>
                        <span>Timeline: {msg.timeline}</span>
                      </div>
                    </div>

                    {/* Staff Replies */}
                    {msg.replies && msg.replies.length > 0 && (
                      <div className="pl-4 border-l-2 border-cyan-500/50 space-y-1 text-xs">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Staff Follow-ups:</span>
                        {msg.replies.map((rep, rIdx) => (
                          <div key={rIdx} className="text-slate-300">
                            <strong className="text-white">{rep.author}:</strong> {rep.text}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add reply note */}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add internal follow-up note or client reply..."
                        className="flex-1 px-3 py-1.5 rounded-lg glass-input text-xs"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.target.value) {
                            handleUpdateMessageStatus(msg.id, msg.status, e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL 1: ADD STAFF USER (RBAC) */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl glass-panel p-6 sm:p-8 border border-purple-500/40 shadow-2xl">
            <button onClick={() => setShowAddUserModal(false)} className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-extrabold text-xl text-white mb-4">
              Add Staff User & Assign Permissions
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="text-[11px] text-slate-300 font-semibold uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="e.g. Asim Raza"
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-semibold uppercase block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="asim@asxdigital.com"
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-semibold uppercase block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-semibold uppercase block mb-1">Designation / Role Title</label>
                <input
                  type="text"
                  value={newUserForm.title}
                  onChange={(e) => setNewUserForm({ ...newUserForm, title: e.target.value })}
                  placeholder="e.g. Operations Manager"
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                />
              </div>

              {/* Granular Permission Toggles */}
              <div className="pt-2">
                <label className="text-[11px] text-cyan-400 font-bold uppercase block mb-2">
                  Select Granular Permissions (Admin Discretion):
                </label>
                <div className="space-y-2 bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
                  {Object.keys(newUserForm.permissions).map((permKey) => (
                    <label key={permKey} className="flex items-center space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newUserForm.permissions[permKey]}
                        onChange={(e) => setNewUserForm({
                          ...newUserForm,
                          permissions: {
                            ...newUserForm.permissions,
                            [permKey]: e.target.checked,
                          }
                        })}
                        className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                      />
                      <span className="text-slate-300">
                        {permKey.replace('can_manage_', 'Can manage ').replace('_', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-dark-950 bg-gradient-to-r from-purple-400 to-cyan-400 shadow-glow-purple"
              >
                Create Staff Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT PERMISSIONS MODAL */}
      {editingPermissionsUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl glass-panel p-6 sm:p-8 border border-cyan-500/40 shadow-2xl">
            <button onClick={() => setEditingPermissionsUser(null)} className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-extrabold text-xl text-white mb-2">
              Modify Permissions for {editingPermissionsUser.name}
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Toggle specific dashboard access rights for this employee.
            </p>

            <div className="space-y-3 bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs mb-6">
              {editingPermissionsUser.permissions && Object.keys(editingPermissionsUser.permissions).map((permKey) => (
                <label key={permKey} className="flex items-center justify-between cursor-pointer py-1 border-b border-slate-800/60 last:border-0">
                  <span className="text-slate-200">
                    {permKey.replace('can_manage_', 'Manage ').replace('_', ' ')}
                  </span>
                  <input
                    type="checkbox"
                    checked={editingPermissionsUser.permissions[permKey]}
                    onChange={(e) => setEditingPermissionsUser({
                      ...editingPermissionsUser,
                      permissions: {
                        ...editingPermissionsUser.permissions,
                        [permKey]: e.target.checked,
                      }
                    })}
                    className="w-4 h-4 rounded text-cyan-500"
                  />
                </label>
              ))}
            </div>

            <button
              onClick={handleSavePermissions}
              className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-dark-950 bg-gradient-to-r from-asx-cyan to-indigo-400 shadow-glow-cyan"
            >
              Update & Apply Permissions
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD TEAM MEMBER */}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl glass-panel p-6 sm:p-8 border border-emerald-500/40 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowAddTeamModal(false)} className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-extrabold text-xl text-white mb-1">
              Add Verified Team Member
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Admin & authorized managers only. Add employee details and portfolio.
            </p>

            <form onSubmit={handleCreateTeamMember} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={teamForm.name}
                    onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                    placeholder="e.g. Usman Tariq"
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Role / Designation</label>
                  <input
                    type="text"
                    required
                    value={teamForm.role}
                    onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                    placeholder="e.g. Senior MERN Engineer"
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Department</label>
                <select
                  value={teamForm.department}
                  onChange={(e) => setTeamForm({ ...teamForm, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-dark-900"
                >
                  <option value="Engineering">Engineering & Web</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Design">Design & UI/UX</option>
                  <option value="Creative & Media">Creative & Video Editing</option>
                  <option value="E-Commerce">Shopify & E-Commerce</option>
                </select>
              </div>

              {/* Photo Upload or URL */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Profile Photo (Upload or URL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={teamForm.avatar}
                    onChange={(e) => setTeamForm({ ...teamForm, avatar: e.target.value })}
                    placeholder="Image URL..."
                    className="flex-1 px-3 py-2 rounded-xl glass-input text-xs"
                  />
                  <label className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer text-xs font-semibold flex items-center space-x-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'avatar', setTeamForm)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Short Bio</label>
                <textarea
                  rows={2}
                  value={teamForm.bio}
                  onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                  placeholder="Specialization and background..."
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={teamForm.skills}
                  onChange={(e) => setTeamForm({ ...teamForm, skills: e.target.value })}
                  placeholder="React, Node.js, Express, Tailwind"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Assigned Portfolio Projects (comma separated)</label>
                <input
                  type="text"
                  value={teamForm.portfolioItems}
                  onChange={(e) => setTeamForm({ ...teamForm, portfolioItems: e.target.value })}
                  placeholder="ApexFlow ERP, VoltPulse App"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-dark-950 bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-glow-emerald"
              >
                Save Employee Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD PORTFOLIO PROJECT */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl glass-panel p-6 sm:p-8 border border-cyan-500/40 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowAddProjectModal(false)} className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-extrabold text-xl text-white mb-4">
              Add New Project to Portfolio
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g. Next-Gen FinTech Dashboard"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Category</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-dark-900"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="App Development">App Development</option>
                    <option value="Shopify & E-Commerce">Shopify & E-Commerce</option>
                    <option value="Web & UI/UX Design">Web & UI/UX Design</option>
                    <option value="Video Editing & Motion Graphics">Video Editing & Motion Graphics</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Client Name</label>
                  <input
                    type="text"
                    value={projectForm.client}
                    onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                    placeholder="e.g. Acme Corp UK"
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Project Image (Upload or URL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={projectForm.image}
                    onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                    placeholder="Image URL..."
                    className="flex-1 px-3 py-2 rounded-xl glass-input text-xs"
                  />
                  <label className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer text-xs font-semibold flex items-center space-x-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'image', setProjectForm)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Overview of the deliverables and metrics..."
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={projectForm.tags}
                  onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                  placeholder="React, Node.js, Tailwind, MongoDB"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Live Demo Link</label>
                <input
                  type="text"
                  value={projectForm.liveUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                  placeholder="https://client-demo.com"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-dark-950 bg-gradient-to-r from-asx-cyan to-indigo-400 shadow-glow-cyan"
              >
                Publish Project to Portfolio
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: GENERATE INVOICE */}
      {showAddInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl glass-panel p-6 sm:p-8 border border-cyan-500/40 shadow-2xl">
            <button onClick={() => setShowAddInvoiceModal(false)} className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-extrabold text-xl text-white mb-4">
              Generate Client Invoice
            </h3>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    value={invoiceForm.clientName}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, clientName: e.target.value })}
                    placeholder="e.g. Marcus Sterling"
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Client Email</label>
                  <input
                    type="email"
                    required
                    value={invoiceForm.clientEmail}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, clientEmail: e.target.value })}
                    placeholder="marcus@company.com"
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Project Deliverable Title</label>
                <input
                  type="text"
                  required
                  value={invoiceForm.projectName}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, projectName: e.target.value })}
                  placeholder="e.g. MERN Stack ERP Phase 1 Milestone"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Amount</label>
                  <input
                    type="number"
                    required
                    value={invoiceForm.amount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
                    placeholder="2500"
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Currency</label>
                  <select
                    value={invoiceForm.currency}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, currency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-dark-900"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="PKR">PKR (Rs.)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AED">AED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Due Date</label>
                <input
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-dark-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-dark-950 bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-glow-emerald"
              >
                Create Invoice
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
