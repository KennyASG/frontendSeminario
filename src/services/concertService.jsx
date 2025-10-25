import apiService from './apiService';
import API_ENDPOINTS from '../config/apiEndpoints';

const concertService = {
    async getAll() {
        return await apiService.get(API_ENDPOINTS.CONCERTS);
    },

    async getById(id) {
        return await apiService.get(API_ENDPOINTS.CONCERT_BY_ID(id));
    },

    async create(concertData) {
        return await apiService.post(API_ENDPOINTS.CREATE_CONCERT, concertData);
    },

    async update(id, concertData) {
        return await apiService.put(API_ENDPOINTS.UPDATE_CONCERT(id), concertData);
    },

    async delete(id) {
        return await apiService.delete(API_ENDPOINTS.DELETE_CONCERT(id));
    }
};

export default concertService;