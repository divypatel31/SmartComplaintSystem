import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SPECIALTIES = [
  { id: 'PLUMBING',   icon: '🔧', label: 'Plumbing',   desc: 'Pipes, drains & water systems'    },
  { id: 'ELECTRICAL', icon: '⚡', label: 'Electrical', desc: 'Wiring, outlets & power issues'   },
  { id: 'IT',         icon: '💻', label: 'IT Support',  desc: 'Networks, servers & tech support' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ username: '', password: '', role: 'USER', specialty: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [step,    setStep]    = useState(1);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const goStep2 = e => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) return setError('Please fill all fields.');
    if (form.password.length < 5) return setError('Password must be at least 5 characters.');
    setError(''); setStep(2);
  };

  const submit = async () => {
    if (form.role === 'WORKER' && !form.specialty) return setError('Please select your specialty.');
    setError(''); setLoading(true);
    try {
      const user = await register(form);
      navigate(user.role === 'WORKER' ? '/worker' : '/user');
    } catch (err) { setError(err.message); setStep(1); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-brand-600 to-brand-800 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-500 opacity-40" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-brand-900 opacity-50" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="font-display font-bold text-white text-lg">ResolveIQ</span>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="font-display font-bold text-white text-4xl leading-tight mb-4">
              Join thousands<br/>of teams today.
            </h2>
            <p className="text-brand-200 font-body text-base leading-relaxed max-w-xs">
              Set up in minutes. No credit card required.
            </p>
          </div>
          <div className="space-y-3">
            {['Submit complaints instantly', 'Real-time status tracking', 'Smart worker assignment'].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-brand-100 text-sm font-body">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-brand-300 text-xs font-body">© 2025 ResolveIQ. All rights reserved.</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-slide-up">

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-mono font-bold transition-all duration-300 ${
                  s === step ? 'bg-brand-600 text-white shadow-brand' :
                  s < step   ? 'bg-emerald-500 text-white' :
                  'bg-gray-200 text-gray-400'
                }`}>{s < step ? '✓' : s}</div>
                <span className={`text-xs font-body ${s === step ? 'text-gray-700 font-semibold' : 'text-gray-400'}`}>
                  {s === 1 ? 'Account details' : 'Choose role'}
                </span>
                {s < 2 && <div className={`flex-1 h-px w-8 ${step > s ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          <h1 className="font-display font-bold text-gray-900 text-2xl mb-1">
            {step === 1 ? 'Create your account' : 'How will you use ResolveIQ?'}
          </h1>
          <p className="text-gray-500 text-sm font-body mb-8">
            {step === 1 ? 'Fill in your details to get started.' : 'Choose your role in the system.'}
          </p>

          {step === 1 && (
            <form onSubmit={goStep2} className="space-y-5 animate-fade-in">
              <div>
                <label className="block section-label mb-2">Username</label>
                <input name="username" value={form.username} onChange={handle}
                  className="input-field" placeholder="Pick a username" required />
              </div>
              <div>
                <label className="block section-label mb-2">Password</label>
                <input name="password" value={form.password} onChange={handle}
                  type="password" className="input-field" placeholder="Min. 5 characters" required />
              </div>
              {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-fade-in">{error}</div>
              )}
              <button type="submit" className="btn-primary w-full py-3">Continue →</button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              {/* Role pick */}
              <div>
                <label className="block section-label mb-3">I am a…</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'USER',   icon: '👤', label: 'Normal User',  desc: 'Submit & track issues'  },
                    { id: 'WORKER', icon: '🛠️', label: 'Field Worker', desc: 'Resolve assigned tasks' },
                  ].map(r => (
                    <button key={r.id} type="button"
                      onClick={() => setForm(f => ({ ...f, role: r.id, specialty: '' }))}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-150 ${
                        form.role === r.id
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}>
                      <div className="text-2xl mb-1">{r.icon}</div>
                      <p className={`font-display font-semibold text-sm ${form.role === r.id ? 'text-brand-700' : 'text-gray-800'}`}>{r.label}</p>
                      <p className="text-xs text-gray-400 font-body mt-0.5">{r.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialty (workers only) */}
              {form.role === 'WORKER' && (
                <div className="animate-slide-down">
                  <label className="block section-label mb-3">Your specialty</label>
                  <div className="space-y-2">
                    {SPECIALTIES.map(sp => (
                      <button key={sp.id} type="button"
                        onClick={() => setForm(f => ({ ...f, specialty: sp.id }))}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 ${
                          form.specialty === sp.id
                            ? 'border-brand-500 bg-brand-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}>
                        <span className="text-xl">{sp.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-display font-semibold text-sm ${form.specialty === sp.id ? 'text-brand-700' : 'text-gray-800'}`}>{sp.label}</p>
                          <p className="text-xs text-gray-400 font-body">{sp.desc}</p>
                        </div>
                        {form.specialty === sp.id && (
                          <div className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
              )}

              <div className="flex gap-3">
                <button onClick={() => { setStep(1); setError(''); }} className="btn-secondary flex-1 py-3">← Back</button>
                <button onClick={submit} disabled={loading} className="btn-primary flex-1 py-3 disabled:opacity-60">
                  {loading ? 'Creating…' : 'Create Account'}
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-6 font-body">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 hover:text-brand-700 font-semibold transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
