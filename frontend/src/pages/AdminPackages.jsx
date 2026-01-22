import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeaderStatCard from './components/AdminHeaderStatCard'; 
import { Search, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserById, getAllPackagesApi, deletePackageApi, getAllUsersApi } from '../services/api'; 
import toast from 'react-hot-toast';

const AdminPackages = () => {
  const [packages, setPackages] = useState([]);
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Get userId at the very beginning of the function
      const storedUserId = localStorage.getItem('userId'); 

      try {
        // Run fetches. Note: We only call getUserById if storedUserId exists
        const [packagesRes, allUsersRes, userProfileRes] = await Promise.all([
          getAllPackagesApi(),
          getAllUsersApi(),
          storedUserId ? getUserById(storedUserId) : Promise.resolve({ data: null })
        ]);

        // 1. Handle Admin Profile Data
        if (userProfileRes?.data) {
          setUserData(userProfileRes.data);
        }

        // 2. Handle Packages Data
        const allPkgs = packagesRes.data.packages || packagesRes.data || [];
        setPackages(Array.isArray(allPkgs) ? allPkgs : []);

        // 3. Handle Users Data (for stats)
        const allUsers = allUsersRes.data.users || allUsersRes.data || [];
        setUsers(Array.isArray(allUsers) ? allUsers : []);

      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      const response = await deletePackageApi(id);
      if (response.data.success) {
        setPackages(prev => prev.filter(pkg => (pkg._id || pkg.id) !== id));
        toast.success("Package deleted successfully");
      }
    } catch (err) {
      toast.error("Error deleting package");
    }
  };

  const filteredPackages = packages.filter(pkg => 
    pkg.packageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.destination?.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export default AdminPackages;