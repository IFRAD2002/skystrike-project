// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import PilotMissionHistory from '../components/PilotMissionHistory';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // This state now only needs to hold the mission ID
  const [selectedMissionId, setSelectedMissionId] = useState(null);
  const [flightHours, setFlightHours] = useState('');
  const [flightDate, setFlightDate] = useState('');

  const navigate = useNavigate();

  const fetchProfile = async () => {
    // This function can be simplified now, we'll keep it as is for consistency
    // but the mission fetching is now fully in the child component.
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in.');
      return navigate('/login');
    }
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const profileRes = await API.get('/auth/me', { headers });
      setUser(profileRes.data.data);
    } catch (error) {
      toast.error('Session expired. Please log in again.');
      localStorage.clear();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // The function now only takes the missionId
  const openLogModal = (missionId) => {
    setSelectedMissionId(missionId);
    setFlightDate(new Date().toISOString().split('T')[0]);
    setFlightHours('');
    document.getElementById('log_flight_modal').showModal();
  };

  const handleLogFlightSubmit = async () => {
    if (!flightHours || !flightDate) return toast.error('Please enter hours and a date.');
    const { missionId, assignmentId } = selectedAssignment;
    console.log("Submitting to backend with these values:");
    console.log("Mission ID:", missionId);
    console.log("Assignment ID:", assignmentId);
    console.log("Flight Hours:", flightHours);
    console.log("Flight Date:", flightDate);
    try {
        const token = localStorage.getItem('token');
        // The API call is now simpler
        await API.put(`/missions/${selectedMissionId}/log`, 
            { flightHours, flightDate },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Flight hours logged!");
        document.getElementById('log_flight_modal').close();
        // Re-fetch profile to update total flight hours
        fetchProfile(); 
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

  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* Profile Card */}
      <div className="card lg:card-side bg-base-100 shadow-xl">
        <figure className="p-8"><img src={imageSrc} alt="Profile" className="rounded-full w-48 h-48 object-cover ring ring-primary ring-offset-base-100 ring-offset-2"/></figure>
        <div className="card-body">
          <h2 className="card-title text-4xl">{user.name}</h2>
          <p className="text-2xl text-accent">"{user.callsign}"</p>
          <div className="divider"></div>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {user.role === 'Pilot' && <p><strong>Flight Hours:</strong> {user.flightHours.toFixed(1)}</p>}
          <div className="card-actions justify-end mt-4"><button onClick={handleLogout} className="btn btn-outline btn-error">Logout</button></div>
        </div>
      </div>

      {/* Conditionally render the new Mission History component */}
      {user.role === 'Pilot' && <PilotMissionHistory user={user} openLogModal={openLogModal} />}

      {/* Log Flight Modal */}
      <dialog id="log_flight_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Log Flight Hours</h3>
          <div className="py-4 space-y-4">
            <div><label className="label"><span className="label-text">Flight Date</span></label><input type="date" className="input input-bordered w-full" value={flightDate} onChange={(e) => setFlightDate(e.target.value)} /></div>
            <div><label className="label"><span className="label-text">Hours Flown</span></label><input type="number" step="0.1" placeholder="e.g., 2.5" className="input input-bordered w-full" value={flightHours} onChange={(e) => setFlightHours(e.target.value)} /></div>
          </div>
          <div className="modal-action"><button onClick={handleLogFlightSubmit} className="btn btn-primary">Submit Log</button><form method="dialog"><button className="btn">Cancel</button></form></div>
        </div>
      </dialog>
    </div>
  );
};

export default ProfilePage;