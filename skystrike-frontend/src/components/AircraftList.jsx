// src/components/AircraftList.jsx
import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AircraftList = ({ aircrafts, fetchAircrafts }) => {
  const userRole = localStorage.getItem('userRole');

  const handleStatusChange = async (aircraftId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5001/api/aircrafts/${aircraftId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Aircraft status updated to ${newStatus}`);
      fetchAircrafts();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update status.');
    }
  };

  const handleDelete = async (aircraftId) => {
    if (!window.confirm('Are you sure you want to delete this aircraft? This action cannot be undone.')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/aircrafts/${aircraftId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Aircraft decommissioned successfully.');
      fetchAircrafts();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete aircraft.');
    }
  };

  if (aircrafts.length === 0) {
    return <p className="text-center py-10">No aircraft found in the fleet.</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {aircrafts.map((craft) => (
        <div 
            key={craft._id} 
            className="card w-full bg-base-100 shadow-xl image-full"
            style={{ '--tw-bg-opacity': '0.2' }}
        >
          <figure>
            <img src={`http://localhost:5001/${craft.image}`} alt={craft.model} className="object-cover w-full h-full" />
          </figure>
          <div className="card-body">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="card-title text-3xl">{craft.model}</h2>
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
                  onChange={(e) => handleStatusChange(craft._id, e.target.value)}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="IN_MAINTENANCE">In Maintenance</option>
                  <option value="OUT_OF_SERVICE">Out of Service</option>
                </select>
              )}

              {userRole === 'Air Battle Manager' && (
                <button onClick={() => handleDelete(craft._id)} className="btn btn-error btn-sm">
                  Decommission
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AircraftList;