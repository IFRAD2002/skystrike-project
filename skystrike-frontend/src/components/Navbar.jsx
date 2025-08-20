// src/components/Navbar.jsx
import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaBell } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const activeLinkStyle = {
    backgroundColor: 'hsl(var(--p))',
    color: 'hsl(var(--pc))',
  };

  return (
    <div className="navbar bg-base-100/50 backdrop-blur-sm shadow-lg px-4 sticky top-0 z-50">
      <div className="flex-1">
        <NavLink to="/" className="btn btn-ghost text-xl">
          <span className="text-primary font-bold">SKYSTRIKE</span>
          <span className="font-light">COMMAND</span>
        </NavLink>
      </div>
      <div className="flex-none">
        <Link to="/notifications" className="btn btn-ghost btn-circle">
            <div className="indicator">
                <FaBell className="h-5 w-5" />
            </div>
        </Link>

        <ul className="menu menu-horizontal px-1">
          <li><NavLink to="/" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Dashboard</NavLink></li>
          {userRole === 'Air Battle Manager' && (
            <>
              <li><NavLink to="/missions" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Missions</NavLink></li>
              <li><NavLink to="/reports" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Reports</NavLink></li>
            </>
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