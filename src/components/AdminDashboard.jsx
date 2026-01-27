import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const SidebarItem = ({ icon, label, active, onClick }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.75rem 1rem',
            cursor: 'pointer',
            marginBottom: '0.25rem',
            borderRadius: '6px',
            color: active ? '#111827' : '#6b7280',
            backgroundColor: active ? '#f3f4f6' : 'transparent',
            fontWeight: active ? 600 : 500
        }}
    >
        <span style={{ marginRight: '0.75rem', fontSize: '1.1rem' }}>{icon}</span>
        {label}
    </div>
);

const MetricCard = ({ title, value, trend, trendColor = '#22c55e', trendText }) => (
    <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', minWidth: '200px' }}>
        <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {title} <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>ⓘ</span>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem', color: '#111827' }}>
            {value}
        </div>
        <div style={{ fontSize: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ color: trendColor, fontWeight: 600 }}>{trend}</span>
            <span style={{ color: '#9ca3af' }}>{trendText}</span>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        approved: { bg: '#dcfce7', color: '#15803d', label: 'Approved' },
        pending: { bg: '#fff7ed', color: '#c2410c', label: 'Pending' },
        rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Rejected' },
        default: { bg: '#f3f4f6', color: '#374151', label: status }
    };
    const style = styles[status] || styles.default;

    return (
        <span style={{
            backgroundColor: style.bg,
            color: style.color,
            padding: '0.25rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 600
        }}>
            {style.label}
        </span>
    );
};

const AdminDashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('requests'); // 'requests', 'users', 'donations', 'services', 'settings'
    const [stats, setStats] = useState({ refugees: 0, requests: 0, pending: 0, donations: '$0' });

    // Data States
    const [requests, setRequests] = useState([]);
    const [refugees, setRefugees] = useState([]);
    const [donations, setDonations] = useState([]);
    const [services, setServices] = useState([]);

    const [loading, setLoading] = useState(true);

    // --- Data Fetching ---
    // --- Data Fetching ---
    const fetchData = async () => {
        setLoading(true);
        console.log("Fetching admin data...");
        try {
            const [
                refugeeCountResult,
                requestCountResult,
                pendingCountResult,
                reqDataResult,
                refDataResult,
                donDataResult,
                servDataResult
            ] = await Promise.allSettled([
                supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'refugee'),
                supabase.from('requests').select('*', { count: 'exact', head: true }),
                supabase.from('requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
                supabase.from('requests').select('*, profiles:user_id(full_name, nationality, gender)').order('created_at', { ascending: false }),
                supabase.from('profiles').select('*').eq('role', 'refugee'),
                supabase.from('donations').select('*').order('created_at', { ascending: false }),
                supabase.from('services').select('*').order('created_at', { ascending: false })
            ]);

            // Helper to extract data or throw error if needed (or just log)
            const getResult = (result, name) => {
                if (result.status === 'rejected') {
                    console.error(`Error fetching ${name}:`, result.reason);
                    return { data: [], count: 0 };
                }
                if (result.value.error) {
                    console.error(`Error fetching ${name}:`, result.value.error);
                    return { data: [], count: 0 };
                }
                return result.value;
            };

            const refugeeCount = getResult(refugeeCountResult, 'refugeeCount').count;
            const requestCount = getResult(requestCountResult, 'requestCount').count;
            const pendingCount = getResult(pendingCountResult, 'pendingCount').count;

            const reqData = getResult(reqDataResult, 'requests').data;
            const refData = getResult(refDataResult, 'refugees').data;
            const donData = getResult(donDataResult, 'donations').data;
            const servData = getResult(servDataResult, 'services').data;

            setRequests(reqData || []);
            setRefugees(refData || []);
            setDonations(donData || []);
            setServices(servData || []);

            // Stats Calculation
            const totalDonations = (donData || []).reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

            setStats({
                refugees: refugeeCount || refData?.length || 0,
                requests: requestCount || reqData?.length || 0,
                pending: pendingCount || (reqData || []).filter(r => r.status === 'pending').length,
                donations: `$${totalDonations.toLocaleString()}`
            });

        } catch (error) {
            console.error('Critical error fetching admin data:', error);
        } finally {
            console.log("Fetch complete, stopping loading.");
            setLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;

        // Wrap logic to prevent state update on unmount
        // But since we can't cancel supabase promises easily we just ignore result
        fetchData();

        return () => { mounted = false; };
    }, []); // Removed dependency array triggering

    const updateStatus = async (id, newStatus) => {
        try {
            const { error } = await supabase.from('requests').update({ status: newStatus }).eq('id', id);
            if (error) throw error;
            // Optimistic update or shallow refetch could be better, but refetch is safer for now
            fetchData();
        } catch (error) {
            console.error('Error updating status:', error);
            alert("Failed to update status");
        }
    };

    const handleAddService = async () => {
        const title = prompt("Service Title:");
        if (!title) return;
        const description = prompt("Description:");
        const category = prompt("Category (e.g., Medical, Shelter):");

        try {
            const { error } = await supabase.from('services').insert([{
                title, description, category, target_amount: 0, raised_amount: 0
            }]);
            if (error) throw error;
            fetchData();
        } catch (error) {
            alert("Error adding service: " + error.message);
        }
    };

    const handleDeleteService = async (id) => {
        if (!confirm("Are you sure you want to delete this service?")) return;
        try {
            const { error } = await supabase.from('services').delete().eq('id', id);
            if (error) throw error;
            fetchData();
        } catch (error) {
            alert("Error deleting service");
        }
    }

    // --- Content Rendering ---
    const renderContent = () => {
        if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

        switch (activeTab) {
            case 'requests':
                return (
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
                                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>
                                    <tr>
                                        <th style={{ padding: '1rem' }}>Refugee</th>
                                        <th style={{ padding: '1rem' }}>Type</th>
                                        <th style={{ padding: '1rem' }}>Urgency</th>
                                        <th style={{ padding: '1rem' }}>Date</th>
                                        <th style={{ padding: '1rem' }}>Status</th>
                                        <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.length === 0 ? <tr><td colSpan="6" style={{ padding: '1rem', textAlign: 'center' }}>No requests</td></tr> : requests.map(req => (
                                        <tr key={req.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '1rem', fontWeight: 500 }}>{req.profiles?.full_name || 'Anonymous'}</td>
                                            <td style={{ padding: '1rem' }}>{req.type}</td>
                                            <td style={{ padding: '1rem' }}>{req.urgency}</td>
                                            <td style={{ padding: '1rem', color: '#6b7280' }}>{new Date(req.created_at).toLocaleDateString()}</td>
                                            <td style={{ padding: '1rem' }}><StatusBadge status={req.status} /></td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                {req.status === 'pending' && (
                                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                        <button onClick={() => updateStatus(req.id, 'approved')} style={{ cursor: 'pointer', border: 'none', background: 'none' }}>✅</button>
                                                        <button onClick={() => updateStatus(req.id, 'rejected')} style={{ cursor: 'pointer', border: 'none', background: 'none' }}>❌</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'refugees':
                return (
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>
                                <tr>
                                    <th style={{ padding: '1rem' }}>Name</th>
                                    <th style={{ padding: '1rem' }}>Nationality</th>
                                    <th style={{ padding: '1rem' }}>Gender</th>
                                    <th style={{ padding: '1rem' }}>DOB</th>
                                    <th style={{ padding: '1rem' }}>Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                {refugees.length === 0 ? <tr><td colSpan="5" style={{ padding: '1rem', textAlign: 'center' }}>No refugees found</td></tr> : refugees.map(ref => (
                                    <tr key={ref.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '1rem', fontWeight: 500 }}>{ref.full_name}</td>
                                        <td style={{ padding: '1rem' }}>{ref.nationality || '-'}</td>
                                        <td style={{ padding: '1rem' }}>{ref.gender || '-'}</td>
                                        <td style={{ padding: '1rem' }}>{ref.date_of_birth || '-'}</td>
                                        <td style={{ padding: '1rem' }}>{ref.phone || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case 'donations':
                return (
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>
                                <tr>
                                    <th style={{ padding: '1rem' }}>Donor</th>
                                    <th style={{ padding: '1rem' }}>Campaign</th>
                                    <th style={{ padding: '1rem' }}>Amount</th>
                                    <th style={{ padding: '1rem' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donations.length === 0 ? <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center' }}>No donations</td></tr> : donations.map(don => (
                                    <tr key={don.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '1rem' }}>{don.donor_name || 'Anonymous'}</td>
                                        <td style={{ padding: '1rem' }}>{don.campaign_id || 'General'}</td>
                                        <td style={{ padding: '1rem', fontWeight: 600, color: '#15803d' }}>${don.amount}</td>
                                        <td style={{ padding: '1rem', color: '#6b7280' }}>{new Date(don.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case 'services':
                return (
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                        <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={handleAddService} className="btn btn-primary" style={{ fontSize: '0.875rem' }}>+ New Service</button>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>
                                <tr>
                                    <th style={{ padding: '1rem' }}>Title</th>
                                    <th style={{ padding: '1rem' }}>Category</th>
                                    <th style={{ padding: '1rem' }}>Target</th>
                                    <th style={{ padding: '1rem' }}>Role</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.length === 0 ? <tr><td colSpan="5" style={{ padding: '1rem', textAlign: 'center' }}>No services</td></tr> : services.map(srv => (
                                    <tr key={srv.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '1rem', fontWeight: 500 }}>{srv.title}</td>
                                        <td style={{ padding: '1rem' }}>{srv.category}</td>
                                        <td style={{ padding: '1rem' }}>${srv.target_amount}</td>
                                        <td style={{ padding: '1rem' }}>{srv.description?.substring(0, 30)}...</td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button onClick={() => handleDeleteService(srv.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case 'settings':
                return (
                    <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Platform Settings</h3>
                        <p style={{ color: '#6b7280' }}>Global system settings will appear here.</p>
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-outline" disabled>Export Data</button>
                            <button className="btn btn-outline" disabled>System Logs</button>
                        </div>
                    </div>
                );

            default:
                return <div>Select a dedicated tab</div>;
        }
    };

    // --- Main Layout Render ---
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: '"Inter", sans-serif' }}>

            {/* 1. Sidebar */}
            <div style={{
                width: '260px',
                backgroundColor: 'white',
                borderRight: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem',
                position: 'fixed',
                height: '100%',
                left: 0,
                top: 0
            }}>
                {/* Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
                    <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>R</div>
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>RefugeeHelp</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Admin Console</div>
                    </div>
                </div>

                {/* Search */}
                <input
                    placeholder="Search"
                    style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        backgroundColor: '#f9fafb',
                        fontSize: '0.875rem',
                        marginBottom: '1.5rem'
                    }}
                />

                {/* Menu */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, marginBottom: '0.5rem', paddingLeft: '1rem' }}>MAIN MENU</div>
                    <SidebarItem icon="📊" label="Requests" active={activeTab === 'requests'} onClick={() => setActiveTab('requests')} />
                    <SidebarItem icon="👥" label="Refugees" active={activeTab === 'refugees'} onClick={() => setActiveTab('refugees')} />
                    <SidebarItem icon="💰" label="Donations" active={activeTab === 'donations'} onClick={() => setActiveTab('donations')} />
                </div>

                <div style={{ marginBottom: 'auto' }}>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, marginBottom: '0.5rem', paddingLeft: '1rem' }}>TOOLS</div>
                    <SidebarItem icon="📦" label="Services" active={activeTab === 'services'} onClick={() => setActiveTab('services')} />
                    <SidebarItem icon="⚙️" label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                </div>

                {/* Bottom User Profile */}
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#d1d5db', overflow: 'hidden' }}>
                        <img src={`https://ui-avatars.com/api/?name=${user.email}&background=random`} alt="Admin" />
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>System Admin</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{user.email}</div>
                    </div>
                    <button onClick={async () => { await signOut(); navigate('/'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }} title="Sign Out">↪</button>
                </div>
            </div>

            {/* 2. Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '260px' }}>

                {/* Header */}
                <div style={{
                    height: '64px',
                    padding: '0 2rem',
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Overview</h2>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }} onClick={fetchData}>↻ Refresh</button>
                        {activeTab === 'services' && <button className="btn btn-primary" onClick={handleAddService} style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>+ Add Service</button>}
                    </div>
                </div>

                {/* Dashboard Body */}
                <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

                    {/* Stats Row (Always visible for now, or could change based on tab) */}
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        <MetricCard title="Total Refugees" value={stats.refugees} trend="Active" trendText="registered" trendColor="#22c55e" />
                        <MetricCard title="Total Donations" value={stats.donations} trend="Total" trendText="received" trendColor="#22c55e" />
                        <MetricCard title="Total Requests" value={stats.requests} trend="All time" trendText="submitted" trendColor="#3b82f6" />
                        <MetricCard title="Pending" value={stats.pending} trend="Attention" trendText="required" trendColor="#f97316" />
                    </div>

                    {/* Dynamic Content */}
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
