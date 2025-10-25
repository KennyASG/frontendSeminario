import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import concertService from '../services/concertService';
import ticketService from '../services/TicketService';

export default function ConcertTicketTypesPage() {
    const { concertId } = useParams();
    const navigate = useNavigate();

    const [concert, setConcert] = useState(null);
    const [ticketTypes, setTicketTypes] = useState([]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingTicket, setEditingTicket] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        available: '',
        section_id: ''
    });

    useEffect(() => {
        fetchData();
    }, [concertId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [concertData, ticketTypesData] = await Promise.all([
                concertService.getById(concertId),
                ticketService.getTicketTypes(concertId)
            ]);

            setConcert(concertData);
            setTicketTypes(Array.isArray(ticketTypesData) ? ticketTypesData : []);

            // Extraer secciones del venue
            const venueSections = concertData.venues?.[0]?.sections || [];
            setSections(venueSections);
        } catch (err) {
            setError(err.message || 'Error al cargar datos');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (ticket = null) => {
        if (ticket) {
            setEditingTicket(ticket);
            setFormData({
                name: ticket.name,
                price: ticket.price.toString(),
                available: ticket.available.toString(),
                section_id: ticket.section_id || ''
            });
        } else {
            setEditingTicket(null);
            setFormData({ name: '', price: '', available: '', section_id: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingTicket(null);
        setFormData({ name: '', price: '', available: '', section_id: '' });
        setError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim()) {
            setError('El nombre es obligatorio');
            return;
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            setError('El precio debe ser mayor a 0');
            return;
        }
        if (!formData.available || parseInt(formData.available) <= 0) {
            setError('La cantidad disponible debe ser mayor a 0');
            return;
        }

        try {
            const dataToSend = {
                name: formData.name,
                price: parseFloat(formData.price),
                available: parseInt(formData.available),
                section_id: formData.section_id ? parseInt(formData.section_id) : null
            };

            if (editingTicket) {
                await ticketService.updateTicketType(editingTicket.id, dataToSend);
            } else {
                await ticketService.createTicketType(concertId, dataToSend);
            }

            await fetchData();
            handleCloseModal();
        } catch (err) {
            setError(err.message || 'Error al guardar el tipo de ticket');
        }
    };

    const handleDelete = async (ticketId, ticketName) => {
        if (!confirm(`¿Estás seguro de eliminar el tipo de ticket "${ticketName}"?`)) {
            return;
        }

        try {
            await ticketService.deleteTicketType(ticketId);
            setTicketTypes(ticketTypes.filter(t => t.id !== ticketId));
        } catch (err) {
            alert(err.message || 'Error al eliminar el tipo de ticket');
        }
    };

    const totalRevenue = ticketTypes.reduce((sum, ticket) => {
        return sum + (ticket.price * ticket.available);
    }, 0);

    const totalTickets = ticketTypes.reduce((sum, ticket) => sum + ticket.available, 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/admin/concerts')}
                    className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
                >
                    ← Volver a Conciertos
                </button>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">
                            🎫 Tipos de Tickets - {concert?.title}
                        </h1>
                        <p className="text-gray-600 mb-2">
                            📅 {concert?.date ? new Date(concert.date).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : 'Sin fecha'}
                        </p>
                        <p className="text-gray-600">
                            📍 {concert?.venues?.[0]?.name || 'Venue no especificado'}
                        </p>
                        <div className="mt-4 flex gap-6">
                            <p className="text-sm text-gray-700">
                                <strong>Total Tickets:</strong> {totalTickets}
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong>Ingreso Potencial:</strong> Q{totalRevenue.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                        + Agregar Tipo de Ticket
                    </button>
                </div>
            </div>

            {error && !showModal && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Lista de tipos de tickets */}
            {ticketTypes.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-500 text-lg mb-4">No hay tipos de tickets registrados</p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
                    >
                        Crear Primer Tipo de Ticket
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ticketTypes.map((ticket) => (
                        <div key={ticket.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                                        {ticket.name}
                                    </h3>
                                    {ticket.section && (
                                        <p className="text-sm text-gray-500">
                                            📍 Sección: {ticket.section.name}
                                        </p>
                                    )}
                                </div>
                                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                                    ID: {ticket.id}
                                </span>
                            </div>

                            <div className="space-y-3 mb-4">
                                {/* Precio */}
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm">Precio:</span>
                                    <span className="text-2xl font-bold text-red-600">
                                        Q{ticket.price}
                                    </span>
                                </div>

                                {/* Disponibles */}
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm">Disponibles:</span>
                                    <span className="text-lg font-semibold text-gray-800">
                                        {ticket.available}
                                    </span>
                                </div>

                                {/* Ingreso potencial */}
                                <div className="flex justify-between items-center pt-3 border-t">
                                    <span className="text-gray-600 text-sm">Ingreso Potencial:</span>
                                    <span className="text-lg font-semibold text-green-600">
                                        Q{(ticket.price * ticket.available).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t">
                                <button
                                    onClick={() => handleOpenModal(ticket)}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded"
                                >
                                    ✏️ Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(ticket.id, ticket.name)}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded"
                                >
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4">
                            {editingTicket ? 'Editar Tipo de Ticket' : 'Nuevo Tipo de Ticket'}
                        </h2>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Nombre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre del Ticket *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                    placeholder="Ej: VIP - Rock Fest, General - Rock Fest"
                                    required
                                />
                            </div>

                            {/* Sección */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sección (Opcional)
                                </label>
                                <select
                                    name="section_id"
                                    value={formData.section_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="">Sin sección específica</option>
                                    {sections.map(section => (
                                        <option key={section.id} value={section.id}>
                                            {section.name} (Capacidad: {section.capacity})
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    Si no seleccionas una sección, el ticket será general
                                </p>
                            </div>

                            {/* Precio */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Precio (Q) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                    placeholder="Ej: 500"
                                    min="1"
                                    step="0.01"
                                    required
                                />
                            </div>

                            {/* Cantidad Disponible */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cantidad Disponible *
                                </label>
                                <input
                                    type="number"
                                    name="available"
                                    value={formData.available}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                    placeholder="Ej: 100"
                                    min="1"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Número de tickets que estarán disponibles para venta
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                                >
                                    {editingTicket ? 'Actualizar' : 'Crear Tipo de Ticket'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}