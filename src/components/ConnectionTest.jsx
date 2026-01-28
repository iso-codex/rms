import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const ConnectionTest = () => {
    const [status, setStatus] = useState('Checking...');
    const [details, setDetails] = useState('');

    useEffect(() => {
        const checkConnection = async () => {
            try {
                // 1. Check Auth Connection (usually fast)
                const { error: authError } = await supabase.auth.getSession();
                if (authError) throw authError;

                // 2. Check DB Connection with a timeout
                // Using a simple query that should return quick results or error (but not hang)
                // We use an AbortController to prevent hanging requests
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

                try {
                    const { count, error, status } = await supabase
                        .from('services')
                        .select('*', { count: 'exact', head: true })
                        .abortSignal(controller.signal);

                    clearTimeout(timeoutId);

                    if (error) {
                        // If RLS denies, that's still a "Connection", just not "Permission"
                        // But usually we want to know if we can reach DB
                        if (error.code === 'PGRST301' || error.status === 401) {
                            setStatus('Connected (Restricted)');
                            setDetails('Database reachable but access restricted (RLS).');
                        } else {
                            setStatus('Error');
                            setDetails(error.message);
                        }
                    } else {
                        setStatus('Success');
                        setDetails(`Connected! DB Status: ${status}, Service Count: ${count}`);
                    }
                } catch (fetchError) {
                    clearTimeout(timeoutId);
                    if (fetchError.name === 'AbortError') {
                        setStatus('Timeout');
                        setDetails('Connection timed out after 5 seconds.');
                    } else {
                        throw fetchError;
                    }
                }
            } catch (err) {
                setStatus('Error');
                setDetails(err.message || 'Unknown error occurred');
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
