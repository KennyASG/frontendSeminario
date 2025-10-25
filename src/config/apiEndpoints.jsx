import API_CONFIG from './apiConfig';

const API_ENDPOINTS = {
    // AUTH
    LOGIN: `${API_CONFIG.AUTH_SERVICE}/auth/login`,
    REGISTER: `${API_CONFIG.AUTH_SERVICE}/auth/register`,
    ME: `${API_CONFIG.AUTH_SERVICE}/auth/me`,

    // CONCERTS
    CONCERTS: `${API_CONFIG.CONCERT_SERVICE}/concerts`,
    CONCERT_BY_ID: (id) => `${API_CONFIG.CONCERT_SERVICE}/${id}`,
    CREATE_CONCERT: `${API_CONFIG.CONCERT_SERVICE}/admin/concert`,
    UPDATE_CONCERT: (id) => `${API_CONFIG.CONCERT_SERVICE}/admin/concert/${id}`,
    DELETE_CONCERT: (id) => `${API_CONFIG.CONCERT_SERVICE}/admin/concert/${id}`,

    // VENUES
    VENUES: `${API_CONFIG.VENUE_SERVICE}/venues`,
    VENUE_BY_ID: (id) => `${API_CONFIG.VENUE_SERVICE}/${id}`,
    VENUE_SECTIONS: (id) => `${API_CONFIG.VENUE_SERVICE}/${id}/sections`,
    CREATE_VENUE: `${API_CONFIG.VENUE_SERVICE}/admin/venue`,
    UPDATE_VENUE: (id) => `${API_CONFIG.VENUE_SERVICE}/admin/venue/${id}`,
    DELETE_VENUE: (id) => `${API_CONFIG.VENUE_SERVICE}/admin/venue/${id}`,
    CREATE_SECTION: (venueId) => `${API_CONFIG.VENUE_SERVICE}/admin/venue/${venueId}/section`,
    UPDATE_SECTION: (venueId, sectionId) => `${API_CONFIG.VENUE_SERVICE}/admin/venue/${venueId}/section/${sectionId}`,
    DELETE_SECTION: (venueId, sectionId) => `${API_CONFIG.VENUE_SERVICE}/admin/venue/${venueId}/section/${sectionId}`,

    // TICKETS
    TICKET_TYPES: (concertId) => `${API_CONFIG.TICKET_SERVICE}/concert/${concertId}/ticket-types`,
    CREATE_RESERVATION: `${API_CONFIG.TICKET_SERVICE}/ticket/reserve`,
    USER_RESERVATIONS: `${API_CONFIG.TICKET_SERVICE}/ticket/reservations`,
    CREATE_TICKET_TYPE: (concertId) => `${API_CONFIG.TICKET_SERVICE}/admin/concert/${concertId}/ticket-type`,
    UPDATE_TICKET_TYPE: (id) => `${API_CONFIG.TICKET_SERVICE}/admin/ticket-type/${id}`,
    DELETE_TICKET_TYPE: (id) => `${API_CONFIG.TICKET_SERVICE}/admin/ticket-type/${id}`,
    RELEASE_EXPIRED: `${API_CONFIG.TICKET_SERVICE}/admin/tickets/release-expired`,

    // ORDERS
    CREATE_ORDER: `${API_CONFIG.ORDER_SERVICE}/`,
    CONFIRM_ORDER: (id) => `${API_CONFIG.ORDER_SERVICE}/${id}/confirm`,
    ORDER_BY_ID: (id) => `${API_CONFIG.ORDER_SERVICE}/${id}`,
    USER_ORDERS: (userId) => `${API_CONFIG.ORDER_SERVICE}/orders/user/${userId}`,
    ALL_ORDERS: `${API_CONFIG.ORDER_SERVICE}/admin/orders`,
    SALES_BY_CONCERT: (concertId) => `${API_CONFIG.ORDER_SERVICE}/admin/concert/${concertId}/sales`,

    // NOTIFICATIONS
    SEND_TICKETS: (orderId) => `${API_CONFIG.NOTIFICATION_SERVICE}/order/${orderId}/send-tickets`,
    SEND_CONFIRMATION: (orderId) => `${API_CONFIG.NOTIFICATION_SERVICE}/order/${orderId}/send-confirmation`,
    NOTIFICATIONS: `${API_CONFIG.NOTIFICATION_SERVICE}/notifications`,
};

export default API_ENDPOINTS;