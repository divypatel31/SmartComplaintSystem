// ============================================================
// MOCK DATA — mirrors your MySQL schema exactly
// Replace calls to these with real fetch('/api/...') calls
// once your Spring Boot REST API is running.
// ============================================================

export const MOCK_USERS = [
  { id: 1, username: 'admin',    password: 'admin123',   role: 'ADMIN',  specialty: null        },
  { id: 2, username: 'alice',    password: 'alice123',   role: 'USER',   specialty: null        },
  { id: 3, username: 'bob',      password: 'bob123',     role: 'USER',   specialty: null        },
  { id: 4, username: 'charlie',  password: 'charlie123', role: 'WORKER', specialty: 'PLUMBING'  },
  { id: 5, username: 'diana',    password: 'diana123',   role: 'WORKER', specialty: 'ELECTRICAL'},
  { id: 6, username: 'eve',      password: 'eve123',     role: 'WORKER', specialty: 'IT'        },
];

export const MOCK_COMPLAINTS = [
  { id: 1, description: 'Water leaking from bathroom ceiling pipe.',     status: 'PENDING',  userId: 2, category: 'PLUMBING',    workerId: null },
  { id: 2, description: 'Power outlet in room 204 is sparking.',         status: 'ASSIGNED', userId: 2, category: 'ELECTRICAL', workerId: 5    },
  { id: 3, description: 'Office WiFi is completely down since morning.',  status: 'PENDING',  userId: 3, category: 'IT',         workerId: null },
  { id: 4, description: 'Kitchen sink drain is clogged and overflowing.',status: 'RESOLVED', userId: 3, category: 'PLUMBING',   workerId: 4    },
  { id: 5, description: 'Flickering lights in conference room B.',        status: 'PENDING',  userId: 2, category: 'ELECTRICAL', workerId: null },
  { id: 6, description: 'Laptop cannot connect to VPN.',                  status: 'ASSIGNED', userId: 3, category: 'IT',         workerId: 6    },
];

// ============================================================
// Mock "API" service layer
// Swap each function body with a real fetch() call later.
// ============================================================

let users      = [...MOCK_USERS];
let complaints = [...MOCK_COMPLAINTS];
let nextUserId      = 7;
let nextComplaintId = 7;

// --- Auth ---
export const apiLogin = async ({ username, password }) => {
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) throw new Error('Invalid username or password.');
  return { ...user };
};

export const apiRegister = async ({ username, password, role, specialty }) => {
  if (users.find(u => u.username === username)) throw new Error('Username already taken.');
  const newUser = { id: nextUserId++, username, password, role, specialty: specialty || null };
  users.push(newUser);
  return { ...newUser };
};

// --- Complaints ---
export const apiGetAllComplaints = async () =>
  complaints.map(c => ({
    ...c,
    user:   users.find(u => u.id === c.userId),
    worker: users.find(u => u.id === c.workerId) || null,
  }));

export const apiGetMyComplaints = async (userId) =>
  complaints
    .filter(c => c.userId === userId)
    .map(c => ({ ...c, worker: users.find(u => u.id === c.workerId) || null }));

export const apiGetWorkerComplaints = async (workerId) =>
  complaints
    .filter(c => c.workerId === workerId)
    .map(c => ({ ...c, user: users.find(u => u.id === c.userId) }));

export const apiSubmitComplaint = async ({ description, category, userId }) => {
  const newC = { id: nextComplaintId++, description, category, status: 'PENDING', userId, workerId: null };
  complaints.push(newC);
  return { ...newC };
};

export const apiGetWorkersBySpecialty = async (specialty) =>
  users.filter(u => u.role === 'WORKER' && u.specialty === specialty);

export const apiAssignComplaint = async (complaintId, workerId) => {
  const c = complaints.find(c => c.id === complaintId);
  if (!c) throw new Error('Complaint not found.');
  c.workerId = workerId;
  c.status   = 'ASSIGNED';
  return { ...c };
};

export const apiResolveComplaint = async (complaintId) => {
  const c = complaints.find(c => c.id === complaintId);
  if (!c) throw new Error('Complaint not found.');
  c.status = 'RESOLVED';
  return { ...c };
};
