// src/data/api.js

const BASE_URL = "https://smartcomplaintsystem-qfgg.onrender.com/api";

// ==========================================
// AUTHENTICATION
// ==========================================
export const apiLogin = async (credentials) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Login failed.');
  }
  return res.json();
};

export const apiRegister = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Registration failed.');
  }
  return res.json();
};

// ==========================================
// COMPLAINTS (TICKETS)
// ==========================================
export const apiGetAllComplaints = async () => {
  const res = await fetch(`${BASE_URL}/complaints`);
  if (!res.ok) throw new Error('Failed to fetch complaints');
  return res.json();
};

export const apiGetMyComplaints = async (userId) => {
  const res = await fetch(`${BASE_URL}/complaints?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch your complaints');
  return res.json();
};

export const apiGetWorkerComplaints = async (workerId) => {
  const res = await fetch(`${BASE_URL}/complaints?workerId=${workerId}`);
  if (!res.ok) throw new Error('Failed to fetch assigned tasks');
  return res.json();
};

export const apiSubmitComplaint = async (data) => {
  const res = await fetch(`${BASE_URL}/complaints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit complaint');
  return res.json();
};

export const apiAssignComplaint = async (complaintId, workerId) => {
  const res = await fetch(`${BASE_URL}/complaints/${complaintId}/assign/${workerId}`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Failed to assign complaint');
  return res.json();
};

export const apiResolveComplaint = async (complaintId) => {
  const res = await fetch(`${BASE_URL}/complaints/${complaintId}/resolve`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Failed to resolve complaint');
  return res.json();
};

export const apiDeleteComplaint = async (id) => {
  const res = await fetch(`${BASE_URL}/complaints/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error("Failed to delete complaint");
  return true;
};

// ==========================================
// USERS & WORKERS
// ==========================================
export const apiGetAllUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const apiGetWorkersBySpecialty = async (specialty) => {
  const res = await fetch(`${BASE_URL}/complaints/workers/${specialty}`);
  if (!res.ok) throw new Error('Failed to fetch workers');
  return res.json();
};

export const apiUpdateUser = async (userId, data) => {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
};

export const apiDeleteUser = async (id) => {
  const res = await fetch(`${BASE_URL}/users/${id}`, { 
    method: 'DELETE' 
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return true;
};

// ==========================================
// NOTIFICATIONS
// ==========================================
export const apiGetNotices = async (userId) => {
  const res = await fetch(`${BASE_URL}/notifications/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch notices");
  return res.json();
};

export const apiDeleteNotice = async (id) => {
  const res = await fetch(`${BASE_URL}/notifications/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error("Failed to delete notice");
  return true;
};