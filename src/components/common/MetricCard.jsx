import PropTypes from 'prop-types';

const MetricCard = ({
    title,
    value,
    subtitle,
    icon,
    trend,
    trendDirection = 'up',
    color = '#3b82f6',
    onClick
}) => {
    return (
        <div
            onClick={onClick}
            style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '1.5rem',
                minWidth: '200px',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
            onMouseOver={(e) => {
                if (onClick) {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                }
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>
                    {title}
                </div>
                {icon && (
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: `${color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem'
                    }}>
                        {icon}
                    </div>
                )}
            </div>

            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#111827' }}>
                {value}
            </div>

            {(subtitle || trend) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                    {trend && (
                        <span style={{
                            color: trendDirection === 'up' ? '#10b981' : trendDirection === 'down' ? '#ef4444' : '#6b7280',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.125rem'
                        }}>
                            {trendDirection === 'up' && '↑'}
                            {trendDirection === 'down' && '↓'}
                            {trend}
                        </span>
                    )}
                    {subtitle && (
                        <span style={{ color: '#9ca3af' }}>{subtitle}</span>
                    )}
                </div>
            )}
        </div>
    );
};

MetricCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    subtitle: PropTypes.string,
    icon: PropTypes.node,
    trend: PropTypes.string,
    trendDirection: PropTypes.oneOf(['up', 'down', 'neutral']),
    color: PropTypes.string,
    onClick: PropTypes.func
};

export default MetricCard;
