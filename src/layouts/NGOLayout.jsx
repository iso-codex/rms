import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const NGOLayout = () => {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Loading...
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    // Only NGO role (or admin) can access
    const allowedRoles = ['ngo', 'admin'];
    if (profile && !allowedRoles.includes(profile.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb', fontFamily: '"Inter", sans-serif' }}>
            <Navbar />

            {/* Main Content */}
            <main style={{ flex: 1, paddingBottom: '2rem' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default NGOLayout;
