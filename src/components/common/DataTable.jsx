import PropTypes from 'prop-types';

const DataTable = ({
    columns,
    data,
    loading = false,
    emptyMessage = 'No data found',
    onRowClick,
    rowKey = 'id'
}) => {
    if (loading) {
        return (
            <div style={{
                padding: '3rem',
                textAlign: 'center',
                color: '#6b7280',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
            }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    border: '3px solid #e5e7eb',
                    borderTopColor: '#f59e0b',
                    borderRadius: '50%',
                    margin: '0 auto 1rem',
                    animation: 'spin 1s linear infinite'
                }} />
                Loading...
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
        }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.875rem',
                    textAlign: 'left'
                }}>
                    <thead style={{
                        backgroundColor: '#f9fafb',
                        borderBottom: '1px solid #e5e7eb'
                    }}>
                        <tr>
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    style={{
                                        padding: '0.875rem 1rem',
                                        color: '#6b7280',
                                        textTransform: 'uppercase',
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        letterSpacing: '0.05em',
                                        textAlign: col.align || 'left',
                                        width: col.width
                                    }}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    style={{
                                        padding: '2rem',
                                        textAlign: 'center',
                                        color: '#9ca3af'
                                    }}
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr
                                    key={row[rowKey]}
                                    onClick={() => onRowClick && onRowClick(row)}
                                    style={{
                                        borderBottom: '1px solid #f3f4f6',
                                        cursor: onRowClick ? 'pointer' : 'default',
                                        transition: 'background-color 0.15s'
                                    }}
                                    onMouseOver={(e) => {
                                        if (onRowClick) e.currentTarget.style.backgroundColor = '#f9fafb';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    {columns.map((col, idx) => (
                                        <td
                                            key={idx}
                                            style={{
                                                padding: '0.875rem 1rem',
                                                fontWeight: col.bold ? 500 : 400,
                                                color: col.muted ? '#6b7280' : '#111827',
                                                textAlign: col.align || 'left'
                                            }}
                                        >
                                            {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

DataTable.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        header: PropTypes.string.isRequired,
        accessor: PropTypes.string.isRequired,
        render: PropTypes.func,
        width: PropTypes.string,
        align: PropTypes.oneOf(['left', 'center', 'right']),
        bold: PropTypes.bool,
        muted: PropTypes.bool
    })).isRequired,
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    emptyMessage: PropTypes.string,
    onRowClick: PropTypes.func,
    rowKey: PropTypes.string
};

export default DataTable;
