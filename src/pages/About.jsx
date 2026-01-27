import aboutImpactImg from '../assets/images/about-impact.png';

const About = () => {
    return (
        <>
            {/* Hero Section */}
            <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '6rem 0', textAlign: 'center' }}>
                <div className="container">
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Our Story & Mission</h1>
                    <p style={{ fontSize: '1.5rem', maxWidth: '800px', margin: '0 auto', opacity: 0.9 }}>
                        Rebuilding lives, restoring hope, and creating a world where everyone belongs.
                    </p>
                </div>
            </div>

            <div className="container" style={{ padding: '5rem 0' }}>

                {/* Intro */}
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', marginBottom: '5rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Who We Are</h2>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                        RefugeeHelp is an international non-profit organization dedicated to serving refugees and forcibly displaced communities around the world.
                        Founded in 2015, we have grown from a small group of volunteers to a global network of humanitarian workers,
                        united by a single belief: that every person deserves dignity, safety, and a chance to rebuild their life.
                    </p>
                </div>

                {/* Values Grid */}
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>
                    <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👁️</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary)' }}>Our Vision</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                            A world where every person forced to flee has the opportunity to build a better future.
                            We envision communities where refugees are welcomed, supported, and empowered to thrive.
                        </p>
                    </div>
                    <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary)' }}>Our Mission</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                            To save lives, protect rights, and build a better future for refugees, forcibly displaced communities, and stateless people
                            through direct aid, advocacy, and sustainable development programs.
                        </p>
                    </div>
                    <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary)' }}>Our Values</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                            Integrity, Compassion, Commitment, and Respect. We believe in the dignity of every individual and their right
                            to a safe, hopeful, and self-determined life.
                        </p>
                    </div>
                </div>

                {/* Impact Section */}
                <div style={{ backgroundColor: '#f9fafb', borderRadius: 'var(--radius-lg)', padding: '4rem', marginBottom: '5rem' }}>
                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                        <div>
                            <img
                                src={aboutImpactImg}
                                alt="Impact"
                                style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}
                            />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Making a Tangible Impact</h2>
                            <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.8 }}>
                                Since our inception, we have helped over 500,000 individuals across 15 countries.
                                From delivering emergency food parcels in conflict zones to providing legal aid for asylum seekers
                                and scholarships for refugee children, our work touches every aspect of the displacement cycle.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', fontSize: '1.125rem' }}>
                                    <span style={{ color: 'var(--primary)', marginRight: '1rem', fontWeight: 'bold' }}>✓</span> 1.2M+ Meals Provided
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', fontSize: '1.125rem' }}>
                                    <span style={{ color: 'var(--primary)', marginRight: '1rem', fontWeight: 'bold' }}>✓</span> 50k+ Medical Consultations
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', fontSize: '1.125rem' }}>
                                    <span style={{ color: 'var(--primary)', marginRight: '1rem', fontWeight: 'bold' }}>✓</span> 20 New Schools Built
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '3rem' }}>Our Leadership Team</h2>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                        {[
                            { name: 'Sarah Johnson', role: 'Executive Director', img: 'https://i.pravatar.cc/300?img=5' },
                            { name: 'David Chen', role: 'Head of Operations', img: 'https://i.pravatar.cc/300?img=11' },
                            { name: 'Amara Okafor', role: 'Program Director', img: 'https://i.pravatar.cc/300?img=24' },
                            { name: 'Michael Smith', role: 'Chief Financial Officer', img: 'https://i.pravatar.cc/300?img=33' }
                        ].map((member, index) => (
                            <div key={index} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                                <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 1.5rem' }}>
                                    <img src={member.img} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{member.name}</h3>
                                <p style={{ color: 'var(--primary)', fontWeight: 500 }}>{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </>
    );
};

export default About;
