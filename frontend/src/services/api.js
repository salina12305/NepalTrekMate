
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

// --- USER & AUTH APIS ---
export const createUserApi = (data) => Api.post("/api/user/register", data);
export const loginUserApi = (data) => Api.post("/api/user/login", data);
export const getUserById = (id) => Api.get(`/api/user/getUserByid/${id}`, getAuthHeader());
export const getAllUsersApi = () => Api.get("/api/user/get_all_users", getAuthHeader());
export const deleteUsersById = (id) => Api.delete(`/api/user/delete_users/${id}`, getAuthHeader());
export const updateUserById = (id, data) => Api.put(`/api/user/updateUserByid/${id}`, data, getAuthHeader());
export const forgotPasswordApi = (data) => Api.post("/api/user/forgot-password", data);
export const resetPasswordApi = (data) => Api.post("/api/user/reset-password", data);

// --- ADMIN / APPROVAL APIS ---
export const getPendingRequestsApi = () => Api.get('/api/user/pending-requests', getAuthHeader());
export const approveUserApi = (id) => Api.put(`/api/user/approve-user/${id}`, {}, getAuthHeader());
export const rejectUserApi = (id) => Api.delete(`/api/user/reject-user/${id}`, getAuthHeader());

// --- GUIDE SPECIFIC APIS ---
export const getGuideBookingsApi = () => Api.get("/api/bookings/guide-assignments", getAuthHeader());
export const getGuideStatsApi = () => Api.get("/api/user/guide-stats", getAuthHeader());
export const getAllGuidesApi = () => Api.get("/api/user/get_all_guides", getAuthHeader());
export const updateBookingStatusApi = (id, status) => {
    return Api.put(`/api/bookings/update-status/${id}`, { status }, getAuthHeader());
};
export const deleteFeedbackApi = (id) => Api.delete(`/api/feedback/delete/${id}`, getAuthHeader());
export const getGuideAssignmentsApi = () => Api.get("/api/bookings/guide-assignments", getAuthHeader());
export const getGuideFeedbackApi = (id) => Api.get(`/api/feedback/agent/${id}`, getAuthHeader());
export const getMyGuideReviewsApi = () => Api.get("/api/feedback/my-reviews", getAuthHeader());
export const createGuideFeedbackApi = (data) => Api.post("/api/feedback/guide-add", data, getAuthHeader());

// --- PACKAGE APIS ---
export const getAllPackagesApi = () => Api.get("/api/packages/get_all", getAuthHeader());
export const getPackageById = (id) => Api.get(`/api/packages/getPackageById/${id}`, getAuthHeader());
export const deletePackageApi = (id) => Api.delete(`/api/packages/delete_packages/${id}`, getAuthHeader());
export const getAgentPackagesApi = (agentId) => Api.get(`/api/packages/get-agent-packages/${agentId}`, getAuthHeader());
export const createPackageApi = (formData) => {
    const config = getAuthHeader();
    config.headers['Content-Type'] = 'multipart/form-data';
    return Api.post("/api/packages/add", formData, config);
};
export const updatePackageById = (id, formData) => {
    const config = getAuthHeader();
    config.headers['Content-Type'] = 'multipart/form-data';
    return Api.put(`/api/packages/update_package/${id}`, formData, config);
};

// --- BOOKING APIS ---
export const createBookingApi = (data) => Api.post("/api/bookings/create", data, getAuthHeader());
export const getMyBookingsApi = () => Api.get("/api/bookings/my-bookings", getAuthHeader());
export const getAllBookingsApi = () => Api.get("/api/bookings/all", getAuthHeader());
export const getBookingByIdApi = (id) => Api.get(`/api/bookings/get_single_booking/${id}`, getAuthHeader());
export const completeBookingApi = (id) => Api.put(`/api/bookings/complete/${id}`, {}, getAuthHeader());

// --- WISHLIST & FEEDBACK ---
export const toggleWishlistApi = (data) => Api.post("/api/wishlist/toggle", data, getAuthHeader());
export const getMyWishlistApi = () => Api.get("/api/wishlist/my-wishlist", getAuthHeader());
export const createFeedbackApi = (data) => Api.post("/api/feedback/add", data, getAuthHeader());
export const getAgentFeedbackApi = (agentId) => Api.get(`/api/feedback/agent/${agentId}`, getAuthHeader());
export const deleteAgentFeedbackApi = (id) => Api.delete(`/api/feedback/delete/${id}`, getAuthHeader());

// --- NEWLY ADDED GUIDE FEEDBACK APIS ---
export const giveGuideFeedbackApi = (data) => Api.post("/api/feedback/guide-add", data, getAuthHeader());
export const getGuideReviewsApi = () => Api.get("/api/feedback/my-reviews", getAuthHeader());

export default Api;