import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TravelAgentSidebar from './components/TravelAgentSidebar';
import { getUserById, createPackageApi } from '../services/api';
import toast from "react-hot-toast";

const AddPackageForm = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null); 
  const [preview, setPreview] = useState(null);  
  
  const [formData, setFormData] = useState({
    packageName: '',
    description: '',
    destination: '',
    price: '',
    durationDays: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const res = await getUserById(userId);
          setUserData(res.data);
        }
      } catch (err) {
        console.error("Error fetching agent data:", err);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("File to be uploaded:", imageFile); 

    if (!imageFile) {
        return toast.error("Please select an image file first");
    }

    const data = new FormData();

    data.append('packageName', formData.packageName);
    data.append('description', formData.description);
    data.append('destination', formData.destination);
    data.append('price', formData.price);
    data.append('durationDays', formData.durationDays);
    data.append('agentId', localStorage.getItem('userId'));
    
    // 2. The File (MUST match upload.single('packageImage'))
    data.append('packageImage', imageFile);
    try {
        const res = await createPackageApi(data);
        if (res.data.success) {
            toast.success("Package Created!");
            navigate('/agentpackages');
        }
    } catch (err) {
        console.error("Upload Error:", err.response?.data);
        toast.error(err.response?.data?.message || "Internal Server Error");
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <TravelAgentSidebar type="agent" userData={userData} />
      
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Add New Package</h2>
          <p className="text-slate-500 text-sm">Create a new trekking experience</p>
        </header>
  
        <div className="flex-1 flex items-center justify-center w-full pb-12">
          <div className="w-full max-w-3xl bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* IMAGE UPLOAD SECTION */}
              <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <div className="w-24 h-24 bg-white rounded-xl border flex items-center justify-center overflow-hidden">
                   {preview ? (
                     <img src={preview} alt="preview" className="w-full h-full object-cover" />
                   ) : (
                     <span className="text-3xl">🖼️</span>
                   )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Upload Package Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Package Name</label>
                <input type="text" name="packageName" required onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
  
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Destination</label>
                  <input type="text" name="destination" required onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Price (Rs.)</label>
                  <input type="number" name="price" required onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Duration (Days)</label>
                <input type="number" name="durationDays" required onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
  
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea name="description" required rows="3" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
  
              <div className="flex gap-4">
                <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold disabled:opacity-50">
                  {loading ? "Processing..." : "Create Package"}
                </button>
                <button type="button" onClick={() => navigate('/agentpackages')} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddPackageForm;