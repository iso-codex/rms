import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section style={{
            position: 'relative',
            height: '600px',
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            overflow: 'hidden'
        }}>
            {/* Background Image Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1
            }}></div>

            {/* Background Image (Placeholder URL - using a reliable Unsplash ID for refugees/charity) */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'url("https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 0
            }}></div>

            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ maxWidth: '600px' }}>
                    <p style={{
                        color: 'var(--primary)',
                        fontWeight: 600,
                        marginBottom: '1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Give them a chance
                    </p>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: 'bold',
                        lineHeight: 1.2,
                        marginBottom: '2rem'
                    }}>
                        Give The Child The Gift Of Education.
                    </h1>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/donate" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                            Donate Now
                        </Link>
                        <Link to="/register" className="btn" style={{
                            backgroundColor: 'white',
                            color: 'var(--text-main)',
                            padding: '1rem 2rem'
                        }}>
                            Join Our Team
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
