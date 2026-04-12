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

  // 🛡️ BULLETPROOF PARSING: Check if backend sent text or JSON
  const contentType = res.headers.get("content-type");
  let data;
  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  // If status is 400, 401, 500, etc. Throw the error neatly!
  if (!res.ok) {
    throw new Error(typeof data === 'string' ? data : data.message || 'Login failed.');
  }

  // Only set token if it exists
  if (data && data.token) {
    sessionStorage.setItem('jwt_token', data.token);
  }
  return data;
};

export const apiRegister = async (dataPayload) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataPayload),
  });

  // 🛡️ BULLETPROOF PARSING: Check if backend sent text or JSON
  const contentType = res.headers.get("content-type");
  let data;
  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  // If registration fails, throw a clean error
  if (!res.ok) {
    throw new Error(typeof data === 'string' ? data : data.message || 'Registration failed.');
  }

  // Only set token if it exists
  if (data && data.token) {
    sessionStorage.setItem('jwt_token', data.token);
  }
  return data;
};

// ==========================================
// COMPLAINTS (TICKETS)
// ==========================================
export const apiGetAllComplaints = async () => {
  const res = await fetch(`${BASE_URL}/complaints`, {
    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('jwt_token')}` }
  });
  if (!res.ok) throw new Error('Failed to fetch complaints');
  return res.json();
};

export const apiGetMyComplaints = async (userId) => {
  const res = await fetch(`${BASE_URL}/complaints?userId=${userId}`, {
    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('jwt_token')}` }
  });
  if (!res.ok) throw new Error('Failed to fetch your complaints');
  return res.json();
};

export const apiGetWorkerComplaints = async (workerId) => {
  const res = await fetch(`${BASE_URL}/complaints?workerId=${workerId}`, {
    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('jwt_token')}` }
  });
  if (!res.ok) throw new Error('Failed to fetch assigned tasks');
  return res.json();
};

// UPDATED: Now accepts imageFile and uses FormData
export const apiSubmitComplaint = async (complaintData, imageFile) => {
  const formData = new FormData();
  
  // Attach text data as a JSON string
  formData.append("complaint", JSON.stringify(complaintData));

  // Attach the image file if one was provided
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const res = await fetch(`${BASE_URL}/complaints`, {
    method: 'POST',
    headers: { 
      // CRITICAL: Do NOT set Content-Type here. The browser must set it automatically for FormData.
      'Authorization': `Bearer ${sessionStorage.getItem('jwt_token')}`
    },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to submit complaint');
  return res.json();
};

export const apiAssignComplaint = async (complaintId, workerId) => {
  const res = await fetch(`${BASE_URL}/complaints/${complaintId}/assign/${workerId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('jwt_token')}` }
  });
  if (!res.ok) throw new Error('Failed to assign complaint');
  return res.json();
};

export const apiResolveComplaint = async (complaintId) => {
  const res = await fetch(`${BASE_URL}/complaints/${complaintId}/resolve`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('jwt_token')}` }
  });
  if (!res.ok) throw new Error('Failed to resolve complaint');
  return res.json();
};

export const apiDeleteComplaint = async (id) => {
  const res = await fetch(`${BASE_URL}/complaints/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('jwt_token')}` }
  });
  if (!res.ok) throw new Error("Failed to delete complaint");
  return true;
};

// ==========================================
// USERS & WORKERS
// ==========================================
export const apiGetAllUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`, {
    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('jwt_token')}` }
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const apiGetWorkersBySpecialty = async (specialty) => {
  const res = await fetch(`${BASE_URL}/complaints/workers/${specialty}`, {
    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('jwt_token')}` }
  });
  if (!res.ok) throw new Error('Failed to fetch workers');
  return res.json();
};

export const apiUpdateUser = async (userId, data) => {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('jwt_token')}`
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
};

export const apiDeleteUser = async (id) => {
  const res = await fetch(`${BASE_URL}/users/${id}`, { 
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('jwt_token')}` }
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return true;
};

// ==========================================
// NOTIFICATIONS
// ==========================================
export const apiGetNotices = async (userId) => {
  const res = await fetch(`${BASE_URL}/notifications/${userId}`, {
    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('jwt_token')}` }
  });
  if (!res.ok) throw new Error("Failed to fetch notices");
  return res.json();
};

export const apiDeleteNotice = async (id) => {
  const res = await fetch(`${BASE_URL}/notifications/${id}`, { 
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('jwt_token')}` }
  });
  if (!res.ok) throw new Error("Failed to delete notice");
  return true;
};