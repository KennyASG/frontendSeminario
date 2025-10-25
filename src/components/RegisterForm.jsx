import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        birthdate: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validaciones
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            setLoading(false);
            return;
        }

        try {
            const registerData = {
                name: formData.name,
                lastname: formData.lastname,
                email: formData.email,
                phone: formData.phone,
                birthdate: formData.birthdate,
                password: formData.password,
                role: 2
            };

            // Usar el userService para registro
            await userService.register(registerData);

            // Registro exitoso - mostrar mensaje y redirigir al login
            setSuccess('¡Cuenta creada exitosamente! Redirigiendo al login...');

            // Esperar 2 segundos para que el usuario vea el mensaje
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            console.error('Register error:', err);
            setError(
                err.message ||
                'Error al registrarse. Intenta nuevamente.'
            );
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-red-900/20 to-orange-900/20"></div>

            {/* Floating Shapes */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
            </div>

            {/* Main Container */}
            <div className="relative z-10 bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 w-full max-w-2xl shadow-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                            <span className="text-2xl font-bold">S</span>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                            SoundMax
                        </h1>
                    </div>
                    <p className="text-gray-400">Únete a la mejor experiencia musical</p>
                </div>

                {/* Register Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-600/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-600/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-sm">
                            {success}
                        </div>
                    )}

                    {/* Grid de 2 columnas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Nombre
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full px-4 py-3 bg-gray-700/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                placeholder="John"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={loading || !!success}
                            />
                        </div>

                        {/* Apellido */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Apellido
                            </label>
                            <input
                                type="text"
                                name="lastname"
                                required
                                className="w-full px-4 py-3 bg-gray-700/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                placeholder="Doe"
                                value={formData.lastname}
                                onChange={handleChange}
                                disabled={loading || !!success}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full px-4 py-3 bg-gray-700/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                placeholder="tu@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading || !!success}
                            />
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                className="w-full px-4 py-3 bg-gray-700/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                placeholder="+502 1234-5678"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={loading || !!success}
                            />
                        </div>

                        {/* Fecha de nacimiento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Fecha de nacimiento
                            </label>
                            <input
                                type="date"
                                name="birthdate"
                                required
                                className="w-full px-4 py-3 bg-gray-700/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                value={formData.birthdate}
                                onChange={handleChange}
                                disabled={loading || !!success}
                            />
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    className="w-full px-4 py-3 pr-12 bg-gray-700/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading || !!success}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    disabled={loading || !!success}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        {/* Confirmar contraseña */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Confirmar contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    required
                                    className="w-full px-4 py-3 pr-12 bg-gray-700/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={loading || !!success}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    disabled={loading || !!success}
                                >
                                    {showConfirmPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Términos y condiciones */}
                    <div className="flex items-start">
                        <input
                            type="checkbox"
                            required
                            disabled={loading || !!success}
                            className="w-4 h-4 mt-1 rounded border-gray-600 text-red-600 focus:ring-red-500 focus:ring-2 bg-gray-700"
                        />
                        <span className="ml-2 text-sm text-gray-300">
                            Acepto los{' '}
                            <button type="button" className="text-red-400 hover:text-red-300">
                                términos y condiciones
                            </button>
                            {' '}y la{' '}
                            <button type="button" className="text-red-400 hover:text-red-300">
                                política de privacidad
                            </button>
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !!success}
                        className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Registrando...</span>
                            </div>
                        ) : success ? (
                            '¡Registro exitoso! ✓'
                        ) : (
                            'Crear cuenta'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-400">
                        ¿Ya tienes cuenta?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-red-400 hover:text-red-300 font-medium transition-colors"
                            disabled={loading}
                        >
                            Inicia sesión aquí
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}