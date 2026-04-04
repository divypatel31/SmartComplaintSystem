import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../shared/DashboardLayout';
import ComplaintCard from '../shared/ComplaintCard';
import StatCard from '../shared/StatCard';
import { apiGetWorkerComplaints, apiResolveComplaint } from '../../data/mockApi';

const specialtyMeta = {
  PLUMBING:   { icon: '🔧', color: 'bg-sky-50 border-sky-200 text-sky-700'         },
  ELECTRICAL: { icon: '⚡', color: 'bg-orange-50 border-orange-200 text-orange-700' },
  IT:         { icon: '💻', color: 'bg-violet-50 border-violet-200 text-violet-700' },
};

function Toast({ toast }) {
  if (!toast) return null;
  const isErr = toast.type === 'error';
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-card-lg border animate-slide-down
      ${isErr ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
      <span>{isErr ? '✗' : '✓'}</span>
      <span className="font-body font-semibold text-sm">{toast.msg}</span>
    </div>
  );
}

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [resolving,  setResolving]  = useState(null);
  const [toast,      setToast]      = useState(null);
  const [filter,     setFilter]     = useState('ALL');

  const load = async () => { setLoading(true); setComplaints(await apiGetWorkerComplaints(user.id)); setLoading(false); };
  useEffect(() => { load(); }, []);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const resolve = async (id) => {
    setResolving(id);
    try {
      await apiResolveComplaint(id);
      await load();
      showToast('Complaint marked as resolved!');
    } catch (e) { showToast(e.message, 'error'); }
    finally { setResolving(null); }
  };

  const active   = complaints.filter(c => c.status === 'ASSIGNED').length;
  const resolved = complaints.filter(c => c.status === 'RESOLVED').length;
  const filtered = filter === 'ALL' ? complaints : complaints.filter(c => c.status === filter);
  const sp       = specialtyMeta[user.specialty] || { icon: '🛠️', color: 'bg-gray-50 border-gray-200 text-gray-700' };

  const navItems = [
    { label: 'My Tasks', icon: '🛠️', active: true, badge: active },
  ];

  return (
    <DashboardLayout navItems={navItems} title="Worker Dashboard">
      <Toast toast={toast} />
      <div className="space-y-6 max-w-5xl mx-auto stagger">

        {/* Identity card */}
        <div className={`flex items-center gap-5 px-6 py-5 rounded-2xl border ${sp.color}`}>
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-card flex-shrink-0">
            {sp.icon}
          </div>
          <div className="flex-1">
            <p className="font-display font-bold text-gray-900 text-lg">{user.username}</p>
            <p className="font-body text-sm text-gray-500 mt-0.5">{user.specialty} Specialist</p>
          </div>
          <div className="text-right">
            <p className="font-display font-bold text-gray-900 text-3xl">{active}</p>
            <p className="font-body text-xs text-gray-500 mt-0.5">active tasks</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total Assigned" value={complaints.length} icon="📋" color="gray"    />
          <StatCard label="Active"          value={active}            icon="⚡" color="amber"   />
          <StatCard label="Resolved"        value={resolved}          icon="✅" color="emerald" />
        </div>

        {/* Active tasks alert */}
        {active > 0 && (
          <div className="flex items-center gap-3 px-5 py-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-base flex-shrink-0">📌</div>
            <p className="font-body text-blue-800 text-sm">
              You have <strong className="font-semibold">{active} active task{active > 1 ? 's' : ''}</strong> awaiting resolution.
              Review each carefully before marking complete.
            </p>
          </div>
        )}

        {/* Filter + heading */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display font-bold text-gray-900 text-base">Assigned Tasks</h3>
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
            {['ALL','ASSIGNED','RESOLVED'].map(f => (
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
            {[1,2,3].map(i => <div key={i} className="h-36 rounded-xl bg-gray-200 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-16 border-dashed">
            <div className="text-5xl mb-3">✨</div>
            <p className="font-display font-bold text-gray-700 mb-1">
              {filter === 'ALL' ? 'No tasks assigned yet' : `No ${filter.toLowerCase()} tasks`}
            </p>
            <p className="font-body text-gray-400 text-sm">The admin will assign tasks matching your specialty.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 stagger">
            {filtered.map(c => (
              <ComplaintCard key={c.id} complaint={c} meta={{ showUser: true }}
                actions={
                  c.status === 'ASSIGNED' ? [
                    <button key="r" onClick={() => resolve(c.id)} disabled={resolving === c.id}
                      className="btn-success text-xs px-4 py-2 disabled:opacity-50">
                      {resolving === c.id ? (
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          Resolving…
                        </span>
                      ) : '✓ Mark as Resolved'}
                    </button>
                  ] : c.status === 'RESOLVED' ? [
                    <span key="done" className="flex items-center gap-1.5 text-xs font-display font-semibold text-emerald-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      Completed
                    </span>
                  ] : null
                }
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
