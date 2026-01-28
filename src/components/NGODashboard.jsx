import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { MetricCard, StatusBadge, AlertBanner } from './common';

const NGODashboard = () => {
    const { user, profile } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data, error } = await supabase
                .from('requests')
                .select(`
                    *,
                    profiles:user_id (full_name, role, phone, email)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data || []);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const { error } = await supabase
                .from('requests')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        urgent: requests.filter(r => r.urgency === 'high' && r.status === 'pending').length
    };

    // Tab Button Component
    const TabButton = ({ id, label, icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.25rem',
                backgroundColor: activeTab === id ? 'white' : 'transparent',
                border: 'none',
                borderBottom: activeTab === id ? '2px solid #f59e0b' : '2px solid transparent',
                color: activeTab === id ? '#111827' : '#6b7280',
                fontWeight: activeTab === id ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.875rem'
            }}
        >
            <span style={{ marginRight: '0.5rem' }}>{icon}</span>
            {label}
        </button>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                            <MetricCard
                                title="Total Requests"
                                value={stats.total}
                                icon="📊"
                                color="#3b82f6"
                                subtitle="all time"
                                onClick={() => setActiveTab('requests')}
                            />
                            <MetricCard
                                title="Pending"
                                value={stats.pending}
                                icon="⏳"
                                color="#f59e0b"
                                subtitle="needing action"
                                onClick={() => setActiveTab('requests')}
                            />
                            <MetricCard
                                title="Approved"
                                value={stats.approved}
                                icon="✅"
                                color="#10b981"
                                subtitle="fulfilled"
                            />
                            <MetricCard
                                title="Urgent"
                                value={stats.urgent}
                                icon="🚨"
                                color="#ef4444"
                                subtitle="high priority"
                                onClick={() => setActiveTab('requests')}
                            />
                        </div>

                        {/* Recent Activity */}
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Requests</h3>
                            <RequestList data={requests.slice(0, 5)} />
                        </div>
                    </div>
                );
            case 'requests':
                return (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>All Requests</h3>
                            <button className="btn btn-outline" onClick={fetchRequests}>Refresh</button>
                        </div>
                        <RequestList data={requests} />
                    </div>
                );
            default:
                return <div>Select a tab</div>;
        }
    };

    const RequestList = ({ data }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280', background: 'white', borderRadius: '8px' }}>No requests found</div>
            ) : (
                data.map((req) => (
                    <div key={req.id} style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111827', textTransform: 'capitalize' }}>
                                        {req.type?.replace(/_/g, ' ')}
                                    </span>
                                    <span style={{
                                        padding: '0.1rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        backgroundColor: req.urgency === 'high' ? '#fee2e2' : req.urgency === 'medium' ? '#fef3c7' : '#dcfce7',
                                        color: req.urgency === 'high' ? '#991b1b' : req.urgency === 'medium' ? '#92400e' : '#166534',
                                        textTransform: 'uppercase'
                                    }}>
                                        {req.urgency}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                    {req.profiles?.full_name} • {new Date(req.created_at).toLocaleDateString()}
                                </div>
                            </div>
                            <StatusBadge status={req.status} />
                        </div>

                        <p style={{ color: '#374151', lineHeight: 1.5 }}>
                            {req.description}
                        </p>

                        {req.status === 'pending' && (
                            <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
                                <button
                                    onClick={() => updateStatus(req.id, 'approved')}
                                    className="btn"
                                    style={{ flex: 1, backgroundColor: '#10b981', color: 'white' }}
                                >
                                    Approve Request
                                </button>
                                <button
                                    onClick={() => updateStatus(req.id, 'rejected')}
                                    className="btn"
                                    style={{ flex: 1, backgroundColor: '#fee2e2', color: '#991b1b' }}
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827' }}>
                    NGO Portal
                </h1>
                <p style={{ color: '#6b7280' }}>Manage incoming help requests and resources</p>
            </div>

            {/* Navigation Tabs */}
            <div style={{
                borderBottom: '1px solid #e5e7eb',
                marginBottom: '2rem',
                display: 'flex',
                gap: '0.5rem',
                backgroundColor: '#f9fafb',
                padding: '0 0.5rem'
            }}>
                <TabButton id="overview" label="Overview" icon="📊" />
                <TabButton id="requests" label="Requests" icon="📝" />
            </div>

            {/* Content */}
            <div style={{ minHeight: '500px' }}>
                {loading ? <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div> : renderContent()}
            </div>
        </div>
    );
};

export default NGODashboard;
