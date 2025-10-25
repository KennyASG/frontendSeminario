import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from '../components/common/Timer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import OrderService from '../services/OrderService';
import userService from '../services/userService';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const [checkoutData, setCheckoutData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCheckoutData();
    }, []);

    const loadCheckoutData = () => {
        try {
            const data = localStorage.getItem('checkoutData');
            
            if (!data) {
                navigate('/concerts');
                return;
            }

            const parsed = JSON.parse(data);
            
            // Verificar que no haya expirado
            const expiresAt = new Date(parsed.expiresAt);
            if (expiresAt <= new Date()) {
                alert('Tu reserva ha expirado. Por favor, vuelve a seleccionar tus tickets.');
                localStorage.removeItem('checkoutData');
                navigate(`/concerts/${parsed.concertId}`);
                return;
            }

            setCheckoutData(parsed);
        } catch (err) {
            console.error('Error al cargar datos de checkout:', err);
            navigate('/concerts');
        } finally {
            setLoading(false);
        }
    };

    const handleExpire = () => {
        alert('Tu reserva ha expirado. Por favor, vuelve a seleccionar tus tickets.');
        localStorage.removeItem('checkoutData');
        navigate(`/concerts/${checkoutData.concertId}`);
    };

    const handleCancelReservation = () => {
        if (confirm('¿Estás seguro de cancelar tu reserva?')) {
            localStorage.removeItem('checkoutData');
            navigate(`/concerts/${checkoutData.concertId}`);
        }
    };

    const handleProceedToPayment = async () => {
        try {
            setProcessing(true);
            setError('');

            const user = userService.getStoredUser();
            if (!user) {
                navigate('/login');
                return;
            }

            // Crear orden en el backend
            // Nota: El backend espera reservation_id, ticket_type_id y quantity
            // Como tenemos múltiples reservas, tomamos la primera
            const firstReservation = checkoutData.reservations[0];
            const firstTicket = checkoutData.tickets[0];

            const orderData = {
                reservation_id: firstReservation.reservation.id,
                ticket_type_id: firstTicket.id,
                quantity: firstTicket.quantity
            };

            const order = await OrderService.create(orderData);

            // Guardar orden ID para la página de pago
            const paymentData = {
                ...checkoutData,
                orderId: order.order?.id || order.id
            };

            localStorage.setItem('paymentData', JSON.stringify(paymentData));
            localStorage.removeItem('checkoutData');

            navigate('/payment');

        } catch (err) {
            console.error('Error al proceder al pago:', err);
            setError(err.message || 'Error al procesar la orden. Intenta nuevamente.');
        } finally {
            setProcessing(false);
        }
    };

    const formatDate = (dateString) => {
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
        return <LoadingSpinner message="Cargando información de reserva..." />;
    }

    if (!checkoutData) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
            <div className="container mx-auto px-6 py-12">
                {/* Header */}
                <div className="max-w-4xl mx-auto mb-8">
                    <button
                        onClick={() => navigate(`/concerts/${checkoutData.concertId}`)}
                        className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
                    >
                        ← Volver al concierto
                    </button>
                    <h1 className="text-4xl font-bold mb-2">Checkout</h1>
                    <p className="text-gray-400">Confirma tu reserva y procede al pago</p>
                </div>

                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna principal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Timer */}
                        <Timer 
                            expiresAt={checkoutData.expiresAt} 
                            onExpire={handleExpire}
                        />

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Información del Concierto */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                            <h2 className="text-2xl font-bold mb-4">Información del Evento</h2>
                            
                            <div className="space-y-3">
                                <div>
                                    <p className="text-gray-400 text-sm">Concierto</p>
                                    <p className="text-white font-bold text-lg">{checkoutData.concertTitle}</p>
                                </div>
                                
                                <div>
                                    <p className="text-gray-400 text-sm">Fecha y Hora</p>
                                    <p className="text-white font-semibold">{formatDate(checkoutData.concertDate)}</p>
                                </div>
                                
                                <div>
                                    <p className="text-gray-400 text-sm">Lugar</p>
                                    <p className="text-white font-semibold">{checkoutData.venue}</p>
                                </div>
                            </div>
                        </div>

                        {/* Tickets Seleccionados */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                            <h2 className="text-2xl font-bold mb-4">Tickets Seleccionados</h2>
                            
                            <div className="space-y-3">
                                {checkoutData.tickets.map((ticket, index) => (
                                    <div 
                                        key={index}
                                        className="bg-gray-900/50 rounded-lg p-4 flex justify-between items-center"
                                    >
                                        <div>
                                            <p className="text-white font-semibold">{ticket.name}</p>
                                            <p className="text-gray-400 text-sm">Cantidad: {ticket.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-orange-500 font-bold text-lg">
                                                Q{(ticket.price * ticket.quantity).toLocaleString()}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                Q{ticket.price} c/u
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Información Importante */}
                        <div className="bg-blue-900/30 border border-blue-500 rounded-2xl p-6">
                            <h3 className="text-lg font-bold mb-3 text-blue-200">Información Importante</h3>
                            <ul className="space-y-2 text-blue-100 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400">•</span>
                                    <span>Tu reserva expirará en el tiempo mostrado arriba</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400">•</span>
                                    <span>Los tickets serán enviados a tu correo después del pago</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400">•</span>
                                    <span>El pago es seguro y procesado inmediatamente</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Sidebar - Resumen */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 space-y-6">
                            {/* Resumen de Pago */}
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                                <h3 className="text-xl font-bold mb-4">Resumen</h3>
                                
                                <div className="space-y-3 mb-6">
                                    {checkoutData.tickets.map((ticket, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span className="text-gray-300">
                                                {ticket.quantity}x {ticket.name}
                                            </span>
                                            <span className="text-white font-semibold">
                                                Q{(ticket.price * ticket.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-700 pt-4 mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-400">Subtotal</span>
                                        <span className="text-white font-semibold">
                                            Q{checkoutData.total.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-400">Cargo por servicio</span>
                                        <span className="text-white font-semibold">Q0</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                                        <span className="text-white font-bold">Total</span>
                                        <span className="text-3xl font-bold text-orange-500">
                                            Q{checkoutData.total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="space-y-3">
                                    <button
                                        onClick={handleProceedToPayment}
                                        disabled={processing}
                                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all text-lg flex items-center justify-center gap-2"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                                Procesando...
                                            </>
                                        ) : (
                                            'Proceder al Pago'
                                        )}
                                    </button>

                                    <button
                                        onClick={handleCancelReservation}
                                        disabled={processing}
                                        className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all"
                                    >
                                        Cancelar Reserva
                                    </button>
                                </div>

                                <p className="text-gray-500 text-xs text-center mt-4">
                                    Pago seguro y encriptado
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}