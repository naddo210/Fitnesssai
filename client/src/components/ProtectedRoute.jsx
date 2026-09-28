import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark text-primary">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return user ? <Layout><Outlet /></Layout> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
