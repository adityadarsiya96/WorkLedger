import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import "./App.css"
import { useAuth } from './context/AuthContext';
import HeroSection from './pages/HeroSection'
import HowItWorks from './pages/HowItWorks'
import Features from './pages/Features'
import Footer from './pages/Footer'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HRDashboard from './pages/hr/HRDashboard'
import ManagerDashboard from './pages/manager/ManagerDashboard';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

const LandingPage = () => (
  <>
    <HeroSection />
    <HowItWorks />
    <Features />
    <Footer />
  </>
);

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return children;
};

const App = () => {
  return (
     <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route 
        path="/hr/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['HR']}>
            <HRDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/manager/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <ManagerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/employee/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['EMPLOYEE']}>
            <EmployeeDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
     </Routes>
    
   

    
  )
}

export default App
