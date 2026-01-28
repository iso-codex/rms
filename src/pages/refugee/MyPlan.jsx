import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useIIPStore } from '../../stores/iipStore';
import { StatusBadge, AlertBanner } from '../../components/common';

const categoryIcons = {
    health: '🏥',
    education: '📚',
    esol: '💬',
    employment: '💼',
    housing: '🏠',
    finance: '💰',
    social: '👥'
};

const MyPlan = () => {
    const { profile } = useAuth();
    const { plans, goals, fetchPlans, fetchGoals, loading } = useIIPStore();
    const [currentPlan, setCurrentPlan] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        if (profile?.household_id) {
            loadPlan();
        }
    }, [profile?.household_id]);

    const loadPlan = async () => {
        await fetchPlans(profile.household_id);
    };

    useEffect(() => {
        if (plans.length > 0) {
            const plan = plans[0];
            setCurrentPlan(plan);
            fetchGoals(plan.id);
        }
    }, [plans]);

    const filteredGoals = selectedCategory === 'all'
        ? goals
        : goals.filter(g => g.category === selectedCategory);

    const categories = ['all', ...new Set(goals.map(g => g.category))];

    const getProgressStats = () => {
        if (goals.length === 0) return { completed: 0, inProgress: 0, pending: 0, percent: 0 };
        const completed = goals.filter(g => g.status === 'completed').length;
        const inProgress = goals.filter(g => g.status === 'in_progress').length;
        const pending = goals.filter(g => ['not_started', 'blocked', 'deferred'].includes(g.status)).length;
        return {
            completed,
            inProgress,
            pending,
            percent: Math.round((completed / goals.length) * 100)
        };
    };

    const stats = getProgressStats();

    if (loading) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#6b7280' }}>
                Loading your plan...
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#111827' }}>
                    My Integration Plan
                </h1>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    Track your goals and progress towards integration
                </p>
            </div>

            {!currentPlan ? (
                <AlertBanner
                    type="info"
                    title="No Plan Yet"
                    message="Your caseworker will create an Individual Integration Plan for you soon. This will help track your goals in areas like health, education, employment, and more."
                />
            ) : (
                <>
                    {/* Progress Overview */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        border: '1px solid #e5e7eb',
                        padding: '1.5rem',
                        marginBottom: '2rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827' }}>Overall Progress</h2>
                            <StatusBadge status={currentPlan.status} />
                        </div>

                        {/* Progress Bar */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                <span style={{ color: '#6b7280' }}>{stats.completed} of {goals.length} goals completed</span>
                                <span style={{ fontWeight: 600, color: '#10b981' }}>{stats.percent}%</span>
                            </div>
                            <div style={{ height: '10px', backgroundColor: '#f3f4f6', borderRadius: '5px', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%',
                                    width: `${stats.percent}%`,
                                    background: 'linear-gradient(90deg, #10b981, #059669)',
                                    borderRadius: '5px',
                                    transition: 'width 0.5s ease'
                                }} />
                            </div>
                        </div>

                        {/* Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                            <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: '#dcfce7', borderRadius: '10px' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#15803d' }}>{stats.completed}</div>
                                <div style={{ fontSize: '0.75rem', color: '#166534' }}>Completed</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: '#dbeafe', borderRadius: '10px' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1d4ed8' }}>{stats.inProgress}</div>
                                <div style={{ fontSize: '0.75rem', color: '#1e40af' }}>In Progress</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: '#f3f4f6', borderRadius: '10px' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#6b7280' }}>{stats.pending}</div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Pending</div>
                            </div>
                        </div>

                        {currentPlan.review_date && (
                            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fef3c7', borderRadius: '8px', fontSize: '0.875rem', color: '#92400e' }}>
                                📅 Next review: {new Date(currentPlan.review_date).toLocaleDateString()}
                            </div>
                        )}
                    </div>

                    {/* Category Filter */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: selectedCategory === cat ? '#d1fae5' : 'white',
                                    border: `1px solid ${selectedCategory === cat ? '#10b981' : '#e5e7eb'}`,
                                    borderRadius: '20px',
                                    fontSize: '0.875rem',
                                    fontWeight: selectedCategory === cat ? 600 : 400,
                                    color: selectedCategory === cat ? '#065f46' : '#6b7280',
                                    cursor: 'pointer',
                                    textTransform: 'capitalize',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem'
                                }}
                            >
                                {cat !== 'all' && categoryIcons[cat]}
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Goals List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filteredGoals.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                                No goals in this category
                            </div>
                        ) : (
                            filteredGoals.map((goal) => (
                                <div
                                    key={goal.id}
                                    style={{
                                        backgroundColor: 'white',
                                        borderRadius: '12px',
                                        border: '1px solid #e5e7eb',
                                        padding: '1.25rem',
                                        borderLeft: goal.status === 'completed' ? '4px solid #10b981' : goal.status === 'in_progress' ? '4px solid #3b82f6' : '4px solid #e5e7eb'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '1.25rem' }}>{categoryIcons[goal.category] || '📌'}</span>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                textTransform: 'uppercase',
                                                color: '#9ca3af',
                                                fontWeight: 600,
                                                letterSpacing: '0.05em'
                                            }}>
                                                {goal.category}
                                            </span>
                                        </div>
                                        <StatusBadge status={goal.status} size="xs" />
                                    </div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
                                        {goal.title}
                                    </h3>
                                    {goal.description && (
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                                            {goal.description}
                                        </p>
                                    )}
                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                                        {goal.target_date && (
                                            <span>🎯 Target: {new Date(goal.target_date).toLocaleDateString()}</span>
                                        )}
                                        {goal.priority && (
                                            <span style={{ textTransform: 'capitalize' }}>⚡ {goal.priority} priority</span>
                                        )}
                                    </div>
                                    {goal.progress_notes && (
                                        <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '8px', fontSize: '0.875rem', color: '#374151' }}>
                                            <strong>Progress:</strong> {goal.progress_notes}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default MyPlan;
