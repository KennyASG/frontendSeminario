import apiService from './apiService';
import API_ENDPOINTS from '../config/apiEndpoints';

const UserService = {
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
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (error) {
                console.error('Error parsing user:', error);
                return null;
            }
        }
        return null;
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    isAdmin() {
        const user = this.getStoredUser();
        return user?.role?.id === 1;
    },

    getToken() {
        return localStorage.getItem('token');
    },
};

export default UserService;