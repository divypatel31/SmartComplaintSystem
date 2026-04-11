import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Notice we now just ask for 'username' but the label says Email or Username
  // Our Spring Boot backend is smart enough to check both!
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form);
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'WORKER') navigate('/worker');
      else navigate('/user');
    } catch (err) {
      setError("Invalid Email/Username or Password.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#0A0A0A] flex-col justify-between p-16 relative overflow-hidden">
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-600/20 blur-[120px]" />
        <motion.div animate={{ scale: [1, 1.3, 1], x: [0, 50, 0] }} transition={{ duration: 15, repeat: Infinity }} className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-purple-600/10 blur-[100px]" />

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-display font-bold text-white text-xl tracking-tight">ResolveIQ</span>
        </motion.div>

        <div className="relative z-10">
          <motion.h2 initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="font-display font-bold text-white text-5xl leading-[1.1] mb-6 tracking-tight">
            Efficiency through <br/><span className="text-blue-500">Intelligent</span> Design.
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-gray-400 text-lg font-body leading-relaxed max-w-sm">
            The modern standard for organizational transparency and rapid issue resolution.
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="relative z-10 flex gap-4">
          {[{ n: '98%', l: 'Uptime' }, { n: '10ms', l: 'Latency' }].map(({ n, l }) => (
            <div key={l} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex-1">
              <p className="font-display font-bold text-white text-2xl tracking-tighter">{n}</p>
              <p className="text-gray-500 text-xs font-mono uppercase tracking-widest mt-1">{l}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[380px]">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="font-display font-bold text-gray-900 text-3xl tracking-tight mb-2">Sign in</h1>
            <p className="text-gray-500 font-body">Enter your credentials to access your dashboard.</p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                Email or Username
              </label>
              <input 
                name="username" 
                value={form.username} 
                onChange={handle}
                className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all font-body text-sm" 
                placeholder="Ex: user@mail.com or User" 
                required 
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[10px] font-bold text-blue-600 hover:underline">Forgot?</button>
              </div>
              <div className="relative">
                <input 
                  name="password" 
                  value={form.password} 
                  onChange={handle}
                  type={showPwd ? 'text' : 'password'}
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all font-body text-sm pr-16" 
                  placeholder="••••••••" 
                  required 
                />
                <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[10px] font-bold uppercase text-gray-400 hover:text-black transition-colors">
                  {showPwd ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold border border-red-100">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full py-4 bg-black text-white rounded-xl font-bold text-sm shadow-xl shadow-black/10 hover:bg-gray-900 transition-all disabled:opacity-50">
              {loading ? 'Authenticating...' : 'Continue'}
            </motion.button>
          </form>

          <footer className="mt-8 text-center">
            <p className="text-sm text-gray-500 font-body">
              New to the platform? <Link to="/register" className="text-black font-bold hover:underline">Create account</Link>
            </p>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}