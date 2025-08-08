// src/components/AddAircraftForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddAircraftForm = ({ onSuccess }) => {
  const [tailNumber, setTailNumber] = useState('');
  const [model, setModel] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [image, setImage] = useState(null); // State for the image file

  const handleSubmit = async (e) => {
    e.preventDefault();

    // We must use FormData to send files
    const formData = new FormData();
    formData.append('tailNumber', tailNumber);
    formData.append('model', model);
    formData.append('status', status);
    if (image) {
      formData.append('image', image); // The field name 'image' must match the backend
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/aircrafts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Axios usually sets this automatically for FormData
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Aircraft added successfully!');
      document.getElementById('add_aircraft_modal').close();
      onSuccess(); // Refresh the list
    } catch (error) {
      console.error('Error adding aircraft:', error);
      toast.error(error.response?.data?.error || 'Failed to add aircraft');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tail Number and Model inputs remain the same */}
      <div>
        <label className="label"><span className="label-text">Tail Number</span></label>
        <input type="text" placeholder="e.g., NG-1234" className="input input-bordered w-full"
          value={tailNumber} onChange={(e) => setTailNumber(e.target.value)} required />
      </div>
      <div>
        <label className="label"><span className="label-text">Model</span></label>
        <input type="text" placeholder="e.g., F-16 Viper" className="input input-bordered w-full"
          value={model} onChange={(e) => setModel(e.target.value)} required />
      </div>

      {/* Add the new file input field */}
      <div>
        <label className="label"><span className="label-text">Aircraft Image</span></label>
        <input 
            type="file" 
            className="file-input file-input-bordered w-full"
            onChange={(e) => setImage(e.target.files[0])}
        />
      </div>

      <div>
        <label className="label"><span className="label-text">Status</span></label>
        <select className="select select-bordered w-full" value={status}
          onChange={(e) => setStatus(e.target.value)}>
          <option value="ACTIVE">Active</option>
          <option value="IN_MAINTENANCE">In Maintenance</option>
          <option value="OUT_OF_SERVICE">Out of Service</option>
        </select>
      </div>

      <div className="modal-action">
        <button type="submit" className="btn btn-primary">Add Aircraft</button>
        <button type="button" className="btn" onClick={() => document.getElementById('add_aircraft_modal').close()}>Cancel</button>
      </div>
    </form>
  );
};

export default AddAircraftForm; 