// src/pages/ReportsPage.jsx
import React, { useState, useEffect } from 'react';
import API from '../api';
import toast from 'react-hot-toast';

const ReportsPage = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await API.get('/reports/sorties', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReportData(res.data.data);
      } catch (error) {
        toast.error('Failed to generate report.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
  if (!reportData) return <div className="text-center py-10">Could not load report data.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Sortie Reports</h1>
      <p className="mb-8 opacity-70">Summary of all completed missions.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pilot Leaderboard */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Pilot Leaderboard</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Callsign</th>
                    <th>Completed Sorties</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.pilotStats.map((pilot, index) => (
                    <tr key={pilot.pilotId}>
                      <th>{index + 1}</th>
                      <td>{pilot.callsign}</td>
                      <td>{pilot.sorties}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Aircraft Activity */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Aircraft Activity</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tail Number</th>
                    <th>Model</th>
                    <th>Completed Sorties</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.aircraftStats.map((craft) => (
                    <tr key={craft.aircraftId}>
                      <td>{craft.tailNumber}</td>
                      <td>{craft.model}</td>
                      <td>{craft.sorties}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;