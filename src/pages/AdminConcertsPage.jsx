import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConcertService from '../services/concertService';
import LoadingSpinner from '../components/common/LoadingSpinner';

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
            const data = await ConcertService.getAll();
            setConcerts(Array.isArray(data) ? data : data.concerts || []);
        } catch (err) {
            setError(err.message || 'Error al cargar conciertos');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!confirm(`¿Estás seguro de eliminar el concierto "${title}"?`)) return;

        try {
            await ConcertService.delete(id);
            setConcerts(concerts.filter(c => c.id !== id));
        } catch (err) {
            alert(err.message || 'Error al eliminar');
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'on_sale': { label: 'En Venta', color: 'bg-green-500' },
            'sold_out': { label: 'Agotado', color: 'bg-gray-500' },
            'scheduled': { label: 'Programado', color: 'bg-blue-500' },
            'completed': { label: 'Finalizado', color: 'bg-gray-600' },
            'canceled': { label: 'Cancelado', color: 'bg-red-500' }
        };

        const statusInfo = statusMap[status?.toLowerCase()] || {
            label: status || 'Desconocido',
            color: 'bg-gray-500'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusInfo.color} uppercase`}>
                {statusInfo.label}
            </span>
        );
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
        return <LoadingSpinner message="Cargando conciertos..." />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Gestión de Conciertos</h1>
                        <p className="text-gray-400">Administra todos los eventos y conciertos</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/concerts/create')}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Crear Concierto
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Conciertos</p>
                                <p className="text-2xl font-bold text-white">{concerts.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">En Venta</p>
                                <p className="text-2xl font-bold text-green-500">
                                    {concerts.filter(c => c.status?.descripcion === 'on_sale').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Programados</p>
                                <p className="text-2xl font-bold text-blue-500">
                                    {concerts.filter(c => c.status?.descripcion === 'scheduled').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Agotados</p>
                                <p className="text-2xl font-bold text-red-500">
                                    {concerts.filter(c => c.status?.descripcion === 'sold_out').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-xl mb-6">
                    {error}
                </div>
            )}

            {/* Concerts table */}
            {concerts.length === 0 ? (
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-16 text-center border border-gray-700">
                    <svg className="w-20 h-20 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <h2 className="text-2xl font-bold mb-2">No hay conciertos registrados</h2>
                    <p className="text-gray-400 mb-6">Comienza creando tu primer concierto</p>
                    <button
                        onClick={() => navigate('/admin/concerts/create')}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Crear Concierto
                    </button>
                </div>
            ) : (
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900/50 border-b border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Concierto
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Venue
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {concerts.map((concert) => (
                                    <tr key={concert.id} className="hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-white">{concert.title}</p>
                                                <p className="text-sm text-gray-400 line-clamp-1">{concert.description}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-300">{formatDate(concert.date)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-300">
                                                {concert.venues?.[0]?.name || 'Sin asignar'}
                                            </p>
                                            {concert.venues?.[0] && (
                                                <p className="text-xs text-gray-500">
                                                    {concert.venues[0].city}, {concert.venues[0].country}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(concert.status?.descripcion)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* View tickets */}
                                                <button
                                                    onClick={() => navigate(`/admin/concerts/${concert.id}/tickets`)}
                                                    className="p-2 text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    title="Gestionar tickets"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                                    </svg>
                                                </button>

                                                {/* Edit */}
                                                <button
                                                    onClick={() => navigate(`/admin/concerts/edit/${concert.id}`)}
                                                    className="p-2 text-orange-400 hover:bg-orange-900/20 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => handleDelete(concert.id, concert.title)}
                                                    className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}