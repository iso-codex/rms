import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const NGODashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            // In a real app we might filter this by region or specific NGO assignment
            // For now, NGOs see all requests
            const { data, error } = await supabase
                .from('requests')
                .select(`
          *,
          profiles:user_id (full_name, role) 
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

    useEffect(() => {
        fetchRequests();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            const { error } = await supabase
                .from('requests')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            // Optimistic update
            setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Incoming Help Requests</h2>
                <button className="btn btn-primary" onClick={fetchRequests}>Refresh</button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {requests.map((request) => (
                        <div key={request.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <h4 style={{ fontWeight: 'bold' }}>{request.type}</h4>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '0.1rem 0.5rem',
                                        backgroundColor: '#fee2e2',
                                        color: '#dc2626',
                                        borderRadius: '4px'
                                    }}>
                                        {request.urgency}
                                    </span>
                                </div>
                                <p style={{ marginBottom: '0.5rem' }}>{request.description}</p>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    Requested by: <strong>{request.profiles?.full_name || 'Anonymous'}</strong> on {new Date(request.created_at).toLocaleDateString()}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {request.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => updateStatus(request.id, 'approved')}
                                            className="btn"
                                            style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.875rem' }}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => updateStatus(request.id, 'rejected')}
                                            className="btn"
                                            style={{ backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '0.875rem' }}
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                                {request.status !== 'pending' && (
                                    <span style={{ fontWeight: 600, textTransform: 'capitalize', color: 'var(--text-muted)' }}>{request.status}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NGODashboard;
