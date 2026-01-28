import PropTypes from 'prop-types';

const alertStyles = {
    info: { bg: '#eff6ff', border: '#3b82f6', icon: 'ℹ️', color: '#1d4ed8' },
    success: { bg: '#f0fdf4', border: '#22c55e', icon: '✓', color: '#15803d' },
    warning: { bg: '#fffbeb', border: '#f59e0b', icon: '⚠', color: '#b45309' },
    error: { bg: '#fef2f2', border: '#ef4444', icon: '✕', color: '#b91c1c' }
};

const AlertBanner = ({
    type = 'info',
    title,
    message,
    onDismiss,
    action
}) => {
    const style = alertStyles[type];

    return (
        <div style={{
            backgroundColor: style.bg,
            borderLeft: `4px solid ${style.border}`,
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
        }}>
            <span style={{
                fontSize: '1.125rem',
                lineHeight: 1
            }}>
                {style.icon}
            </span>

            <div style={{ flex: 1 }}>
                {title && (
                    <div style={{
                        fontWeight: 600,
                        color: style.color,
                        marginBottom: message ? '0.25rem' : 0
                    }}>
                        {title}
                    </div>
                )}
                {message && (
                    <div style={{
                        color: '#4b5563',
                        fontSize: '0.875rem',
                        lineHeight: 1.5
                    }}>
                        {message}
                    </div>
                )}
                {action && (
                    <div style={{ marginTop: '0.75rem' }}>
                        {action}
                    </div>
                )}
            </div>

            {onDismiss && (
                <button
                    onClick={onDismiss}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9ca3af',
                        fontSize: '1rem',
                        padding: '0.25rem',
                        lineHeight: 1
                    }}
                >
                    ×
                </button>
            )}
        </div>
    );
};

AlertBanner.propTypes = {
    type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
    title: PropTypes.string,
    message: PropTypes.string,
    onDismiss: PropTypes.func,
    action: PropTypes.node
};

export default AlertBanner;
