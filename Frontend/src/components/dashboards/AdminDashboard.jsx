import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../shared/DashboardLayout';
import ComplaintCard from '../shared/ComplaintCard';
import StatCard from '../shared/StatCard';
import Modal from '../shared/Modal';

import { 
  apiGetAllComplaints, 
  apiGetWorkersBySpecialty, 
  apiAssignComplaint, 
  apiGetAllUsers, 
  apiDeleteComplaint,
  apiUpdateUser,  
  apiDeleteUser   
} from '../../data/mockApi';

const specialtyFor = cat => ({ PLUMBING: 'PLUMBING', ELECTRICAL: 'ELECTRICAL', IT: 'IT' }[cat] || null);
const ALL_SPECIALTIES = ['PLUMBING', 'ELECTRICAL', 'IT'];

export default function AdminDashboard() {
  const [view, setView] = useState('complaints'); // 'complaints' or 'users'
  
  // ── Data States ──
  const [complaints, setComplaints] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ── Action States (Complaints) ──
  const [filter, setFilter] = useState('ALL');
  const [assignModal, setAssignModal] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [assigning, setAssigning] = useState(false);

  // ── Action States (Users) ──
  const [editUserModal, setEditUserModal] = useState(null);
  const [userSaving, setUserSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [compData, userData] = await Promise.all([
        apiGetAllComplaints(),
        apiGetAllUsers()
      ]);
      setComplaints(compData);
      setUsersList(userData);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ==========================================
  // COMPLAINT FUNCTIONS
  // ==========================================
  const openAssign = async (c) => {
    const sp = specialtyFor(c.category);
    const workersList = sp ? await apiGetWorkersBySpecialty(sp) : [];
    setWorkers(workersList);
    setAssignModal(c);
  };

  const assign = async (workerId) => {
    setAssigning(true);
    try {
      await apiAssignComplaint(assignModal.id, workerId);
      await loadData();
      setAssignModal(null);
    } catch (e) { alert("Error: " + e.message); } 
    finally { setAssigning(false); }
  };

  const deleteComplaint = async (id) => {
    if(!window.confirm("Are you sure you want to permanently delete this resolved complaint?")) return;
    try {
      await apiDeleteComplaint(id);
      await loadData();
    } catch (e) { alert("Error deleting: " + e.message); }
  };

  // ==========================================
  // USER MANAGEMENT FUNCTIONS
  // ==========================================
  const deleteUser = async (id) => {
    if (!window.confirm("CRITICAL WARNING: Are you sure you want to permanently delete this user and all their data?")) return;
    try {
      await apiDeleteUser(id);
      await loadData(); // Refresh list automatically
    } catch (e) { alert("Error terminating user: " + e.message); }
  };

  const saveUserEdit = async () => {
    setUserSaving(true);
    try {
      await apiUpdateUser(editUserModal.id, editUserModal);
      setEditUserModal(null);
      await loadData(); // Refresh list automatically
    } catch (e) { alert("Error updating user: " + e.message); }
    finally { setUserSaving(false); }
  };

  // ── Render Helpers ──
  const filteredComplaints = filter === 'ALL' ? complaints : complaints.filter(c => c.status === filter);
  const pendingCount = complaints.filter(c => c.status === 'PENDING').length;

  return (
    <DashboardLayout 
      title="System Overview" 
      navItems={[
        { label: 'Incident Logs', icon: '🌍', active: view === 'complaints', onClick: () => setView('complaints') },
        { label: 'User Directory', icon: '👥', active: view === 'users', onClick: () => setView('users') }
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* ── VIEW 1: COMPLAINTS ── */}
        {view === 'complaints' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard label="Total Tickets" value={complaints.length} color="gray" />
              <StatCard label="Awaiting Action" value={pendingCount} color="amber" />
              <StatCard label="In Progress" value={complaints.filter(c => c.status === 'ASSIGNED').length} color="blue" />
              <StatCard label="Resolved" value={complaints.filter(c => c.status === 'RESOLVED').length} color="emerald" />
            </div>

            {/* Filter Bar */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight text-gray-900">Active Incidents</h3>
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                {['ALL', 'PENDING', 'ASSIGNED', 'RESOLVED'].map(f => (
                  <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Complaint Grid */}
            {loading ? (
              <div className="text-center py-10 text-gray-400 font-bold">Loading Data...</div>
            ) : (
              <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatePresence>
                  {filteredComplaints.map((c) => (
                    <ComplaintCard 
                      key={c.id} 
                      complaint={c} 
                      actions={
                        c.status === 'PENDING' ? (
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => openAssign(c)} className="px-4 py-2 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-black/10">
                            Assign Worker
                          </motion.button>
                        ) : c.status === 'RESOLVED' ? (
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => deleteComplaint(c.id)} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-red-200 transition-colors">
                            🗑️ Delete Log
                          </motion.button>
                        ) : null
                      }
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── VIEW 2: USER DIRECTORY ── */}
        {view === 'users' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-gray-900">User Directory</h3>
                <p className="text-xs text-gray-500 font-medium mt-1">Manage all registered accounts across the platform.</p>
              </div>
              <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold border border-blue-100">
                Total Users: {usersList.length}
              </div>
            </div>

            {loading ? (
               <div className="text-center py-10 text-gray-400 font-bold">Loading Directory...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {usersList.map(u => (
                  <motion.div key={u.id} whileHover={{ y: -4 }} className="glass p-5 rounded-2xl border border-white/40 shadow-sm flex flex-col justify-between h-full group">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-inner ${u.role === 'ADMIN' ? 'bg-black text-white' : u.role === 'WORKER' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                            {u.username[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{u.username}</p>
                            <p className="text-[10px] text-gray-400 font-mono tracking-tighter truncate max-w-[120px]">{u.email || 'No email'}</p>
                          </div>
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${u.role === 'ADMIN' ? 'bg-gray-900 text-white border-gray-800' : u.role === 'WORKER' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                          {u.role}
                        </span>
                      </div>

                      <div className="space-y-2 pt-4 border-t border-gray-100/50">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-gray-400 uppercase tracking-widest">Phone</span>
                          <span className="font-semibold text-gray-700">{u.mobileNumber || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-gray-400 uppercase tracking-widest">Location</span>
                          <span className="font-semibold text-gray-700 truncate max-w-[120px]">{u.location || 'N/A'}</span>
                        </div>
                        {u.role === 'WORKER' && (
                          <div className="mt-3 pt-3 border-t border-gray-50">
                            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block mb-2">Registered Specialties</span>
                            <div className="flex flex-wrap gap-1.5">
                              {u.specialty ? u.specialty.split(',').map(sp => (
                                <span key={sp} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[9px] font-bold uppercase tracking-wider border border-blue-100">
                                  {sp}
                               </span>
                              )) : (
                                <span className="text-[10px] text-gray-400 font-medium">None assigned</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ── ADMIN ACTION BUTTONS ── */}
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100/50">
                      <button 
                        onClick={() => setEditUserModal(u)}
                        className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => deleteUser(u.id)}
                        className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors"
                      >
                        🗑️ Terminate
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* ── ASSIGN WORKER MODAL ── */}
      <Modal open={!!assignModal} onClose={() => setAssignModal(null)} title="Dispatch Resource">
        {assignModal && (
          <div className="space-y-6 p-2">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Subject</p>
              <p className="text-sm font-medium text-gray-800">{assignModal.description}</p>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Verified Field Workers</p>
              {workers.length === 0 ? (
                <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                  <p className="text-sm text-gray-400">No matching specialists found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {workers.map(w => (
                    <motion.button
                      key={w.id}
                      whileHover={{ x: 5 }}
                      onClick={() => assign(w.id)}
                      disabled={assigning}
                      className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-black bg-white transition-all group"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                          {w.username[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{w.username}</p>
                          {/* Format comma-separated strings nicely (e.g., PLUMBING • IT) */}
                          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">
                            {w.specialty ? w.specialty.split(',').join(' • ') : 'NO SPECIALTY'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                        Dispatch →
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setAssignModal(null)} className="w-full py-4 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest">
              Cancel Operation
            </button>
          </div>
        )}
      </Modal>

      {/* ── EDIT USER MODAL ── */}
      <Modal open={!!editUserModal} onClose={() => setEditUserModal(null)} title="Modify User Account">
        {editUserModal && (
          <div className="space-y-5 p-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
              <input 
                value={editUserModal.username} 
                onChange={e => setEditUserModal({...editUserModal, username: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-black outline-none text-sm transition-all" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">System Role</label>
              <select 
                value={editUserModal.role} 
                onChange={e => setEditUserModal({...editUserModal, role: e.target.value, specialty: e.target.value !== 'WORKER' ? '' : editUserModal.specialty})}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-black outline-none text-sm font-bold transition-all"
              >
                <option value="USER">Standard User</option>
                <option value="WORKER">Field Worker</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
              
            {/* NEW: Multi-Select Specialty Block for Admins */}
            {editUserModal.role === 'WORKER' && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Assigned Specialties</label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_SPECIALTIES.map(sp => {
                    const selectedList = editUserModal.specialty ? editUserModal.specialty.split(',') : [];
                    const isSelected = selectedList.includes(sp);
                    
                    return (
                      <button
                        key={sp}
                        onClick={(e) => {
                          e.preventDefault();
                          const updated = isSelected 
                            ? selectedList.filter(item => item !== sp) 
                            : [...selectedList, sp];
                          setEditUserModal({...editUserModal, specialty: updated.join(',')});
                        }}
                        className={`px-3 py-3 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all text-left flex justify-between items-center ${isSelected ? 'bg-black text-white border-black shadow-md' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'}`}
                      >
                        {sp}
                        {isSelected && <span className="text-white">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={saveUserEdit}
              disabled={userSaving}
              className="w-full py-4 mt-4 bg-black text-white rounded-2xl font-bold text-sm shadow-xl shadow-black/10 disabled:opacity-50"
            >
              {userSaving ? 'Overwriting...' : 'Force Update Record'}
            </motion.button>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}