import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import RequestForm from './RequestForm';

const RefugeeDashboard = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const { data, error } = await supabase
                .from('requests')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data || []);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [user.id]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#f59e0b'; // amber
            case 'approved': return '#10b981'; // emerald
            case 'rejected': return '#ef4444'; // red
            default: return '#6b7280'; // gray
        }
    };

    return (
        <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', alignItems: 'start' }}>
            <RequestForm onSuccess={fetchRequests} />

            <div className="card">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>My Requests</h3>

                {loading ? (
                    <p>Loading requests...</p>
                ) : requests.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No requests submitted yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {requests.map((request) => (
                            <div key={request.id} style={{
                                border: '1px solid var(--border)',
                                padding: '1rem',
                                borderRadius: 'var(--radius)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{request.type} - <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{request.urgency} Urgency</span></div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{request.description}</p>
                                </div>
                                <div style={{
                                    padding: '0.25rem 0.75rem',
                                    backgroundColor: getStatusColor(request.status) + '20', // 20% opacity
                                    color: getStatusColor(request.status),
                                    borderRadius: '999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'capitalize'
                                }}>
                                    {request.status}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RefugeeDashboard;
