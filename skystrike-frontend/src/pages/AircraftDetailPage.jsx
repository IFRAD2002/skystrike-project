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
  
  // State to manage which tab is active
  const [activeTab, setActiveTab] = useState('history');

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

  // All handler functions (handleLogSubmit, handleEditSubmit, etc.) remain the same
  const handleLogSubmit = async () => { if (!description) return toast.error('Description cannot be empty.'); try { const token = localStorage.getItem('token'); await API.post(`/aircrafts/${id}/maintenance`, { description }, { headers: { Authorization: `Bearer ${token}` } }); toast.success('Maintenance log added.'); document.getElementById('log_maintenance_modal').close(); setDescription(''); fetchData(); } catch (error) { toast.error('Failed to add log.'); } };
  const handleEditSubmit = async () => { try { const token = localStorage.getItem('token'); await API.put(`/aircrafts/${id}`, editFormData, { headers: { Authorization: `Bearer ${token}` } }); toast.success('Aircraft details updated.'); document.getElementById('edit_aircraft_modal').close(); fetchData(); } catch (error) { toast.error(error.response?.data?.error || 'Failed to update details.'); } };
  const handleScheduleSubmit = async () => { if (!scheduleDate) return toast.error('Please select a date.'); try { const token = localStorage.getItem('token'); const body = { scheduledMaintenanceDate: scheduleDate, scheduledMaintenanceNotes: scheduleNotes }; await API.put(`/aircrafts/${id}`, body, { headers: { Authorization: `Bearer ${token}` } }); toast.success('Maintenance scheduled successfully.'); document.getElementById('schedule_maintenance_modal').close(); fetchData(); } catch (error) { toast.error('Failed to schedule maintenance.'); } };
  const handleEditFormChange = (e) => { setEditFormData({ ...editFormData, [e.target.name]: e.target.value }); };


  if (loading) return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
  if (!aircraft) return <div className="text-center py-10">Aircraft not found.</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6"><Link to="/" className="btn btn-ghost">← Back to Dashboard</Link></div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Aircraft Info */}
        <div className="lg:w-1/3">
          <div className="card bg-base-100 shadow-xl sticky top-24">
            <figure><img src={aircraft.image.startsWith('http') ? aircraft.image : `${import.meta.env.VITE_API_URL.replace('/api', '')}/${aircraft.image}`} alt={aircraft.model} /></figure>
            <div className="card-body">
              <div className="flex justify-between items-center"><h2 className="card-title text-3xl">{aircraft.model}</h2>{userRole && <button className="btn btn-outline btn-xs" onClick={() => document.getElementById('edit_aircraft_modal').showModal()}>Edit</button>}</div>
              <p className="font-mono text-xl">{aircraft.tailNumber}</p>
              <span className={`badge badge-lg ${aircraft.status === 'ACTIVE' ? 'badge-success' : aircraft.status === 'IN_MAINTENANCE' ? 'badge-warning' : 'badge-error'}`}>{aircraft.status}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Content */}
        <div className="lg:w-2/3">
          {/* Tab Navigation */}
          <div role="tablist" className="tabs tabs-lifted">
            <a role="tab" className={`tab ${activeTab === 'history' ? 'tab-active' : ''}`} onClick={() => setActiveTab('history')}>Maintenance History</a>
            <a role="tab" className={`tab ${activeTab === 'schedule' ? 'tab-active' : ''}`} onClick={() => setActiveTab('schedule')}>Scheduled Maintenance</a>
          </div>

          {/* Tab Content */}
          <div className="card bg-base-100 shadow-xl">
            {/* Maintenance History Tab Content */}
            {activeTab === 'history' && (
              <div className="card-body">
                <div className="flex justify-between items-center"><h2 className="card-title">Maintenance History</h2>{userRole && (<button className="btn btn-primary btn-sm" onClick={() => document.getElementById('log_maintenance_modal').showModal()}>Log Maintenance</button>)}</div>
                <div className="divider"></div>
                <div className="overflow-x-auto h-96"><table className="table table-pin-rows"><thead><tr><th>Date</th><th>Description</th></tr></thead><tbody>{maintenanceLogs.length > 0 ? maintenanceLogs.map(log => (<tr key={log._id}><td>{new Date(log.serviceDate).toLocaleDateString()}</td><td>{log.description}</td></tr>)) : <tr><td colSpan="2" className='text-center'>No maintenance logs found.</td></tr>}</tbody></table></div>
              </div>
            )}
            
            {/* Scheduled Maintenance Tab Content */}
            {activeTab === 'schedule' && (
              <div className="card-body">
                <div className="flex justify-between items-center"><h2 className="card-title">Scheduled Maintenance</h2>{userRole && <button className="btn btn-secondary btn-sm" onClick={() => document.getElementById('schedule_maintenance_modal').showModal()}>Schedule</button>}</div>
                <div className="divider my-2"></div>
                {aircraft.scheduledMaintenanceDate ? (<div><p className="font-bold text-lg">{new Date(aircraft.scheduledMaintenanceDate).toDateString()}</p><p className="text-sm opacity-70 mt-1">{aircraft.scheduledMaintenanceNotes}</p></div>) : <p>No maintenance scheduled.</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- ALL MODALS ARE HERE AT THE BOTTOM --- */}
      <dialog id="log_maintenance_modal" className="modal">{/* ... */}</dialog>
      <dialog id="edit_aircraft_modal" className="modal">{/* ... */}</dialog>
      <dialog id="schedule_maintenance_modal" className="modal">{/* ... */}</dialog>
    </div>
  );
};

export default AircraftDetailPage;