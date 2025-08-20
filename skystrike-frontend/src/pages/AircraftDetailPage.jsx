// src/pages/AircraftDetailPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import toast from 'react-hot-toast';

const AircraftDetailPage = () => {
  const { id } = useParams();
  const [aircraft, setAircraft] = useState(null);
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for forms
  const [description, setDescription] = useState('');
  const [editFormData, setEditFormData] = useState({ model: '', tailNumber: '' });
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleNotes, setScheduleNotes] = useState('');
  
  const userRole = localStorage.getItem('userRole');

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [aircraftRes, logsRes] = await Promise.all([
        API.get(`/aircrafts/${id}`, { headers }),
        API.get(`/aircrafts/${id}/maintenance`, { headers }),
      ]);
      
      const craft = aircraftRes.data.data;
      setAircraft(craft);
      setMaintenanceLogs(logsRes.data.data);
      
      setEditFormData({ model: craft.model, tailNumber: craft.tailNumber });
      setScheduleDate(craft.scheduledMaintenanceDate ? new Date(craft.scheduledMaintenanceDate).toISOString().split('T')[0] : '');
      setScheduleNotes(craft.scheduledMaintenanceNotes || '');

    } catch (error) {
      toast.error('Failed to fetch aircraft details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Handlers for all forms ---
  const handleLogSubmit = async () => { /* ... remains the same */ };
  const handleEditSubmit = async () => { /* ... remains the same */ };
  
  const handleScheduleSubmit = async () => {
    if (!scheduleDate) return toast.error('Please select a date.');
    try {
      const token = localStorage.getItem('token');
      const body = {
        scheduledMaintenanceDate: scheduleDate,
        scheduledMaintenanceNotes: scheduleNotes,
      };
      await API.put(`/aircrafts/${id}`, body, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Maintenance scheduled successfully.');
      document.getElementById('schedule_maintenance_modal').close();
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Failed to schedule maintenance.');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
  if (!aircraft) return <div className="text-center py-10">Aircraft not found.</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6"><Link to="/" className="btn btn-ghost">← Back to Dashboard</Link></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex flex-col gap-6">
          {/* Aircraft Info Card */}
          <div className="card bg-base-100 shadow-xl">
            <figure><img src={aircraft.image.startsWith('http') ? aircraft.image : `${import.meta.env.VITE_API_URL.replace('/api', '')}/${aircraft.image}`} alt={aircraft.model} /></figure>
            <div className="card-body">
              <div className="flex justify-between items-center"><h2 className="card-title text-3xl">{aircraft.model}</h2>{userRole && <button className="btn btn-outline btn-xs" onClick={() => document.getElementById('edit_aircraft_modal').showModal()}>Edit</button>}</div>
              <p className="font-mono text-xl">{aircraft.tailNumber}</p>
              <span className={`badge badge-lg ${aircraft.status === 'ACTIVE' ? 'badge-success' : aircraft.status === 'IN_MAINTENANCE' ? 'badge-warning' : 'badge-error'}`}>{aircraft.status}</span>
            </div>
          </div>

          {/* NEW: Scheduled Maintenance Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className="card-title">Scheduled Maintenance</h2>
                {userRole && <button className="btn btn-secondary btn-xs" onClick={() => document.getElementById('schedule_maintenance_modal').showModal()}>Schedule</button>}
              </div>
              <div className="divider my-2"></div>
              {aircraft.scheduledMaintenanceDate ? (
                <div>
                  <p className="font-bold text-lg">{new Date(aircraft.scheduledMaintenanceDate).toDateString()}</p>
                  <p className="text-sm opacity-70 mt-1">{aircraft.scheduledMaintenanceNotes}</p>
                </div>
              ) : <p>No maintenance scheduled.</p>}
            </div>
          </div>
        </div>

        {/* Maintenance History Card */}
        <div className="md:col-span-2">{/* ... Maintenance History card remains the same ... */}</div>
      </div>

      {/* ... All Modals ... */}
      {/* NEW: Schedule Maintenance Modal */}
      <dialog id="schedule_maintenance_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Schedule Future Maintenance</h3>
          <div className="py-4 space-y-4">
            <div>
              <label className="label"><span className="label-text">Date</span></label>
              <input type="date" className="input input-bordered w-full" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
            </div>
            <div>
              <label className="label"><span className="label-text">Notes (Optional)</span></label>
              <textarea className="textarea textarea-bordered w-full" placeholder="Describe the work to be done..." value={scheduleNotes} onChange={(e) => setScheduleNotes(e.target.value)}></textarea>
            </div>
          </div>
          <div className="modal-action">
            <button onClick={handleScheduleSubmit} className="btn btn-primary">Save Schedule</button>
            <form method="dialog"><button className="btn">Cancel</button></form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AircraftDetailPage;