// src/pages/NotificationsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await API.get('/notifications', { headers: { Authorization: `Bearer ${token}` } });
            setNotifications(data.data);
        } catch (error) {
            toast.error("Failed to fetch notifications.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleMarkAllRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await API.put('/notifications/markread', {}, { headers: { Authorization: `Bearer ${token}` } });
            // Refresh the list to show the "read" status
            fetchNotifications();
        } catch (error) {
            toast.error("Failed to mark notifications as read.");
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold">Notifications</h1>
                <button onClick={handleMarkAllRead} className="btn btn-primary">Mark All as Read</button>
            </div>

            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map(noti => (
                        <div key={noti._id} className={`alert shadow-lg ${noti.isRead ? 'opacity-60' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <div>
                                <h3 className="font-bold">New Assignment</h3>
                                <div className="text-xs">{noti.message}</div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>You have no notifications.</p>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;