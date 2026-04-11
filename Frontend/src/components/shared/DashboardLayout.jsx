import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apiUpdateUser } from '../../data/mockApi'; // Ensure this is imported!

export default function DashboardLayout({ children, navItems, title }) {
  const { user, logout, updateLocalUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Profile Modal State ──
  const [showProfile, setShowProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ 
    location: user?.location || '', 
    mobileNumber: user?.mobileNumber || '' 
  });
  const [saving, setSaving] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      const updatedUser = await apiUpdateUser(user.id, profileForm);
      updateLocalUser(updatedUser); // Instantly updates context without refreshing
      setShowProfile(false);
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Side Navigation (Glassmorphic) ── */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 z-50 flex flex-col 
        bg-white/70 backdrop-blur-2xl border-r border-white/40 transition-transform duration-500 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div className="p-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 mb-12">
            <motion.div 
              whileHover={{ rotate: 180 }}
              className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </motion.div>
            <span className="text-xl font-black tracking-tighter text-gray-900">ResolveIQ</span>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {navItems?.map((item) => (
              <motion.div
                key={item.label}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  item.onClick?.();
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300
                  ${item.active 
                    ? 'bg-black text-white shadow-xl shadow-black/10' 
                    : 'text-gray-500 hover:bg-gray-100/50 hover:text-black'}`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
                
                {item.active && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-4 bg-white rounded-full ml-1"
                  />
                )}
              </motion.div>
            ))}
          </nav>
        </div>

        {/* User Workspace Bottom Section */}
        <div className="mt-auto p-6 space-y-4">
          <div className="p-4 rounded-3xl bg-gray-50/50 border border-gray-100">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Network Status</p>
             <div className="flex items-center gap-2 px-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-600">Secure Live Connection</span>
             </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl text-red-500 font-bold text-xs hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
          >
            Terminate Session
            <span>→</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Section */}
        <header className="px-8 lg:px-12 py-8 flex items-center justify-between sticky top-0 bg-[#F8FAFC]/60 backdrop-blur-xl z-40 border-b border-gray-100/50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden p-2 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
            <div>
               <h2 className="text-2xl font-black tracking-tight text-gray-900">{title}</h2>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Control Center</p>
            </div>
          </div>

          {/* ── Profile Trigger Avatar ── */}
          <div 
            className="flex items-center gap-4 group cursor-pointer" 
            onClick={() => setShowProfile(true)}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-gray-900 leading-none">{user?.username}</p>
              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.15em] mt-1.5 inline-block bg-blue-50 px-2 py-0.5 rounded-md">
                {user?.role}
              </p>
            </div>
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-black border-2 border-white shadow-sm flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                <span className="text-sm font-bold text-white">{user?.username?.[0].toUpperCase()}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <div className="flex-1 overflow-y-auto px-8 lg:px-12 py-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── PROFILE SETTINGS MODAL ── */}
      <AnimatePresence>
        {showProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            {/* Modal Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowProfile(false)} 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            />
            
            {/* Modal Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 10 }} 
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900">Account Profile</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">View and manage your information.</p>
                </div>
                <button 
                  onClick={() => setShowProfile(false)} 
                  className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Read-Only Information */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Username</span>
                  <span className="text-sm font-bold text-gray-900">{user?.username}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</span>
                  <span className="text-sm font-bold text-gray-900">{user?.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role Level</span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-md uppercase tracking-wider">{user?.role}</span>
                </div>
                {user?.role === 'WORKER' && (
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200/60 mt-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Specialty</span>
                    <span className="text-sm font-bold text-amber-600">{user?.specialty}</span>
                  </div>
                )}
              </div>

              {/* Editable Fields */}
              <div className="space-y-4 mb-8">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Current Location</label>
                  <input 
                    value={profileForm.location} 
                    onChange={e => setProfileForm({...profileForm, location: e.target.value})}
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-black outline-none text-sm transition-all focus:ring-4 focus:ring-black/5" 
                    placeholder="Enter your location"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
                  <input 
                    value={profileForm.mobileNumber} 
                    onChange={e => setProfileForm({...profileForm, mobileNumber: e.target.value})}
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-black outline-none text-sm transition-all focus:ring-4 focus:ring-black/5" 
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={handleProfileSave}
                disabled={saving}
                className="w-full py-4 bg-black text-white rounded-2xl font-bold text-sm shadow-xl shadow-black/10 disabled:opacity-50"
              >
                {saving ? 'Updating System...' : 'Save Changes'}
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}