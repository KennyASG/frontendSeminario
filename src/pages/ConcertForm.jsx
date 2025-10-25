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
        status_id: 2, // Por defecto: on_sale
        venue_id: ''
    });

    // Estados disponibles para conciertos
    const concertStatuses = [
        { id: 1, label: 'Programado', value: 'scheduled' },
        { id: 2, label: 'En Venta', value: 'on_sale' },
        { id: 3, label: 'Agotado', value: 'sold_out' },
        { id: 4, label: 'Completado', value: 'completed' },
        { id: 5, label: 'Cancelado', value: 'canceled' }
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
        }
    };

    const fetchConcert = async () => {
        try {
            setLoading(true);
            const concert = await concertService.getById(id);

            // Formatear la fecha para el input datetime-local
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
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    {isEdit ? 'Editar Concierto' : 'Crear Nuevo Concierto'}
                </h1>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                {/* Título */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título del Concierto *
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Ej: Rock Fest 2025"
                        maxLength="100"
                        required
                    />
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción *
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Describe el concierto..."
                        rows="4"
                        maxLength="200"
                        required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        {formData.description.length}/200 caracteres
                    </p>
                </div>

                {/* Fecha y Hora */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha y Hora *
                    </label>
                    <input
                        type="datetime-local"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                    />
                </div>

                {/* Venue */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Venue (Lugar) *
                    </label>
                    <select
                        name="venue_id"
                        value={formData.venue_id}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                    >
                        <option value="">Selecciona un venue</option>
                        {venues.map(venue => (
                            <option key={venue.id} value={venue.id}>
                                {venue.name} - {venue.city}, {venue.country}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Estado */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado *
                    </label>
                    <select
                        name="status_id"
                        value={formData.status_id}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                    >
                        {concertStatuses.map(status => (
                            <option key={status.id} value={status.id}>
                                {status.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Botones */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Guardando...' : (isEdit ? 'Actualizar Concierto' : 'Crear Concierto')}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/concerts')}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}