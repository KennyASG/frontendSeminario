import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';

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

            await UserService.register(registerData);

            setSuccess('¡Cuenta creada exitosamente! Redirigiendo al login...');

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            console.error('Register error:', err);
            setError(err.message || 'Error al registrarse. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-2xl">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-4 shadow-2xl shadow-orange-500/50">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Crear cuenta nueva</h1>
                    <p className="text-gray-400">Únete y disfruta los mejores conciertos</p>
                </div>

                {/* Form Card */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-8">
                    {error && (
                        <div className="mb-6 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-xl flex items-center gap-3">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-xl flex items-center gap-3">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nombre y Apellido */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="w-full px-4 py-3 bg-gray-700/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    placeholder="Juan"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={loading || !!success}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    name="lastname"
                                    required
                                    className="w-full px-4 py-3 bg-gray-700/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    placeholder="Pérez"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    disabled={loading || !!success}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full px-4 py-3 bg-gray-700/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                placeholder="tu@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading || !!success}
                            />
                        </div>

                        {/* Teléfono y Fecha de nacimiento */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    className="w-full px-4 py-3 bg-gray-700/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    placeholder="+502 1234-5678"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={loading || !!success}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Fecha de nacimiento
                                </label>
                                <input
                                    type="date"
                                    name="birthdate"
                                    required
                                    className="w-full px-4 py-3 bg-gray-700/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    value={formData.birthdate}
                                    onChange={handleChange}
                                    disabled={loading || !!success}
                                />
                            </div>
                        </div>

                        {/* Contraseñas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required
                                        className="w-full px-4 pr-12 py-3 bg-gray-700/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirmar contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        required
                                        className="w-full px-4 pr-12 py-3 bg-gray-700/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
                                        {showConfirmPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
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
                                className="mt-1 h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 rounded bg-gray-700"
                            />
                            <label className="ml-2 block text-sm text-gray-300">
                                Acepto los{' '}
                                <button type="button" className="text-orange-400 hover:text-orange-300">
                                    términos y condiciones
                                </button>
                                {' '}y la{' '}
                                <button type="button" className="text-orange-400 hover:text-orange-300">
                                    política de privacidad
                                </button>
                            </label>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading || !!success}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                    <span>Creando cuenta...</span>
                                </>
                            ) : success ? (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Cuenta creada</span>
                                </>
                            ) : (
                                <>
                                    <span>Crear Cuenta</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login link */}
                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <p className="text-center text-gray-400 text-sm">
                            ¿Ya tienes cuenta?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                            >
                                Inicia sesión aquí
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>© 2025 TicketApp. Todos los derechos reservados.</p>
                </div>
            </div>
        </div>
    );
}