import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHouseholdStore } from '../../stores/householdStore';
import { DataTable, StatusBadge } from '../../components/common';
import NewCaseModal from '../../components/caseworker/NewCaseModal';

const CaseList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { households, fetchHouseholds, loading } = useHouseholdStore();
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetchHouseholds(user.id);
    }, [user?.id]);

    const filteredHouseholds = households.filter(h => {
        const matchesFilter = filter === 'all' || h.status === filter;
        const matchesSearch = !searchTerm ||
            h.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.head?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const columns = [
        {
            header: 'Household',
            accessor: 'address',
            bold: true,
            render: (address, row) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{row.head?.full_name || 'No head assigned'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{address || 'No address'}</div>
                </div>
            )
        },
        {
            header: 'Members',
            accessor: 'members',
            render: (members) => members?.length || 0
        },
        {
            header: 'Accommodation',
            accessor: 'accommodation_type',
            render: (type) => type || '-'
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (status) => <StatusBadge status={status} />
        },
        {
            header: 'Created',
            accessor: 'created_at',
            muted: true,
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            header: '',
            accessor: 'id',
            width: '60px',
            render: (id) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/caseworker/cases/${id}`);
                    }}
                    style={{
                        padding: '0.375rem 0.75rem',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        cursor: 'pointer'
                    }}
                >
                    View
                </button>
            )
        }
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem', color: '#111827' }}>
                        Cases
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        Manage your assigned households
                    </p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="btn btn-primary"
                    style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    + New Case
                </button>
            </div>

            {/* Filters */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                <input
                    type="text"
                    placeholder="Search by name or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '0.625rem 1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        width: '280px',
                        outline: 'none'
                    }}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['all', 'active', 'closed'].map((status) => (
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
                            {status}
                        </button>
                    ))}
                </div>
                <div style={{ marginLeft: 'auto', color: '#6b7280', fontSize: '0.875rem' }}>
                    {filteredHouseholds.length} case{filteredHouseholds.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Cases Table */}
            <DataTable
                columns={columns}
                data={filteredHouseholds}
                loading={loading}
                emptyMessage="No cases found"
                onRowClick={(row) => navigate(`/caseworker/cases/${row.id}`)}
            />

            <NewCaseModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    fetchHouseholds(user.id);
                    // Optionally navigate to the new case or show a toast
                }}
            />
        </div>
    );
};

export default CaseList;
