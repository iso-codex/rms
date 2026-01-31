import { useState } from 'react';
import { Modal } from '../common';
import { useHouseholdStore } from '../../stores/householdStore';
import { useAuth } from '../../context/AuthContext';

const NewCaseModal = ({ isOpen, onClose, onSuccess }) => {
    const { createHousehold, loading } = useHouseholdStore();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        address: '',
        accommodation_type: 'Temporary',
        local_authority: '',
        status: 'active',
        assigned_caseworker_id: user?.id || null
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure caseworker ID is set if not already
        const dataToSubmit = {
            ...formData,
            assigned_caseworker_id: formData.assigned_caseworker_id || user?.id,
            created_at: new Date().toISOString()
        };

        const result = await createHousehold(dataToSubmit);

        if (result) {
            onSuccess(result);
            onClose();
            // Reset form
            setFormData({
                address: '',
                accommodation_type: 'Temporary',
                local_authority: '',
                status: 'active',
                assigned_caseworker_id: user?.id || null
            });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Case"
            size="md"
        >
            <form onSubmit={handleSubmit} id="new-case-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Address *</label>
                    <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="e.g. 123 Hope Street"
                        style={{ width: '100%', padding: '0.625rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.875rem' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Accommodation Type</label>
                    <select
                        name="accommodation_type"
                        value={formData.accommodation_type}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.625rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.875rem' }}
                    >
                        <option value="Temporary">Temporary</option>
                        <option value="Permanent">Permanent</option>
                        <option value="Hotel">Hotel</option>
                        <option value="Hostel">Hostel</option>
                        <option value="Private Rented">Private Rented</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Local Authority</label>
                    <input
                        type="text"
                        name="local_authority"
                        value={formData.local_authority}
                        onChange={handleChange}
                        placeholder="e.g. Manchester City Council"
                        style={{ width: '100%', padding: '0.625rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.875rem' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-outline"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Case'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default NewCaseModal;
