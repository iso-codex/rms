import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, Modal } from '../../components/common';
import { supabase } from '../../supabaseClient';

const MyRequests = () => {
    const { user, profile } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewModal, setShowNewModal] = useState(false);
    const [newRequest, setNewRequest] = useState({
        type: 'healthcare',
        description: '',
        urgency: 'medium'
    });

    useEffect(() => {
        fetchRequests();
    }, [user?.id]);

    const fetchRequests = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('requests')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (!error) {
            setRequests(data || []);
        }
        setLoading(false);
    };

    const handleSubmit = async () => {
        if (!newRequest.description.trim()) return;

        const { error } = await supabase.from('requests').insert([{
            user_id: user.id,
            type: newRequest.type,
            description: newRequest.description,
            urgency: newRequest.urgency,
            status: 'pending'
        }]);

        if (!error) {
            setNewRequest({ type: 'healthcare', description: '', urgency: 'medium' });
            setShowNewModal(false);
            fetchRequests();
        }
    };

    const requestTypes = [
        { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
        { value: 'education', label: 'Education', icon: '📚' },
        { value: 'housing', label: 'Housing', icon: '🏠' },
        { value: 'employment', label: 'Employment', icon: '💼' },
        { value: 'benefits', label: 'Benefits', icon: '💷' },
        { value: 'transport', label: 'Transport', icon: '🚗' },
        { value: 'language', label: 'ESOL/Language', icon: '💬' },
        { value: 'other', label: 'Other', icon: '📋' }
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem', color: '#111827' }}>
                        Help Requests
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        Submit and track your support requests
                    </p>
                </div>
                <button
                    onClick={() => setShowNewModal(true)}
                    className="btn btn-primary"
                    style={{ padding: '0.625rem 1.25rem' }}
                >
                    + New Request
                </button>
            </div>

            {/* Requests List */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    Loading requests...
                </div>
            ) : requests.length === 0 ? (
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    padding: '3rem',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#111827' }}>
                        No requests yet
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                        Need help with something? Submit a request and your caseworker will assist you.
                    </p>
                    <button
                        onClick={() => setShowNewModal(true)}
                        className="btn btn-primary"
                    >
                        Submit Your First Request
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {requests.map((req) => (
                        <div
                            key={req.id}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                border: '1px solid #e5e7eb',
                                padding: '1.25rem'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1.25rem' }}>
                                        {requestTypes.find(t => t.value === req.type)?.icon || '📋'}
                                    </span>
                                    <span style={{ fontWeight: 600, color: '#111827', textTransform: 'capitalize' }}>
                                        {req.type?.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <StatusBadge status={req.status} />
                            </div>
                            <p style={{ color: '#4b5563', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                                {req.description}
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                                <span>🕐 {new Date(req.created_at).toLocaleDateString()}</span>
                                <span style={{ textTransform: 'capitalize' }}>⚡ {req.urgency} urgency</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* New Request Modal */}
            <Modal
                isOpen={showNewModal}
                onClose={() => setShowNewModal(false)}
                title="Submit Help Request"
                size="md"
                footer={
                    <>
                        <button onClick={() => setShowNewModal(false)} className="btn btn-outline">Cancel</button>
                        <button onClick={handleSubmit} className="btn btn-primary">Submit Request</button>
                    </>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                            What do you need help with?
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                            {requestTypes.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setNewRequest({ ...newRequest, type: type.value })}
                                    style={{
                                        padding: '0.75rem',
                                        backgroundColor: newRequest.type === type.value ? '#d1fae5' : 'white',
                                        border: `1px solid ${newRequest.type === type.value ? '#10b981' : '#e5e7eb'}`,
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <span>{type.icon}</span>
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                            How urgent is this?
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['low', 'medium', 'high'].map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setNewRequest({ ...newRequest, urgency: level })}
                                    style={{
                                        flex: 1,
                                        padding: '0.625rem',
                                        backgroundColor: newRequest.urgency === level ? (level === 'high' ? '#fee2e2' : level === 'medium' ? '#fef3c7' : '#dcfce7') : 'white',
                                        border: `1px solid ${newRequest.urgency === level ? (level === 'high' ? '#ef4444' : level === 'medium' ? '#f59e0b' : '#10b981') : '#e5e7eb'}`,
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        textTransform: 'capitalize',
                                        fontWeight: newRequest.urgency === level ? 600 : 400
                                    }}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                            Please describe what you need
                        </label>
                        <textarea
                            value={newRequest.description}
                            onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                            rows={4}
                            placeholder="Explain your situation and what help you need..."
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                resize: 'vertical'
                            }}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MyRequests;
