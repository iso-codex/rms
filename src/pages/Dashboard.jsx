import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import RefugeeDashboard from '../components/RefugeeDashboard';
import NGODashboard from '../components/NGODashboard';

const Dashboard = () => {
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const role = profile?.role || 'refugee';

    useEffect(() => {
        if (role === 'admin') {
            navigate('/admin');
        }
    }, [role, navigate]);

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Dashboard</h1>
                <p style={{ color: 'var(--text-muted)' }}>Welcome back, <span style={{ fontWeight: 600 }}>{profile?.full_name || user.email}</span></p>
            </div>

            {role === 'refugee' && <RefugeeDashboard />}
            {role === 'ngo' && <NGODashboard />}
            {/* Admin is redirected */}
            {role === 'donor' && (
                <div className="card">
                    <h3>Donor Dashboard</h3>
                    <p>Thank you for your support! Your donation history will appear here.</p>
                </div>
            )}
        </div>
    );
};


export default Dashboard;
