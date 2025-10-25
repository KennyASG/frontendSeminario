import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import concertService from '../services/concertService';

export default function AdminConcertsPage() {
    const [concerts, setConcerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchConcerts();
    }, []);

    const fetchConcerts = async () => {
        try {
            setLoading(true);
            const data = await concertService.getAll();
            console.log('Concerts data:', data);
            setConcerts(Array.isArray(data) ? data : data.concerts || []);
        } catch (err) {
            setError(err.message || 'Error al cargar conciertos');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!confirm(`¿Estás seguro de eliminar el concierto "${title}"?`)) return;

        try {
            await concertService.delete(id);
            setConcerts(concerts.filter(c => c.id !== id));
        } catch (err) {
            alert(err.message || 'Error al eliminar');
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'on_sale': { label: 'En Venta', color: 'bg-green-100 text-green-800' },
            'sold_out': { label: 'Agotado', color: 'bg-red-100 text-red-800' },
            'scheduled': { label: 'Programado', color: 'bg-blue-100 text-blue-800' },
            'completed': { label: 'Finalizado', color: 'bg-gray-100 text-gray-800' },
            'canceled': { label: 'Cancelado', color: 'bg-red-100 text-red-800' }
        };

        const statusInfo = statusMap[status?.toLowerCase()] || {
            label: status || 'Desconocido',
            color: 'bg-gray-100 text-gray-800'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                {statusInfo.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">🎵 Gestión de Conciertos</h1>
                    <p className="text-gray-600 mt-1">Administra todos los eventos y conciertos</p>
                </div>
                <button
                    onClick={() => navigate('/admin/concerts/create')}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    ➕ Crear Concierto
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {concerts.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-12 text-center">
                    <div className="text-6xl mb-4">🎭</div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">
                        No hay conciertos registrados
                    </h2>
                    <p className="text-gray-500 mb-6">
                        Comienza creando tu primer concierto
                    </p>
                    <button
                        onClick={() => navigate('/admin/concerts/create')}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium"
                    >
                        ➕ Crear Primer Concierto
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {concerts.map((concert) => (
                        <div
                            key={concert.id}
                            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                        >
                            {/* Header del Card con Gradiente */}
                            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 text-white">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold leading-tight flex-1 mr-2">
                                        {concert.title}
                                    </h3>
                                    {getStatusBadge(concert.status?.descripcion || concert.status?.description)}
                                </div>
                                <p className="text-sm text-red-100 opacity-90">
                                    ID: {concert.id}
                                </p>
                            </div>

                            {/* Body del Card */}
                            <div className="p-5">
                                {/* Descripción */}
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                                    {concert.description || 'Sin descripción'}
                                </p>

                                {/* Fecha */}
                                <div className="flex items-start gap-2 mb-3">
                                    <span className="text-gray-400 text-lg">📅</span>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 font-medium">Fecha del Evento</p>
                                        <p className="text-sm text-gray-800 font-semibold">
                                            {formatDate(concert.date)}
                                        </p>
                                    </div>
                                </div>

                                {/* Venue */}
                                <div className="flex items-start gap-2 mb-4">
                                    <span className="text-gray-400 text-lg">🏟️</span>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 font-medium">Lugar</p>
                                        <p className="text-sm text-gray-800 font-semibold">
                                            {concert.venues?.[0]?.name || 'Sin venue asignado'}
                                        </p>
                                        {concert.venues?.[0]?.city && (
                                            <p className="text-xs text-gray-500">
                                                {concert.venues[0].city}, {concert.venues[0].country}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Botones de Acción */}
                                <div className="flex gap-2 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => navigate(`/admin/concerts/${concert.id}/tickets`)}
                                        className="flex-1 bg-purple-500 hover:bg-purple-600 text-white text-sm py-2 px-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-1"
                                        title="Gestionar tipos de tickets"
                                    >
                                        🎫 Tickets
                                    </button>
                                    <button
                                        onClick={() => navigate(`/admin/concerts/edit/${concert.id}`)}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-1"
                                        title="Editar concierto"
                                    >
                                        ✏️ Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(concert.id, concert.title)}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-1"
                                        title="Eliminar concierto"
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </div>

                            {/* Footer del Card */}
                            <div className="bg-gray-50 px-5 py-3 border-t">
                                <p className="text-xs text-gray-500 text-center">
                                    Creado: {new Date(concert.created_at).toLocaleDateString('es-ES')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Info adicional */}
            {concerts.length > 0 && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <strong>📊 Total de conciertos:</strong> {concerts.length}
                    </p>
                </div>
            )}
        </div>
    );
}