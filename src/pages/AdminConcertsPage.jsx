import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import concertService from '../services/concertService';

export default function AdminConcertsPage() {
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
            console.log('Concerts data:', data);
            // La API puede devolver un objeto con propiedad 'concerts' o directamente un array
            setConcerts(Array.isArray(data) ? data : data.concerts || []);
        } catch (err) {
            setError(err.message || 'Error al cargar conciertos');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este concierto?')) return;

        try {
            await concertService.delete(id);
            setConcerts(concerts.filter(c => c.id !== id));
        } catch (err) {
            alert(err.message || 'Error al eliminar');
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
                <h1 className="text-2xl font-bold">Gestión de Conciertos</h1>
                <button
                    onClick={() => navigate('/admin/concerts/create')}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                    + Crear Concierto
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {concerts.map((concert) => (
                            <tr key={concert.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{concert.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{concert.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {new Date(concert.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {concert.venues?.[0]?.name || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {concert.status?.description || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                                    <button
                                        onClick={() => navigate(`/admin/concerts/${concert.id}`)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Ver
                                    </button>
                                    <button
                                        onClick={() => navigate(`/admin/concerts/${concert.id}/edit`)}
                                        className="text-green-600 hover:text-green-900"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(concert.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {concerts.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                    No hay conciertos registrados
                </div>
            )}
        </div>
    );
}