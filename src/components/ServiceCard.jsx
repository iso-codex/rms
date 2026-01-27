import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ServiceCard = ({ title, description, raised, goal, image, actionLabel = 'Donate Now', actionTo = '/donate' }) => {
    const progress = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '200px', overflow: 'hidden' }}>
                <img
                    src={image}
                    alt={title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                />
            </div>

            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1 }}>{description}</p>

                {goal > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            <span style={{ fontWeight: 600 }}>Raised: ${raised}</span>
                            <span style={{ color: 'var(--text-muted)' }}>Goal: ${goal}</span>
                        </div>
                        <div style={{ height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%',
                                width: `${progress}%`,
                                backgroundColor: 'var(--secondary)',
                                borderRadius: '4px'
                            }}></div>
                        </div>
                    </div>
                )}

                <Link to={actionTo} className="btn btn-outline" style={{ width: '100%' }}>
                    {actionLabel}
                </Link>
            </div>
        </div>
    );
};

ServiceCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    raised: PropTypes.number,
    goal: PropTypes.number,
    image: PropTypes.string.isRequired,
    actionLabel: PropTypes.string,
    actionTo: PropTypes.string,
};

export default ServiceCard;
