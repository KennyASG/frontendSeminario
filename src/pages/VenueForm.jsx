import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import venueService from '../services/VenueSerive';

export default function VenueForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        country: 'Guatemala'
    });

    useEffect(() => {
        if (isEdit) {
            fetchVenue();
        }
    }, [id]);

    const fetchVenue = async () => {
        try {
            setLoading(true);
            const venue = await venueService.getById(id);
            setFormData({
                name: venue.name,
                address: venue.address,
                city: venue.city,
                country: venue.country
            });
        } catch (err) {
            setError(err.message || 'Error al cargar el venue');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validaciones
        if (!formData.name.trim()) {
            setError('El nombre es obligatorio');
            return;
        }
        if (!formData.address.trim()) {
            setError('La dirección es obligatoria');
            return;
        }
        if (!formData.city.trim()) {
            setError('La ciudad es obligatoria');
            return;
        }
        if (!formData.country.trim()) {
            setError('El país es obligatorio');
            return;
        }

        try {
            setLoading(true);

            if (isEdit) {
                await venueService.update(id, formData);
            } else {
                await venueService.create(formData);
            }

            navigate('/admin/venues');
        } catch (err) {
            setError(err.message || `Error al ${isEdit ? 'actualizar' : 'crear'} el venue`);
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
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    {isEdit ? 'Editar Venue' : 'Crear Nuevo Venue'}
                </h1>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                {/* Nombre */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Venue *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Ej: Estadio Nacional"
                        required
                    />
                </div>

                {/* Dirección */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección *
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Ej: Av. Principal 123, Zona 10"
                        required
                    />
                </div>

                {/* Ciudad */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad *
                    </label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Ej: Guatemala City"
                        required
                    />
                </div>

                {/* País */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        País *
                    </label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Ej: Guatemala"
                        required
                    />
                </div>

                {/* Botones */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Guardando...' : (isEdit ? 'Actualizar Venue' : 'Crear Venue')}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/venues')}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg"
                    >
                        Cancelar
                    </button>
                </div>

                {/* Nota informativa */}
                {!isEdit && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                        <p className="text-sm text-blue-800">
                            <strong>💡 Nota:</strong> Después de crear el venue, podrás agregar secciones (VIP, General, etc.) y asientos.
                        </p>
                    </div>
                )}
            </form>
        </div>
    );
}