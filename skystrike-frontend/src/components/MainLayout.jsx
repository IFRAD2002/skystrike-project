// src/components/MainLayout.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

const MainLayout = () => {
  const socket = useRef();
  const [userId, setUserId] = useState(null);

  // Get user ID from token
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      }
    } catch (error) {
      console.error("Invalid token");
    }
  }, []);

  // Connect to socket.io server
  useEffect(() => {
    // Make sure your backend URL is correct here
    socket.current = io(import.meta.env.VITE_API_URL.replace('/api', '')); 

    // Listen for notifications from the server
    socket.current.on("getNotification", (data) => {
      // Check if the notification is for me
      if (data.recipientId === userId) {
        toast.success(data.message, {
          icon: '🔔',
          duration: 6000,
        });
      }
    });

    return () => {
      socket.current.disconnect();
    }
  }, [userId]);

  // Add user to the online list on the server
  useEffect(() => {
    if (socket.current && userId) {
      socket.current.emit("addUser", userId);
    }
  }, [socket.current, userId]);

  return (
    <>
      <Navbar />
      <main>
        <Outlet /> 
      </main>
    </>
  );
};

export default MainLayout;