import { Outlet, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { path: '/refugee', icon: '🏠', label: 'Home', end: true },
    { path: '/refugee/profile', icon: '👤', label: 'My Profile' },
    { path: '/refugee/plan', icon: '📋', label: 'My Plan' },
    { path: '/refugee/requests', icon: '📝', label: 'Help Requests' },
    { path: '/refugee/events', icon: '📅', label: 'Community Events' },
];

const RefugeeLayout = () => {
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

    // Only refugee role can access
    if (profile && profile.role !== 'refugee') {
        if (['caseworker', 'ngo', 'admin'].includes(profile.role)) {
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
                width: '240px',
                backgroundColor: 'white',
                borderRight: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                left: 0,
                top: 0
            }}>
                {/* Brand */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
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
                            <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#111827' }}>RefugeeHelp</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>My Portal</div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
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
                                color: isActive ? '#111827' : '#6b7280',
                                backgroundColor: isActive ? '#d1fae5' : 'transparent',
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

                {/* Quick Help */}
                <div style={{ padding: '1rem', margin: '0.5rem 1rem', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#15803d', marginBottom: '0.5rem' }}>
                        Need Help?
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#166534', lineHeight: 1.5 }}>
                        Contact your caseworker or call our helpline.
                    </div>
                    <button
                        onClick={() => navigate('/refugee/requests')}
                        style={{
                            marginTop: '0.75rem',
                            width: '100%',
                            padding: '0.5rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Submit Request
                    </button>
                </div>

                {/* User Profile */}
                <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.875rem'
                        }}>
                            {profile?.full_name?.charAt(0) || '?'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {profile?.full_name || 'Welcome'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                Refugee
                            </div>
                        </div>
                        <button
                            onClick={handleSignOut}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#9ca3af',
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
            <main style={{ flex: 1, marginLeft: '240px', minHeight: '100vh' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default RefugeeLayout;
