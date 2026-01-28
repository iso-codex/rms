import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useIIPStore } from '../../stores/iipStore';
import { DataTable, StatusBadge, LoadingSpinner } from '../../components/common';

const IIPList = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const householdId = searchParams.get('household');
    const { plans, fetchPlans, loading } = useIIPStore();
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPlans(householdId);
    }, [householdId]);

    const filteredPlans = plans.filter(p => {
        const matchesFilter = filter === 'all' || p.status === filter;
        const matchesSearch = !searchTerm ||
            p.household?.address?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const columns = [
        {
            header: 'Household',
            accessor: 'household',
            bold: true,
            render: (household) => household?.address || 'Unknown'
        },
        {
            header: 'Start Date',
            accessor: 'start_date',
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            header: 'Review Date',
            accessor: 'review_date',
            render: (date) => date ? new Date(date).toLocaleDateString() : '-'
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
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/caseworker/iip/${id}`);
                    }}
                    className="btn btn-outline"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                >
                    View
                </button>
            )
        }
    ];

    if (loading && plans.length === 0) {
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
                            {householdId ? 'Household Integration Plans' : 'Integration Plans'}
                        </h1>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        Manage long-term integration goals and progress
                    </p>
                </div>
                {!householdId && (
                    <button
                        onClick={() => navigate('/caseworker/iip/new')}
                        className="btn btn-primary"
                    >
                        + New Plan
                    </button>
                )}
                {householdId && plans.length === 0 && (
                    <button
                        onClick={() => navigate(`/caseworker/iip/new?household=${householdId}`)}
                        className="btn btn-primary"
                    >
                        + Create Plan
                    </button>
                )}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Search by address..."
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
                    {['all', 'draft', 'active', 'review_pending', 'completed', 'archived'].map((status) => (
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
                data={filteredPlans}
                loading={loading}
                emptyMessage="No integration plans found"
                onRowClick={(row) => navigate(`/caseworker/iip/${row.id}`)}
            />
        </div>
    );
};

export default IIPList;
