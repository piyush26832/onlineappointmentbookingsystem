import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/app/components/context/AuthContext';
import { LoginPage } from '@/app/components/auth/LoginPage';
import { SignupPage } from '@/app/components/auth/SignupPage';
import { UserDashboard } from '@/app/components/dashboard/UserDashboard';
import { ProfessionalDashboard } from '@/app/components/dashboard/ProfessionalDashboard';
import { AdminDashboard } from '@/app/components/dashboard/AdminDashboard';
import { ProfessionalList } from '@/app/components/booking/ProfessionalList';
import { ProfessionalProfile } from '@/app/components/booking/ProfessionalProfile';
import { Toaster } from '@/app/components/ui/sonner';
import { initializeMockData } from '@/app/lib/mockData';

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: string[];
}> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="size-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate
              to={
                user.role === 'admin'
                  ? '/admin'
                  : user.role === 'professional'
                  ? '/professional'
                  : '/dashboard'
              }
              replace
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
      <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" replace />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/professionals"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <ProfessionalList />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/professionals/:id"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <ProfessionalProfile />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/professional"
        element={
          <ProtectedRoute allowedRoles={['professional']}>
            <ProfessionalDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="dark min-h-screen">
          <AppRoutes />
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
