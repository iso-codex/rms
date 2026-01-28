import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useCaseStore } from '../../stores/caseStore';
import { useHouseholdStore } from '../../stores/householdStore';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/common';

const AssessmentForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const householdIdParam = searchParams.get('household');
    const { user } = useAuth();

    const { assessments, createAssessment, updateAssessment, fetchAssessments, loading: caseLoading } = useCaseStore();
    const { households, fetchHouseholds, loading: householdLoading } = useHouseholdStore();

    const isEditing = !!id;
    const [formData, setFormData] = useState({
        household_id: householdIdParam || '',
        assessment_type: 'initial_needs',
        status: 'pending',
        priority: 'medium',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 1 week
        notes: '',
        completed_by: user?.id
    });

    useEffect(() => {
        const loadData = async () => {
            if (households.length === 0) {
                await fetchHouseholds(user.id);
            }
            if (isEditing) {
                // Find existing assessment
                const existing = assessments.find(a => a.id === id);
                if (existing) {
                    setFormData({
                        household_id: existing.household_id,
                        assessment_type: existing.assessment_type,
                        status: existing.status,
                        priority: existing.priority,
                        due_date: existing.due_date ? existing.due_date.split('T')[0] : '',
                        notes: existing.notes || '',
                        completed_by: existing.completed_by
                    });
                } else {
                    // Fetch if not in store
                    await fetchAssessments();
                }
            }
        };
        loadData();
    }, [id, user?.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            completed_by: user.id // Ensure current user is markers as assessor
        };

        let result;
        if (isEditing) {
            result = await updateAssessment(id, payload);
        } else {
            result = await createAssessment(payload);
        }

        if (result) {
            navigate('/caseworker/assessments');
        }
    };

    if (caseLoading || householdLoading) {
        return <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}><LoadingSpinner /></div>;
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '0.5rem' }}
                >
                    ← Back
                </button>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827' }}>
                    {isEditing ? 'Edit Assessment' : 'New Assessment'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Household Selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Household</label>
                    <select
                        value={formData.household_id}
                        onChange={(e) => setFormData({ ...formData, household_id: e.target.value })}
                        required
                        disabled={!!householdIdParam}
                        style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    >
                        <option value="">Select a household...</option>
                        {households.map(h => (
                            <option key={h.id} value={h.id}>
                                {h.address} - {h.head?.full_name || 'No Head'}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Type & Priority Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Assessment Type</label>
                        <select
                            value={formData.assessment_type}
                            onChange={(e) => setFormData({ ...formData, assessment_type: e.target.value })}
                            required
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        >
                            <option value="initial_needs">Initial Needs Assessment</option>
                            <option value="housing_check">Housing Check</option>
                            <option value="integration_review">Integration Review</option>
                            <option value="financial_audit">Financial Audit</option>
                            <option value="safeguarding">Safeguarding</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Priority</label>
                        <select
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            required
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                </div>

                {/* Status & Due Date Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            required
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Due Date</label>
                        <input
                            type="date"
                            value={formData.due_date}
                            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                            required
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                    </div>
                </div>

                {/* Notes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Notes / Findings</label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={6}
                        placeholder="Enter detailed assessment notes..."
                        style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb', resize: 'vertical' }}
                    />
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
                        {isEditing ? 'Update Assessment' : 'Create Assessment'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AssessmentForm;
