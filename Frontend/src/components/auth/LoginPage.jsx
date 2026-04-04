import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [form,     setForm]    = useState({ username: '', password: '' });
  const [error,    setError]   = useState('');
  const [loading,  setLoading] = useState(false);
  const [showPwd,  setShowPwd] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form);
      if      (user.role === 'ADMIN')  navigate('/admin');
      else if (user.role === 'WORKER') navigate('/worker');
      else                             navigate('/user');
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const quickFill = (u, p) => setForm({ username: u, password: p });

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-brand-600 flex-col justify-between p-12 relative overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-500 opacity-50" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-brand-700 opacity-60" />
        <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-brand-400 opacity-20 -translate-y-1/2 translate-x-1/2" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="font-display font-bold text-white text-lg">ResolveIQ</span>
        </div>

        {/* Tagline */}
        <div className="relative z-10">
          <h2 className="font-display font-bold text-white text-4xl leading-tight mb-4">
            Resolve issues faster,<br/>together.
          </h2>
          <p className="text-brand-200 text-base font-body leading-relaxed max-w-xs">
            A unified platform for submitting, tracking and resolving complaints across your organisation.
          </p>
        </div>

        {/* Stats row */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { n: '98%', l: 'Resolution rate' },
            { n: '2x',  l: 'Faster response' },
            { n: '24h', l: 'Avg. close time'  },
          ].map(({ n, l }) => (
            <div key={l} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="font-display font-bold text-white text-2xl">{n}</p>
              <p className="text-brand-200 text-xs font-body mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-slide-up">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-display font-bold text-gray-900 text-lg">ResolveIQ</span>
          </div>

          <h1 className="font-display font-bold text-gray-900 text-2xl mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm font-body mb-8">Sign in to your account to continue.</p>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block section-label mb-2">Username</label>
              <input name="username" value={form.username} onChange={handle}
                className="input-field" placeholder="Enter username" required />
            </div>
            <div>
              <label className="block section-label mb-2">Password</label>
              <div className="relative">
                <input name="password" value={form.password} onChange={handle}
                  type={showPwd ? 'text' : 'password'}
                  className="input-field pr-11" placeholder="Enter password" required />
                <button type="button" onClick={() => setShowPwd(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPwd ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-fade-in">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6 font-body">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 hover:text-brand-700 font-semibold transition-colors">
              Create one free
            </Link>
          </p>

          {/* Dev quick-login */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="section-label text-center mb-3">Quick login — dev only</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Admin',  u: 'admin',   p: 'admin123',   color: 'text-red-600 bg-red-50 border-red-200'   },
                { label: 'User',   u: 'alice',   p: 'alice123',   color: 'text-brand-600 bg-brand-50 border-brand-200' },
                { label: 'Worker', u: 'charlie', p: 'charlie123', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
              ].map(({ label, u, p, color }) => (
                <button key={label} onClick={() => quickFill(u, p)}
                  className={`text-xs font-mono py-2 px-2 rounded-lg border font-medium transition-colors ${color}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
