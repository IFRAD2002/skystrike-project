// src/components/AddAircraftForm.jsx
import React, { useState } from 'react';
import API from '../../api'; // Use the new API config
import toast from 'react-hot-toast';

const AddAircraftForm = ({ onSuccess }) => {
  const [tailNumber, setTailNumber] = useState('');
  const [model, setModel] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('tailNumber', tailNumber);
    formData.append('model', model);
    formData.append('status', status);
    if (image) {
      formData.append('image', image);
    }

    try {
      const token = localStorage.getItem('token');
      // Updated to use API.post
      await API.post('/aircrafts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Aircraft added successfully!');
      document.getElementById('add_aircraft_modal').close();
      onSuccess();
    } catch (error) {
      console.error('Error adding aircraft:', error);
      toast.error(error.response?.data?.error || 'Failed to add aircraft');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="label"><span className="label-text">Tail Number</span></label><input type="text" placeholder="e.g., NG-1234" className="input input-bordered w-full" value={tailNumber} onChange={(e) => setTailNumber(e.target.value)} required /></div>
      <div><label className="label"><span className="label-text">Model</span></label><input type="text" placeholder="e.g., F-16 Viper" className="input input-bordered w-full" value={model} onChange={(e) => setModel(e.target.value)} required /></div>
      <div><label className="label"><span className="label-text">Aircraft Image</span></label><input type="file" className="file-input file-input-bordered w-full" onChange={(e) => setImage(e.target.files[0])} /></div>
      <div><label className="label"><span className="label-text">Status</span></label><select className="select select-bordered w-full" value={status} onChange={(e) => setStatus(e.target.value)}><option value="ACTIVE">Active</option><option value="IN_MAINTENANCE">In Maintenance</option><option value="OUT_OF_SERVICE">Out of Service</option></select></div>
      <div className="modal-action"><button type="submit" className="btn btn-primary">Add Aircraft</button><button type="button" className="btn" onClick={() => document.getElementById('add_aircraft_modal').close()}>Cancel</button></div>
    </form>
  );
};

export default AddAircraftForm;