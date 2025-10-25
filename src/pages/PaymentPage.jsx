import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import OrderService from '../services/OrderService';rvices/orderService';

export default function PaymentPage() {
    const navigate = useNavigate();
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);

    const [paymentForm, setPaymentForm] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
    });

    useEffect(() => {
        loadPaymentData();
    }, []);

    const loadPaymentData = () => {
        try {
            const data = localStorage.getItem('paymentData');
            
            if (!data) {
                navigate('/concerts');
                return;
            }

            const parsed = JSON.parse(data);
            setPaymentData(parsed);
        } catch (err) {
            console.error('Error al cargar datos de pago:', err);
            navigate('/concerts');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Formatear número de tarjeta
        if (name === 'cardNumber') {
            formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            if (formattedValue.length > 19) return;
        }

        // Formatear fecha de expiración
        if (name === 'expiryDate') {
            formattedValue = value.replace(/\D/g, '');
            if (formattedValue.length >= 2) {
                formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
            }
            if (formattedValue.length > 5) return;
        }

        // Limitar CVV
        if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '');
            if (formattedValue.length > 3) return;
        }

        setPaymentForm(prev => ({
            ...prev,
            [name]: formattedValue
        }));
    };

    const validateForm = () => {
        if (!paymentForm.cardNumber || paymentForm.cardNumber.replace(/\s/g, '').length < 16) {
            setError('Número de tarjeta inválido');
            return false;
        }
        if (!paymentForm.cardName) {
            setError('Nombre del titular es requerido');
            return false;
        }
        if (!paymentForm.expiryDate || paymentForm.expiryDate.length < 5) {
            setError('Fecha de expiración inválida');
            return false;
        }
        if (!paymentForm.cvv || paymentForm.cvv.length < 3) {
            setError('CVV inválido');
            return false;
        }
        return true;
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            setProcessing(true);
            setError('');

            // Simular delay de procesamiento de pago
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Confirmar la orden en el backend
            const confirmedOrder = await orderService.confirm(paymentData.orderId);

            setOrderDetails(confirmedOrder);
            setPaymentSuccess(true);
            
            // Limpiar datos de localStorage
            localStorage.removeItem('paymentData');
            localStorage.removeItem('checkoutData');

        } catch (err) {
            console.error('Error al procesar pago:', err);
            setError(err.message || 'Error al procesar el pago. Intenta nuevamente.');
            setProcessing(false);
        }
    };

    const handleSendTickets = async () => {
        try {
            // Enviar tickets por email (opcional)
            // await notificationService.sendTickets(paymentData.orderId);
            alert('Los tickets han sido enviados a tu correo electrónico');
        } catch (err) {
            console.error('Error al enviar tickets:', err);
        }
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
        return <LoadingSpinner message="Cargando información de pago..." />;
    }

    if (!paymentData) {
        return null;
    }

    // Pantalla de éxito
    if (paymentSuccess && orderDetails) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
                <div className="container mx-auto px-6 py-12">
                    <div className="max-w-2xl mx-auto">
                        {/* Animación de éxito */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-4 animate-bounce">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold mb-2">¡Pago Exitoso!</h1>
                            <p className="text-gray-400 text-lg">Tu compra ha sido procesada correctamente</p>
                        </div>

                        {/* Información de la orden */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 mb-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Número de Orden</p>
                                    <p className="text-white font-bold text-2xl">#{orderDetails.order?.id || paymentData.orderId}</p>
                                </div>
                                <div className="bg-green-500/20 border border-green-500 rounded-lg px-4 py-2">
                                    <p className="text-green-400 font-semibold text-sm">CONFIRMADA</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-700 pt-6 space-y-4">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Evento</p>
                                    <p className="text-white font-semibold text-lg">{paymentData.concertTitle}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Fecha</p>
                                    <p className="text-white font-semibold">{formatDate(paymentData.concertDate)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Lugar</p>
                                    <p className="text-white font-semibold">{paymentData.venue}</p>
                                </div>
                            </div>
                        </div>

                        {/* Tickets generados */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 mb-6">
                            <h2 className="text-2xl font-bold mb-4">Tus Tickets</h2>
                            <div className="space-y-3">
                                {orderDetails.tickets?.map((ticket, index) => (
                                    <div key={ticket.id || index} className="bg-gray-900/50 rounded-lg p-4 border-l-4 border-orange-500">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-white font-semibold">Ticket #{ticket.id}</p>
                                                <p className="text-gray-400 text-sm">Código: {ticket.code}</p>
                                            </div>
                                            <div className="bg-orange-500/20 rounded-lg px-3 py-1">
                                                <p className="text-orange-400 font-semibold text-xs">EMITIDO</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total pagado */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-lg">Total Pagado</span>
                                <span className="text-3xl font-bold text-green-500">Q{paymentData.total.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Acciones */}
                        <div className="space-y-3">
                            <button
                                onClick={handleSendTickets}
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
                            >
                                Enviar Tickets por Email
                            </button>
                            <button
                                onClick={() => navigate('/my-orders')}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl transition-all"
                            >
                                Ver Mis Órdenes
                            </button>
                            <button
                                onClick={() => navigate('/concerts')}
                                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all"
                            >
                                Volver a Conciertos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Formulario de pago
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
            <div className="container mx-auto px-6 py-12">
                {/* Header */}
                <div className="max-w-4xl mx-auto mb-8">
                    <button
                        onClick={() => navigate('/checkout')}
                        className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
                    >
                        ← Volver al Checkout
                    </button>
                    <h1 className="text-4xl font-bold mb-2">Pago</h1>
                    <p className="text-gray-400">Completa tu información de pago</p>
                </div>

                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario de pago */}
                    <div className="lg:col-span-2">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
                            <h2 className="text-2xl font-bold mb-6">Información de Pago</h2>

                            {error && (
                                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handlePayment} className="space-y-6">
                                {/* Número de tarjeta */}
                                <div>
                                    <label className="block text-gray-300 text-sm font-semibold mb-2">
                                        Número de Tarjeta
                                    </label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={paymentForm.cardNumber}
                                        onChange={handleInputChange}
                                        placeholder="1234 5678 9012 3456"
                                        className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                                        disabled={processing}
                                    />
                                </div>

                                {/* Nombre en la tarjeta */}
                                <div>
                                    <label className="block text-gray-300 text-sm font-semibold mb-2">
                                        Nombre del Titular
                                    </label>
                                    <input
                                        type="text"
                                        name="cardName"
                                        value={paymentForm.cardName}
                                        onChange={handleInputChange}
                                        placeholder="JUAN PEREZ"
                                        className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg px-4 py-3 text-white uppercase focus:outline-none focus:border-orange-500"
                                        disabled={processing}
                                    />
                                </div>

                                {/* Fecha y CVV */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 text-sm font-semibold mb-2">
                                            Fecha de Expiración
                                        </label>
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            value={paymentForm.expiryDate}
                                            onChange={handleInputChange}
                                            placeholder="MM/AA"
                                            className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                                            disabled={processing}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 text-sm font-semibold mb-2">
                                            CVV
                                        </label>
                                        <input
                                            type="text"
                                            name="cvv"
                                            value={paymentForm.cvv}
                                            onChange={handleInputChange}
                                            placeholder="123"
                                            className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                                            disabled={processing}
                                        />
                                    </div>
                                </div>

                                {/* Botón de pago */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all text-lg flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                            Procesando Pago...
                                        </>
                                    ) : (
                                        <>Pagar Q{paymentData.total.toLocaleString()}</>
                                    )}
                                </button>
                            </form>

                            {/* Nota de seguridad */}
                            <div className="mt-6 flex items-center gap-2 text-gray-400 text-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span>Pago seguro y encriptado</span>
                            </div>
                        </div>
                    </div>

                    {/* Resumen de compra */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                                <h3 className="text-xl font-bold mb-4">Resumen</h3>
                                
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">Evento</p>
                                        <p className="text-white font-semibold">{paymentData.concertTitle}</p>
                                    </div>
                                    
                                    <div className="border-t border-gray-700 pt-4">
                                        <p className="text-gray-400 text-sm mb-3">Tickets</p>
                                        {paymentData.tickets.map((ticket, index) => (
                                            <div key={index} className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-300">{ticket.quantity}x {ticket.name}</span>
                                                <span className="text-white font-semibold">Q{(ticket.price * ticket.quantity).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="border-t border-gray-700 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-white font-bold">Total</span>
                                            <span className="text-3xl font-bold text-orange-500">Q{paymentData.total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}