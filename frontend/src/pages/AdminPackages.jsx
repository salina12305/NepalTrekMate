// import React, { useState, useEffect } from 'react';
// import AdminSidebar from './components/AdminSidebar';
// import AdminHeaderStatCard from './components/AdminHeaderStatCard'; 
// import { Search, Eye, Trash2 } from 'lucide-react';
// import { getUserById, getAllPackagesApi, deletePackageApi } from '../services/api'; 
// import toast from 'react-hot-toast';

// const AdminPackages = () => {
//   const [packages, setPackages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // 1. Fetch Admin Profile for Sidebar
//         const userId = localStorage.getItem('userId'); 
//         if (userId) {
//           const res = await getUserById(userId);
//           if (res.data) setUserData(res.data); 
//         }
        
//         // 2. Fetch All Packages (Assuming you have an getAllPackagesApi)
//         const response = await getAllPackagesApi();
//         const allPkgs = response.data.packages || response.data;
//         if (Array.isArray(allPkgs)) setPackages(allPkgs);
//       } catch (err) {
//         console.error("Fetch error:", err);
//         toast.error("Failed to load packages.");
//       } finally {
//         setLoading(false); 
//       }
//     };
//     fetchData();
//   }, []);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this package?")) return;
//     try {
//       const response = await deletePackageApi(id);
//       if (response.data.success) {
//         setPackages(prev => prev.filter(pkg => (pkg._id || pkg.id) !== id));
//         toast.success("Package deleted successfully");
//       }
//     } catch (err) {
//       toast.error("Error deleting package");
//     }
//   };

//   const filteredPackages = packages.filter(pkg => 
//     pkg.packageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     pkg.destination?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

// }

// export default AdminPackages;