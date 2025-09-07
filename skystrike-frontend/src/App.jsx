
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import MissionsPage from './pages/MissionsPage';
import AircraftDetailPage from './pages/AircraftDetailPage';
import ReportsPage from './pages/ReportsPage';
import NotificationsPage from './pages/NotificationsPage';
import AnalyticsPage from './pages/AnalyticsPage';

// Import Layouts and Route Protection
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

function App() {
  return (
    <div data-theme="dark" className="min-h-screen bg-cover bg-center bg-fixed hero-overlay bg-opacity-60" 
         style={{backgroundImage: 'url(/hangar-background.jpg)'}}>
      <Toaster />
      <Routes>
        {/* Public routes without the Navbar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Parent route for all protected pages that WILL have the Navbar */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/aircraft/:id" element={<AircraftDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;