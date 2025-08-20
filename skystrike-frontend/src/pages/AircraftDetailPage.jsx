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

  const handleLogSubmit = async () => {
    if (!description) return toast.error('Description cannot be empty.');
    try {
      const token = localStorage.getItem('token');
      await API.post(`/aircrafts/${id}/maintenance`, 
        { description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Maintenance log added.');
      document.getElementById('log_maintenance_modal').close();
      setDescription('');
      fetchData();
    } catch (error) {
      toast.error('Failed to add log.');
    }
  };
  
  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await API.put(`/aircrafts/${id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Aircraft details updated.');
      document.getElementById('edit_aircraft_modal').close();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update details.');
    }
  };

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
      fetchData();
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
          <div className="card bg-base-100 shadow-xl">
            <figure><img src={aircraft.image.startsWith('http') ? aircraft.image : `${import.meta.env.VITE_API_URL.replace('/api', '')}/${aircraft.image}`} alt={aircraft.model} /></figure>
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className="card-title text-3xl">{aircraft.model}</h2>
                {userRole && <button className="btn btn-outline btn-xs" onClick={() => document.getElementById('edit_aircraft_modal').showModal()}>Edit</button>}
              </div>
              <p className="font-mono text-xl">{aircraft.tailNumber}</p>
              <span className={`badge badge-lg ${aircraft.status === 'ACTIVE' ? 'badge-success' : aircraft.status === 'IN_MAINTENANCE' ? 'badge-warning' : 'badge-error'}`}>{aircraft.status}</span>
            </div>
          </div>
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
        <div className="md:col-span-2">
           <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className="card-title">Maintenance History</h2>
                {userRole && (<button className="btn btn-primary btn-sm" onClick={() => document.getElementById('log_maintenance_modal').showModal()}>Log Maintenance</button>)}
              </div>
              <div className="divider"></div>
              <div className="overflow-x-auto h-96">
                <table className="table table-pin-rows">
                  <thead><tr><th>Date</th><th>Description</th></tr></thead>
                  <tbody>
                    {maintenanceLogs.length > 0 ? maintenanceLogs.map(log => (<tr key={log._id}><td>{new Date(log.serviceDate).toLocaleDateString()}</td><td>{log.description}</td></tr>)) : <tr><td colSpan="2" className='text-center'>No maintenance logs found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- ALL MODALS ARE HERE AT THE BOTTOM --- */}
      <dialog id="log_maintenance_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Log New Maintenance</h3>
          <textarea className="textarea textarea-bordered w-full mt-4" placeholder="Describe the work performed..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          <div className="modal-action"><button onClick={handleLogSubmit} className="btn btn-primary">Save Log</button><form method="dialog"><button className="btn">Cancel</button></form></div>
        </div>
      </dialog>

      <dialog id="edit_aircraft_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Aircraft Details</h3>
          <div className="py-4 space-y-4">
            <div><label className="label"><span className="label-text">Model</span></label><input type="text" name="model" className="input input-bordered w-full" value={editFormData.model} onChange={handleEditFormChange} /></div>
            <div><label className="label"><span className="label-text">Tail Number</span></label><input type="text" name="tailNumber" className="input input-bordered w-full" value={editFormData.tailNumber} onChange={handleEditFormChange} /></div>
          </div>
          <div className="modal-action"><button onClick={handleEditSubmit} className="btn btn-primary">Save Changes</button><form method="dialog"><button className="btn">Cancel</button></form></div>
        </div>
      </dialog>

      <dialog id="schedule_maintenance_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Schedule Future Maintenance</h3>
          <div className="py-4 space-y-4">
            <div><label className="label"><span className="label-text">Date</span></label><input type="date" className="input input-bordered w-full" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} /></div>
            <div><label className="label"><span className="label-text">Notes (Optional)</span></label><textarea className="textarea textarea-bordered w-full" placeholder="Describe the work to be done..." value={scheduleNotes} onChange={(e) => setScheduleNotes(e.target.value)}></textarea></div>
          </div>
          <div className="modal-action"><button onClick={handleScheduleSubmit} className="btn btn-primary">Save Schedule</button><form method="dialog"><button className="btn">Cancel</button></form></div>
        </div>
      </dialog>
    </div>
  );
};

export default AircraftDetailPage;