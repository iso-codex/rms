import { Outlet, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { path: '/admin', icon: '📊', label: 'Dashboard', end: true },
    { path: '/admin/users', icon: '👥', label: 'Users' },
    { path: '/admin/households', icon: '🏠', label: 'Households' },
    { path: '/admin/safeguarding', icon: '🛡️', label: 'Safeguarding' },
    { path: '/admin/analytics', icon: '📈', label: 'Analytics' },
    { path: '/admin/settings', icon: '⚙️', label: 'Settings' },
];

const AdminLayout = () => {
    const { user, profile, signOut, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Loading...
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    // Only admin role can access
    if (profile && profile.role !== 'admin') {
        if (['caseworker', 'ngo'].includes(profile.role)) {
            return <Navigate to="/caseworker" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: '"Inter", sans-serif' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                backgroundColor: '#111827',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                left: 0,
                top: 0
            }}>
                {/* Brand */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #374151' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1.25rem'
                        }}>
                            R
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '1rem', color: 'white' }}>RefugeeHelp</div>
                            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Admin Console</div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.75rem', paddingLeft: '0.75rem', letterSpacing: '0.05em' }}>
                        Administration
                    </div>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.75rem 1rem',
                                marginBottom: '0.25rem',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                color: isActive ? 'white' : '#9ca3af',
                                backgroundColor: isActive ? '#374151' : 'transparent',
                                fontWeight: isActive ? 600 : 500,
                                fontSize: '0.875rem',
                                transition: 'all 0.15s'
                            })}
                        >
                            <span style={{ marginRight: '0.75rem', fontSize: '1.1rem' }}>{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* System Status */}
                <div style={{ padding: '1rem', margin: '0.5rem 1rem', backgroundColor: '#1f2937', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>System Healthy</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                        Last sync: Just now
                    </div>
                </div>

                {/* User Profile */}
                <div style={{ padding: '1rem', borderTop: '1px solid #374151' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.875rem'
                        }}>
                            {profile?.full_name?.charAt(0) || 'A'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {profile?.full_name || 'Administrator'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                System Admin
                            </div>
                        </div>
                        <button
                            onClick={handleSignOut}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#6b7280',
                                fontSize: '1.25rem',
                                padding: '0.25rem'
                            }}
                            title="Sign Out"
                        >
                            ↪
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, marginLeft: '260px', minHeight: '100vh' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
