import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../shared/DashboardLayout';
import ComplaintCard from '../shared/ComplaintCard';
import StatCard from '../shared/StatCard';
import { apiGetWorkerComplaints, apiResolveComplaint } from '../../data/mockApi'; // ⬅️ REAL API

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetches only tasks assigned to this specific worker from MySQL
      const data = await apiGetWorkerComplaints(user.id);
      setComplaints(data);
    } catch (err) {
      console.error("Worker load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleResolve = async (id) => {
    setResolvingId(id);
    try {
      await apiResolveComplaint(id);
      await loadData();
    } catch (e) {
      alert("Resolution failed: " + e.message);
    } finally {
      setResolvingId(null);
    }
  };

  const assignedTasks = complaints.filter(c => c.status === 'ASSIGNED');
  const completedTasks = complaints.filter(c => c.status === 'RESOLVED');

  return (
    <DashboardLayout 
      title="Service Console" 
      navItems={[{ label: 'Active Tasks', icon: '🛠️', active: true, badge: assignedTasks.length }]}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Quick Stats for Worker */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Pending Repair" value={assignedTasks.length} color="blue" />
          <StatCard label="Completed Today" value={completedTasks.length} color="emerald" />
          <StatCard label="Current Status" value="On Duty" color="gray" />
        </div>

        {/* Work Orders Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-xl font-bold tracking-tight text-gray-900">Assigned Work Orders</h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              Verified {user?.specialty} Specialist
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map(i => <div key={i} className="h-48 rounded-3xl bg-gray-50 animate-pulse" />)}
            </div>
          ) : assignedTasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/30"
            >
              <div className="text-4xl mb-4">☕</div>
              <h4 className="text-lg font-bold text-gray-900">All caught up!</h4>
              <p className="text-sm text-gray-400 max-w-xs mx-auto mt-2">
                No new tasks assigned to your queue at the moment. Relax or check back later.
              </p>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {assignedTasks.map((c, index) => (
                  <motion.div
                    key={c.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ComplaintCard 
                      complaint={c} 
                      actions={
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={resolvingId === c.id}
                          onClick={() => handleResolve(c.id)}
                          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                        >
                          {resolvingId === c.id ? 'Updating...' : 'Finish Task'}
                        </motion.button>
                      }
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Recently Completed (Optional minimalist view) */}
        {completedTasks.length > 0 && (
          <div className="pt-10 opacity-60">
             <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 px-1">Recent Completions</h4>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {completedTasks.slice(0, 3).map(c => (
                  <div key={c.id} className="p-4 rounded-2xl bg-white border border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600 truncate max-w-[150px]">{c.description}</span>
                    <span className="text-[9px] font-bold text-emerald-500 uppercase">Resolved</span>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}