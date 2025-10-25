import { Link, useLocation } from 'react-router-dom';
import userService from '../../services/userService';

const Sidebar = () => {
    const location = useLocation();
    const isAdmin = userService.isAdmin();

    const menuItems = [
        { path: '/concerts', label: 'Conciertos', icon: '🎵', public: true },
        { path: '/my-orders', label: 'Mis Órdenes', icon: '🎫', public: false },
        ...(isAdmin ? [
            { path: '/admin/concerts', label: 'Gestión Conciertos', icon: '⚙️', admin: true },
            { path: '/admin/venues', label: 'Gestión Venues', icon: '🏟️', admin: true },
            { path: '/admin/orders', label: 'Todas las Órdenes', icon: '📊', admin: true },
        ] : []),
    ];

    return (
        <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
            <div className="mb-8">
                <h2 className="text-2xl font-bold">TicketApp</h2>
            </div>
            <nav>
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center gap-3 p-3 rounded-lg transition ${location.pathname === item.path
                                        ? 'bg-blue-600'
                                        : 'hover:bg-gray-700'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;