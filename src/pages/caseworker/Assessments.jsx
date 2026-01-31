import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCaseStore } from '../../stores/caseStore';
import { DataTable, StatusBadge, LoadingSpinner } from '../../components/common';

const Assessments = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const householdId = searchParams.get('household');
    const { assessments, fetchAssessments, deleteAssessment, loading } = useCaseStore();
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAssessments(householdId);
    }, [householdId]);

    const filteredAssessments = assessments.filter(a => {
        const matchesFilter = filter === 'all' || a.status === filter;
        const matchesSearch = !searchTerm ||
            a.household?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.assessment_type?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const columns = [
        {
            header: 'Type',
            accessor: 'assessment_type',
            bold: true,
            render: (type) => <span style={{ textTransform: 'capitalize' }}>{type.replace(/_/g, ' ')}</span>
        },
        {
            header: 'Household',
            accessor: 'household',
            render: (household) => household?.address || 'Unknown'
        },
        {
            header: 'Due Date',
            accessor: 'due_date',
            render: (date) => date ? new Date(date).toLocaleDateString() : '-'
        },
        {
            header: 'Priority',
            accessor: 'priority',
            render: (priority) => (
                <span style={{
                    textTransform: 'capitalize',
                    fontWeight: 500,
                    color: priority === 'high' || priority === 'critical' ? '#dc2626' : 'inherit'
                }}>
                    {priority}
                </span>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (status) => <StatusBadge status={status} />
        },
        {
            header: '',
            accessor: 'id',
            width: '100px',
            render: (id) => (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/caseworker/assessments/${id}`);
                        }}
                        className="btn btn-outline"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                    >
                        Edit
                    </button>
                    <button
                        onClick={async (e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this assessment?')) {
                                await deleteAssessment(id);
                                // The store updates the state, so the list should refresh automatically
                            }
                        }}
                        className="btn btn-outline"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderColor: '#ef4444', color: '#ef4444' }}
                    >
                        Delete
                    </button>
                </div>
            )
        }
    ];

    if (loading && assessments.length === 0) {
        return <div style={{ padding: '4rem', textAlign: 'center' }}><LoadingSpinner /></div>;
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        {householdId && (
                            <button
                                onClick={() => navigate(-1)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}
                            >
                                ←
                            </button>
                        )}
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>
                            {householdId ? 'Household Assessments' : 'All Assessments'}
                        </h1>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        Manage needs assessments and risk evaluations
                    </p>
                </div>
                <button
                    onClick={() => navigate(householdId ? `/caseworker/assessments/new?household=${householdId}` : '/caseworker/assessments/new')}
                    className="btn btn-primary"
                >
                    + New Assessment
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Search address or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '0.625rem 1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        width: '280px'
                    }}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['all', 'pending', 'in_progress', 'completed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: filter === status ? '#fef3c7' : 'white',
                                border: `1px solid ${filter === status ? '#f59e0b' : '#e5e7eb'}`,
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                fontWeight: filter === status ? 600 : 400,
                                color: filter === status ? '#92400e' : '#6b7280',
                                cursor: 'pointer',
                                textTransform: 'capitalize'
                            }}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredAssessments}
                loading={loading}
                emptyMessage="No assessments found"
                onRowClick={(row) => navigate(`/caseworker/assessments/${row.id}`)}
            />
        </div>
    );
};

export default Assessments;
