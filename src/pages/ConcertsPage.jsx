import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import concertService from '../services/concertService';
import LoadingSpinner from '../components/common/LoadingSpinner';

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
            'on_sale': { label: 'En Venta', color: 'bg-green-500' },
            'sold_out': { label: 'Agotado', color: 'bg-gray-500' },
            'scheduled': { label: 'Próximamente', color: 'bg-blue-500' },
            'completed': { label: 'Finalizado', color: 'bg-gray-500' },
            'canceled': { label: 'Cancelado', color: 'bg-red-500' }
        };

        const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-500' };
        return (
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${statusInfo.color} uppercase`}>
                {statusInfo.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    if (loading) {
        return <LoadingSpinner message="Cargando conciertos..." />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 py-20">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4">
                            VIVE LA MÚSICA
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90">
                            Los mejores conciertos y eventos musicales de Guatemala
                        </p>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-12">
                {/* Header section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Conciertos Disponibles</h2>
                    <p className="text-gray-400">Encuentra tu próximo evento y compra tus entradas</p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Concerts grid */}
                {concerts.length === 0 ? (
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-16 text-center border border-gray-700">
                        <div className="mb-6">
                            <svg className="w-24 h-24 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">No hay conciertos disponibles</h2>
                        <p className="text-gray-400">
                            Por el momento no hay eventos en venta. ¡Vuelve pronto!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {concerts.map((concert) => (
                            <div
                                key={concert.id}
                                className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700 hover:border-orange-500 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20"
                                onClick={() => navigate(`/concerts/${concert.id}`)}
                            >
                                {/* Image Section */}
                                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-600 to-red-600">
                                    <div className="absolute inset-0 bg-black/40"></div>
                                    {/* Placeholder for concert image */}
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{
                                            backgroundImage: 'url(https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800)',
                                            filter: 'brightness(0.6)'
                                        }}
                                    ></div>
                                    
                                    {/* Status badge */}
                                    <div className="absolute top-4 left-4 z-10">
                                        {getStatusBadge(concert.status?.descripcion || 'unknown')}
                                    </div>

                                    {/* Featured tag */}
                                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                                        Destacado
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6">
                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-500 transition-colors line-clamp-1">
                                        {concert.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                        {concert.description}
                                    </p>

                                    {/* Details */}
                                    <div className="space-y-3 mb-4">
                                        {/* Date */}
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold">{formatDate(concert.date)}</p>
                                            </div>
                                        </div>

                                        {/* Time */}
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold">{formatTime(concert.date)}</p>
                                            </div>
                                        </div>

                                        {/* Venue */}
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold line-clamp-1">
                                                    {concert.venues?.[0]?.name || 'Venue no especificado'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {concert.venues?.[0]?.city}, {concert.venues?.[0]?.country}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price info */}
                                    {concert.ticketTypes && concert.ticketTypes.length > 0 && (
                                        <div className="border-t border-gray-700 pt-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400 text-sm">Desde</span>
                                                <span className="text-2xl font-bold text-orange-500">
                                                    Q{Math.min(...concert.ticketTypes.map(t => t.price)).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action button */}
                                    <button 
                                        className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/concerts/${concert.id}`);
                                        }}
                                    >
                                        Ver Tickets
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}