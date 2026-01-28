import { useEffect } from 'react';
import PropTypes from 'prop-types';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    footer
}) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeStyles = {
        sm: { maxWidth: '400px' },
        md: { maxWidth: '560px' },
        lg: { maxWidth: '720px' },
        xl: { maxWidth: '900px' },
        full: { maxWidth: '95vw', width: '100%' }
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem'
            }}
            onClick={onClose}
        >
            {/* Backdrop */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)'
            }} />

            {/* Modal Content */}
            <div
                style={{
                    position: 'relative',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    width: '100%',
                    ...sizeStyles[size],
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'modalIn 0.2s ease-out'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <style>{`
                    @keyframes modalIn {
                        from {
                            opacity: 0;
                            transform: scale(0.95) translateY(-10px);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1) translateY(0);
                        }
                    }
                `}</style>

                {/* Header */}
                {title && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1.25rem 1.5rem',
                        borderBottom: '1px solid #e5e7eb'
                    }}>
                        <h3 style={{
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            margin: 0,
                            color: '#111827'
                        }}>
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: 'transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem',
                                color: '#6b7280',
                                transition: 'all 0.15s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#f3f4f6';
                                e.currentTarget.style.color = '#111827';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#6b7280';
                            }}
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Body */}
                <div style={{
                    padding: '1.5rem',
                    overflowY: 'auto',
                    flex: 1
                }}>
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '0.75rem',
                        padding: '1rem 1.5rem',
                        borderTop: '1px solid #e5e7eb',
                        backgroundColor: '#f9fafb'
                    }}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    children: PropTypes.node,
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
    footer: PropTypes.node
};

export default Modal;
