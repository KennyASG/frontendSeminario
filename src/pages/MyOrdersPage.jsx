import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import OrderService from '../services/OrderService';
import userService from '../services/UserService';

export default function MyOrdersPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUserOrders();
    }, []);

    const fetchUserOrders = async () => {
        try {
            setLoading(true);
            const user = userService.getStoredUser();
            
            if (!user) {
                navigate('/login');
                return;
            }

            const data = await OrderService.getUserOrders(user.id);
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error al cargar órdenes:', err);
            setError(err.message || 'Error al cargar tus órdenes');
        } finally {
            setLoading(false);
        }
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
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <LoadingSpinner message="Cargando tus órdenes..." />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
            <div className="container mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Mis Órdenes</h1>
                    <p className="text-gray-400">Historial de compras y tickets</p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Lista de órdenes */}
                {orders.length === 0 ? (
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-12 border border-gray-700 text-center">
                        <div className="text-6xl mb-4">🎫</div>
                        <h2 className="text-2xl font-bold mb-2">No tienes órdenes</h2>
                        <p className="text-gray-400 mb-6">Aún no has realizado ninguna compra</p>
                        <button
                            onClick={() => navigate('/concerts')}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-8 rounded-xl transition-all"
                        >
                            Ver Conciertos
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all cursor-pointer"
                                onClick={() => navigate(`/my-orders/${order.id}`)}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    {/* Info de la orden */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-white">
                                                Orden #{order.id}
                                            </h3>
                                            {getStatusBadge(order.status?.descripcion || order.status)}
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <p className="text-white font-semibold">
                                                {order.concert?.title || 'Concierto'}
                                            </p>
                                            <p className="text-gray-400 text-sm">
                                                {order.concert?.date ? formatDate(order.concert.date) : ''}
                                            </p>
                                            <p className="text-gray-400 text-sm">
                                                {order.tickets?.length || 0} ticket{order.tickets?.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Total y fecha de compra */}
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-gray-400 text-xs mb-1">Fecha de compra</p>
                                            <p className="text-white font-semibold text-sm">
                                                {formatDate(order.created_at || order.createdAt)}
                                            </p>
                                        </div>
                                        
                                        <div className="text-right">
                                            <p className="text-gray-400 text-xs mb-1">Total</p>
                                            <p className="text-2xl font-bold text-orange-500">
                                                Q{order.total?.toLocaleString() || '0'}
                                            </p>
                                        </div>

                                        {/* Flecha */}
                                        <div className="text-gray-400">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}