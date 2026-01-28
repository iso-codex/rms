import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIIPStore } from '../../stores/iipStore';
import { StatusBadge, LoadingSpinner, Modal } from '../../components/common';

const IIPDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentPlan, fetchPlan, updatePlan, goals, addGoal, updateGoal, deleteGoal, loading } = useIIPStore();

    const [showGoalModal, setShowGoalModal] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [goalForm, setGoalForm] = useState({
        category: 'employment',
        goal_description: '',
        target_date: '',
        status: 'pending',
        priority: 'medium'
    });

    useEffect(() => {
        if (id) {
            fetchPlan(id);
        }
    }, [id]);

    const handleGoalSubmit = async () => {
        if (!goalForm.goal_description) return;

        if (editingGoal) {
            await updateGoal(editingGoal.id, goalForm);
        } else {
            await addGoal({
                ...goalForm,
                plan_id: id
            });
        }
        setShowGoalModal(false);
        setEditingGoal(null);
        setGoalForm({
            category: 'employment',
            goal_description: '',
            target_date: '',
            status: 'pending',
            priority: 'medium'
        });
        // Refresh plan/goals
        fetchPlan(id);
    };

    const openEditGoal = (goal) => {
        setEditingGoal(goal);
        setGoalForm({
            category: goal.category,
            goal_description: goal.goal_description,
            target_date: goal.target_date ? goal.target_date.split('T')[0] : '',
            status: goal.status,
            priority: goal.priority
        });
        setShowGoalModal(true);
    };

    const handleDeleteGoal = async (goalId) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            await deleteGoal(goalId);
            fetchPlan(id);
        }
    };

    if (loading || !currentPlan) {
        return <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}><LoadingSpinner /></div>;
    }

    const categories = ['employment', 'education', 'housing', 'health', 'social', 'legal'];

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate('/caseworker/iip')}
                    style={{ color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1rem' }}
                >
                    ← Back to Plans
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
                            Integration Plan
                        </h1>
                        <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                            Household: <strong>{currentPlan.household?.address}</strong>
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => navigate(`/caseworker/iip/${id}/edit`)}
                            className="btn btn-outline"
                        >
                            Edit Plan Details
                        </button>
                        <StatusBadge status={currentPlan.status} />
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Left Column: Plan Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>Plan Overview</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                            <div><span style={{ color: '#6b7280' }}>Start Date:</span> <br />{new Date(currentPlan.start_date).toLocaleDateString()}</div>
                            <div><span style={{ color: '#6b7280' }}>Review Date:</span> <br />{currentPlan.review_date ? new Date(currentPlan.review_date).toLocaleDateString() : 'Not set'}</div>
                            <div><span style={{ color: '#6b7280' }}>Overall Goal:</span> <br />{currentPlan.overall_goal || 'No specific overall goal set.'}</div>
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#eff6ff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1e3a8a' }}>Progress</h3>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1e40af' }}>
                            {useIIPStore.getState().getProgress()}%
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#1e3a8a' }}>of goals completed</p>
                    </div>
                </div>

                {/* Right Column: Goals */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>Integration Goals</h3>
                        <button
                            onClick={() => {
                                setEditingGoal(null);
                                setGoalForm({
                                    category: 'employment',
                                    goal_description: '',
                                    target_date: '',
                                    status: 'pending',
                                    priority: 'medium'
                                });
                                setShowGoalModal(true);
                            }}
                            className="btn btn-primary"
                            style={{ fontSize: '0.875rem' }}
                        >
                            + Add Goal
                        </button>
                    </div>

                    {goals.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                            No goals added yet. Create the first goal to track progress.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {goals.map((goal) => (
                                <div key={goal.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            <StatusBadge status={goal.category} size="xs" />
                                            {goal.priority === 'high' && <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626' }}>HIGH PRIORITY</span>}
                                        </div>
                                        <p style={{ fontWeight: 500, color: '#111827', marginBottom: '0.5rem' }}>{goal.goal_description}</p>
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                            Target: {goal.target_date ? new Date(goal.target_date).toLocaleDateString() : 'No date'}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                        <StatusBadge status={goal.status} />
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => openEditGoal(goal)}
                                                style={{ fontSize: '0.75rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteGoal(goal.id)}
                                                style={{ fontSize: '0.75rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Goal Modal */}
            <Modal
                isOpen={showGoalModal}
                onClose={() => setShowGoalModal(false)}
                title={editingGoal ? 'Edit Goal' : 'Add New Goal'}
                size="md"
                footer={
                    <>
                        <button onClick={() => setShowGoalModal(false)} className="btn btn-outline">Cancel</button>
                        <button onClick={handleGoalSubmit} className="btn btn-primary">{editingGoal ? 'Update Goal' : 'Add Goal'}</button>
                    </>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Category</label>
                        <select
                            value={goalForm.category}
                            onChange={(e) => setGoalForm({ ...goalForm, category: e.target.value })}
                            style={{ width: '100%', padding: '0.625rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.875rem' }}
                        >
                            {categories.map(c => (
                                <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Description</label>
                        <textarea
                            value={goalForm.goal_description}
                            onChange={(e) => setGoalForm({ ...goalForm, goal_description: e.target.value })}
                            rows={3}
                            placeholder="What is the goal?"
                            style={{ width: '100%', padding: '0.625rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.875rem', resize: 'vertical' }}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Target Date</label>
                            <input
                                type="date"
                                value={goalForm.target_date}
                                onChange={(e) => setGoalForm({ ...goalForm, target_date: e.target.value })}
                                style={{ width: '100%', padding: '0.625rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.875rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Priority</label>
                            <select
                                value={goalForm.priority}
                                onChange={(e) => setGoalForm({ ...goalForm, priority: e.target.value })}
                                style={{ width: '100%', padding: '0.625rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.875rem' }}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Status</label>
                        <select
                            value={goalForm.status}
                            onChange={(e) => setGoalForm({ ...goalForm, status: e.target.value })}
                            style={{ width: '100%', padding: '0.625rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.875rem' }}
                        >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="needs_attention">Needs Attention</option>
                        </select>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default IIPDetail;
