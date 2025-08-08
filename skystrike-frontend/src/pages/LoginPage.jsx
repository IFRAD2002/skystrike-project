
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
        email,
        password,
      });

      const token = loginResponse.data.token;
      localStorage.setItem('token', token); // Save the token

      // Immediately fetch user profile to get the role
      const profileResponse = await axios.get('http://localhost:5001/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
      });

      // Save the user's role to localStorage
      localStorage.setItem('userRole', profileResponse.data.data.role);

      toast.success(loginResponse.data.message || 'Logged in successfully!');
      
      // Navigate to the profile page after successful login
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
        
        {/* This is the login form card below */}
        <div className="card shrink-0 w-full max-w-sm shadow-2xl glass">
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="email" 
                placeholder="email" 
                className="input input-bordered" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input 
                type="password" 
                placeholder="password" 
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required />
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