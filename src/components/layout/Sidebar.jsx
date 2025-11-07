import { Link, useLocation } from 'react-router-dom';
import userService from '../../services/UserService';

const Sidebar = () => {
    const location = useLocation();
    const isAdmin = userService.isAdmin();

    const menuItems = [
        { 
            path: '/concerts', 
            label: 'Conciertos', 
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
            ),
            public: true 
        },
        { 
            path: '/my-orders', 
            label: 'Mis Órdenes', 
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
            ),
            public: false 
        },
        ...(isAdmin ? [
            { 
                path: '/admin/concerts', 
                label: 'Gestión Conciertos', 
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                ),
                admin: true 
            },
            { 
                path: '/admin/venues', 
                label: 'Gestión Venues', 
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                ),
                admin: true 
            },
            { 
                path: '/admin/orders', 
                label: 'Todas las Órdenes', 
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                ),
                admin: true 
            },
        ] : []),
    ];

    return (
        <div className="w-64 bg-gradient-to-b from-gray-900 to-black text-white min-h-screen border-r border-gray-800 flex flex-col">
            {/* Logo / Header */}
            <div className="p-6 border-b border-gray-800 flex-shrink-0">
                <Link to="/concerts" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                        TicketApp
                    </span>
                </Link>
            </div>

            {/* Navigation - Flex-grow para ocupar espacio disponible */}
            <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path || 
                                       (item.path !== '/concerts' && location.pathname.startsWith(item.path));
                        
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                        isActive
                                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                    }`}
                                >
                                    <span className={isActive ? 'text-white' : 'text-gray-400'}>
                                        {item.icon}
                                    </span>
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer info - Flex-shrink-0 para que no se comprima */}
            <div className="flex-shrink-0 p-4 border-t border-gray-800 mt-auto">
                <div className="text-center text-gray-500 text-xs">
                    <p className="mb-1">TicketApp v1.0</p>
                    <p>Sistema de Tickets</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;