import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const Api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
});

const config = {
    headers:{
        'authorization' : `Bearer ${localStorage.getItem("token")}`
    }
}

const getAuthHeader = () => ({
    headers: {
        'authorization': `Bearer ${localStorage.getItem("token")}`
    }
});

const getAuthConfig = () => ({
    headers: {
        'authorization': `Bearer ${localStorage.getItem("token")}`
    }
});

// --- USER & ADMIN APIS ---
export const createUserApi = (data) => Api.post("/api/user/register", data);
export const loginUserApi = (data) => Api.post("/api/user/login", data);
export const getUserById = (id) => Api.get(`/api/user/getUserByid/${id}`, getAuthHeader());
export const getAllUsersApi = () => Api.get("/api/user/get_all_users", getAuthHeader());
export const deleteUsersById = (id) => Api.delete(`/api/user/delete_users/${id}`, getAuthHeader());
export const updateUserById = (id, data) => Api.put(`/api/user/updateUserByid/${id}`, data, getAuthHeader());

// --- APPROVAL APIS ---
export const getPendingRequestsApi = () => Api.get('/api/user/pending-requests', getAuthHeader());
export const approveUserApi = (id) => Api.put(`/api/user/approve-user/${id}`, {}, getAuthHeader());
export const rejectUserApi = (id) => Api.delete(`/api/user/reject-user/${id}`, getAuthHeader());

// --- PACKAGE APIS ---
export const getPackageById = (id) => Api.get(`/api/packages/getPackageById/${id}`, getAuthHeader());
export const deletePackage = (id) => Api.delete(`/api/packages/delete_packages/${id}`, getAuthHeader());
export const deletePackageApi = (id) => Api.delete(`/api/packages/delete_packages/${id}`, getAuthHeader());
export const getAgentPackagesApi = (agentId) => 
    Api.get(`/api/packages/get-agent-packages/${agentId}`, getAuthHeader());
export const createPackageApi = (formData) => Api.post("/api/packages/add", formData, {
    headers: {
        'authorization': `Bearer ${localStorage.getItem("token-37c")}`,
        'Content-Type': undefined 
    }
});
export const updatePackageById = (id, formData) => 
    Api.put(`/api/packages/update_package/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'authorization': `Bearer ${localStorage.getItem('token-37c')}`
        }
    });

export const getAllPackagesApi = () => Api.get("/api/packages/get_all", getAuthHeader());
export const getAllBookingsApi = () => Api.get("/api/bookings/get_all", getAuthHeader());