import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useCaseStore } from '../../stores/caseStore';
import { useHouseholdStore } from '../../stores/householdStore';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/common';

const ReferralForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const householdIdParam = searchParams.get('household');
    const { user } = useAuth();

    const { referrals, createReferral, updateReferral, fetchReferrals, loading: caseLoading } = useCaseStore();
    const { households, fetchHouseholds, loading: householdLoading } = useHouseholdStore();

    const isEditing = !!id;
    const [formData, setFormData] = useState({
        household_id: householdIdParam || '',
        service_type: 'health',
        provider_name: '',
        status: 'pending',
        referred_at: new Date().toISOString().split('T')[0],
        check_in_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +1 week
        notes: '',
        referred_by: user?.id
    });

    useEffect(() => {
        const loadData = async () => {
            if (households.length === 0) {
                await fetchHouseholds(user.id);
            }
            if (isEditing) {
                const existing = referrals.find(r => r.id === id);
                if (existing) {
                    setFormData({
                        household_id: existing.household_id,
                        service_type: existing.service_type,
                        provider_name: existing.provider_name || '',
                        status: existing.status,
                        referred_at: existing.referred_at ? existing.referred_at.split('T')[0] : '',
                        check_in_date: existing.check_in_date ? existing.check_in_date.split('T')[0] : '',
                        notes: existing.notes || '',
                        referred_by: existing.referred_by
                    });
                } else {
                    await fetchReferrals();
                }
            }
        };
        loadData();
    }, [id, user?.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            referred_by: user.id
        };

        let result;
        if (isEditing) {
            result = await updateReferral(id, payload);
        } else {
            result = await createReferral(payload);
        }

        if (result) {
            navigate('/caseworker/referrals');
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
                    {isEditing ? 'Edit Referral' : 'New Referral'}
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

                {/* Service & Provider */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Service Type</label>
                        <select
                            value={formData.service_type}
                            onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                            required
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        >
                            <option value="health">Healthcare</option>
                            <option value="legal">Legal Aid</option>
                            <option value="housing">Housing Support</option>
                            <option value="education">Education/Schooling</option>
                            <option value="employment">Employment Services</option>
                            <option value="mental_health">Mental Health</option>
                            <option value="language">Language Classes</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Provider Name</label>
                        <input
                            type="text"
                            value={formData.provider_name}
                            onChange={(e) => setFormData({ ...formData, provider_name: e.target.value })}
                            required
                            placeholder="e.g. City Health Clinic"
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                    </div>
                </div>

                {/* Dates & Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Referred Date</label>
                        <input
                            type="date"
                            value={formData.referred_at}
                            onChange={(e) => setFormData({ ...formData, referred_at: e.target.value })}
                            required
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Check-in Date</label>
                        <input
                            type="date"
                            value={formData.check_in_date}
                            onChange={(e) => setFormData({ ...formData, check_in_date: e.target.value })}
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            required
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        >
                            <option value="pending">Pending</option>
                            <option value="sent">Sent</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="declined">Declined</option>
                        </select>
                    </div>
                </div>

                {/* Notes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Notes / Instructions</label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={6}
                        placeholder="Enter referral details and instructions..."
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
                        {isEditing ? 'Update Referral' : 'Create Referral'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReferralForm;
