import PropTypes from 'prop-types';

const LoadingSpinner = ({ size = 'md', color = '#f59e0b', text }) => {
    const sizeStyles = {
        sm: { width: '20px', height: '20px', borderWidth: '2px' },
        md: { width: '32px', height: '32px', borderWidth: '3px' },
        lg: { width: '48px', height: '48px', borderWidth: '4px' }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
        }}>
            <div style={{
                ...sizeStyles[size],
                border: `${sizeStyles[size].borderWidth} solid #e5e7eb`,
                borderTopColor: color,
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
            }} />
            {text && (
                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>{text}</span>
            )}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

LoadingSpinner.propTypes = {
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    color: PropTypes.string,
    text: PropTypes.string
};

export default LoadingSpinner;
