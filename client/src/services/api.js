const BACKEND_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API_BASE = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

function getAuthHeader() {
  const token = localStorage.getItem('asx_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }
  return data;
}

export const api = {
  // Auth & RBAC Users
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async getUsers() {
    const res = await fetch(`${API_BASE}/auth/users`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async createUser(userData) {
    const res = await fetch(`${API_BASE}/auth/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  async updatePermissions(userId, payload) {
    const res = await fetch(`${API_BASE}/auth/users/${userId}/permissions`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async deleteUser(userId) {
    const res = await fetch(`${API_BASE}/auth/users/${userId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // Services
  async getServices() {
    const res = await fetch(`${API_BASE}/services`);
    return handleResponse(res);
  },

  async createService(data) {
    const res = await fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateService(id, data) {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteService(id) {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // Portfolio
  async getPortfolio(category = 'All') {
    const url = category && category !== 'All' 
      ? `${API_BASE}/portfolio?category=${encodeURIComponent(category)}`
      : `${API_BASE}/portfolio`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  async createProject(data) {
    const res = await fetch(`${API_BASE}/portfolio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateProject(id, data) {
    const res = await fetch(`${API_BASE}/portfolio/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteProject(id) {
    const res = await fetch(`${API_BASE}/portfolio/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // Team & Employees
  async getTeam() {
    const res = await fetch(`${API_BASE}/team`);
    return handleResponse(res);
  },

  async createTeamMember(data) {
    const res = await fetch(`${API_BASE}/team`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateTeamMember(id, data) {
    const res = await fetch(`${API_BASE}/team/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteTeamMember(id) {
    const res = await fetch(`${API_BASE}/team/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // Reviews & Client Feedback
  async getReviews() {
    const res = await fetch(`${API_BASE}/reviews`);
    return handleResponse(res);
  },

  async getAllReviewsAdmin() {
    const res = await fetch(`${API_BASE}/reviews/all`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async submitReview(data) {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateReviewStatus(id, data) {
    const res = await fetch(`${API_BASE}/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteReview(id) {
    const res = await fetch(`${API_BASE}/reviews/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // Billing & Payment Hub
  async getBillingMethods() {
    const res = await fetch(`${API_BASE}/billing/methods`);
    return handleResponse(res);
  },

  async updateBillingMethods(data) {
    const res = await fetch(`${API_BASE}/billing/methods`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async searchInvoice(query) {
    const res = await fetch(`${API_BASE}/billing/invoices/search?query=${encodeURIComponent(query)}`);
    return handleResponse(res);
  },

  async submitPaymentProof(data) {
    const res = await fetch(`${API_BASE}/billing/invoices/verify-proof`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async getInvoices() {
    const res = await fetch(`${API_BASE}/billing/invoices`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async createInvoice(data) {
    const res = await fetch(`${API_BASE}/billing/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateInvoice(id, data) {
    const res = await fetch(`${API_BASE}/billing/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteInvoice(id) {
    const res = await fetch(`${API_BASE}/billing/invoices/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // Messaging & Inquiries
  async submitMessage(data) {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async getMessages(status = 'All') {
    const url = status && status !== 'All' 
      ? `${API_BASE}/messages?status=${encodeURIComponent(status)}`
      : `${API_BASE}/messages`;
    const res = await fetch(url, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async updateMessageStatus(id, data) {
    const res = await fetch(`${API_BASE}/messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteMessage(id) {
    const res = await fetch(`${API_BASE}/messages/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // File Upload
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    });
    const data = await handleResponse(res);
    if (BACKEND_URL && data.url && data.url.startsWith('/')) {
      data.url = `${BACKEND_URL}${data.url}`;
    }
    return data;
  },
};
