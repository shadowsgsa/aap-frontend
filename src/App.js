import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AppNavbar from './components/AppNavbar';
import SideMenu from './components/SideMenu';

// Pages
import HomePage from './pages/Home/HomePage';
import Content from './pages/Content/content';
import ManageContent from './pages/Content/manageContent';
import LoginPage from './pages/Auth/Login';
import SignupPage from './pages/Auth/createuser';
import { useEffect } from 'react';
// Auth helper

export default function App() {
  const isAuthenticated = () => {
  
  return !!localStorage.getItem("token"); // simple JWT check
};

// Protected route component
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

  const isAdmin = ()=>{
  const user = localStorage.getItem('role');
  if (user.toLowerCase() === 'admin'){

    return true;
    
  }
  return false;
}
const AdminRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin()) {
    // Logged in but not admin
    return <Navigate to="/" replace />; // or a "Not Authorized" page
  }
  return children;
};
  return (
    <Router>
      <CssBaseline />
      
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route 
          path="/" 
          element={
            <PrivateRoute>
                <HomePage />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/upload-content/:dept" 
          element={
            <AdminRoute>
                <Content />
            </AdminRoute>
          } 
        />
         <Route 
          path="/create-user" 
          element={
            <AdminRoute>
                <SignupPage />
            </AdminRoute>
          } 
        />
        <Route 
          path="/manage-content/:dept" 
          element={
            <PrivateRoute>
                <ManageContent />
            </PrivateRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// Optional layout wrapper to include navbar/sidebar

