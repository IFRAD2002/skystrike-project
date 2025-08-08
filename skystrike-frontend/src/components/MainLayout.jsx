// src/components/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* Child routes will be rendered here */}
        <Outlet /> 
      </main>
    </>
  );
};

export default MainLayout;