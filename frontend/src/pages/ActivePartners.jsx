import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from './components/AdminSidebar';
import toast from 'react-hot-toast';

const ActivePartners = () => {
  const [partners, setPartners] = useState([]);

  const fetchActivePartners = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/user/active-partners");
      setPartners(res.data.partners);
    } catch (err) {
      toast.error("Failed to load active partners");
    }
  };

  useEffect(() => {
    fetchActivePartners();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Remove this partner? This action cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:3000/api/user/delete-user/${id}`);
        toast.success("Partner removed");
        fetchActivePartners();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar type="admin" />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Active Partners (Agents & Guides)</h1>
        
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.map(partner => (
                <tr key={partner.id} className="border-b hover:bg-slate-50">
                  <td className="p-4">{partner.fullName}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      partner.role === 'guide' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {partner.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{partner.email}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleDelete(partner.id)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ActivePartners;