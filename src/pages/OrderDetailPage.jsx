import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import orderService from '../services/orderService';

export default function OrderDetailPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sendingTickets, setSendingTickets] = useState(false);

    useEffect(() => {
        fetchOrderDetail();
    }, [orderId]);

    const fetchOrderDetail = async () => {
        try {
            setLoading(true);
            const data = await orderService.getById(orderId);
            setOrder(data);
        } catch (err) {
            console.error('Error al cargar detalle de orden:', err);
            setError(err.message || 'Error al cargar los detalles de la orden');
        } finally {
            setLoading(false);
        }
    };

    const handleSendTickets = async () => {
        try {
            setSendingTickets(true);
            // await notificationService.sendTickets(orderId);
            alert('Los tickets han sido enviados a tu correo electrónico');
        } catch (err) {
            console.error('Error al enviar tickets:', err);
            alert('Error al enviar tickets. Intenta nuevamente.');
        } finally {
            setSendingTickets(false);
        }
    };

    const handlePrintTickets = () => {
        window.print();
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': { label: 'Pendiente', color: 'bg-yellow-500' },
            'confirmed': { label: 'Confirmada', color: 'bg-green-500' },
            'canceled': { label: 'Cancelada', color: 'bg-red-500' },
            'failed': { label: 'Fallida', color: 'bg-red-500' }
        };

        const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-500' };
        return (
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold text-white ${statusInfo.color} uppercase`}>
                {statusInfo.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <LoadingSpinner message="Cargando detalles de la orden..." />;
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => navigate('/my-orders')}
                        className="text-orange-500 hover:text-orange-400 mb-4 flex items-center gap-2"
                    >
                        ← Volver a Mis Órdenes
                    </button>
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
                        {error || 'Orden no encontrada'}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
            <div className="container mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/my-orders')}
                        className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
                    >
                        ← Volver a Mis Órdenes
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Orden #{order.id}</h1>
                            <p className="text-gray-400">Detalles de tu compra</p>
                        </div>
                        {getStatusBadge(order.status?.descripcion || order.status)}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna principal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Información del concierto */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
                            <h2 className="text-2xl font-bold mb-6">Información del Evento</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Concierto</p>
                                    <p className="text-white font-bold text-xl">{order.concert?.title || 'N/A'}</p>
                                </div>
                                
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Fecha del Evento</p>
                                    <p className="text-white font-semibold">{formatDate(order.concert?.date)}</p>
                                </div>
                                
                                {order.concert?.venue && (
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">Lugar</p>
                                        <p className="text-white font-semibold">{order.concert.venue}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tickets */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Tus Tickets</h2>
                                <span className="text-gray-400 text-sm">
                                    {order.tickets?.length || 0} ticket{order.tickets?.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                            
                            <div className="space-y-4">
                                {order.tickets && order.tickets.length > 0 ? (
                                    order.tickets.map((ticket, index) => (
                                        <div 
                                            key={ticket.id || index}
                                            className="bg-gray-900/50 rounded-xl p-6 border-l-4 border-orange-500"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="text-white font-bold text-lg">Ticket #{ticket.id}</p>
                                                    <p className="text-gray-400 text-sm">Código: {ticket.code}</p>
                                                </div>
                                                <div className="bg-green-500/20 border border-green-500 rounded-lg px-3 py-1">
                                                    <p className="text-green-400 font-semibold text-xs">
                                                        {ticket.status?.descripcion?.toUpperCase() || 'EMITIDO'}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {ticket.ticketType && (
                                                <div className="border-t border-gray-700 pt-3">
                                                    <p className="text-gray-400 text-sm">Tipo de Entrada</p>
                                                    <p className="text-white font-semibold">{ticket.ticketType.name}</p>
                                                </div>
                                            )}
                                            
                                            {ticket.seat && (
                                                <div className="mt-2">
                                                    <p className="text-gray-400 text-sm">Asiento</p>
                                                    <p className="text-white font-semibold">
                                                        Sección {ticket.seat.section?.name || 'General'} - Asiento #{ticket.seat.id}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-center py-4">No hay tickets disponibles</p>
                                )}
                            </div>
                        </div>

                        {/* Información de pago */}
                        {order.payment && (
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
                                <h2 className="text-2xl font-bold mb-6">Información de Pago</h2>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Método de Pago</span>
                                        <span className="text-white font-semibold">Tarjeta de Crédito</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Estado</span>
                                        <span className="text-green-400 font-semibold">
                                            {order.payment.status?.descripcion?.toUpperCase() || 'CAPTURADO'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">ID de Transacción</span>
                                        <span className="text-white font-mono text-sm">{order.payment.id}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Resumen */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 space-y-6">
                            {/* Resumen de compra */}
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                                <h3 className="text-xl font-bold mb-4">Resumen</h3>
                                
                                <div className="space-y-3 mb-6">
                                    {order.items && order.items.length > 0 ? (
                                        order.items.map((item, index) => (
                                            <div key={index} className="flex justify-between text-sm">
                                                <span className="text-gray-300">
                                                    {item.quantity}x {item.ticketType?.name || 'Ticket'}
                                                </span>
                                                <span className="text-white font-semibold">
                                                    Q{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-gray-400 text-sm">
                                            {order.tickets?.length || 0} ticket{order.tickets?.length !== 1 ? 's' : ''}
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-gray-700 pt-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-bold">Total</span>
                                        <span className="text-3xl font-bold text-orange-500">
                                            Q{order.total?.toLocaleString() || '0'}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-xs text-gray-400 text-center mb-4">
                                    <p>Fecha de compra:</p>
                                    <p className="text-white font-semibold mt-1">
                                        {formatDate(order.created_at || order.createdAt)}
                                    </p>
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                                <h3 className="text-lg font-bold mb-4">Acciones</h3>
                                
                                <div className="space-y-3">
                                    <button
                                        onClick={handleSendTickets}
                                        disabled={sendingTickets}
                                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        {sendingTickets ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                Enviar por Email
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={handlePrintTickets}
                                        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        Imprimir Tickets
                                    </button>

                                    <button
                                        onClick={() => navigate('/concerts')}
                                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all"
                                    >
                                        Ver Más Conciertos
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}