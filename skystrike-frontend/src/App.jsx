
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import MissionsPage from './pages/MissionsPage';

// Import Layouts and Route Protection
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

function App() {
  return (
    <div data-theme="dark" className="min-h-screen bg-cover bg-center bg-fixed hero-overlay bg-opacity-60" 
         style={{backgroundImage: 'url(https://images.unsplash.com/photo-1518365666497-654acc04138a?q=80&w=2938&auto=format&fit=crop)'}}>
      <Toaster />
      <Routes>
        {/* Public routes without the Navbar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Parent route for all protected pages that WILL have the Navbar */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/missions" element={<MissionsPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;