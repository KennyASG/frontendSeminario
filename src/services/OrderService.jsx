import apiService from './apiService';
import API_ENDPOINTS from '../config/apiEndpoints';

const orderService = {
    async getAll() {
        return await apiService.get(API_ENDPOINTS.ALL_ORDERS);
    },

    async getById(id) {
        return await apiService.get(API_ENDPOINTS.ORDER_BY_ID(id));
    },

    async getUserOrders(userId) {
        return await apiService.get(API_ENDPOINTS.USER_ORDERS(userId));
    },

    async getSalesByConcert(concertId) {
        return await apiService.get(API_ENDPOINTS.SALES_BY_CONCERT(concertId));
    },

    async create(orderData) {
        return await apiService.post(API_ENDPOINTS.CREATE_ORDER, orderData);
    },

    async confirm(id) {
        return await apiService.post(API_ENDPOINTS.CONFIRM_ORDER(id));
    }
};

export default orderService;