// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import API from '../api';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = await API.post('/auth/login', {
        email,
        password,
      });

      const token = loginResponse.data.token;
      localStorage.setItem('token', token);

      const profileResponse = await API.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.setItem('userRole', profileResponse.data.data.role);

      // --- PLAY SOUND ON SUCCESS ---
      const audio = new Audio('/sounds/login-success.mp3');
      audio.volume = 0.1;
      audio.play();
      // ---------------------------

      toast.success(loginResponse.data.message || 'Logged in successfully!');
      
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200" style={{backgroundImage: 'url(/military-bg.jpg)'}}>
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content flex-col text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold">
            <span className="text-primary">SKYSTRIKE</span>
            <span className="font-light text-4xl"> COMMAND</span>
          </h1>
          <p className="py-6 text-2xl">Enlist yourself into a journey of thrill commrade</p>
        </div>
        
        <div className="card shrink-0 w-full max-w-sm shadow-2xl glass">
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label"><span className="label-text">Email</span></label>
              <input type="email" placeholder="email" className="input input-bordered" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Password</span></label>
              <input type="password" placeholder="password" className="input input-bordered" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
            <div className="text-center mt-4">
              <p>Don't have an account? <Link to="/register" className="link link-primary">Enlist Here</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;