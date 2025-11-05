import API_CONFIG from './apiConfig';

const API_ENDPOINTS = {
    // AUTH - Puerto 3001
    LOGIN: `${API_CONFIG.AUTH_SERVICE}/auth/login`,
    REGISTER: `${API_CONFIG.AUTH_SERVICE}/auth/register`,
    ME: `${API_CONFIG.AUTH_SERVICE}/auth/me`,
    ADMIN_USERS: `${API_CONFIG.AUTH_SERVICE}/auth/admin/users`,

    // CONCERTS - Puerto 3001
    CONCERTS: `${API_CONFIG.CONCERT_SERVICE}/concert/concerts`,
    CONCERT_BY_ID: (id) => `${API_CONFIG.CONCERT_SERVICE}/concert/${id}`,
    CREATE_CONCERT: `${API_CONFIG.CONCERT_SERVICE}/concert/admin/concert`,
    UPDATE_CONCERT: (id) => `${API_CONFIG.CONCERT_SERVICE}/concert/admin/concert/${id}`,
    DELETE_CONCERT: (id) => `${API_CONFIG.CONCERT_SERVICE}/concert/admin/concert/${id}`,
    AVAILABLE_SEATS: (id) => `${API_CONFIG.CONCERT_SERVICE}/concert/concerts/${id}/available-seats`,

    // VENUES - Puerto 3002
    VENUES: `${API_CONFIG.VENUE_SERVICE}/venue/venues`,
    VENUE_BY_ID: (id) => `${API_CONFIG.VENUE_SERVICE}/venue/${id}`,
    VENUE_SECTIONS: (id) => `${API_CONFIG.VENUE_SERVICE}/venue/${id}/sections`,
    CREATE_VENUE: `${API_CONFIG.VENUE_SERVICE}/venue/admin/venue`,
    UPDATE_VENUE: (id) => `${API_CONFIG.VENUE_SERVICE}/venue/admin/venue/${id}`,
    DELETE_VENUE: (id) => `${API_CONFIG.VENUE_SERVICE}/venue/admin/venue/${id}`,
    CREATE_SECTION: (venueId) => `${API_CONFIG.VENUE_SERVICE}/venue/admin/venue/${venueId}/section`,
    UPDATE_SECTION: (venueId, sectionId) => `${API_CONFIG.VENUE_SERVICE}/venue/admin/venue/${venueId}/section/${sectionId}`,
    DELETE_SECTION: (venueId, sectionId) => `${API_CONFIG.VENUE_SERVICE}/venue/admin/venue/${venueId}/section/${sectionId}`,

    // TICKETS - Puerto 3003
    TICKET_TYPES: (concertId) => `${API_CONFIG.TICKET_SERVICE}/concert/${concertId}/ticket-types`,
    CREATE_RESERVATION: `${API_CONFIG.TICKET_SERVICE}/ticket/reserve`,
    USER_RESERVATIONS: `${API_CONFIG.TICKET_SERVICE}/ticket/reservations`,
    CREATE_TICKET_TYPE: (concertId) => `${API_CONFIG.TICKET_SERVICE}/admin/concert/${concertId}/ticket-type`,
    UPDATE_TICKET_TYPE: (id) => `${API_CONFIG.TICKET_SERVICE}/admin/ticket-type/${id}`,
    DELETE_TICKET_TYPE: (id) => `${API_CONFIG.TICKET_SERVICE}/admin/ticket-type/${id}`,
    RELEASE_EXPIRED: `${API_CONFIG.TICKET_SERVICE}/admin/tickets/release-expired`,

    // ORDERS - Puerto 3004
    CREATE_ORDER: `${API_CONFIG.ORDER_SERVICE}/order/`,
    CONFIRM_ORDER: (id) => `${API_CONFIG.ORDER_SERVICE}/order/${id}/confirm`,
    ORDER_BY_ID: (id) => `${API_CONFIG.ORDER_SERVICE}/order/${id}`,
    USER_ORDERS: (userId) => `${API_CONFIG.ORDER_SERVICE}/order/orders/user/${userId}`,
    ALL_ORDERS: `${API_CONFIG.ORDER_SERVICE}/order/admin/orders`,
    SALES_BY_CONCERT: (concertId) => `${API_CONFIG.ORDER_SERVICE}/order/admin/concert/${concertId}/sales`,

    // NOTIFICATIONS - Puerto 3005
    SEND_TICKETS: (orderId) => `${API_CONFIG.NOTIFICATION_SERVICE}/notification/order/${orderId}/send-tickets`,
    SEND_CONFIRMATION: (orderId) => `${API_CONFIG.NOTIFICATION_SERVICE}/notification/order/${orderId}/send-confirmation`,
    NOTIFICATIONS: `${API_CONFIG.NOTIFICATION_SERVICE}/notification/notifications`,
};

export default API_ENDPOINTS;