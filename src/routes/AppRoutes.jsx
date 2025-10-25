import { Routes, Route, Navigate } from 'react-router-dom';
import userService from '../services/userService';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import MainContent from '../components/layout/MainContent';
import LoginPage from '../pages/Loginpage';
import RegisterPage from '../components/RegisterPage';
import AdminConcertsPage from '../pages/AdminConcertsPage';
import AdminVenuesPage from '../pages/AdminVenuesPage';
import AdminOrdersPage from '../pages/AdminOrdersPage';
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

const AppRoutes = () => {
    const isAuthenticated = userService.isAuthenticated();

    if (!isAuthenticated) {
        return (
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        );
    }

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <MainContent>
                    <Routes>
                        <Route path="/concerts" element={
                            <ProtectedRoute>
                                <div>Concerts Page</div>
                            </ProtectedRoute>
                        } />
                        <Route path="/my-orders" element={
                            <ProtectedRoute>
                                <div>My Orders Page</div>
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/concerts" element={
                            <ProtectedRoute adminOnly>
                                <AdminConcertsPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/venues" element={
                            <ProtectedRoute adminOnly>
                                <AdminVenuesPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/orders" element={
                            <ProtectedRoute adminOnly>
                                <AdminOrdersPage />
                            </ProtectedRoute>
                        } />
                        <Route path="*" element={<Navigate to="/concerts" replace />} />
                    </Routes>
                </MainContent>
            </div>
        </div>
    );
};

export default AppRoutes;