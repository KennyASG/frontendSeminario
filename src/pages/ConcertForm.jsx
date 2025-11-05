import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import concertService from '../services/concertService';
import venueService from '../services/VenueSerive';

export default function ConcertForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [venues, setVenues] = useState([]);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        status_id: 2,
        venue_id: ''
    });

    // Estados disponibles para conciertos
    const concertStatuses = [
        { id: 1, label: 'Programado', value: 'scheduled', color: 'blue' },
        { id: 2, label: 'En Venta', value: 'on_sale', color: 'green' },
        { id: 3, label: 'Agotado', value: 'sold_out', color: 'red' },
        { id: 4, label: 'Completado', value: 'completed', color: 'gray' },
        { id: 5, label: 'Cancelado', value: 'canceled', color: 'orange' }
    ];

    useEffect(() => {
        fetchVenues();
        if (isEdit) {
            fetchConcert();
        }
    }, [id]);

    const fetchVenues = async () => {
        try {
            const data = await venueService.getAll();
            setVenues(Array.isArray(data) ? data : data.venues || []);
        } catch (err) {
            console.error('Error al cargar venues:', err);
            setError('No se pudieron cargar los venues');
        }
    };

    const fetchConcert = async () => {
        try {
            setLoading(true);
            const concert = await concertService.getById(id);

            const dateObj = new Date(concert.date);
            const formattedDate = dateObj.toISOString().slice(0, 16);

            setFormData({
                title: concert.title,
                description: concert.description,
                date: formattedDate,
                status_id: concert.status_id,
                venue_id: concert.venues?.[0]?.id || ''
            });
        } catch (err) {
            setError(err.message || 'Error al cargar el concierto');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'status_id' || name === 'venue_id' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validaciones
        if (!formData.title.trim()) {
            setError('El título es obligatorio');
            return;
        }
        if (!formData.description.trim()) {
            setError('La descripción es obligatoria');
            return;
        }
        if (!formData.date) {
            setError('La fecha es obligatoria');
            return;
        }
        if (!formData.venue_id) {
            setError('Debes seleccionar un venue');
            return;
        }

        // Validar que la fecha sea futura
        const selectedDate = new Date(formData.date);
        const now = new Date();
        if (selectedDate <= now) {
            setError('La fecha debe ser futura');
            return;
        }

        try {
            setLoading(true);

            // Convertir la fecha al formato ISO correcto
            const dateToSend = new Date(formData.date).toISOString();

            const dataToSend = {
                ...formData,
                date: dateToSend
            };

            if (isEdit) {
                await concertService.update(id, dataToSend);
            } else {
                await concertService.create(dataToSend);
            }

            navigate('/admin/concerts');
        } catch (err) {
            setError(err.message || `Error al ${isEdit ? 'actualizar' : 'crear'} el concierto`);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEdit) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-400 text-lg">Cargando concierto...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
            <div className="max-w-4xl mx-auto">
                {/* Breadcrumb + Header */}
                <div className="mb-8">
                    {/* Breadcrumb */}
                    <button
                        onClick={() => navigate('/admin/concerts')}
                        className="text-purple-400 hover:text-purple-300 mb-6 flex items-center gap-2 group transition-all"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="font-medium">Volver a Conciertos</span>
                    </button>

                    {/* Title */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                                {isEdit ? 'Editar Concierto' : 'Crear Nuevo Concierto'}
                            </h1>
                            <p className="text-gray-400 text-sm mt-1">
                                {isEdit ? 'Actualiza la información del concierto' : 'Completa los datos para crear un nuevo concierto'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 animate-fadeIn">
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                    <div className="p-8 space-y-6">
                        {/* Título */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                </svg>
                                Título del Concierto *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="Ej: Rock Fest 2025"
                                maxLength="100"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100 caracteres</p>
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Descripción *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                placeholder="Describe el concierto..."
                                rows="4"
                                maxLength="200"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">{formData.description.length}/200 caracteres</p>
                        </div>

                        {/* Fecha y Hora */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Fecha y Hora *
                            </label>
                            <input
                                type="datetime-local"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                La fecha debe ser futura
                            </p>
                        </div>

                        {/* Venue */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Venue (Lugar) *
                            </label>
                            <select
                                name="venue_id"
                                value={formData.venue_id}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                                required
                            >
                                <option value="" className="bg-gray-800">Selecciona un venue</option>
                                {venues.map(venue => (
                                    <option key={venue.id} value={venue.id} className="bg-gray-800">
                                        {venue.name} - {venue.city}, {venue.country}
                                    </option>
                                ))}
                            </select>
                            {venues.length === 0 && (
                                <p className="text-xs text-orange-400 mt-1 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    No hay venues disponibles. Crea uno primero.
                                </p>
                            )}
                        </div>

                        {/* Estado */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Estado *
                            </label>
                            <select
                                name="status_id"
                                value={formData.status_id}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                                required
                            >
                                {concertStatuses.map(status => (
                                    <option key={status.id} value={status.id} className="bg-gray-800">
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Form Footer con botones */}
                    <div className="bg-gray-900/50 px-8 py-6 border-t border-gray-700 flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/concerts')}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-xl transition-all hover:scale-[1.02] inline-flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || venues.length === 0}
                            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] shadow-lg shadow-orange-500/20 inline-flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    <span>Guardando...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{isEdit ? 'Actualizar Concierto' : 'Crear Concierto'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Info Card (opcional) */}
                <div className="mt-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-semibold mb-2">Información Importante</h3>
                            <ul className="text-gray-400 text-sm space-y-1">
                                <li className="flex items-center gap-2">
                                    <span className="text-purple-400">•</span>
                                    Asegúrate de que el venue tenga secciones creadas antes de vender tickets
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-purple-400">•</span>
                                    La fecha debe ser futura para poder crear el concierto
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-purple-400">•</span>
                                    Después de crear el concierto, podrás añadir tipos de tickets
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animaciones */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}