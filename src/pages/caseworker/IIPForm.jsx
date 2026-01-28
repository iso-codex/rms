import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useIIPStore } from '../../stores/iipStore';
import { useHouseholdStore } from '../../stores/householdStore';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/common';

const IIPForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const householdIdParam = searchParams.get('household');
    const { user } = useAuth();

    const { plans, createPlan, updatePlan, fetchPlans, loading: iipLoading } = useIIPStore();
    const { households, fetchHouseholds, loading: householdLoading } = useHouseholdStore();

    const isEditing = !!id;
    const [formData, setFormData] = useState({
        household_id: householdIdParam || '',
        start_date: new Date().toISOString().split('T')[0],
        review_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +30 days
        status: 'draft',
        overall_goal: '',
        caseworker_id: user?.id
    });

    useEffect(() => {
        const loadData = async () => {
            if (households.length === 0) {
                await fetchHouseholds(user.id);
            }
            if (isEditing) {
                const existing = plans.find(p => p.id === id);
                if (existing) {
                    setFormData({
                        household_id: existing.household_id,
                        start_date: existing.start_date ? existing.start_date.split('T')[0] : '',
                        review_date: existing.review_date ? existing.review_date.split('T')[0] : '',
                        status: existing.status,
                        overall_goal: existing.overall_goal || '',
                        caseworker_id: existing.caseworker_id
                    });
                } else {
                    await fetchPlans();
                }
            }
        };
        loadData();
    }, [id, user?.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            caseworker_id: user.id
        };

        let result;
        if (isEditing) {
            result = await updatePlan(id, payload);
        } else {
            result = await createPlan(payload);
        }

        if (result) {
            if (isEditing) {
                navigate(`/caseworker/iip/${id}`);
            } else {
                // If new, go to detail page to add goals
                navigate(`/caseworker/iip/${result.id}`);
            }
        }
    };

    if (iipLoading || householdLoading) {
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
                    {isEditing ? 'Edit Integration Plan' : 'New Integration Plan'}
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
                        disabled={!!householdIdParam || isEditing}
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

                {/* Dates Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Start Date</label>
                        <input
                            type="date"
                            value={formData.start_date}
                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                            required
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Next Review Date</label>
                        <input
                            type="date"
                            value={formData.review_date}
                            onChange={(e) => setFormData({ ...formData, review_date: e.target.value })}
                            required
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                    </div>
                </div>

                {/* Status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Status</label>
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        required
                        style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="review_pending">Review Pending</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>

                {/* Overall Goal */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Overall Integration Goal</label>
                    <textarea
                        value={formData.overall_goal}
                        onChange={(e) => setFormData({ ...formData, overall_goal: e.target.value })}
                        rows={4}
                        placeholder="Describe the main objective for this household's integration..."
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
                        {isEditing ? 'Update Plan' : 'Create & Add Goals'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default IIPForm;
