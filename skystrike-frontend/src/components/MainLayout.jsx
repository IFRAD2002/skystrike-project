
import React, { useEffect, useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

const MainLayout = () => {
  const socket = useRef();
  const [userId, setUserId] = useState(null);

  
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

  
  useEffect(() => {
    
    socket.current = io(import.meta.env.VITE_API_URL.replace('/api', '')); 

    
    socket.current.on("getNotification", (data) => {
      
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