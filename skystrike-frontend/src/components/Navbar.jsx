// src/components/Navbar.jsx
import React from 'react';
// Import NavLink instead of Link
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // This style will be applied to the active NavLink
  const activeLinkStyle = {
    backgroundColor: 'hsl(var(--p))', // Use the primary color from daisyUI
    color: 'hsl(var(--pc))', // Use the primary-content color
  };

  return (
    <div className="navbar bg-base-100/50 backdrop-blur-sm shadow-lg px-4 sticky top-0 z-50">
      <div className="flex-1">
        <NavLink to="/" className="btn btn-ghost text-xl">
          <span className="text-primary font-bold">SKYSTRIKE</span> Command
        </NavLink>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li><NavLink to="/" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Dashboard</NavLink></li>
          {userRole === 'Air Battle Manager' && (
            <li><NavLink to="/missions" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Missions</NavLink></li>
          )}
          <li>
            <details>
              <summary>Profile</summary>
              <ul className="p-2 bg-base-100 rounded-t-none">
                <li><NavLink to="/profile">View Profile</NavLink></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;