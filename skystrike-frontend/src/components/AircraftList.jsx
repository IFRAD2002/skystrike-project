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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {aircrafts.map((craft) => (
        <Link to={`/aircraft/${craft._id}`} key={craft._id} className="card w-full h-80 shadow-xl image-full transition-transform transform hover:scale-105">
          <figure>
            <img 
              src={craft.image.startsWith('http') ? craft.image : `${import.meta.env.VITE_API_URL.replace('/api', '')}/${craft.image}`} 
              alt={craft.model} 
              className="object-cover w-full h-full" 
            />
          </figure>
          {/* We wrap the card-body in another div to make it glass */}
          <div className="card-body glass rounded-2xl m-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="card-title text-2xl">{craft.model}</h2>
                <p className="font-mono">{craft.tailNumber}</p>
              </div>
              <div className={`badge badge-lg ${
                  craft.status === 'ACTIVE' ? 'badge-success' :
                  craft.status === 'IN_MAINTENANCE' ? 'badge-warning' : 'badge-error'
              }`}>
                {craft.status}
              </div>
            </div>

            <div className="flex-grow"></div>

            <div className="card-actions justify-end items-center">
              {userRole && (
                <select 
                  className="select select-bordered select-sm" 
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
                <button onClick={(e) => handleDelete(e, craft._id)} className="btn btn-error btn-sm">
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