const Footer = () => {
    return (
        <footer style={{ backgroundColor: '#1f2937', color: 'white', padding: '4rem 0', marginTop: 'auto' }}>
            <div className="container">
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary)' }}>Adukt Social Services</h3>
                        <p style={{ color: '#9ca3af', lineHeight: 1.6 }}>
                            Empowering displaced communities with dignity, hope, and direct support.
                            Connecting those in need with those who can help.
                        </p>
                    </div>

                    <div>
                        <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li><a href="/about" style={{ color: '#d1d5db' }}>About Us</a></li>
                            <li><a href="/services" style={{ color: '#d1d5db' }}>Our Services</a></li>
                            <li><a href="/donate" style={{ color: '#d1d5db' }}>Donate</a></li>
                            <li><a href="/contact" style={{ color: '#d1d5db' }}>Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Contact</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#d1d5db' }}>
                            <li>info@refugeehelp.org</li>
                            <li>+1 (555) 123-4567</li>
                            <li>123 Hope Street, New York, NY</li>
                        </ul>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #374151', marginTop: '3rem', paddingTop: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                    © {new Date().getFullYear()} Adukt Social Services. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
