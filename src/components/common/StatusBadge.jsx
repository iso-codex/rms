import PropTypes from 'prop-types';

const statusStyles = {
    // General statuses
    active: { bg: '#dcfce7', color: '#15803d' },
    completed: { bg: '#dcfce7', color: '#15803d' },
    approved: { bg: '#dcfce7', color: '#15803d' },
    pending: { bg: '#fef3c7', color: '#92400e' },
    in_progress: { bg: '#dbeafe', color: '#1d4ed8' },
    draft: { bg: '#f3f4f6', color: '#374151' },
    on_hold: { bg: '#fef3c7', color: '#92400e' },
    under_review: { bg: '#e0e7ff', color: '#3730a3' },
    overdue: { bg: '#fee2e2', color: '#991b1b' },
    rejected: { bg: '#fee2e2', color: '#991b1b' },
    cancelled: { bg: '#f3f4f6', color: '#6b7280' },
    closed: { bg: '#f3f4f6', color: '#6b7280' },

    // Goal statuses
    not_started: { bg: '#f3f4f6', color: '#6b7280' },
    blocked: { bg: '#fee2e2', color: '#991b1b' },
    deferred: { bg: '#fef3c7', color: '#92400e' },

    // Risk levels
    low: { bg: '#dcfce7', color: '#15803d' },
    medium: { bg: '#fef3c7', color: '#92400e' },
    high: { bg: '#fed7aa', color: '#c2410c' },
    critical: { bg: '#fee2e2', color: '#991b1b' },
    urgent: { bg: '#fee2e2', color: '#991b1b' },

    // Transport/Referral statuses
    sent: { bg: '#dbeafe', color: '#1d4ed8' },
    accepted: { bg: '#dcfce7', color: '#15803d' },
    declined: { bg: '#fee2e2', color: '#991b1b' },
    scheduled: { bg: '#e0e7ff', color: '#3730a3' },
    no_show: { bg: '#fee2e2', color: '#991b1b' },

    // Default
    default: { bg: '#f3f4f6', color: '#374151' }
};

const formatLabel = (status) => {
    if (!status) return 'Unknown';
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const StatusBadge = ({ status, size = 'sm' }) => {
    const style = statusStyles[status] || statusStyles.default;
    const sizeStyles = {
        xs: { padding: '0.125rem 0.5rem', fontSize: '0.625rem' },
        sm: { padding: '0.25rem 0.75rem', fontSize: '0.75rem' },
        md: { padding: '0.375rem 1rem', fontSize: '0.875rem' }
    };

    return (
        <span style={{
            backgroundColor: style.bg,
            color: style.color,
            ...sizeStyles[size],
            borderRadius: '9999px',
            fontWeight: 600,
            display: 'inline-block',
            textTransform: 'capitalize',
            whiteSpace: 'nowrap'
        }}>
            {formatLabel(status)}
        </span>
    );
};

StatusBadge.propTypes = {
    status: PropTypes.string,
    size: PropTypes.oneOf(['xs', 'sm', 'md'])
};

export default StatusBadge;
