import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TravelAgentSidebar from './components/TravelAgentSidebar';
import { getUserById, getPackageById, updatePackageById } from '../services/api';
import toast from 'react-hot-toast';

const EditPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // Image states
  const [imageFile, setImageFile] = useState(null); 
  const [preview, setPreview] = useState(null);    

  const [formData, setFormData] = useState({
    packageName: '',
    description: '',
    destination: '',
    price: '',
    durationDays: '',
  });

  // 1. Load Initial Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const userRes = await getUserById(userId);
          setUserData(userRes.data);
        }

        const pkgRes = await getPackageById(id);
        if (pkgRes.data) {
          const pkg = pkgRes.data;
          setFormData({
            packageName: pkg.packageName || '',
            description: pkg.description || '',
            destination: pkg.destination || '',
            price: pkg.price || '',
            durationDays: pkg.durationDays || '',
          });
          
          // Show existing image as initial preview with cache-busting timestamp
          if (pkg.packageImage) {
            setPreview(`http://localhost:3000/public/uploads/${pkg.packageImage}?t=${new Date().getTime()}`);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load package data.");
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a local URL for the preview
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Prepare FormData
    const data = new FormData();
    data.append('packageName', formData.packageName);
    data.append('description', formData.description);
    data.append('destination', formData.destination);
    data.append('price', formData.price);
    data.append('durationDays', formData.durationDays);
    
    // 2. Only append the image if a NEW one was selected
    if (imageFile) {
      data.append('packageImage', imageFile);
    }

    try {
      // 3. Make the API Call
      const res = await updatePackageById(id, data);
      
      if (res.data && res.data.success) {
        toast.success("Package Updated Successfully!");
        navigate('/agentpackages');
      } else {
        toast.error("Update failed. Please try again.");
      }
  } catch (err) {
    console.log("Full Error Object:", err); 
    
    if (err.response) {
        // Server responded with an error (e.g., 400, 404, 500)
        console.log("Server Error Data:", err.response.data);
        toast.error(err.response.data.message || "Server Error");
    } else if (err.request) {
        // Request was made but no response (Network error/Server down)
        console.log("No Response Received:", err.request);
        toast.error("Server is not responding. Check your backend terminal.");
    } else {
        // Logic error (like the "API is not defined" error you just had)
        console.log("Request Setup Error:", err.message);
        toast.error(err.message);
    }
  } finally {
    setLoading(false);
  }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <TravelAgentSidebar type="agent" userData={userData} />
      
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Edit Package</h2>
          <p className="text-slate-500 text-sm">Update your trekking experience details</p>
        </header>
  
        <div className="flex-1 flex items-center justify-center w-full pb-12">
          <div className="w-full max-w-3xl bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
              
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
                  <label className="block text-sm font-bold text-slate-700 mb-1">Update Package Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Leave empty to keep existing image</p>
                </div>
              </div>

              {/* PACKAGE NAME */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Package Name</label>
                <input 
                  type="text" 
                  name="packageName" 
                  value={formData.packageName} 
                  required 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
  
              {/* DESTINATION & PRICE */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Destination</label>
                  <input 
                    type="text" 
                    name="destination" 
                    value={formData.destination} 
                    required 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Price (Rs.)</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    required 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>

              {/* DURATION */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Duration (Days)</label>
                <input 
                  type="number" 
                  name="durationDays" 
                  value={formData.durationDays} 
                  required 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
  
              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  required 
                  rows="3" 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
  
              {/* ACTIONS */}
              <div className="flex gap-4">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 transition-all hover:bg-blue-700"
                >
                  {loading ? "Updating..." : "Save Changes"}
                </button>
                <button 
                  type="button" 
                  onClick={() => navigate('/agentpackages')} 
                  className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200"
                >
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

export default EditPackage;