// src/pages/AnalyticsPage.jsx
import React, { useState, useEffect } from 'react';
import API from '../api';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalyticsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await API.get('/reports/stats', { headers: { Authorization: `Bearer ${token}` } });
                setStats(data.data);
            } catch (error) {
                toast.error("Failed to fetch analytics data.");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const COLORS = {
        'ACTIVE': '#16a34a', // Green
        'IN_MAINTENANCE': '#facc15', // Yellow
        'OUT_OF_SERVICE': '#dc2626', // Red
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
    if (!stats) return <div className="text-center py-10">Could not load analytics data.</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-8">Analytics Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Aircraft Status Pie Chart */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Aircraft Status Breakdown</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={stats.statusStats} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                    {stats.statusStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                {/* Monthly Sorties Bar Chart */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Completed Sorties by Month</h2>
                         <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.monthlySorties}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip cursor={{fill: 'rgba(255, 255, 255, 0.1)'}} />
                                <Legend />
                                <Bar dataKey="sorties" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;