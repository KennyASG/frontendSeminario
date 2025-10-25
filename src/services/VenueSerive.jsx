import apiService from './apiService';
import API_ENDPOINTS from '../config/apiEndpoints';

const venueService = {
    async getAll() {
        return await apiService.get(API_ENDPOINTS.VENUES);
    },

    async getById(id) {
        return await apiService.get(API_ENDPOINTS.VENUE_BY_ID(id));
    },

    async getSections(id) {
        return await apiService.get(API_ENDPOINTS.VENUE_SECTIONS(id));
    },

    async create(venueData) {
        return await apiService.post(API_ENDPOINTS.CREATE_VENUE, venueData);
    },

    async update(id, venueData) {
        return await apiService.put(API_ENDPOINTS.UPDATE_VENUE(id), venueData);
    },

    async delete(id) {
        return await apiService.delete(API_ENDPOINTS.DELETE_VENUE(id));
    },

    async createSection(venueId, sectionData) {
        return await apiService.post(API_ENDPOINTS.CREATE_SECTION(venueId), sectionData);
    },

    async updateSection(venueId, sectionId, sectionData) {
        return await apiService.put(API_ENDPOINTS.UPDATE_SECTION(venueId, sectionId), sectionData);
    },

    async deleteSection(venueId, sectionId) {
        return await apiService.delete(API_ENDPOINTS.DELETE_SECTION(venueId, sectionId));
    }
};

export default venueService;