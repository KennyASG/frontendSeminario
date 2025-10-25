import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import venueService from '../services/VenueSerive';

export default function VenueSectionsPage() {
    const { venueId } = useParams();
    const navigate = useNavigate();

    const [venue, setVenue] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingSection, setEditingSection] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        capacity: ''
    });

    useEffect(() => {
        fetchData();
    }, [venueId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [venueData, sectionsData] = await Promise.all([
                venueService.getById(venueId),
                venueService.getSections(venueId)
            ]);
            setVenue(venueData);
            setSections(Array.isArray(sectionsData) ? sectionsData : sectionsData.sections || []);
        } catch (err) {
            setError(err.message || 'Error al cargar datos');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (section = null) => {
        if (section) {
            setEditingSection(section);
            setFormData({
                name: section.name,
                capacity: section.capacity.toString()
            });
        } else {
            setEditingSection(null);
            setFormData({ name: '', capacity: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingSection(null);
        setFormData({ name: '', capacity: '' });
        setError('');
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

        if (!formData.name.trim()) {
            setError('El nombre de la sección es obligatorio');
            return;
        }
        if (!formData.capacity || parseInt(formData.capacity) <= 0) {
            setError('La capacidad debe ser mayor a 0');
            return;
        }

        try {
            const dataToSend = {
                name: formData.name,
                capacity: parseInt(formData.capacity)
            };

            if (editingSection) {
                await venueService.updateSection(venueId, editingSection.id, dataToSend);
            } else {
                await venueService.createSection(venueId, dataToSend);
            }

            await fetchData();
            handleCloseModal();
        } catch (err) {
            setError(err.message || 'Error al guardar la sección');
        }
    };

    const handleDelete = async (sectionId, sectionName) => {
        if (!confirm(`¿Estás seguro de eliminar la sección "${sectionName}"? Esta acción eliminará también todos sus asientos.`)) {
            return;
        }

        try {
            await venueService.deleteSection(venueId, sectionId);
            setSections(sections.filter(s => s.id !== sectionId));
        } catch (err) {
            alert(err.message || 'Error al eliminar la sección');
        }
    };

    const totalCapacity = sections.reduce((sum, section) => sum + section.capacity, 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/admin/venues')}
                    className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
                >
                    ← Volver a Venues
                </button>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">
                            Secciones de {venue?.name}
                        </h1>
                        <p className="text-gray-600">
                            📍 {venue?.address}, {venue?.city}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Capacidad Total: <strong>{totalCapacity}</strong> asientos
                        </p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                        + Agregar Sección
                    </button>
                </div>
            </div>

            {error && !showModal && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Lista de secciones */}
            {sections.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-500 text-lg mb-4">No hay secciones registradas</p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
                    >
                        Crear Primera Sección
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sections.map((section) => (
                        <div key={section.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-gray-800">
                                    {section.name}
                                </h3>
                                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                                    ID: {section.id}
                                </span>
                            </div>

                            <div className="mb-4">
                                <p className="text-gray-600">
                                    <span className="font-semibold">Capacidad:</span> {section.capacity} asientos
                                </p>
                            </div>

                            <div className="flex gap-2 pt-4 border-t">
                                <button
                                    onClick={() => handleOpenModal(section)}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded"
                                >
                                    ✏️ Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(section.id, section.name)}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded"
                                >
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4">
                            {editingSection ? 'Editar Sección' : 'Nueva Sección'}
                        </h2>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre de la Sección *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                    placeholder="Ej: VIP, General, Premium"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Capacidad (Número de Asientos) *
                                </label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                    placeholder="Ej: 100"
                                    min="1"
                                    required
                                />
                                {!editingSection && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Se crearán automáticamente los asientos numerados del 1 al {formData.capacity || 'N'}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                                >
                                    {editingSection ? 'Actualizar' : 'Crear Sección'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}