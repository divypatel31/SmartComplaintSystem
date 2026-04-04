import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const roleStyle = {
  ADMIN:  { badge: 'bg-red-100 text-red-700 border-red-200',    dot: 'bg-red-500'   },
  USER:   { badge: 'bg-brand-100 text-brand-700 border-brand-200', dot: 'bg-brand-500' },
  WORKER: { badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
};

export default function DashboardLayout({ children, navItems, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const rs = roleStyle[user?.role] || roleStyle.USER;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ─────────────────────────────── */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 z-30 flex flex-col
        bg-white border-r border-gray-100 shadow-card
        transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="font-display font-bold text-gray-900 text-sm">ResolveIQ</p>
            <p className="font-mono text-xs text-gray-400">v1.0 · mock data</p>
          </div>
        </div>

        {/* User pill */}
        <div className="px-4 pt-4 pb-3 border-b border-gray-100">
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 border ${rs.badge}`}>
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center font-display font-bold text-white text-sm flex-shrink-0">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-display font-semibold text-gray-900 text-sm truncate">{user?.username}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${rs.dot}`} />
                <span className="font-mono text-xs text-gray-500">
                  {user?.role}{user?.specialty ? ` · ${user.specialty}` : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          <p className="section-label px-3 pb-2 pt-1">Navigation</p>
          {navItems?.map(item => (
            <div key={item.label}
              onClick={() => { item.onClick?.(); setSidebarOpen(false); }}
              className={`sidebar-link ${item.active ? 'active' : ''}`}>
              <span className="text-base">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge != null && (
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-brand-100 text-brand-700">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-gray-500 hover:text-red-600 hover:bg-red-50
              transition-all duration-150 font-body font-semibold text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────── */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex items-center gap-4 px-6 py-4
          bg-white/90 backdrop-blur-sm border-b border-gray-100">
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="font-display text-lg font-bold text-gray-900 flex-1">{title}</h2>
          {/* Breadcrumb dot indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-soft" />
            <span className="font-mono text-xs text-amber-700">Mock Data Mode</span>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
