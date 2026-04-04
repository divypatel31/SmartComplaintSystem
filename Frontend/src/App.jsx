import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage    from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import UserDashboard   from './components/dashboards/UserDashboard';
import AdminDashboard  from './components/dashboards/AdminDashboard';
import WorkerDashboard from './components/dashboards/WorkerDashboard';

// Route guards
function RequireAuth({ children, role }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role && user.role !== role) return <Navigate to={redirectFor(user.role)} replace />;
  return children;
}

function GuestOnly({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to={redirectFor(user.role)} replace />;
  return children;
}

const redirectFor = role =>
  ({ ADMIN: '/admin', WORKER: '/worker', USER: '/user' }[role] || '/login');

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? redirectFor(user.role) : '/login'} replace />} />

      <Route path="/login"    element={<GuestOnly><LoginPage    /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />

      <Route path="/user"   element={<RequireAuth role="USER">  <UserDashboard   /></RequireAuth>} />
      <Route path="/admin"  element={<RequireAuth role="ADMIN"> <AdminDashboard  /></RequireAuth>} />
      <Route path="/worker" element={<RequireAuth role="WORKER"><WorkerDashboard /></RequireAuth>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
