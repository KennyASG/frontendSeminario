import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import concertService from '../services/concertService';

export default function ConcertDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [concert, setConcert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchConcertDetail();
    }, [id]);

    const fetchConcertDetail = async () => {
        try {
            setLoading(true);
            const data = await concertService.getById(id);
            setConcert(data);
        } catch (err) {
            setError(err.message || 'Error al cargar detalles del concierto');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'on_sale': { label: 'En Venta', color: 'bg-green-100 text-green-800', icon: '✅' },
            'sold_out': { label: 'Agotado', color: 'bg-red-100 text-red-800', icon: '❌' },
            'scheduled': { label: 'Próximamente', color: 'bg-blue-100 text-blue-800', icon: '🕐' },
            'completed': { label: 'Finalizado', color: 'bg-gray-100 text-gray-800', icon: '🏁' },
            'canceled': { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: '🚫' }
        };

        const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: '❓' };
        return (
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusInfo.color}`}>
                <span>{statusInfo.icon}</span>
                {statusInfo.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('es-ES', options);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (error || !concert) {
        return (
            <div className="p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error || 'Concierto no encontrado'}
                </div>
                <button
                    onClick={() => navigate('/concerts')}
                    className="text-blue-600 hover:text-blue-700"
                >
                    ← Volver a conciertos
                </button>
            </div>
        );
    }

    const venue = concert.venues?.[0];
    const isAvailable = concert.status?.descripcion === 'on_sale';

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Botón Volver */}
            <button
                onClick={() => navigate('/concerts')}
                className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-2"
            >
                ← Volver a conciertos
            </button>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg p-8 mb-6 shadow-xl">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold mb-2">
                            {concert.title}
                        </h1>
                        <p className="text-red-100 text-lg">
                            {concert.description}
                        </p>
                    </div>
                    <div>
                        {getStatusBadge(concert.status?.descripcion)}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Información Principal */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Detalles del Evento */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            📋 Detalles del Evento
                        </h2>

                        <div className="space-y-4">
                            {/* Fecha */}
                            <div className="flex items-start gap-4">
                                <div className="bg-red-100 rounded-full p-3">
                                    <span className="text-2xl">📅</span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Fecha y Hora</p>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {formatDate(concert.date)}
                                    </p>
                                </div>
                            </div>

                            {/* Venue */}
                            {venue && (
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 rounded-full p-3">
                                        <span className="text-2xl">🏟️</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Lugar</p>
                                        <p className="text-lg font-semibold text-gray-800">
                                            {venue.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            📍 {venue.address}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {venue.city}, {venue.country}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* ID del Concierto */}
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-100 rounded-full p-3">
                                    <span className="text-2xl">🎫</span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">ID del Evento</p>
                                    <p className="text-lg font-semibold text-gray-800">
                                        #{concert.id}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secciones del Venue */}
                    {venue?.sections && venue.sections.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                🎭 Secciones Disponibles
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {venue.sections.map((section) => (
                                    <div key={section.id} className="border rounded-lg p-4 hover:border-red-500 transition">
                                        <h3 className="font-semibold text-gray-800 mb-1">
                                            {section.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Capacidad: {section.capacity} asientos
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tipos de Tickets */}
                    {concert.ticketTypes && concert.ticketTypes.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                💰 Tipos de Entradas
                            </h2>
                            <div className="space-y-3">
                                {concert.ticketTypes.map((ticket) => (
                                    <div key={ticket.id} className="border rounded-lg p-4 flex justify-between items-center hover:border-red-500 transition">
                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                {ticket.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Disponibles: {ticket.available}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-red-600">
                                                Q{ticket.price}
                                            </p>
                                            <p className="text-xs text-gray-500">por entrada</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar - Acciones */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            🎟️ Comprar Entradas
                        </h3>

                        {isAvailable ? (
                            <div className="space-y-4">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <p className="text-sm text-green-800 font-medium">
                                        ✅ Entradas disponibles
                                    </p>
                                </div>

                                <button
                                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
                                    onClick={() => alert('Funcionalidad de compra - próximamente')}
                                >
                                    Comprar Ahora
                                </button>

                                <div className="text-xs text-gray-500 text-center">
                                    <p>Proceso de compra seguro</p>
                                    <p>🔒 Pago protegido</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                                    <p className="text-sm text-gray-700 font-medium text-center">
                                        {concert.status?.descripcion === 'sold_out' && '❌ Entradas Agotadas'}
                                        {concert.status?.descripcion === 'scheduled' && '🕐 Próximamente'}
                                        {concert.status?.descripcion === 'completed' && '🏁 Evento Finalizado'}
                                        {concert.status?.descripcion === 'canceled' && '🚫 Evento Cancelado'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Información adicional */}
                        <div className="mt-6 pt-6 border-t">
                            <h4 className="font-semibold text-gray-800 mb-3">
                                📌 Información Adicional
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• Compra segura garantizada</li>
                                <li>• Entradas digitales</li>
                                <li>• Confirmación inmediata</li>
                                <li>• Soporte 24/7</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nota informativa */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    <strong>💡 Nota:</strong> Para ver todas las opciones de compra y reservar tus asientos,
                    inicia sesión o regístrate en la plataforma.
                </p>
            </div>
        </div>
    );
}