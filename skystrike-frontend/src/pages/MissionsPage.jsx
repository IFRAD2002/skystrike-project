// src/pages/MissionsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';
import toast from 'react-hot-toast';

const MissionsPage = () => {
  const [missions, setMissions] = useState([]);
  const [pilots, setPilots] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedMission, setSelectedMission] = useState(null);
  const [selectedPilot, setSelectedPilot] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState('');
  const [newObjective, setNewObjective] = useState('');

  const userRole = localStorage.getItem('userRole');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [missionsRes, pilotsRes, aircraftsRes] = await Promise.all([
        API.get('/missions', { headers }),
        API.get('/pilots', { headers }),
        API.get('/aircrafts', { headers }),
      ]);

      setMissions(missionsRes.data.data);
      setPilots(pilotsRes.data.data);
      setAircrafts(aircraftsRes.data.data);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch necessary data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenAssignModal = (mission) => {
    setSelectedMission(mission);
    setSelectedPilot('');
    setSelectedAircraft('');
    document.getElementById('assign_modal').showModal();
  };

  const handleAssignSubmit = async () => {
    if (!selectedPilot || !selectedAircraft) {
      return toast.error('Please select both a pilot and an aircraft.');
    }
    try {
      const token = localStorage.getItem('token');
      await API.put(`/missions/${selectedMission._id}/assign`, 
        { pilotId: selectedPilot, aircraftId: selectedAircraft },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Assignment added to mission!');
      document.getElementById('assign_modal').close();
      fetchData(); // Refresh data
    } catch (error) {
       toast.error(error.response?.data?.error || 'Assignment failed.');
    }
  };
  
  const handleCreateMission = async () => {
    if (!newObjective) return toast.error('Objective cannot be empty.');
    try {
      const token = localStorage.getItem('token');
      await API.post('/missions', 
        { objective: newObjective },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Mission created successfully!');
      document.getElementById('create_mission_modal').close();
      setNewObjective(''); // Clear input
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Failed to create mission.');
    }
  };

  const handleStatusUpdate = async (missionId, newStatus) => {
    try {
        const token = localStorage.getItem('token');
        await API.put(`/missions/${missionId}/status`, 
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(`Mission status updated to ${newStatus}`);
        fetchData(); // Refresh the list
    } catch (error) {
        toast.error('Failed to update mission status.');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Mission Control</h1>
        {userRole === 'Air Battle Manager' &&
            <button className="btn btn-primary" onClick={() => document.getElementById('create_mission_modal').showModal()}>
                Create New Mission
            </button>
        }
      </div>

      <div className="card bg-base-300 bg-opacity-50 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Active & Planned Missions</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Objective</th>
                  <th>Status</th>
                  <th>Assigned Crew & Fleet</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {missions.map(mission => (
                  <tr key={mission._id}>
                    <td className="font-bold">{mission.objective}</td>
                    <td>
                      {userRole === 'Air Battle Manager' ? (
                        <select 
                            className="select select-bordered select-xs"
                            value={mission.status}
                            onChange={(e) => handleStatusUpdate(mission._id, e.target.value)}
                        >
                            <option value="PLANNED">Planned</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="ABORTED">Aborted</option>
                        </select>
                      ) : (
                        <span className="badge badge-info">{mission.status}</span>
                      )}
                    </td>
                    <td>
                      {mission.assignments.length > 0 ? (
                        <div className='flex flex-col gap-2'>
                          {mission.assignments.map(asgn => (
                            <div key={asgn.pilot?._id || Math.random()} className="flex items-center gap-2">
                              <span className="badge badge-ghost">{asgn.pilot?.callsign || 'N/A'}</span>
                              <span className="opacity-50">-&gt;</span>
                              <span className="badge badge-neutral">{asgn.aircraft?.tailNumber || 'N/A'}</span>
                            </div>
                          ))}
                        </div>
                      ) : 'N/A'}
                    </td>
                    <td>
                      {userRole === 'Air Battle Manager' &&
                        <button className="btn btn-secondary btn-xs" onClick={() => handleOpenAssignModal(mission)}>
                            Assign Crew
                        </button>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      <dialog id="assign_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Assign to: "{selectedMission?.objective}"</h3>
          <div className="py-4 space-y-4">
            <div>
              <label className="label"><span className="label-text">Select Pilot</span></label>
              <select className="select select-bordered w-full" defaultValue="" onChange={(e) => setSelectedPilot(e.target.value)}>
                <option value="" disabled>Choose a pilot</option>
                {pilots.map(p => <option key={p._id} value={p._id}>{p.callsign} ({p.name})</option>)}
              </select>
            </div>
            <div>
              <label className="label"><span className="label-text">Select Aircraft</span></label>
              <select className="select select-bordered w-full" defaultValue="" onChange={(e) => setSelectedAircraft(e.target.value)}>
                <option value="" disabled>Choose an aircraft</option>
                {aircrafts.map(a => <option key={a._id} value={a._id}>{a.tailNumber} ({a.model})</option>)}
              </select>
            </div>
          </div>
          <div className="modal-action">
            <button onClick={handleAssignSubmit} className="btn btn-primary">Confirm Assignment</button>
            <form method="dialog"><button className="btn">Cancel</button></form>
          </div>
        </div>
      </dialog>

      {/* Create Mission Modal */}
      <dialog id="create_mission_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create New Mission</h3>
          <div className="py-4">
            <label className="label"><span className="label-text">Mission Objective</span></label>
            <input 
              type="text" 
              className="input input-bordered w-full" 
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              placeholder="Enter mission objective..." />
          </div>
          <div className="modal-action">
            <button onClick={handleCreateMission} className="btn btn-primary">Create</button>
            <form method="dialog"><button className="btn">Cancel</button></form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default MissionsPage;