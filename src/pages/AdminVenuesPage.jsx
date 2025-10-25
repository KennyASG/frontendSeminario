import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import venueService from '../services/VenueSerive';

export default function AdminVenuesPage() {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchVenues();
    }, []);

    const fetchVenues = async () => {
        try {
            setLoading(true);
            const data = await venueService.getAll();
            setVenues(Array.isArray(data) ? data : data.venues || []);
        } catch (err) {
            setError(err.message || 'Error al cargar venues');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`¿Estás seguro de eliminar el venue "${name}"? Esta acción eliminará también todas sus secciones y asientos.`)) {
            return;
        }

        try {
            await venueService.delete(id);
            setVenues(venues.filter(v => v.id !== id));
        } catch (err) {
            alert(err.message || 'Error al eliminar. Puede que este venue esté siendo usado en conciertos.');
        }
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestión de Venues</h1>
                <button
                    onClick={() => navigate('/admin/venues/create')}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                    + Crear Venue
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {venues.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-500 text-lg mb-4">No hay venues registrados</p>
                    <button
                        onClick={() => navigate('/admin/venues/create')}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
                    >
                        Crear Primer Venue
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {venues.map((venue) => (
                        <div key={venue.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                                            {venue.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">ID: {venue.id}</p>
                                    </div>
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                        🏟️ Venue
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-start gap-2">
                                        <span className="text-gray-500 text-sm">📍</span>
                                        <div className="text-sm text-gray-700">
                                            <p>{venue.address}</p>
                                            <p>{venue.city}, {venue.country}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Secciones */}
                                <div className="mb-4 pt-4 border-t">
                                    <button
                                        onClick={() => navigate(`/admin/venues/${venue.id}/sections`)}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        📋 Ver Secciones
                                    </button>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex gap-2 pt-4 border-t">
                                    <button
                                        onClick={() => navigate(`/admin/venues/edit/${venue.id}`)}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded"
                                    >
                                        ✏️ Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(venue.id, venue.name)}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded"
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}