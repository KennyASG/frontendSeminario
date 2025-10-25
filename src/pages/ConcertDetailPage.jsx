import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import concertService from '../services/concertService';
import ticketService from '../services/ticketService';
import userService from '../services/userService';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ConcertDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [concert, setConcert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reserving, setReserving] = useState(false);
    const [selectedTickets, setSelectedTickets] = useState({});

    useEffect(() => {
        fetchConcertDetail();
    }, [id]);

    const fetchConcertDetail = async () => {
        try {
            setLoading(true);
            const data = await concertService.getById(id);
            setConcert(data);
            
            if (data.ticketTypes && data.ticketTypes.length > 0) {
                const initialQuantities = {};
                data.ticketTypes.forEach(ticket => {
                    initialQuantities[ticket.id] = 0;
                });
                setSelectedTickets(initialQuantities);
            }
        } catch (err) {
            setError(err.message || 'Error al cargar detalles del concierto');
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (ticketTypeId, newQuantity) => {
        const ticketType = concert.ticketTypes.find(t => t.id === ticketTypeId);
        
        if (newQuantity > ticketType.available) {
            alert(`Solo hay ${ticketType.available} tickets disponibles de tipo "${ticketType.name}"`);
            return;
        }
        
        if (newQuantity < 0) return;
        
        setSelectedTickets(prev => ({
            ...prev,
            [ticketTypeId]: newQuantity
        }));
    };

    const getTotalTickets = () => {
        return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
    };

    const getTotalPrice = () => {
        if (!concert?.ticketTypes) return 0;
        
        return concert.ticketTypes.reduce((total, ticket) => {
            const quantity = selectedTickets[ticket.id] || 0;
            return total + (ticket.price * quantity);
        }, 0);
    };

    const getSelectedTicketsSummary = () => {
        if (!concert?.ticketTypes) return [];
        
        return concert.ticketTypes
            .filter(ticket => selectedTickets[ticket.id] > 0)
            .map(ticket => ({
                ...ticket,
                quantity: selectedTickets[ticket.id]
            }));
    };

    const handleReserve = async () => {
        try {
            const totalTickets = getTotalTickets();
            
            if (totalTickets === 0) {
                alert('Debes seleccionar al menos un ticket');
                return;
            }
            
            setReserving(true);
            setError('');
            
            const user = userService.getStoredUser();
            if (!user) {
                alert('Debes iniciar sesión para comprar tickets');
                navigate('/login');
                return;
            }
            
            const selectedSummary = getSelectedTicketsSummary();
            const reservationPromises = selectedSummary.map(ticket => 
                ticketService.createReservation({
                    concert_id: parseInt(id),
                    ticket_type_id: ticket.id,
                    quantity: ticket.quantity
                })
            );
            
            const reservations = await Promise.all(reservationPromises);
            
            const checkoutData = {
                concertId: id,
                concertTitle: concert.title,
                concertDate: concert.date,
                venue: concert.venues?.[0]?.name,
                tickets: selectedSummary,
                total: getTotalPrice(),
                reservations: reservations,
                expiresAt: reservations[0]?.reservation?.expires_at || new Date(Date.now() + 15 * 60 * 1000).toISOString()
            };
            
            localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
            navigate('/checkout');
            
        } catch (err) {
            console.error('Error al crear reserva:', err);
            setError(err.message || 'Error al procesar la reserva. Intenta nuevamente.');
            setReserving(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('es-ES', options);
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
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

    if (loading) {
        return <LoadingSpinner message="Cargando detalles del concierto..." />;
    }

    if (error && !concert) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => navigate('/concerts')}
                        className="text-orange-500 hover:text-orange-400 mb-4 flex items-center gap-2"
                    >
                        ← Volver a conciertos
                    </button>
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    const venue = concert.venues?.[0];
    const isAvailable = concert.status?.descripcion === 'on_sale';
    const totalTickets = getTotalTickets();
    const totalPrice = getTotalPrice();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
            {/* Hero Section con imagen de fondo */}
            <div className="relative h-[70vh] overflow-hidden">
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10"></div>
                
                {/* Background image placeholder */}
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1920)',
                        filter: 'brightness(0.4)'
                    }}
                ></div>

                {/* Botón Volver */}
                <button
                    onClick={() => navigate('/concerts')}
                    className="absolute top-6 left-6 text-white/80 hover:text-white flex items-center gap-2 z-20 bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm"
                >
                    ← Volver a Conciertos
                </button>

                {/* Content */}
                <div className="relative z-20 h-full flex items-end">
                    <div className="container mx-auto px-6 pb-12">
                        <div className="max-w-2xl">
                            {getStatusBadge(concert.status?.descripcion)}
                            
                            <h1 className="text-6xl font-bold mt-4 mb-3">
                                {concert.title}
                            </h1>
                            
                            <p className="text-xl text-gray-300 mb-2">
                                {concert.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información y Tickets */}
            <div className="container mx-auto px-6 -mt-20 relative z-30 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna Izquierda - Info del concierto */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Card de información básica */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Fecha</p>
                                    <p className="text-white font-semibold text-lg">{formatDate(concert.date)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Hora</p>
                                    <p className="text-white font-semibold text-lg">{formatTime(concert.date)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Venue</p>
                                    <p className="text-white font-semibold">{venue?.name || 'Por confirmar'}</p>
                                    {venue && (
                                        <p className="text-gray-400 text-sm">{venue.city}, {venue.country}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Duración</p>
                                    <p className="text-white font-semibold">2h 30min</p>
                                </div>
                            </div>
                        </div>

                        {/* Descripción extendida */}
                        {concert.description && (
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
                                <h2 className="text-2xl font-bold mb-4">Acerca del evento</h2>
                                <p className="text-gray-300 leading-relaxed">
                                    {concert.description}. Una noche llena de música, entretenimiento y sorpresas que no te puedes perder.
                                </p>
                            </div>
                        )}

                        {/* Tipos de Tickets */}
                        {concert.ticketTypes && concert.ticketTypes.length > 0 && (
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
                                <h2 className="text-2xl font-bold mb-6">Tipos de Entradas</h2>
                                <div className="space-y-4">
                                    {concert.ticketTypes.map((ticket) => {
                                        const selectedQty = selectedTickets[ticket.id] || 0;
                                        const isOutOfStock = ticket.available === 0;
                                        
                                        return (
                                            <div 
                                                key={ticket.id} 
                                                className={`bg-gray-900/50 rounded-xl p-6 border-2 transition-all ${
                                                    isOutOfStock 
                                                        ? 'border-gray-700 opacity-50' 
                                                        : selectedQty > 0 
                                                            ? 'border-orange-500' 
                                                            : 'border-gray-700 hover:border-gray-600'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white">{ticket.name}</h3>
                                                        <p className="text-gray-400 text-sm mt-1">
                                                            {isOutOfStock ? (
                                                                <span className="text-red-400 font-semibold">Agotado</span>
                                                            ) : (
                                                                `Disponibles: ${ticket.available}`
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-3xl font-bold text-orange-500">Q{ticket.price}</p>
                                                        <p className="text-gray-500 text-xs">por entrada</p>
                                                    </div>
                                                </div>

                                                {!isOutOfStock && isAvailable && (
                                                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                                                        <span className="text-gray-400 text-sm">Cantidad:</span>
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => handleQuantityChange(ticket.id, selectedQty - 1)}
                                                                disabled={selectedQty === 0}
                                                                className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-white font-bold"
                                                            >
                                                                -
                                                            </button>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max={ticket.available}
                                                                value={selectedQty}
                                                                onChange={(e) => handleQuantityChange(ticket.id, parseInt(e.target.value) || 0)}
                                                                className="w-16 text-center bg-gray-700 border-2 border-gray-600 rounded-lg py-2 font-bold text-white focus:outline-none focus:border-orange-500"
                                                            />
                                                            <button
                                                                onClick={() => handleQuantityChange(ticket.id, selectedQty + 1)}
                                                                disabled={selectedQty >= ticket.available}
                                                                className="w-10 h-10 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-white font-bold"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        {selectedQty > 0 && (
                                                            <span className="text-gray-400 text-sm">
                                                                Subtotal: <span className="font-bold text-orange-500">Q{(ticket.price * selectedQty).toLocaleString()}</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Columna Derecha - Resumen sticky */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                                {error && (
                                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
                                        {error}
                                    </div>
                                )}

                                {isAvailable ? (
                                    <>
                                        {totalTickets > 0 ? (
                                            <>
                                                <h3 className="text-xl font-bold mb-4">Resumen de Compra</h3>
                                                
                                                <div className="space-y-3 mb-6">
                                                    {getSelectedTicketsSummary().map(ticket => (
                                                        <div key={ticket.id} className="flex justify-between text-sm bg-gray-900/50 p-3 rounded-lg">
                                                            <span className="text-gray-300">
                                                                {ticket.quantity}x {ticket.name}
                                                            </span>
                                                            <span className="font-semibold text-white">
                                                                Q{(ticket.price * ticket.quantity).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="border-t border-gray-700 pt-4 mb-6">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-400">Total</span>
                                                        <span className="text-3xl font-bold text-orange-500">
                                                            Q{totalPrice.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-500 text-xs text-center mt-2">
                                                        {totalTickets} {totalTickets === 1 ? 'ticket' : 'tickets'} seleccionado{totalTickets !== 1 ? 's' : ''}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={handleReserve}
                                                    disabled={reserving}
                                                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all text-lg flex items-center justify-center gap-2"
                                                >
                                                    {reserving ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                                            Procesando...
                                                        </>
                                                    ) : (
                                                        'Comprar Tickets'
                                                    )}
                                                </button>

                                                <p className="text-gray-500 text-xs text-center mt-4">
                                                    Reserva segura por 15 minutos
                                                </p>
                                            </>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="text-5xl mb-4">🎫</div>
                                                <h3 className="text-xl font-bold mb-2">Selecciona tus tickets</h3>
                                                <p className="text-gray-400 text-sm">
                                                    Usa los selectores para elegir la cantidad de entradas
                                                </p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-5xl mb-4">
                                            {concert.status?.descripcion === 'sold_out' ? '🚫' : '⏰'}
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">
                                            {concert.status?.descripcion === 'sold_out' 
                                                ? 'Entradas Agotadas' 
                                                : 'Venta No Disponible'
                                            }
                                        </h3>
                                        <p className="text-gray-400 text-sm">
                                            {concert.status?.descripcion === 'sold_out' 
                                                ? 'Este evento está completamente vendido' 
                                                : 'Las entradas no están disponibles en este momento'
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}