import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventStore } from '../../stores/eventStore';
import { LoadingSpinner, StatusBadge } from '../../components/common';

const Events = () => {
    const navigate = useNavigate();
    const { events, fetchEvents, loading } = useEventStore();
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchEvents();
    }, []);

    const filteredEvents = events.filter(event => {
        if (filter === 'all') return true;
        if (filter === 'upcoming') return new Date(event.event_date) >= new Date();
        if (filter === 'past') return new Date(event.event_date) < new Date();
        return event.event_type === filter;
    });

    if (loading && events.length === 0) {
        return <div style={{ padding: '4rem', textAlign: 'center' }}><LoadingSpinner /></div>;
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '0.25rem' }}>
                        Community Events
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        Manage workshops, social gatherings, and training
                    </p>
                </div>
                <button
                    onClick={() => navigate('/caseworker/events/new')}
                    className="btn btn-primary"
                >
                    + Create Event
                </button>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['all', 'upcoming', 'past', 'workshop', 'social', 'training', 'orientation'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: filter === f ? '#f3f4f6' : 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                fontWeight: filter === f ? 600 : 400,
                                color: filter === f ? '#111827' : '#6b7280',
                                cursor: 'pointer',
                                textTransform: 'capitalize'
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* List View */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {filteredEvents.map((event) => (
                    <div key={event.id} style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <StatusBadge status={event.event_type} />
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.5rem',
                                    backgroundColor: new Date(event.event_date) < new Date() ? '#f3f4f6' : '#dcfce7',
                                    color: new Date(event.event_date) < new Date() ? '#6b7280' : '#166534',
                                    borderRadius: '4px',
                                    fontWeight: 500
                                }}>
                                    {new Date(event.event_date) < new Date() ? 'Past' : 'Upcoming'}
                                </span>
                            </div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
                                {event.title}
                            </h3>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {event.description}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#4b5563' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>📅</span>
                                    {new Date(event.event_date).toLocaleDateString()} at {event.start_time?.slice(0, 5)}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>📍</span>
                                    {event.location || 'TBD'}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>👥</span>
                                    Capacity: {event.max_participants || 'Unlimited'}
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb', marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => navigate(`/caseworker/events/${event.id}`)}
                                className="btn btn-outline"
                                style={{ fontSize: '0.875rem', width: '100%' }}
                            >
                                Manage Event
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
                    <p>No events found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default Events;
