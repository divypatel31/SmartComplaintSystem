import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const statusColors = {
  PENDING: {
    bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-200/50', dot: 'bg-amber-500', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]'
  },
  ASSIGNED: {
    bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-200/50', dot: 'bg-blue-500', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]'
  },
  RESOLVED: {
    bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-200/50', dot: 'bg-emerald-500', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]'
  }
};

const formatDateTime = (dateString) => {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
};

export default function ComplaintCard({ complaint, actions }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const style = statusColors[complaint.status] || statusColors.PENDING;

  // ── SMART DATA PARSING ──
  const reporterName  = complaint.user?.username || complaint.username || `User #${complaint.userId}`;
  const reporterPhone = complaint.user?.mobileNumber || complaint.userMobile || 'No number provided';
  const reporterLoc   = complaint.user?.location || complaint.userLocation || 'No location provided';

  const workerName    = complaint.worker?.username || complaint.workerName || (complaint.workerId ? `Worker #${complaint.workerId}` : 'Unassigned');
  const workerPhone   = complaint.worker?.mobileNumber || complaint.workerMobile || 'No number provided';
  const workerSpec    = complaint.worker?.specialty || complaint.category;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => setIsExpanded(!isExpanded)}
      className={`glass relative group overflow-hidden p-6 rounded-[2rem] border transition-colors duration-300 cursor-pointer shadow-xl shadow-black/[0.02] ${isExpanded ? 'border-gray-300' : 'border-white/40'}`}
    >
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-20 transition-colors duration-500 ${style.dot}`} />

      <div className="relative z-10">
        
        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${style.dot} ${style.glow} animate-pulse`} />
            <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono">
              TICKET-{String(complaint.id).padStart(4, '0')}
            </span>
          </div>
          
          <div className="flex flex-col sm:items-end gap-2">
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                {complaint.category}
              </span>
              <span className={`px-3 py-1 rounded-full ${style.bg} ${style.text} ${style.border} text-[10px] font-black uppercase tracking-wider border`}>
                {complaint.status}
              </span>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {formatDateTime(complaint.createdAt)}
            </span>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="mb-6">
          <p className="text-gray-800 font-medium leading-relaxed text-[15px] line-clamp-3">
            {complaint.description}
          </p>
        </div>

        {/* ── FOOTER (Always Visible) ── */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100/50" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm">
              <span className="text-[10px] font-bold text-gray-600">{reporterName[0].toUpperCase()}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-900 uppercase tracking-tight">Reported By</p>
              <p className="text-[10px] font-medium text-gray-400">{reporterName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {actions}
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-200">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </motion.div>
          </div>
        </div>

        {/* ── EXPANDED DETAILS ── */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden border-t border-gray-100/80 pt-6"
              onClick={(e) => e.stopPropagation()} 
            >
              {/* 📸 NEW: Image Display Block */}
              {complaint.imageUrl && (
                <div className="mb-6">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Attached Evidence</p>
                  <motion.img 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    src={complaint.imageUrl} 
                    alt="Evidence" 
                    className="w-full max-h-[300px] object-cover rounded-[1.5rem] border border-gray-100 shadow-md hover:shadow-lg transition-shadow"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* User Details Box */}
                <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-3">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Reporter Info</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Name</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{reporterName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Phone No.</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{reporterPhone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Live Location</p>
                    <p className="text-sm font-bold text-gray-900">{reporterLoc}</p>
                  </div>
                </div>

                {/* Worker Details Box */}
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50 space-y-3">
                  <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">Dispatch Info</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] font-bold text-blue-400 uppercase">Worker Name</p>
                      <p className="text-sm font-bold text-blue-900 truncate">{workerName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-blue-400 uppercase">Phone No.</p>
                      <p className="text-sm font-bold text-blue-900 truncate">{workerPhone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-400 uppercase">Specialty</p>
                    <p className="text-sm font-bold text-blue-900">{workerSpec}</p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}