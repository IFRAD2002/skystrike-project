// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for the flight log modal
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [flightHours, setFlightHours] = useState('');
  const [flightDate, setFlightDate] = useState('');

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in.');
      navigate('/login');
      return;
    }
    try {
      const headers = { Authorization: `Bearer ${token}` };
      // Only fetch missions if the user is a Pilot
      const profileRes = await API.get('/auth/me', { headers });
      setUser(profileRes.data.data);

      if (profileRes.data.data.role === 'Pilot') {
        const missionsRes = await API.get('/missions', { headers });
        setMissions(missionsRes.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      toast.error('Session expired. Please log in again.');
      localStorage.clear();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openLogModal = (mission, assignment) => {
    setSelectedAssignment({ missionId: mission._id, assignmentId: assignment._id });
    setFlightDate(new Date().toISOString().split('T')[0]); // Default to today
    setFlightHours('');
    document.getElementById('log_flight_modal').showModal();
  };

  const handleLogFlightSubmit = async () => {
    if (!flightHours || !flightDate) return toast.error('Please enter hours and a date.');
    try {
        const token = localStorage.getItem('token');
        const { missionId, assignmentId } = selectedAssignment;
        await API.put(`/missions/${missionId}/assignments/${assignmentId}/log`, 
            { flightHours, flightDate },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Flight hours logged!");
        document.getElementById('log_flight_modal').close();
        fetchData(); // Refresh all data
    } catch (error) {
        toast.error(error.response?.data?.error || "Failed to log hours.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
  if (!user) return <div>Could not load user profile.</div>;

  const imageSrc = user.profilePicture.startsWith('http') ? user.profilePicture : `${import.meta.env.VITE_API_URL.replace('/api', '')}/${user.profilePicture}`;
  
  // Filter for completed missions assigned to this pilot
  const completedMissions = missions.filter(m => 
    m.status === 'COMPLETED' && m.assignments.some(a => a.pilot._id === user._id)
  );

  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* Profile Card */}
      <div className="card lg:card-side bg-base-100 shadow-xl">
        <figure className="p-8">
            <img 
            src={imageSrc}
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
          {/* Only show flight hours for Pilots */}
          {user.role === 'Pilot' && <p><strong>Flight Hours:</strong> {user.flightHours.toFixed(1)}</p>}
          <div className="card-actions justify-end mt-4">
            <button onClick={handleLogout} className="btn btn-outline btn-error">Logout</button>
          </div>
        </div>
      </div>

      {/* --- THIS IS THE KEY CHANGE --- */}
      {/* Only show the Mission History card if the user is a Pilot */}
      {user.role === 'Pilot' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Completed Mission History</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead><tr><th>Objective</th><th>Aircraft</th><th>Hours Logged</th><th>Actions</th></tr></thead>
                <tbody>
                  {completedMissions.length > 0 ? (
                      completedMissions.map(m => {
                          const assignment = m.assignments.find(a => a.pilot._id === user._id);
                          // Add a check to ensure assignment is found before rendering
                          if (!assignment) return null;
                          return (
                              <tr key={assignment._id}>
                                  <td>{m.objective}</td>
                                  <td>{assignment.aircraft.tailNumber}</td>
                                  <td>{assignment.flightHoursLogged ? `${assignment.flightHoursLogged.toFixed(1)} hrs` : 'Pending'}</td>
                                  <td>
                                      {!assignment.flightHoursLogged && (
                                          <button className="btn btn-primary btn-xs" onClick={() => openLogModal(m, assignment)}>
                                              Log Flight
                                          </button>
                                      )}
                                  </td>
                              </tr>
                          )
                      })
                  ) : (
                      <tr><td colSpan="4" className='text-center'>No completed missions found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Log Flight Modal */}
      <dialog id="log_flight_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Log Flight Hours</h3>
          <div className="py-4 space-y-4">
            <div>
                <label className="label"><span className="label-text">Flight Date</span></label>
                <input type="date" className="input input-bordered w-full" value={flightDate} onChange={(e) => setFlightDate(e.target.value)} />
            </div>
            <div>
                <label className="label"><span className="label-text">Hours Flown</span></label>
                <input type="number" step="0.1" placeholder="e.g., 2.5" className="input input-bordered w-full" value={flightHours} onChange={(e) => setFlightHours(e.target.value)} />
            </div>
          </div>
          <div className="modal-action">
            <button onClick={handleLogFlightSubmit} className="btn btn-primary">Submit Log</button>
            <form method="dialog"><button className="btn">Cancel</button></form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ProfilePage;