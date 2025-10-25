import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';

const Navbar = () => {
    const navigate = useNavigate();
    const user = userService.getStoredUser();

    const handleLogout = () => {
        userService.logout();
        navigate('/login');
    };

    return (
        <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
            <div className="text-xl font-semibold text-gray-800">
                Bienvenido, {user?.name || 'Usuario'}
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{user?.email}</span>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                >
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default Navbar;