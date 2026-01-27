import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
    const { user, loading } = useAuth();

    if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

    if (!user) return <Navigate to="/login" replace />;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)' }}>
            <Navbar />
            <div className="container" style={{ padding: '2rem 1rem', flex: 1 }}>
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;
