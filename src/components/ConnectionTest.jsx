import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const ConnectionTest = () => {
    const [status, setStatus] = useState('Checking...');
    const [details, setDetails] = useState('');

    useEffect(() => {
        const checkConnection = async () => {
            try {
                // Try a simple health check or public table query
                // We'll query profiles count (HEAD request) or just check url
                const { data, error, status } = await supabase.from('services').select('id', { count: 'exact', head: true });

                if (error) {
                    setStatus('Error');
                    setDetails(error.message || JSON.stringify(error));
                } else {
                    setStatus('Success');
                    setDetails(`Connected! Status: ${status}`);
                }
            } catch (err) {
                setStatus('Exception');
                setDetails(err.message);
            }
        };

        checkConnection();
    }, []);

    return (
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', margin: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Supabase Connection Test</h2>
            <div style={{ margin: '1rem 0', fontSize: '1.25rem' }}>
                Status: <span style={{ fontWeight: 'bold', color: status === 'Success' ? 'green' : 'red' }}>{status}</span>
            </div>
            <pre style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '4px', overflowX: 'auto' }}>
                {details}
            </pre>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                URL: {import.meta.env.VITE_SUPABASE_URL}
            </p>
        </div>
    );
};

export default ConnectionTest;
