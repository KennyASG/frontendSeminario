import { Routes, Route, Navigate } from 'react-router-dom';
import userService from '../services/userService';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import MainContent from '../components/layout/MainContent';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../components/RegisterPage';
import ConcertsPage from '../pages/ConcertsPage';
import ConcertDetailPage from '../pages/ConcertDetailPage';
// import MyOrdersPage from '../pages/MyOrdersPage';
import AdminConcertsPage from '../pages/AdminConcertsPage';
import ConcertForm from '../pages/ConcertForm';
import AdminVenuesPage from '../pages/AdminVenuesPage';
import VenueForm from '../pages/VenueForm';
import VenueSectionsPage from '../pages/VenuesSectionPage';
import AdminOrdersPage from '../pages/AdminOrdersPage';

// Componente de ruta protegida
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const isAuthenticated = userService.isAuthenticated();
    const isAdmin = userService.isAdmin();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/concerts" replace />;
    }

    return children;
};

function AppRoutes() {
    const isAuthenticated = userService.isAuthenticated();

    return (
        <>
            {!isAuthenticated ? (
                // Rutas públicas (sin Layout)
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            ) : (
                // Rutas protegidas (con Layout)
                <div className="flex h-screen">
                    <Sidebar />
                    <div className="flex-1 flex flex-col">
                        <Navbar />
                        <MainContent>
                            <Routes>
                                {/* Rutas para usuarios regulares */}
                                <Route path="/concerts" element={
                                    <ProtectedRoute>
                                        <ConcertsPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/concerts/:id" element={
                                    <ProtectedRoute>
                                        <ConcertDetailPage />
                                    </ProtectedRoute>
                                } />
                                {/* <Route path="/my-orders" element={
                                    <ProtectedRoute>
                                        <MyOrdersPage />
                                    </ProtectedRoute>
                                } /> */}

                                {/* Rutas de administración - Conciertos */}
                                <Route path="/admin/concerts" element={
                                    <ProtectedRoute adminOnly>
                                        <AdminConcertsPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/concerts/create" element={
                                    <ProtectedRoute adminOnly>
                                        <ConcertForm />
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/concerts/edit/:id" element={
                                    <ProtectedRoute adminOnly>
                                        <ConcertForm />
                                    </ProtectedRoute>
                                } />

                                {/* Rutas de administración - Venues */}
                                <Route path="/admin/venues" element={
                                    <ProtectedRoute adminOnly>
                                        <AdminVenuesPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/venues/create" element={
                                    <ProtectedRoute adminOnly>
                                        <VenueForm />
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/venues/edit/:id" element={
                                    <ProtectedRoute adminOnly>
                                        <VenueForm />
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/venues/:venueId/sections" element={
                                    <ProtectedRoute adminOnly>
                                        <VenueSectionsPage />
                                    </ProtectedRoute>
                                } />

                                {/* Rutas de administración - Órdenes */}
                                <Route path="/admin/orders" element={
                                    <ProtectedRoute adminOnly>
                                        <AdminOrdersPage />
                                    </ProtectedRoute>
                                } />

                                {/* Redirección por defecto */}
                                <Route path="/" element={<Navigate to="/concerts" replace />} />
                                <Route path="*" element={<Navigate to="/concerts" replace />} />
                            </Routes>
                        </MainContent>
                    </div>
                </div>
            )}
        </>
    );
}

export default AppRoutes;