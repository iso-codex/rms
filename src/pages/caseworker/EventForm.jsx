import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEventStore } from '../../stores/eventStore';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/common';

const EventForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const { events, createEvent, updateEvent, fetchEvent, loading } = useEventStore();

    const isEditing = !!id;
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_type: 'workshop',
        event_date: new Date().toISOString().split('T')[0],
        start_time: '12:00',
        end_time: '13:00',
        location: '',
        max_participants: 20,
        status: 'active',
        organizer_id: user?.id
    });

    useEffect(() => {
        const loadData = async () => {
            if (isEditing) {
                // Determine if we need to fetch
                const existing = events.find(e => e.id === id);
                if (existing) {
                    setFormData({
                        title: existing.title,
                        description: existing.description || '',
                        event_type: existing.event_type,
                        event_date: existing.event_date.split('T')[0],
                        start_time: existing.start_time,
                        end_time: existing.end_time,
                        location: existing.location || '',
                        max_participants: existing.max_participants || 0,
                        status: existing.status,
                        organizer_id: existing.organizer_id
                    });
                } else {
                    const data = await fetchEvent(id);
                    if (data) {
                        setFormData({
                            title: data.title,
                            description: data.description || '',
                            event_type: data.event_type,
                            event_date: data.event_date.split('T')[0],
                            start_time: data.start_time,
                            end_time: data.end_time,
                            location: data.location || '',
                            max_participants: data.max_participants || 0,
                            status: data.status,
                            organizer_id: data.organizer_id
                        });
                    }
                }
            }
        };
        loadData();
    }, [id, user?.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            organizer_id: user.id
        };

        let result;
        if (isEditing) {
            result = await updateEvent(id, payload);
        } else {
            result = await createEvent(payload);
        }

        if (result) {
            navigate('/caseworker/events');
        }
    };

    if (loading) {
        return <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}><LoadingSpinner /></div>;
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate('/caseworker/events')}
                    style={{ color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '0.5rem' }}
                >
                    ← Back to Events
                </button>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827' }}>
                    {isEditing ? 'Edit Event' : 'Create New Event'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Title */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Event Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        placeholder="e.g. Weekly English Class"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                </div>

                {/* Description */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        placeholder="Describe the event..."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb', resize: 'vertical' }}
                    />
                </div>

                {/* Type & Date */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Event Type</label>
                        <select
                            value={formData.event_type}
                            onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        >
                            <option value="workshop">Workshop</option>
                            <option value="seminar">Seminar</option>
                            <option value="social">Social Gathering</option>
                            <option value="training">Training</option>
                            <option value="orientation">Orientation</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Date</label>
                        <input
                            type="date"
                            value={formData.event_date}
                            onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                    </div>
                </div>

                {/* Times */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Start Time</label>
                        <input
                            type="time"
                            value={formData.start_time}
                            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>End Time</label>
                        <input
                            type="time"
                            value={formData.end_time}
                            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                    </div>
                </div>

                {/* Location & Capacity */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="e.g. Community Room B"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Capacity</label>
                        <input
                            type="number"
                            value={formData.max_participants}
                            onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                    </div>
                </div>

                {/* Status */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Status</label>
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    >
                        <option value="active">Active</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn btn-outline"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        {isEditing ? 'Update Event' : 'Create Event'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EventForm;
