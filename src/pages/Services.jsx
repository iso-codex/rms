import ServiceCard from "../components/ServiceCard";

const Services = () => {
    const services = [
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
        {
            id: 4,
            title: 'Education Programs',
            description: 'Schooling and vocational training for children and adults.',
            image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 5,
            title: 'Shelter & Housing',
            description: 'Emergency tents and temporary housing solutions.',
            image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 6,
            title: 'Psychosocial Support',
            description: 'Counseling and mental health support for trauma survivors.',
            image: 'https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        },
    ];

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Our Services</h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>
                    Comprehensive support for every stage of the refugee journey.
                </p>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {services.map((service) => (
                    <ServiceCard key={service.id} {...service} actionLabel="Register" actionTo="/register" />
                ))}
            </div>
        </div>
    );
};

export default Services;
