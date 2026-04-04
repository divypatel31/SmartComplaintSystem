import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../shared/DashboardLayout';
import ComplaintCard from '../shared/ComplaintCard';
import StatCard from '../shared/StatCard';
import Modal from '../shared/Modal';
import { apiGetMyComplaints, apiSubmitComplaint } from '../../data/mockApi';

const CATEGORIES = [
  { id: 'PLUMBING',   icon: '🔧', label: 'Plumbing'   },
  { id: 'ELECTRICAL', icon: '⚡', label: 'Electrical'  },
  { id: 'IT',         icon: '💻', label: 'IT Support'  },
  { id: 'GENERAL',    icon: '📋', label: 'General'     },
];

function Toast({ toast }) {
  if (!toast) return null;
  const isErr = toast.type === 'error';
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-card-lg border animate-slide-down
      ${isErr ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
      <span className="text-base">{isErr ? '✗' : '✓'}</span>
      <span className="font-body font-semibold text-sm">{toast.msg}</span>
    </div>
  );
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(false);
  const [form,       setForm]       = useState({ description: '', category: 'GENERAL' });
  const [submitting, setSubmitting] = useState(false);
  const [toast,      setToast]      = useState(null);
  const [filter,     setFilter]     = useState('ALL');

  const load = async () => { setLoading(true); setComplaints(await apiGetMyComplaints(user.id)); setLoading(false); };
  useEffect(() => { load(); }, []);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const submit = async () => {
    if (!form.description.trim()) return;
    setSubmitting(true);
    try {
      await apiSubmitComplaint({ ...form, userId: user.id });
      await load();
      setModal(false);
      setForm({ description: '', category: 'GENERAL' });
      showToast('Complaint submitted successfully!');
    } catch (e) { showToast(e.message, 'error'); }
    finally { setSubmitting(false); }
  };

  const pending  = complaints.filter(c => c.status === 'PENDING').length;
  const assigned = complaints.filter(c => c.status === 'ASSIGNED').length;
  const resolved = complaints.filter(c => c.status === 'RESOLVED').length;
  const filtered = filter === 'ALL' ? complaints : complaints.filter(c => c.status === filter);

  const navItems = [
    { label: 'My Complaints', icon: '📋', active: true, badge: complaints.length },
    { label: 'New Complaint',  icon: '➕', onClick: () => setModal(true) },
  ];

  return (
    <DashboardLayout navItems={navItems} title="My Dashboard">
      <Toast toast={toast} />
      <div className="space-y-6 max-w-5xl mx-auto stagger">

        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-white text-xl">
              Welcome back, {user.username}! 👋
            </h3>
            <p className="text-brand-200 text-sm font-body mt-1">
              Track your submitted issues and stay updated in real time.
            </p>
          </div>
          <button onClick={() => setModal(true)}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white text-brand-700
              font-display font-semibold text-sm rounded-lg shadow-card hover:bg-brand-50 transition-colors">
            <span className="text-base">+</span> New Complaint
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total"    value={complaints.length} icon="📋" color="gray"    />
          <StatCard label="Pending"  value={pending}           icon="⏳" color="amber"   />
          <StatCard label="Assigned" value={assigned}          icon="🛠️" color="violet"  />
          <StatCard label="Resolved" value={resolved}          icon="✅" color="emerald" />
        </div>

        {/* Filter + header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display font-bold text-gray-900 text-base">Complaint History</h3>
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
            {['ALL','PENDING','ASSIGNED','RESOLVED'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-display font-semibold transition-all duration-150
                  ${filter === f ? 'bg-white text-gray-900 shadow-card' : 'text-gray-500 hover:text-gray-700'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-36 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-16 border-dashed">
            <div className="text-5xl mb-3">📭</div>
            <p className="font-display font-bold text-gray-700 mb-1">No complaints yet</p>
            <p className="font-body text-gray-400 text-sm mb-5">Click the button below to submit your first complaint.</p>
            <button onClick={() => setModal(true)} className="btn-primary mx-auto">+ Submit Complaint</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 stagger">
            {filtered.map(c => <ComplaintCard key={c.id} complaint={c} />)}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Submit New Complaint">
        <div className="space-y-4">
          <div>
            <label className="block section-label mb-2">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat.id} type="button"
                  onClick={() => setForm(f => ({ ...f, category: cat.id }))}
                  className={`flex items-center gap-2 py-2.5 px-3 rounded-lg border-2 text-sm font-display font-semibold transition-all duration-150 ${
                    form.category === cat.id
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}>
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block section-label mb-2">Description</label>
            <textarea className="input-field resize-none h-28"
              placeholder="Describe the issue clearly…"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <p className="text-xs text-gray-400 font-body mt-1">{form.description.length}/255 characters</p>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={submit}
              disabled={submitting || !form.description.trim()}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Submitting…' : 'Submit Complaint'}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
