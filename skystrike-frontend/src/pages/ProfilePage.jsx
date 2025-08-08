
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to view this page.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5001/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token'); // Clear bad token
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  if (!user) {
    return <div>Could not load user profile.</div>
  }

  return (
    <div className="container mx-auto p-8">
      <div className="card lg:card-side bg-base-100 shadow-xl">
        <figure className="p-8">
            
          <img 
            src={`http://localhost:5001/${user.profilePicture}`} 
            alt="Profile"
            className="rounded-full w-48 h-48 object-cover ring ring-primary ring-offset-base-100 ring-offset-2"
            />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-4xl">{user.name}</h2>
          <p className="text-2xl text-accent">"{user.callsign}"</p>
          <div className="divider"></div>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Flight Hours:</strong> {user.flightHours}</p>
          <div className="card-actions justify-end mt-4">
            <button onClick={handleLogout} className="btn btn-outline btn-error">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;