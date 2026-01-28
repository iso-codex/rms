import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import homeIntroImg from '../assets/images/home-intro.png';

const Home = () => {
    const { user, profile } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && profile) {
            switch (profile.role) {
                case 'admin':
                    navigate('/admin', { replace: true });
                    break;
                case 'caseworker':
                    navigate('/caseworker', { replace: true });
                    break;
                case 'ngo':
                    navigate('/ngo', { replace: true });
                    break;
                case 'refugee':
                    navigate('/refugee', { replace: true });
                    break;
                default:
                    navigate('/dashboard', { replace: true });
            }
        }
    }, [user, profile, navigate]);

    // ... stats and featuredCauses ...
    const stats = [
        { label: 'Total Campaigns', value: '0' },
        { label: 'Total Fund Raised', value: '0M' },
        { label: 'Happy Volunteers', value: '0' },
        { label: 'Years of Fund Raising', value: '0' },
    ];

    const featuredCauses = [
        {
            id: 1,
            title: 'The Thirsty are Waiting For Your Help.',
            description: 'Clean water projects for remote villages.',
            raised: 35000,
            goal: 52000,
            image: 'https://images.unsplash.com/photo-1541976544351-e4edbc077f98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 2,
            title: 'Changing lives one meal at a time.',
            description: 'Providing nutritious meals to displaced families.',
            raised: 12000,
            goal: 25000,
            image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 3,
            title: "Let's be one community in this cause.",
            description: 'Building shelters and safe spaces for children.',
            raised: 28600,
            goal: 30000,
            image: 'https://images.unsplash.com/photo-1593113598340-068dde1302a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        },
    ];

    return (
        <>
            <Hero />

            {/* Intro Section */}
            <section style={{ padding: '4rem 0' }}>
                <div className="container grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <img
                            src={homeIntroImg}
                            alt="Hope"
                            style={{ borderRadius: 'var(--radius-lg)', width: '100%', boxShadow: 'var(--shadow-lg)' }}
                        />
                    </div>
                    <div>
                        <span style={{ color: 'var(--primary)', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Welcome To RefugeeHelp</span>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1.2, marginBottom: '1.5rem' }}>
                            Restoring Hope, One Life at a Time.
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                            We are dedicated to providing essential support to those who have lost everything.
                            Your contribution can help rebuild lives, provide education, and ensure safety for thousands of refugees.
                        </p>
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                            <Link to="/about" className="btn btn-primary">Discover More</Link>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ backgroundColor: '#fee2e2', padding: '0.5rem', borderRadius: '50%', color: 'var(--primary)' }}>📞</span>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Call Us</div>
                                    <div style={{ fontWeight: 'bold' }}>+1 (234) 555-0102</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section style={{ padding: '2rem 0', backgroundColor: '#f3f4f6' }}>
                <div className="container">
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', textAlign: 'center' }}>
                        {stats.map((stat, index) => (
                            <div key={index}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{stat.value}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Services Section */}
            <section style={{ padding: '5rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>What We Do</span>
                        <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Our Services for Refugees</h2>
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                        {[
                            {
                                id: 1,
                                title: 'Emergency Food Aid',
                                description: 'Distribution of essential food packages to families in crisis zones.',
                                image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                            },
                            {
                                id: 2,
                                title: 'Medical Assistance',
                                description: 'Mobile clinics and essential medicine for those with limited access to healthcare.',
                                image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                            },
                            {
                                id: 3,
                                title: 'Legal Aid & Protection',
                                description: 'Support with asylum applications, documentation, and rights advocacy.',
                                image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                            },
                        ].map((service) => (
                            <ServiceCard key={service.id} {...service} actionLabel="Register" actionTo="/register" />
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                        <Link to="/services" className="btn btn-outline">View All Services</Link>
                    </div>
                </div>
            </section>

            {/* Featured Causes */}
            <section style={{ padding: '5rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Featured Cause</span>
                        <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Find the popular cause</h2>
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                        {featuredCauses.map((cause) => (
                            <ServiceCard key={cause.id} {...cause} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Volunteer/Community Section */}
            <section style={{ padding: '5rem 0', backgroundColor: 'var(--surface)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '3rem' }}>Meet Our Volunteer Behind the Success Story</h2>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 1rem', backgroundColor: '#e5e7eb' }}>
                                    <img src={`https://i.pravatar.cc/300?img=${i + 10}`} alt="Volunteer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <h4 style={{ fontWeight: 'bold' }}>Volunteer {i}</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Role</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
