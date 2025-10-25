import apiService from './apiService';
import API_ENDPOINTS from '../config/apiEndpoints';

const userService = {
    async login(email, password) {
        const response = await apiService.post(API_ENDPOINTS.LOGIN, { email, password });
        if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
    },

    async register(userData) {
        const response = await apiService.post(API_ENDPOINTS.REGISTER, userData);
        if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
    },

    async getCurrentUser() {
        return await apiService.get(API_ENDPOINTS.ME);
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getStoredUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    isAdmin() {
        const user = this.getStoredUser();
        return user?.role_id === 1;
    },
};

export default userService;