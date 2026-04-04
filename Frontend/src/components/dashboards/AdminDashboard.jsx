import { useState, useEffect } from 'react';
import DashboardLayout from '../shared/DashboardLayout';
import ComplaintCard from '../shared/ComplaintCard';
import StatCard from '../shared/StatCard';
import Modal from '../shared/Modal';
import { apiGetAllComplaints, apiGetWorkersBySpecialty, apiAssignComplaint } from '../../data/mockApi';

const specialtyFor = cat => ({ PLUMBING: 'PLUMBING', ELECTRICAL: 'ELECTRICAL', IT: 'IT' }[cat] || null);

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

export default function AdminDashboard() {
  const [complaints,   setComplaints]  = useState([]);
  const [loading,      setLoading]     = useState(true);
  const [filter,       setFilter]      = useState('ALL');
  const [assignModal,  setAssignModal] = useState(null);
  const [workers,      setWorkers]     = useState([]);
  const [assigning,    setAssigning]   = useState(false);
  const [toast,        setToast]       = useState(null);

  const load = async () => { setLoading(true); setComplaints(await apiGetAllComplaints()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const openAssign = async (c) => {
    const sp = specialtyFor(c.category);
    setWorkers(sp ? await apiGetWorkersBySpecialty(sp) : []);
    setAssignModal(c);
  };

  const assign = async (workerId) => {
    setAssigning(true);
    try {
      await apiAssignComplaint(assignModal.id, workerId);
      await load();
      setAssignModal(null);
      showToast('Worker assigned successfully!');
    } catch (e) { showToast(e.message, 'error'); }
    finally { setAssigning(false); }
  };

  const filtered = filter === 'ALL' ? complaints : complaints.filter(c => c.status === filter);
  const pending  = complaints.filter(c => c.status === 'PENDING').length;
  const assigned = complaints.filter(c => c.status === 'ASSIGNED').length;
  const resolved = complaints.filter(c => c.status === 'RESOLVED').length;

  const navItems = [
    { label: 'All Complaints', icon: '📋', active: true, badge: complaints.length },
  ];

  return (
    <DashboardLayout navItems={navItems} title="Admin Dashboard">
      <Toast toast={toast} />
      <div className="space-y-6 max-w-5xl mx-auto stagger">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total"    value={complaints.length} icon="📋" color="gray"    />
          <StatCard label="Pending"  value={pending}           icon="⏳" color="amber"   />
          <StatCard label="Assigned" value={assigned}          icon="🔄" color="brand"   />
          <StatCard label="Resolved" value={resolved}          icon="✅" color="emerald" />
        </div>

        {/* Pending attention banner */}
        {pending > 0 && (
          <div className="flex items-center gap-3 px-5 py-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-lg flex-shrink-0">⚠️</div>
            <div>
              <p className="font-display font-semibold text-amber-800 text-sm">
                {pending} complaint{pending > 1 ? 's' : ''} awaiting assignment
              </p>
              <p className="font-body text-amber-600 text-xs mt-0.5">
                Assign a qualified worker to each pending complaint.
              </p>
            </div>
          </div>
        )}

        {/* Filter + heading */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-gray-900 text-base">All Complaints</h3>
            <p className="font-body text-gray-400 text-xs mt-0.5">Showing {filtered.length} of {complaints.length}</p>
          </div>
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

        {/* Complaints grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-40 rounded-xl bg-gray-200 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-16 border-dashed">
            <div className="text-5xl mb-3">🎉</div>
            <p className="font-display font-bold text-gray-700">No {filter !== 'ALL' ? filter.toLowerCase() : ''} complaints</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 stagger">
            {filtered.map(c => (
              <ComplaintCard key={c.id} complaint={c} meta={{ showUser: true }}
                actions={
                  c.status === 'PENDING' ? [
                    <button key="a" onClick={() => openAssign(c)} className="btn-primary text-xs px-4 py-2">
                      🛠️ Assign Worker
                    </button>
                  ] : c.status === 'ASSIGNED' ? [
                    <button key="r" onClick={() => openAssign(c)} className="btn-secondary text-xs px-4 py-2">
                      🔄 Reassign
                    </button>
                  ] : null
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Assign modal */}
      <Modal open={!!assignModal} onClose={() => setAssignModal(null)}
        title={`Assign Complaint #${String(assignModal?.id || 0).padStart(4,'0')}`}>
        {assignModal && (
          <div className="space-y-4">
            {/* Complaint preview */}
            <div className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
              <p className="section-label mb-1">Complaint</p>
              <p className="font-body text-gray-700 text-sm">{assignModal.description}</p>
            </div>

            <div>
              <p className="section-label mb-3">
                Available {specialtyFor(assignModal.category) || 'General'} Workers
              </p>
              {workers.length === 0 ? (
                <div className="px-4 py-8 rounded-xl bg-gray-50 border border-gray-200 text-center">
                  <div className="text-3xl mb-2">🤷</div>
                  <p className="font-body text-gray-500 text-sm">No available workers for this category.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {workers.map(w => (
                    <button key={w.id} onClick={() => assign(w.id)} disabled={assigning}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                        bg-white hover:bg-brand-50 border border-gray-200 hover:border-brand-300
                        text-left transition-all duration-150 disabled:opacity-50 group shadow-card">
                      <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center
                        font-display font-bold text-brand-600 text-sm flex-shrink-0">
                        {w.username[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-gray-900 text-sm group-hover:text-brand-700 transition-colors">{w.username}</p>
                        <p className="font-mono text-xs text-gray-400">{w.specialty}</p>
                      </div>
                      <span className="flex items-center gap-1 text-xs font-display font-semibold text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Assign <span>→</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setAssignModal(null)} className="btn-secondary w-full">Cancel</button>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
