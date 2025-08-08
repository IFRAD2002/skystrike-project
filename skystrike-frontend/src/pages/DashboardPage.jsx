
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AircraftList from '../components/AircraftList';
import AddAircraftForm from '../components/AddAircraftForm';

const DashboardPage = () => {
  const [aircrafts, setAircrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Get the user's role
  const userRole = localStorage.getItem('userRole');

  const fetchAircrafts = useCallback(async () => {
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/aircrafts', {
          headers: { Authorization: `Bearer ${token}` }
      });
      setAircrafts(response.data.data);
    } catch (error) {
      console.error('Error fetching aircraft:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAircrafts();
  }, [fetchAircrafts]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Fleet Dashboard</h1>

        {/* 2. Conditionally render the button */}
        {userRole === 'Air Battle Manager' && (
          <button className="btn btn-primary" onClick={() => document.getElementById('add_aircraft_modal').showModal()}>
            Add Aircraft
          </button>
        )}
      </div>

       <div className="card bg-base-300 bg-opacity-50 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Aircraft Fleet</h2>
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-4 w-full">
                        <div className="skeleton h-40 w-full"></div>
                        <div className="skeleton h-4 w-28"></div>
                        <div className="skeleton h-4 w-full"></div>
                    </div>
                ))}
            </div>
          ) : (
            <AircraftList aircrafts={aircrafts} fetchAircrafts={fetchAircrafts} />
          )}
        </div>
      </div>
      
      <dialog id="add_aircraft_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Add New Aircraft</h3>
          <AddAircraftForm onSuccess={fetchAircrafts} />
        </div>
      </dialog>
    </div>
  );
};

export default DashboardPage;