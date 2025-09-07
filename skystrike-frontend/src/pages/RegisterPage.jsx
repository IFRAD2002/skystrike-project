
import React, { useState } from 'react';
import API from '../api'; 
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaAt, FaLock, FaBroadcastTower, FaUpload } from 'react-icons/fa';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    callsign: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const registrationData = new FormData();
    registrationData.append('name', formData.name);
    registrationData.append('email', formData.email);
    registrationData.append('password', formData.password);
    registrationData.append('callsign', formData.callsign);
    if (profilePicture) {
      registrationData.append('profilePicture', profilePicture);
    }

    try {
      
      await API.post('/auth/register', registrationData);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200" style={{backgroundImage: 'url(/military-bg.jpg)'}}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="card shrink-0 w-full max-w-lg shadow-2xl glass">
            <form className="card-body" onSubmit={handleSubmit}>
            <h1 className="text-4xl font-bold text-center tracking-wider">Enlist Now</h1>
            <p className="text-center text-neutral-content mb-4">Create Your Pilot Profile</p>
            
            <div className="form-control"><label className="label"><span className="label-text">Full Name</span></label><label className="input input-bordered flex items-center gap-2"><FaUser /><input type="text" name="name" className="grow" placeholder="Your full name" onChange={handleChange} required /></label></div>
            <div className="form-control"><label className="label"><span className="label-text">Callsign</span></label><label className="input input-bordered flex items-center gap-2"><FaBroadcastTower /><input type="text" name="callsign" className="grow" placeholder="Your callsign" onChange={handleChange} required /></label></div>
            <div className="form-control"><label className="label"><span className="label-text">Email</span></label><label className="input input-bordered flex items-center gap-2"><FaAt /><input type="email" name="email" className="grow" placeholder="Your email" onChange={handleChange} required /></label></div>
            <div className="form-control"><label className="label"><span className="label-text">Password</span></label><label className="input input-bordered flex items-center gap-2"><FaLock /><input type="password" name="password" className="grow" placeholder="Your password" onChange={handleChange} required /></label></div>
            <div className="form-control"><label className="label"><span className="label-text">Profile Picture</span></label><input type="file" name="profilePicture" className="file-input file-input-bordered w-full" onChange={handleFileChange} /></div>

            <div className="form-control mt-6"><button type="submit" className="btn btn-primary"><FaUpload className="mr-2"/>Complete Enlistment</button></div>
            <div className="text-center mt-4"><p>Already have an account? <Link to="/login" className="link link-primary">Log In</Link></p></div>
            </form>
        </div>
    </div>
  );
};

export default RegisterPage;