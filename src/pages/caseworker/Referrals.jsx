import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCaseStore } from '../../stores/caseStore';
import { DataTable, StatusBadge, LoadingSpinner } from '../../components/common';

const Referrals = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const householdId = searchParams.get('household');
    const { referrals, fetchReferrals, loading } = useCaseStore();
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchReferrals(householdId);
    }, [householdId]);

    const filteredReferrals = referrals.filter(r => {
        const matchesFilter = filter === 'all' || r.status === filter;
        const matchesSearch = !searchTerm ||
            r.household?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.provider_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.service_type?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const columns = [
        {
            header: 'Service Type',
            accessor: 'service_type',
            bold: true,
            render: (type) => <span style={{ textTransform: 'capitalize' }}>{type?.replace(/_/g, ' ')}</span>
        },
        {
            header: 'Provider',
            accessor: 'provider_name',
            render: (name) => name || 'TBD'
        },
        {
            header: 'Household',
            accessor: 'household',
            render: (household) => household?.address || 'Unknown'
        },
        {
            header: 'Referred Date',
            accessor: 'referred_at',
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
                        navigate(`/caseworker/referrals/${id}`);
                    }}
                    className="btn btn-outline"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                >
                    Edit
                </button>
            )
        }
    ];

    if (loading && referrals.length === 0) {
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
                            {householdId ? 'Household Referrals' : 'All Referrals'}
                        </h1>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        Manage service referrals and external support
                    </p>
                </div>
                <button
                    onClick={() => navigate(householdId ? `/caseworker/referrals/new?household=${householdId}` : '/caseworker/referrals/new')}
                    className="btn btn-primary"
                >
                    + New Referral
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Search provider, type or address..."
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
                    {['all', 'pending', 'sent', 'in_progress', 'completed', 'declined'].map((status) => (
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
                data={filteredReferrals}
                loading={loading}
                emptyMessage="No referrals found"
                onRowClick={(row) => navigate(`/caseworker/referrals/${row.id}`)}
            />
        </div>
    );
};

export default Referrals;
