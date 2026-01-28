import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useHouseholdStore } from '../../stores/householdStore';
import { useCaseStore } from '../../stores/caseStore';
import { MetricCard, AlertBanner } from '../../components/common';
import { supabase } from '../../supabaseClient';

// Import List Components
import CaseList from './CaseList';
import Assessments from './Assessments';
import Referrals from './Referrals';
import IIPList from './IIPList';
import Events from './Events';

const CaseworkerDashboard = () => {
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const { households, fetchHouseholds } = useHouseholdStore();
    const { fetchAssessments } = useCaseStore();

    // Tab State
    const [activeTab, setActiveTab] = useState('overview');

    // Dashboard Stats State
    const [stats, setStats] = useState({
        totalCases: 0,
        pendingAssessments: 0,
        activeReferrals: 0,
        activePlans: 0,
        upcomingEvents: 0
    });
    const [overdueAssessments, setOverdueAssessments] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, [user?.id]);

    const loadDashboardData = async () => {
        if (!user) return;

        await fetchHouseholds(user.id);
        await fetchAssessments();

        // Get stats
        const [
            { count: pendingCount },
            { count: referralCount },
            { count: planCount },
            { count: eventCount }
        ] = await Promise.all([
            supabase.from('assessments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
            supabase.from('referrals').select('*', { count: 'exact', head: true }).in('status', ['pending', 'sent', 'in_progress']),
            supabase.from('integration_plans').select('*', { count: 'exact', head: true }).eq('status', 'active'),
            supabase.from('community_events').select('*', { count: 'exact', head: true }).gte('event_date', new Date().toISOString())
        ]);

        // Get overdue assessments
        const { data: overdue } = await supabase
            .from('assessments')
            .select('*, household:households!assessments_household_id_fkey(id, address)')
            .lt('due_date', new Date().toISOString().split('T')[0])
            .neq('status', 'completed')
            .limit(5);

        setStats({
            totalCases: households.length,
            pendingAssessments: pendingCount || 0,
            activeReferrals: referralCount || 0,
            activePlans: planCount || 0,
            upcomingEvents: eventCount || 0
        });

        setOverdueAssessments(overdue || []);
    };

    // Tab Button Component
    const TabButton = ({ id, label, icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.25rem',
                backgroundColor: activeTab === id ? 'white' : 'transparent',
                border: 'none',
                borderBottom: activeTab === id ? '2px solid #f59e0b' : '2px solid transparent',
                color: activeTab === id ? '#111827' : '#6b7280',
                fontWeight: activeTab === id ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.875rem'
            }}
        >
            <span style={{ marginRight: '0.5rem' }}>{icon}</span>
            {label}
        </button>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                            <MetricCard
                                title="Active Cases"
                                value={stats.totalCases}
                                icon="👥"
                                color="#3b82f6"
                                subtitle="assigned to you"
                                onClick={() => setActiveTab('cases')}
                            />
                            <MetricCard
                                title="Pending Assessments"
                                value={stats.pendingAssessments}
                                icon="📋"
                                color="#f59e0b"
                                subtitle="awaiting completion"
                                onClick={() => setActiveTab('assessments')}
                            />
                            <MetricCard
                                title="Active Plans"
                                value={stats.activePlans}
                                icon="📈"
                                color="#10b981"
                                subtitle="integration plans"
                                onClick={() => setActiveTab('iip')}
                            />
                            <MetricCard
                                title="Upcoming Events"
                                value={stats.upcomingEvents}
                                icon="📅"
                                color="#8b5cf6"
                                subtitle="scheduled"
                                onClick={() => setActiveTab('events')}
                            />
                        </div>

                        {/* Recent Alerts */}
                        {overdueAssessments.length > 0 && (
                            <AlertBanner
                                type="warning"
                                title={`${overdueAssessments.length} Overdue Assessment${overdueAssessments.length > 1 ? 's' : ''}`}
                                message="Some assessments are past their due date."
                                action={
                                    <button onClick={() => setActiveTab('assessments')} className="btn btn-primary" style={{ fontSize: '0.75rem' }}>
                                        View Assessments
                                    </button>
                                }
                            />
                        )}

                        {/* Quick Actions Grid */}
                        <div>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Quick Actions</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <button onClick={() => navigate('/caseworker/assessments/new')} style={actionButtonStyle}>
                                    <span style={{ fontSize: '1.5rem' }}>📋</span>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>New Assessment</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Start needs assessment</div>
                                    </div>
                                </button>
                                <button onClick={() => navigate('/caseworker/referrals/new')} style={actionButtonStyle}>
                                    <span style={{ fontSize: '1.5rem' }}>🔗</span>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>Make Referral</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Connect to services</div>
                                    </div>
                                </button>
                                <button onClick={() => navigate('/caseworker/iip/new')} style={actionButtonStyle}>
                                    <span style={{ fontSize: '1.5rem' }}>📈</span>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>Create Plan</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>New integration plan</div>
                                    </div>
                                </button>
                                <button onClick={() => navigate('/caseworker/events/new')} style={actionButtonStyle}>
                                    <span style={{ fontSize: '1.5rem' }}>📅</span>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>Create Event</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Schedule activity</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'cases':
                return <CaseList embedded />;
            case 'assessments':
                return <Assessments embedded />;
            case 'referrals':
                return <Referrals embedded />;
            case 'iip':
                return <IIPList embedded />;
            case 'events':
                return <Events embedded />;
            default:
                return <div>Select a tab</div>;
        }
    };

    const actionButtonStyle = {
        padding: '1rem',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        textAlign: 'left'
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827', marginBottom: '0.25rem' }}>
                        Caseworker Portal
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        Welcome back, {profile?.full_name || 'Caseworker'}
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{
                borderBottom: '1px solid #e5e7eb',
                marginBottom: '2rem',
                display: 'flex',
                gap: '0.5rem',
                backgroundColor: '#f9fafb',
                padding: '0 0.5rem'
            }}>
                <TabButton id="overview" label="Overview" icon="📊" />
                <TabButton id="cases" label="Cases" icon="👥" />
                <TabButton id="assessments" label="Assessments" icon="📋" />
                <TabButton id="referrals" label="Referrals" icon="🔗" />
                <TabButton id="iip" label="Plans" icon="📈" />
                <TabButton id="events" label="Events" icon="📅" />
            </div>

            {/* Content Area */}
            <div style={{ minHeight: '500px' }}>
                {renderContent()}
            </div>
        </div>
    );
};

export default CaseworkerDashboard;
