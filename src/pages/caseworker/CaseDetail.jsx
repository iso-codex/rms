import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHouseholdStore } from '../../stores/householdStore';
import { useCaseStore } from '../../stores/caseStore';
import { useIIPStore } from '../../stores/iipStore';
import { StatusBadge, Modal, AlertBanner, LoadingSpinner } from '../../components/common';

const CaseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { currentHousehold, fetchHousehold, loading } = useHouseholdStore();
    const { caseNotes, fetchCaseNotes, addCaseNote, referrals, fetchReferrals } = useCaseStore();
    const { plans, fetchPlans } = useIIPStore();
    const [activeTab, setActiveTab] = useState('overview');
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [newNote, setNewNote] = useState({ content: '', category: 'general', is_sensitive: false });

    useEffect(() => {
        if (id) {
            fetchHousehold(id);
            fetchCaseNotes(id);
            fetchReferrals(id);
            fetchPlans(id);
        }
    }, [id]);

    const handleAddNote = async () => {
        if (!newNote.content.trim()) return;

        await addCaseNote({
            household_id: id,
            caseworker_id: user.id,
            ...newNote
        });

        setNewNote({ content: '', category: 'general', is_sensitive: false });
        setShowNoteModal(false);
    };

    if (loading || !currentHousehold) {
        return (
            <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
                <LoadingSpinner text="Loading case details..." />
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📋' },
        { id: 'members', label: 'Members', icon: '👥' },
        { id: 'notes', label: 'Case Notes', icon: '✏️' },
        { id: 'referrals', label: 'Referrals', icon: '🔗' },
        { id: 'iip', label: 'Integration Plan', icon: '🎯' },
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate('/caseworker/cases')}
                    style={{ color: '#6b7280', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                    ← Back to Cases
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#111827' }}>
                            {currentHousehold.head?.full_name || 'Unknown Household'}
                        </h1>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
                            <span>📍 {currentHousehold.address || 'No address'}</span>
                            <StatusBadge status={currentHousehold.status} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            onClick={() => setShowNoteModal(true)}
                            className="btn btn-outline"
                            style={{ fontSize: '0.875rem' }}
                        >
                            + Add Note
                        </button>
                        <button
                            onClick={() => navigate(`/caseworker/assessments?household=${id}`)}
                            className="btn btn-primary"
                            style={{ fontSize: '0.875rem' }}
                        >
                            New Assessment
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '0.75rem 1rem',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === tab.id ? '2px solid #f59e0b' : '2px solid transparent',
                                color: activeTab === tab.id ? '#111827' : '#6b7280',
                                fontWeight: activeTab === tab.id ? 600 : 400,
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
                {activeTab === 'overview' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>Household Details</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div><span style={{ color: '#6b7280' }}>Address:</span> <strong>{currentHousehold.address || '-'}</strong></div>
                                <div><span style={{ color: '#6b7280' }}>Accommodation:</span> <strong>{currentHousehold.accommodation_type || '-'}</strong></div>
                                <div><span style={{ color: '#6b7280' }}>Local Authority:</span> <strong>{currentHousehold.local_authority || '-'}</strong></div>
                                <div><span style={{ color: '#6b7280' }}>Members:</span> <strong>{currentHousehold.members?.length || 0}</strong></div>
                                <div><span style={{ color: '#6b7280' }}>Created:</span> <strong>{new Date(currentHousehold.created_at).toLocaleDateString()}</strong></div>
                            </div>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>Head of Household</h3>
                            {currentHousehold.head ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div><span style={{ color: '#6b7280' }}>Name:</span> <strong>{currentHousehold.head.full_name}</strong></div>
                                    <div><span style={{ color: '#6b7280' }}>Phone:</span> <strong>{currentHousehold.head.phone || '-'}</strong></div>
                                    <div><span style={{ color: '#6b7280' }}>Gender:</span> <strong>{currentHousehold.head.gender || '-'}</strong></div>
                                    <div><span style={{ color: '#6b7280' }}>Nationality:</span> <strong>{currentHousehold.head.nationality || '-'}</strong></div>
                                </div>
                            ) : (
                                <p style={{ color: '#6b7280' }}>No head of household assigned</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'members' && (
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>Household Members</h3>
                        {currentHousehold.members?.length > 0 ? (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {currentHousehold.members.map((member) => (
                                    <div key={member.id} style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{member.full_name}</div>
                                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                {member.gender} • {member.date_of_birth ? `DOB: ${new Date(member.date_of_birth).toLocaleDateString()}` : 'No DOB'} • {member.nationality || 'Unknown nationality'}
                                            </div>
                                        </div>
                                        {member.id === currentHousehold.head_of_household_id && (
                                            <StatusBadge status="Head" size="xs" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#6b7280' }}>No members in this household</p>
                        )}
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827' }}>Case Notes</h3>
                            <button onClick={() => setShowNoteModal(true)} className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
                                + Add Note
                            </button>
                        </div>
                        {caseNotes.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {caseNotes.map((note) => (
                                    <div key={note.id} style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', borderLeft: note.is_sensitive ? '3px solid #ef4444' : '3px solid #e5e7eb' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                {note.caseworker?.full_name} • {new Date(note.created_at).toLocaleString()}
                                            </span>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <StatusBadge status={note.category} size="xs" />
                                                {note.is_sensitive && <StatusBadge status="critical" size="xs" />}
                                            </div>
                                        </div>
                                        <p style={{ color: '#374151', lineHeight: 1.6 }}>{note.content}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#6b7280' }}>No case notes yet</p>
                        )}
                    </div>
                )}

                {activeTab === 'referrals' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827' }}>Referrals</h3>
                            <button onClick={() => navigate(`/caseworker/referrals?household=${id}&new=true`)} className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
                                + New Referral
                            </button>
                        </div>
                        {referrals.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {referrals.map((ref) => (
                                    <div key={ref.id} style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, marginBottom: '0.25rem', textTransform: 'capitalize' }}>{ref.service_type.replace(/_/g, ' ')}</div>
                                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                {ref.provider_name || 'Provider TBD'} • {new Date(ref.referred_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <StatusBadge status={ref.status} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#6b7280' }}>No referrals yet</p>
                        )}
                    </div>
                )}

                {activeTab === 'iip' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827' }}>Individual Integration Plan</h3>
                            {plans.length === 0 && (
                                <button onClick={() => navigate(`/caseworker/iip/new?household=${id}`)} className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
                                    + Create IIP
                                </button>
                            )}
                        </div>
                        {plans.length > 0 ? (
                            <div>
                                {plans.map((plan) => (
                                    <div key={plan.id} style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <StatusBadge status={plan.status} />
                                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                Review: {plan.review_date ? new Date(plan.review_date).toLocaleDateString() : 'Not scheduled'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/caseworker/iip/${plan.id}`)}
                                            className="btn btn-outline"
                                            style={{ width: '100%', fontSize: '0.875rem' }}
                                        >
                                            View Integration Plan →
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <AlertBanner
                                type="info"
                                title="No Integration Plan"
                                message="Create an Individual Integration Plan to track goals and progress for this household."
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Add Note Modal */}
            <Modal
                isOpen={showNoteModal}
                onClose={() => setShowNoteModal(false)}
                title="Add Case Note"
                size="md"
                footer={
                    <>
                        <button onClick={() => setShowNoteModal(false)} className="btn btn-outline">Cancel</button>
                        <button onClick={handleAddNote} className="btn btn-primary">Save Note</button>
                    </>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Category</label>
                        <select
                            value={newNote.category}
                            onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                            style={{ width: '100%', padding: '0.625rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.875rem' }}
                        >
                            <option value="general">General</option>
                            <option value="health">Health</option>
                            <option value="education">Education</option>
                            <option value="housing">Housing</option>
                            <option value="employment">Employment</option>
                            <option value="finance">Finance</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Note Content</label>
                        <textarea
                            value={newNote.content}
                            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                            rows={5}
                            placeholder="Enter your case note..."
                            style={{ width: '100%', padding: '0.625rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.875rem', resize: 'vertical' }}
                        />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <input
                            type="checkbox"
                            checked={newNote.is_sensitive}
                            onChange={(e) => setNewNote({ ...newNote, is_sensitive: e.target.checked })}
                        />
                        Mark as sensitive/confidential
                    </label>
                </div>
            </Modal>
        </div>
    );
};

export default CaseDetail;
