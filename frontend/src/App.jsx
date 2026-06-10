import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';

const DashboardWrapper = () => {
  const role = localStorage.getItem('userRole');
  if (role === 'ADMIN') return <AdminDashboard />;
  if (role === 'CUSTOMER') return <CustomerDashboard />;
  return <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        {/* Global Notification Container */}
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<DashboardWrapper />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;