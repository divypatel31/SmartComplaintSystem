import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../shared/DashboardLayout';
import ComplaintCard from '../shared/ComplaintCard';
import StatCard from '../shared/StatCard';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

import { 
  apiGetMyComplaints, 
  apiSubmitComplaint, 
  apiGetNotices, 
  apiDeleteNotice 
} from '../../data/mockApi'; 

// 📡 NEW: Import the WebSocket Client
import { wsClient } from '../../data/websocketClient';

const CATEGORIES = [
  { id: 'PLUMBING',   icon: '🔧', label: 'Plumbing'   },
  { id: 'ELECTRICAL', icon: '⚡', label: 'Electrical'  },
  { id: 'IT',         icon: '💻', label: 'IT Support'  },
  { id: 'GENERAL',    icon: '📋', label: 'General'     },
];

const mapContainerStyle = { width: '100%', height: '200px', borderRadius: '12px' };
const defaultCenter = { lat: 20.5937, lng: 78.9629 }; 

export default function UserDashboard() {
  const { user } = useAuth();
  
  const [view, setView] = useState('overview'); 
  
  const [complaints, setComplaints] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modal, setModal] = useState(false); 
  const [filter, setFilter] = useState('ALL');
  
  const [form, setForm] = useState({ 
    description: '', 
    category: 'GENERAL',
    location: user?.location || '' 
  });
  const [imageFile, setImageFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [locMode, setLocMode] = useState('manual');
  const [detectingLoc, setDetectingLoc] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [compData, noticeData] = await Promise.all([
        apiGetMyComplaints(user.id),
        apiGetNotices(user.id)
      ]);
      setComplaints(compData);
      setNotices(noticeData);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 📡 NEW: Connect to WebSockets on mount
  useEffect(() => {
    // 1. Initial standard fetch
    loadData();

    // 2. Connect the live tunnel
    if (user?.id) {
      wsClient.connect(
        user.id,
        // When a new notice arrives (like a worker being assigned)
        (newNotice) => {
          setNotices((prev) => [newNotice, ...prev]);
          alert(`🔔 Live Alert: ${newNotice.title}`);
        },
        // When the global complaints change (we fetch the latest silent update)
        () => {
          loadData();
        }
      );
    }

    // 3. Cleanup: Stop listening when we leave the dashboard
    return () => {
      wsClient.disconnect();
    };
  }, [user]);

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

  const handleAutoDetect = (e) => {
    e.preventDefault();
    if (!navigator.geolocation) return alert("Your browser doesn't support geolocation.");
    
    setDetectingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMapCenter({ lat, lng });
        fetchAddress(lat, lng);
        setDetectingLoc(false);
      },
      () => {
        alert("Location access denied. Please type it manually.");
        setDetectingLoc(false);
      }
    );
  };

  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMapCenter({ lat, lng });
    fetchAddress(lat, lng);
  }, []);

  const handleSubmit = async () => {
    if (!form.description.trim() || !form.location.trim()) return alert("Please fill in all details.");
    setSubmitting(true);
    try {
      await apiSubmitComplaint({ ...form, userId: user.id }, imageFile);
      // Removed loadData() here because the WebSocket will tell us when it's done!
      setModal(false);
      setForm({ description: '', category: 'GENERAL', location: user?.location || '' });
      setImageFile(null); 
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNotice = async (id) => {
    try {
      await apiDeleteNotice(id);
      setNotices(notices.filter(n => n.id !== id));
    } catch (err) { 
      alert(err.message); 
    }
  };

  const filtered = filter === 'ALL' ? complaints : complaints.filter(c => c.status === filter);

  return (
    <DashboardLayout 
      title="Personal Hub" 
      navItems={[
        { label: 'Overview', icon: '💎', active: view === 'overview', onClick: () => setView('overview') },
        { label: 'Notice Center', icon: '🔔', active: view === 'notices', onClick: () => setView('notices') },
        { label: 'New Issue', icon: '➕', onClick: () => setModal(true) }
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {view === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative overflow-hidden rounded-[2rem] bg-black p-10 text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[80px] -mr-20 -mt-20" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-3xl font-bold tracking-tight mb-2">Welcome, {user?.username} ✨</h3>
                  <p className="text-gray-400 text-sm font-medium max-w-sm">
                    Your central command for reporting and tracking organizational maintenance.
                  </p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setModal(true)}
                  className="px-8 py-4 bg-white text-black rounded-2xl font-bold text-sm shadow-xl hover:bg-gray-100 transition-colors"
                >
                  + Create New Ticket
                </motion.button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="Active Requests" value={complaints.filter(c => c.status !== 'RESOLVED').length} color="blue" />
              <StatCard label="Resolved" value={complaints.filter(c => c.status === 'RESOLVED').length} color="emerald" />
              <StatCard label="Avg Response" value="Under 2h" color="gray" />
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex gap-6">
                {['ALL', 'PENDING', 'ASSIGNED', 'RESOLVED'].map(f => (
                  <button 
                    key={f} 
                    onClick={() => setFilter(f)}
                    className={`relative py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                      filter === f ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {f}
                    {filter === f && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2].map(i => <div key={i} className="h-44 rounded-3xl bg-gray-100 animate-pulse" />)}
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatePresence>
                  {filtered.map((c, index) => (
                    <motion.div
                      key={c.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ComplaintCard complaint={c} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        )}

        {view === 'notices' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-gray-900">System Alerts</h3>
                <p className="text-xs text-gray-500 font-medium mt-1">Real-time updates regarding your tickets and actions.</p>
              </div>
              <div className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold border border-amber-100 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                Total Alerts: {notices.length}
              </div>
            </div>

            {notices.length === 0 ? (
               <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                 <p className="text-4xl mb-4">📭</p>
                 <p className="text-gray-400 font-bold">You're all caught up!</p>
                 <p className="text-xs text-gray-400 mt-1">No new system notices right now.</p>
               </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {notices.map(n => (
                    <motion.div 
                      key={n.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="glass p-5 rounded-2xl border border-white/40 shadow-sm flex items-start justify-between gap-4 group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl shadow-inner border border-blue-100 shrink-0">
                          🔔
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">{n.title}</h4>
                          <p className="text-sm text-gray-600 font-medium mt-1 leading-relaxed max-w-2xl">{n.message}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3">
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleDeleteNotice(n.id)}
                        className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Dismiss Notice"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setModal(false)} 
              className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
            />
            
            <motion.div 
              initial={{ x: '100%', opacity: 0.5 }} 
              animate={{ x: 0, opacity: 1 }} 
              exit={{ x: '100%', opacity: 0.5 }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg h-screen bg-white shadow-2xl flex flex-col"
            >
              
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white sticky top-0 z-10">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">New Request</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">Submit an issue to the maintenance team.</p>
                </div>
                <button 
                  onClick={() => setModal(false)} 
                  className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-black transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                
                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Issue Category</label>
                  <div className="grid grid-cols-2 gap-3">
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => setForm(f => ({ ...f, category: cat.id }))}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                          form.category === cat.id ? 'border-black bg-black text-white shadow-xl' : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <span className="text-[10px] font-bold uppercase">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Incident Location</label>
                    <div className="flex bg-gray-100 rounded-lg p-0.5">
                      <button onClick={(e) => { e.preventDefault(); setLocMode('manual'); }} className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${locMode === 'manual' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}>Type</button>
                      <button onClick={(e) => { e.preventDefault(); setLocMode('map'); }} className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${locMode === 'map' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}>Map</button>
                    </div>
                  </div>

                  {locMode === 'manual' ? (
                    <input 
                      value={form.location} 
                      onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} 
                      className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-black outline-none transition-all text-sm focus:ring-4 focus:ring-black/5" 
                      placeholder="Where exactly is the issue?" 
                    />
                  ) : (
                    <div className="relative w-full rounded-xl border border-gray-200 overflow-hidden bg-gray-50 shadow-inner">
                      <div className="p-2 flex justify-between items-center bg-white border-b border-gray-100 z-10 relative">
                        <button 
                          onClick={handleAutoDetect} 
                          disabled={detectingLoc} 
                          className="px-4 py-2 bg-black text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                          {detectingLoc ? 'Locating...' : '📍 Auto-Detect GPS'}
                        </button>
                      </div>

                      {isLoaded ? (
                        <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={15} onClick={onMapClick} options={{ disableDefaultUI: true, zoomControl: true }}>
                          {form.location && <Marker position={mapCenter} animation={window.google.maps.Animation.DROP} />}
                        </GoogleMap>
                      ) : (
                        <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm font-bold bg-gray-100 animate-pulse">
                          Initializing Maps Engine...
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

                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Attach Evidence (Photo)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-black outline-none transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-black file:text-white hover:file:bg-gray-800"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Detailed Description</label>
                  <textarea 
                    className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all text-sm h-40 resize-none"
                    placeholder="Provide as much detail as possible..."
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0 z-10">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  disabled={submitting || !form.description.trim() || !form.location.trim()}
                  onClick={handleSubmit}
                  className="w-full py-4 bg-black text-white rounded-2xl font-bold text-sm shadow-xl shadow-black/10 disabled:opacity-50"
                >
                  {submitting ? 'Dispatching...' : 'Dispatch Ticket →'}
                </motion.button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </DashboardLayout>
  );
}