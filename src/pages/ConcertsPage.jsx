import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import concertService from '../services/concertService';

export default function ConcertsPage() {
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

            // Filtrar solo conciertos con estado "on_sale" (disponibles para compra)
            const availableConcerts = Array.isArray(data)
                ? data.filter(concert => concert.status?.descripcion === 'on_sale')
                : (data.concerts || []).filter(concert => concert.status?.descripcion === 'on_sale');

            setConcerts(availableConcerts);
        } catch (err) {
            setError(err.message || 'Error al cargar conciertos');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'on_sale': { label: 'En Venta', color: 'bg-green-100 text-green-800' },
            'sold_out': { label: 'Agotado', color: 'bg-red-100 text-red-800' },
            'scheduled': { label: 'Próximamente', color: 'bg-blue-100 text-blue-800' },
            'completed': { label: 'Finalizado', color: 'bg-gray-100 text-gray-800' },
            'canceled': { label: 'Cancelado', color: 'bg-red-100 text-red-800' }
        };

        const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                {statusInfo.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
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

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    🎵 Conciertos Disponibles
                </h1>
                <p className="text-gray-600">
                    Encuentra los mejores eventos y compra tus entradas
                </p>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {concerts.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-12 text-center">
                    <div className="text-6xl mb-4">🎭</div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">
                        No hay conciertos disponibles
                    </h2>
                    <p className="text-gray-500">
                        Por el momento no hay eventos en venta. ¡Vuelve pronto!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {concerts.map((concert) => (
                        <div
                            key={concert.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                            onClick={() => navigate(`/concerts/${concert.id}`)}
                        >
                            {/* Header del Card */}
                            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 text-white">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold leading-tight">
                                        {concert.title}
                                    </h3>
                                    {getStatusBadge(concert.status?.descripcion || 'unknown')}
                                </div>
                            </div>

                            {/* Body del Card */}
                            <div className="p-6">
                                {/* Descripción */}
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {concert.description}
                                </p>

                                {/* Fecha */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-gray-400">📅</span>
                                    <span className="text-sm text-gray-700 font-medium">
                                        {formatDate(concert.date)}
                                    </span>
                                </div>

                                {/* Venue */}
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-gray-400">📍</span>
                                    <div className="text-sm text-gray-700">
                                        <p className="font-medium">
                                            {concert.venues?.[0]?.name || 'Venue no especificado'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {concert.venues?.[0]?.city}, {concert.venues?.[0]?.country}
                                        </p>
                                    </div>
                                </div>

                                {/* Botón */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/concerts/${concert.id}`);
                                    }}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                                >
                                    Ver Detalles y Comprar
                                </button>
                            </div>

                            {/* Footer del Card */}
                            <div className="bg-gray-50 px-6 py-3 border-t">
                                <p className="text-xs text-gray-500 text-center">
                                    ID: {concert.id} • Creado: {new Date(concert.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Info adicional */}
            {concerts.length > 0 && (
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <strong>💡 Tip:</strong> Haz clic en cualquier concierto para ver más detalles,
                        disponibilidad de asientos y tipos de entradas.
                    </p>
                </div>
            )}
        </div>
    );
}