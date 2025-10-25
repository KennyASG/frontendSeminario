import apiService from './apiService';
import API_ENDPOINTS from '../config/apiEndpoints';

const ticketService = {
    // Obtener tipos de tickets de un concierto
    async getTicketTypes(concertId) {
        return await apiService.get(API_ENDPOINTS.TICKET_TYPES(concertId));
    },

    // Crear tipo de ticket
    async createTicketType(concertId, ticketData) {
        return await apiService.post(API_ENDPOINTS.CREATE_TICKET_TYPE(concertId), ticketData);
    },

    // Actualizar tipo de ticket
    async updateTicketType(id, ticketData) {
        return await apiService.put(API_ENDPOINTS.UPDATE_TICKET_TYPE(id), ticketData);
    },

    // Eliminar tipo de ticket
    async deleteTicketType(id) {
        return await apiService.delete(API_ENDPOINTS.DELETE_TICKET_TYPE(id));
    },

    // Crear reserva
    async createReservation(reservationData) {
        return await apiService.post(API_ENDPOINTS.CREATE_RESERVATION, reservationData);
    },

    // Obtener reservas del usuario
    async getUserReservations() {
        return await apiService.get(API_ENDPOINTS.USER_RESERVATIONS);
    },

    // Liberar reservas expiradas (Admin)
    async releaseExpiredReservations() {
        return await apiService.post(API_ENDPOINTS.RELEASE_EXPIRED);
    }
};

export default ticketService;