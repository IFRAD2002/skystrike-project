// src/components/PilotMissionHistory.jsx
import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';
import toast from 'react-hot-toast';

const PilotMissionHistory = ({ user, openLogModal }) => {
    const [completedAssignments, setCompletedAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMissionHistory = useCallback(async () => {
        if (!user) return;
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const missionsRes = await API.get('/missions', { headers });
            
            const assignments = missionsRes.data.data
                .filter(m => m.status === 'COMPLETED')
                .flatMap(m => 
                    m.assignments
                    .filter(a => a.pilot._id === user._id)
                    .map(a => ({ ...a, missionObjective: m.objective, missionId: m._id }))
                );
            setCompletedAssignments(assignments);
        } catch (error) {
            toast.error("Failed to load mission history.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchMissionHistory();
    }, [fetchMissionHistory]);

    if (loading) {
        return <div className="skeleton h-32 w-full"></div>;
    }

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Completed Mission History</h2>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead><tr><th>Objective</th><th>Aircraft</th><th>Hours Logged</th><th>Actions</th></tr></thead>
                        <tbody>
                            {completedAssignments.length > 0 ? (
                                completedAssignments.map(assignment => (
                                    <tr key={assignment._id}>
                                        <td>{assignment.missionObjective}</td>
                                        <td>{assignment.aircraft.tailNumber}</td>
                                        <td>{assignment.flightHoursLogged ? `${assignment.flightHoursLogged.toFixed(1)} hrs` : 'Pending'}</td>
                                        <td>
                                            {!assignment.flightHoursLogged && (
                                                <button className="btn btn-primary btn-xs" onClick={() => openLogModal(assignment.missionId, assignment._id)}>
                                                    Log Flight
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className='text-center'>No completed missions found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PilotMissionHistory;