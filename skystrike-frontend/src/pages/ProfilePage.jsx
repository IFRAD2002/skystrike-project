// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedMissionId, setSelectedMissionId] = useState(null);
  const [flightHours, setFlightHours] = useState('');
  const [flightDate, setFlightDate] = useState('');

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    // ... fetchData remains the same ...
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openLogModal = (missionId) => {
    setSelectedMissionId(missionId);
    setFlightDate(new Date().toISOString().split('T')[0]);
    setFlightHours('');
    document.getElementById('log_flight_modal').showModal();
  };

  const handleLogFlightSubmit = async () => {
    if (!flightHours || !flightDate) return toast.error('Please enter hours and a date.');
    try {
        const token = localStorage.getItem('token');
        // --- UPDATED API CALL ---
        // Now we only need the mission ID
        await API.put(`/missions/${selectedMissionId}/log`, 
            { flightHours, flightDate },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Flight hours logged!");
        document.getElementById('log_flight_modal').close();
        fetchData();
    } catch (error) {
        toast.error(error.response?.data?.error || "Failed to log hours.");
    }
  };

  const handleLogout = () => { /* ... */ };

  if (loading) return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
  if (!user) return <div>Could not load user profile.</div>;

  const imageSrc = user.profilePicture.startsWith('http') ? user.profilePicture : `${import.meta.env.VITE_API_URL.replace('/api', '')}/${user.profilePicture}`;
  
  const completedMissions = missions.filter(m => 
    m.status === 'COMPLETED' && m.assignments.some(a => a.pilot._id === user._id)
  );

  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* Profile Card ... remains the same */}
      <div className="card lg:card-side bg-base-100 shadow-xl">{/*...*/}</div>

      {/* Completed Mission History Card */}
      {user.role === 'Pilot' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Completed Mission History</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead><tr><th>Objective</th><th>Aircraft</th><th>Hours Logged</th><th>Actions</th></tr></thead>
                <tbody>
                  {completedMissions.map(m => {
                      const assignment = m.assignments.find(a => a.pilot._id === user._id);
                      if (!assignment) return null;
                      return (
                          <tr key={m._id + assignment._id}>
                              <td>{m.objective}</td>
                              <td>{assignment.aircraft.tailNumber}</td>
                              <td>{assignment.flightHoursLogged ? `${assignment.flightHoursLogged.toFixed(1)} hrs` : 'Pending'}</td>
                              <td>
                                  {!assignment.flightHoursLogged && (
                                      // --- UPDATED BUTTON ---
                                      <button className="btn btn-primary btn-xs" onClick={() => openLogModal(m._id)}>
                                          Log Flight
                                      </button>
                                  )}
                              </td>
                          </tr>
                      )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Log Flight Modal ... remains the same */}
      <dialog id="log_flight_modal" className="modal">{/*...*/}</dialog>
    </div>
  );
};

export default ProfilePage;