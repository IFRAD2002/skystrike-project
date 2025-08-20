// src/components/AircraftList.jsx
import React from 'react';
import API from '../api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AircraftList = ({ aircrafts, fetchAircrafts }) => {
  const userRole = localStorage.getItem('userRole');

  // ... (handleStatusChange and handleDelete functions remain the same)
  const handleStatusChange = async (e, aircraftId, newStatus) => { e.stopPropagation(); e.preventDefault(); try { const token = localStorage.getItem('token'); await API.put(`/aircrafts/${aircraftId}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } }); toast.success(`Aircraft status updated to ${newStatus}`); fetchAircrafts(); } catch (error) { toast.error(error.response?.data?.error || 'Failed to update status.'); }};
  const handleDelete = async (e, aircraftId) => { e.stopPropagation(); e.preventDefault(); if (!window.confirm('Are you sure you want to delete this aircraft? This action cannot be undone.')) { return; } try { const token = localStorage.getItem('token'); await API.delete(`/aircrafts/${aircraftId}`, { headers: { Authorization: `Bearer ${token}` } }); toast.success('Aircraft decommissioned successfully.'); fetchAircrafts(); } catch (error) { toast.error(error.response?.data?.error || 'Failed to delete aircraft.'); }};


  if (aircrafts.length === 0) {
    return <p className="text-center py-10">No aircraft found in the fleet.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {aircrafts.map((craft) => (
        <Link to={`/aircraft/${craft._id}`} key={craft._id} className="card w-full bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-primary border-2 border-transparent">
          <div className="card-body">
            {/* Header section with avatar and title */}
            <div className="flex items-center gap-4 mb-4">
              <div className="avatar">
                <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={craft.image.startsWith('http') ? craft.image : `${import.meta.env.VITE_API_URL.replace('/api', '')}/${craft.image}`} alt={craft.model} />
                </div>
              </div>
              <div>
                <h2 className="card-title text-xl">{craft.model}</h2>
                <p className="font-mono text-sm opacity-70">{craft.tailNumber}</p>
              </div>
            </div>
            
            {/* Stats Section */}
            <div className="stats stats-vertical shadow w-full">
              <div className="stat">
                <div className="stat-title">Status</div>
                <div className={`stat-value text-lg ${
                  craft.status === 'ACTIVE' ? 'text-success' :
                  craft.status === 'IN_MAINTENANCE' ? 'text-warning' : 'text-error'
                }`}>{craft.status}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Last Updated</div>
                <div className="stat-value text-lg">{new Date(craft.updatedAt).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Actions at the bottom */}
            <div className="card-actions justify-end items-center mt-4">
              {userRole && (
                <select 
                  className="select select-bordered select-xs" 
                  value={craft.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleStatusChange(e, craft._id, e.target.value)}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="IN_MAINTENANCE">In Maintenance</option>
                  <option value="OUT_OF_SERVICE">Out of Service</option>
                </select>
              )}
              {userRole === 'Air Battle Manager' && (
                <button onClick={(e) => handleDelete(e, craft._id)} className="btn btn-error btn-xs">
                  Decommission
                </button>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default AircraftList;