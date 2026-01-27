import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Import images
import hero1 from '../assets/images/hero-1.png';
import hero2 from '../assets/images/hero-2.png';
import hero3 from '../assets/images/hero-3.png';

const Hero = () => {
    const images = [hero1, hero2, hero3];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [images.length]);

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

            {/* Slideshow Backgrounds */}
            {images.map((img, index) => (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${img})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: 0,
                        opacity: index === currentImageIndex ? 1 : 0,
                        transition: 'opacity 1s ease-in-out'
                    }}
                />
            ))}

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
                        Restoring Dignity, Rebuilding Lives.
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

            {/* Slide Indicators */}
            <div style={{
                position: 'absolute',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 2,
                display: 'flex',
                gap: '0.5rem'
            }}>
                {images.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: index === currentImageIndex ? 'var(--primary)' : 'rgba(255, 255, 255, 0.5)',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s'
                        }}
                    />
                ))}
            </div>
        </section>
    );
};

export default Hero;
