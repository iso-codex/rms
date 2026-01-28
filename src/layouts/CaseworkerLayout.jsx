import { Outlet, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { path: '/caseworker', icon: '📊', label: 'Dashboard', end: true },
    { path: '/caseworker/cases', icon: '👥', label: 'Cases' },
    { path: '/caseworker/assessments', icon: '📋', label: 'Assessments' },
    { path: '/caseworker/referrals', icon: '🔗', label: 'Referrals' },
    { path: '/caseworker/iip', icon: '📈', label: 'Integration Plans' },
    { path: '/caseworker/events', icon: '📅', label: 'Events' },
];

const CaseworkerLayout = () => {
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

    // Check if user has casework/ngo/admin role
    const allowedRoles = ['caseworker', 'ngo', 'admin'];
    if (profile && !allowedRoles.includes(profile.role)) {
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
                backgroundColor: 'white',
                borderRight: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                left: 0,
                top: 0,
                zIndex: 50
            }}>
                {/* Brand */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
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
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Caseworker Portal</div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                    <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.75rem', paddingLeft: '0.75rem', letterSpacing: '0.05em' }}>
                        Case Management
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
                                color: isActive ? '#d97706' : '#4b5563',
                                backgroundColor: isActive ? '#fef3c7' : 'transparent',
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

                {/* User Profile */}
                <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: '#f59e0b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.875rem'
                        }}>
                            {profile?.full_name?.charAt(0) || 'C'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {profile?.full_name || 'Caseworker'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                Staff Member
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
                                padding: '0.25rem',
                                transition: 'color 0.2s'
                            }}
                            title="Sign Out"
                            onMouseOver={(e) => e.target.style.color = '#ef4444'}
                            onMouseOut={(e) => e.target.style.color = '#9ca3af'}
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

export default CaseworkerLayout;
