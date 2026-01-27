import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, signOut, profile } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Services', path: '/services' },
        { name: 'Donate', path: '/donate' },
    ];

    return (
        <nav className="navbar" style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: 0, zIndex: 50 }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
                {/* Logo */}
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>Adukt Social Services</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    {navLinks.map((link) => (
                        <Link key={link.name} to={link.path} style={{ fontWeight: 500, color: 'var(--text-main)' }} className="nav-link">
                            {link.name}
                        </Link>
                    ))}

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Link to="/dashboard" className="btn btn-outline">
                                Dashboard
                            </Link>
                            <button onClick={handleSignOut} className="btn" style={{ color: 'var(--text-muted)' }}>
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Link to="/login" style={{ fontWeight: 500 }}>Log In</Link>
                            <Link to="/register" className="btn btn-primary">
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="visible-mobile"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ padding: '0.5rem', display: 'none' }} // Hidden by default, shown via CSS media query
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {isOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '4rem',
                    left: 0,
                    right: 0,
                    backgroundColor: 'var(--surface)',
                    padding: '1rem',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            style={{ padding: '0.5rem', fontWeight: 500 }}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {user ? (
                        <>
                            <Link to="/dashboard" onClick={() => setIsOpen(false)} style={{ padding: '0.5rem', fontWeight: 500 }}>Dashboard</Link>
                            <button onClick={() => { handleSignOut(); setIsOpen(false); }} style={{ textAlign: 'left', padding: '0.5rem', fontWeight: 500 }}>Sign Out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setIsOpen(false)} style={{ padding: '0.5rem', fontWeight: 500 }}>Log In</Link>
                            <Link to="/register" onClick={() => setIsOpen(false)} className="btn btn-primary" style={{ textAlign: 'center' }}>Get Started</Link>
                        </>
                    )}
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .visible-mobile { display: block !important; }
        }
        .nav-link:hover { color: var(--primary) !important; }
      `}</style>
        </nav>
    );
};

export default Navbar;
