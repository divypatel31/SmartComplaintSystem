import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const SPECIALTIES = [
  { id: 'PLUMBING', icon: '🔧', label: 'Plumbing', desc: 'Pipes & water systems' },
  { id: 'ELECTRICAL', icon: '⚡', label: 'Electrical', desc: 'Wiring & power' },
  { id: 'IT', icon: '💻', label: 'IT Support', desc: 'Networks & tech' },
];

// Map Settings
const mapContainerStyle = { width: '100%', height: '200px', borderRadius: '12px' };
const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Default: India

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    role: '', specialty: '', location: '', email: '', username: '', password: '', confirmPassword: '', mobileNumber: ''
  });

  const [locMode, setLocMode] = useState('manual');
  const [detectingLoc, setDetectingLoc] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // 1. Load Google Maps API Securely
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  // 2. Reverse Geocoding (GPS to Address)
  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setForm(f => ({ ...f, location: data.results[0].formatted_address }));
      } else {
        setForm(f => ({ ...f, location: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}` }));
      }
    } catch (err) {
      console.error("Geocoding failed", err);
    }
  };

  // 3. Auto-Detect GPS
  const handleAutoDetect = (e) => {
    e.preventDefault();
    if (!navigator.geolocation) return setError("Your browser doesn't support geolocation.");
    
    setDetectingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMapCenter({ lat, lng });
        fetchAddress(lat, lng);
        setDetectingLoc(false);
      },
      (err) => {
        setError("Location access denied. Please type it manually.");
        setDetectingLoc(false);
      }
    );
  };

  // 4. Map Click Handler
  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMapCenter({ lat, lng });
    fetchAddress(lat, lng);
  }, []);

  const nextStep = (e) => {
    e?.preventDefault();
    setError('');
    if (step === 1) {
      if (!form.role) return setError('Please select an account type to continue.');
      setStep(2);
    } else if (step === 2) {
      if (form.role === 'WORKER' && !form.specialty) return setError('Please select at least one specialty.');
      if (!form.location.trim()) return setError('Please provide your location.');
      setStep(3);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email.includes('@')) return setError('Valid email is required.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');

    setLoading(true);
    try {
      const user = await register(form);
      navigate(user.role === 'WORKER' ? '/worker' : '/user');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* ── Left Branding Panel ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#0A0A0A] flex-col justify-between p-16 relative overflow-hidden">
        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, -45, 0] }} transition={{ duration: 25, repeat: Infinity }} className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px]" />
        <motion.div animate={{ scale: [1, 1.2, 1], x: [0, -30, 0] }} transition={{ duration: 18, repeat: Infinity }} className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-indigo-600/20 blur-[100px]" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-display font-bold text-white text-xl tracking-tight">ResolveIQ</span>
        </div>

        <div className="relative z-10">
          <h2 className="font-display font-bold text-white text-5xl leading-tight mb-8 tracking-tight">
            Empower your <br /><span className="text-indigo-500 font-extrabold italic">workflow.</span>
          </h2>
          <div className="space-y-6">
            {['Smart Routing', 'Geo-Targeted Tasks', 'Zero-config setup'].map((f) => (
              <div key={f} className="flex items-center gap-4 group">
                <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-indigo-500 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                </div>
                <span className="text-gray-400 text-sm font-medium tracking-wide">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-gray-600 text-xs font-mono uppercase tracking-[0.2em]">Designed for the future of work.</p>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 py-12">
        <div className="w-full max-w-[420px]">

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-4 mb-10">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all duration-500 ${s === step ? 'border-black bg-black text-white' : s < step ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-100 text-gray-300'}`}>
                  {s < step ? '✓' : s}
                </div>
                {s < 3 && <div className={`w-8 h-[2px] transition-colors duration-500 ${step > s ? 'bg-emerald-500' : 'bg-gray-100'}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* STEP 1: ROLE SELECTION */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="text-center lg:text-left mb-6">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">How will you join?</h1>
                  <p className="text-gray-500 text-sm">Select your primary objective on the platform.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'USER', label: 'Standard User', desc: 'I want to report and track issues.', icon: '👤' },
                    { id: 'WORKER', label: 'Field Specialist', desc: 'I am here to resolve assigned tasks.', icon: '🛠️' }
                  ].map(r => (
                    <button key={r.id} onClick={() => { setForm(f => ({ ...f, role: r.id, specialty: '' })); setError(''); }} className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all ${form.role === r.id ? 'border-black bg-gray-50 shadow-md' : 'border-gray-100 hover:border-gray-200'}`}>
                      <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-2xl shadow-sm">{r.icon}</div>
                      <div>
                        <p className="font-bold text-gray-900">{r.label}</p>
                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-tight mt-0.5">{r.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {error && <p className="text-xs font-bold text-red-500 text-center">{error}</p>}

                <motion.button whileTap={{ scale: 0.98 }} onClick={nextStep} className="w-full py-4 bg-black text-white rounded-xl font-bold text-sm shadow-xl mt-4">
                  Continue Setup →
                </motion.button>
              </motion.div>
            )}

            {/* STEP 2: LOCATION & SPECIALTY */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="text-center lg:text-left mb-4">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Service Details</h1>
                  <p className="text-gray-500 text-sm">Help us connect you locally.</p>
                </div>

                {form.role === 'WORKER' && (
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Discipline</label>
                      <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-100">Multi-Select Allowed</span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {SPECIALTIES.map(sp => {
                        // NEW MULTI-SELECT LOGIC
                        const selectedList = form.specialty ? form.specialty.split(',') : [];
                        const isSelected = selectedList.includes(sp.id);

                        return (
                          <button 
                            key={sp.id} 
                            onClick={(e) => {
                              e.preventDefault();
                              setForm(f => {
                                const current = f.specialty ? f.specialty.split(',') : [];
                                const updated = isSelected 
                                  ? current.filter(item => item !== sp.id) 
                                  : [...current, sp.id];
                                return { ...f, specialty: updated.join(',') }; 
                              });
                            }} 
                            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isSelected ? 'border-black bg-black text-white shadow-md' : 'border-gray-100 text-gray-600 hover:bg-gray-50'}`}
                          >
                            <span className="text-xs font-bold uppercase tracking-widest">{sp.label}</span>
                            <div className="flex items-center gap-3">
                              <span>{sp.icon}</span>
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-white' : 'border-gray-300'}`}>
                                {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Base Location</label>
                    <div className="flex bg-gray-100 rounded-lg p-0.5">
                      <button onClick={(e) => { e.preventDefault(); setLocMode('manual'); }} className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${locMode === 'manual' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}>Type</button>
                      <button onClick={(e) => { e.preventDefault(); setLocMode('map'); }} className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${locMode === 'map' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}>Map</button>
                    </div>
                  </div>

                  {locMode === 'manual' ? (
                    <input name="location" value={form.location} onChange={handle} className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-black outline-none transition-all text-sm" placeholder="Enter your full address..." />
                  ) : (
                    <div className="relative w-full rounded-xl border border-gray-200 overflow-hidden bg-gray-50 shadow-inner">
                      <div className="p-2 flex justify-between items-center bg-white border-b border-gray-100 z-10 relative">
                        <button onClick={handleAutoDetect} disabled={detectingLoc} className="px-4 py-2 bg-black text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-md hover:bg-gray-800 disabled:opacity-50 transition-colors">
                          {detectingLoc ? 'Locating...' : '📍 Auto-Detect GPS'}
                        </button>
                      </div>

                      {isLoaded ? (
                        <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={15} onClick={onMapClick} options={{ disableDefaultUI: true, zoomControl: true }}>
                          {form.location && <Marker position={mapCenter} animation={window.google.maps.Animation.DROP} />}
                        </GoogleMap>
                      ) : (
                        <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm font-bold bg-gray-100 animate-pulse">
                          Loading Maps...
                        </div>
                      )}

                      {form.location && (
                        <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-md p-2 rounded-lg border border-gray-200 shadow-lg text-[10px] font-bold text-gray-700 truncate text-center pointer-events-none">
                          {form.location}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {error && <p className="text-xs font-bold text-red-500 px-1">{error}</p>}

                <div className="flex gap-3 pt-4">
                  <button onClick={(e) => { e.preventDefault(); setStep(1); setError(''); }} className="flex-1 py-4 rounded-xl font-bold text-sm text-gray-500 bg-gray-100 hover:bg-gray-200">Back</button>
                  <motion.button whileTap={{ scale: 0.98 }} onClick={nextStep} className="flex-[2] py-4 bg-black text-white rounded-xl font-bold text-sm shadow-xl">Proceed →</motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: CREDENTIALS */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="text-center lg:text-left mb-6">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Secure Account</h1>
                  <p className="text-gray-500 text-sm">Final step to create your profile.</p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email ID</label>
                      <input name="email" type="email" value={form.email} onChange={handle} className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-black outline-none transition-all text-sm" placeholder="divy@mail.com" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
                      <input name="mobileNumber" type="tel" value={form.mobileNumber} onChange={handle} className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-black outline-none transition-all text-sm" placeholder="+91 98765 43210" required />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
                    <input name="username" value={form.username} onChange={handle} className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-black outline-none transition-all text-sm" placeholder="alraj_24" required />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                      <input name="password" type="password" value={form.password} onChange={handle} className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-black outline-none transition-all text-sm" placeholder="••••••••" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm</label>
                      <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handle} className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-black outline-none transition-all text-sm" placeholder="••••••••" required />
                    </div>
                  </div>

                  {error && <p className="text-xs font-bold text-red-500 px-1 pt-1">{error}</p>}

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => { setStep(2); setError(''); }} className="flex-1 py-4 rounded-xl font-bold text-sm text-gray-500 bg-gray-100 hover:bg-gray-200">Back</button>
                    <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="flex-[2] py-4 bg-black text-white rounded-xl font-bold text-sm shadow-xl disabled:opacity-50">
                      {loading ? 'Finalizing...' : 'Create Account ✨'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-sm text-gray-400 mt-8">
            Already a member? <Link to="/login" className="text-black font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}