import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useIIPStore } from '../../stores/iipStore';
import { MetricCard, AlertBanner } from '../../components/common';
import { supabase } from '../../supabaseClient';

// Import "Pages" as Tab Components
// We'll reimplement them here as specific tab views or import them if they were designed to be embedded
// Since MyPlan and MyRequests are full pages, importing them might bring their own Headers, which we might want to suppress or wrap.
// For cleaner integration, I'll inline the simplified versions or adapt them.
// Let's import the full components but we might need to adjust them to not have their own "Header" titles if we want a unified look.
// Actually, re-rendering them is cleaner for "Dashboard" mode.

import MyPlan from './MyPlan';
import MyRequests from './MyRequests';
// We'll also add an Events tab later if needed via existing component

const RefugeeHome = () => {
    const { user, profile } = useAuth();
    const { plans, fetchPlans } = useIIPStore();
    const [activeTab, setActiveTab] = useState('overview');

    // Stats for Overview
    const [stats, setStats] = useState({
        goalsCompleted: 0,
        totalGoals: 0,
        pendingRequests: 0,
        upcomingEvents: 0
    });
    const [caseworker, setCaseworker] = useState(null);

    useEffect(() => {
        if (profile?.household_id) {
            loadStats();
        }
    }, [profile?.household_id, activeTab]); // Reload when tab changes in case data updated

    const loadStats = async () => {
        await fetchPlans(profile.household_id);

        // Get caseworker
        const { data: household } = await supabase
            .from('households')
            .select('*, caseworker:profiles!households_assigned_caseworker_id_fkey(full_name, phone)')
            .eq('id', profile.household_id)
            .single();

        if (household?.caseworker) setCaseworker(household.caseworker);

        // Goals
        const { data: goals } = await supabase
            .from('integration_goals')
            .select('status')
            .in('plan_id', plans.map(p => p.id));
        const completed = goals?.filter(g => g.status === 'completed').length || 0;

        // Requests
        const { count: requestCount } = await supabase
            .from('requests')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('status', 'pending');

        // Events
        const { count: eventCount } = await supabase
            .from('community_events')
            .select('*', { count: 'exact', head: true })
            .gte('event_date', new Date().toISOString())
            .eq('is_published', true);

        setStats({
            goalsCompleted: completed,
            totalGoals: goals?.length || 0,
            pendingRequests: requestCount || 0,
            upcomingEvents: eventCount || 0
        });
    };

    const progressPercent = stats.totalGoals > 0 ? Math.round((stats.goalsCompleted / stats.totalGoals) * 100) : 0;

    // Tab Button
    const TabButton = ({ id, label, icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.25rem',
                backgroundColor: activeTab === id ? 'white' : 'transparent',
                border: 'none',
                borderBottom: activeTab === id ? '2px solid #10b981' : '2px solid transparent',
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

    const OverviewTab = () => (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Welcome Header */}
            <div style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '16px',
                padding: '2rem',
                marginBottom: '2rem',
                color: 'white',
                boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)'
            }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                    Welcome back, {profile?.full_name?.split(' ')[0]}!
                </h1>
                <p style={{ opacity: 0.9 }}>
                    Integration Progress
                </p>
                <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${progressPercent}%`, height: '100%', background: 'white', borderRadius: '999px' }} />
                </div>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <MetricCard
                    title="Planning Goals"
                    value={`${stats.goalsCompleted}/${stats.totalGoals}`}
                    icon="🎯"
                    color="#10b981"
                    onClick={() => setActiveTab('plan')}
                />
                <MetricCard
                    title="Active Requests"
                    value={stats.pendingRequests}
                    icon="📝"
                    color="#f59e0b"
                    onClick={() => setActiveTab('requests')}
                />
                <MetricCard
                    title="Events Near You"
                    value={stats.upcomingEvents}
                    icon="🎉"
                    color="#8b5cf6"
                    onClick={() => setActiveTab('events')}
                />
            </div>

            {/* Caseworker Card */}
            {caseworker && (
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👨‍💼</div>
                    <div>
                        <div style={{ fontWeight: 600 }}>{caseworker.full_name}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Your Caseworker • {caseworker.phone || 'No phone'}</div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div style={{ padding: '2rem', minHeight: '100vh' }}>
            {/* Nav Tabs */}
            <div style={{
                borderBottom: '1px solid #e5e7eb',
                marginBottom: '2rem',
                display: 'flex',
                gap: '0.5rem',
                justifyContent: 'center',
                backgroundColor: '#f9fafb',
            }}>
                <TabButton id="overview" label="Overview" icon="🏠" />
                <TabButton id="plan" label="My Plan" icon="📋" />
                <TabButton id="requests" label="Requests" icon="📝" />
                {/* <TabButton id="events" label="Events" icon="🎉" />  -- Future implement */}
            </div>

            {/* Content Content */}
            <div>
                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'plan' && <MyPlan />}
                {activeTab === 'requests' && <MyRequests />}
                {/* {activeTab === 'events' && <div>Events coming soon...</div>} */}
            </div>
        </div>
    );
};

export default RefugeeHome;
