import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        const initAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                setSession(session);
                setUser(session?.user ?? null);
                if (session?.user) {
                    await fetchProfile(session.user.id);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                setLoading(false);
            }
        };

        initAuth();

        // Listen for changes on auth state (sing in, sign out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
            } else {
                setProfile(data);
            }
        } catch (error) {
            console.error('Error in fetchProfile:', error);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        session,
        user,
        profile,
        loading,
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signUp: (data) => supabase.auth.signUp(data),
        signOut: () => supabase.auth.signOut(),
    };

    // Force timeout for loading state
    useEffect(() => {
        const timer = setTimeout(() => {
            if (loading) {
                console.warn('Auth loading timed out');
                setLoading(false); // Force loading to false after 5s
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [loading]);

    const handleReset = async () => {
        localStorage.clear();
        await supabase.auth.signOut();
        window.location.reload();
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    gap: '1rem',
                    fontFamily: 'system-ui, sans-serif'
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        border: '3px solid #e5e7eb',
                        borderTopColor: '#f59e0b',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <div>Loading...</div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

                    {/* Fallback reset button that appears after 2s */}
                    <button
                        onClick={handleReset}
                        style={{
                            marginTop: '2rem',
                            padding: '0.5rem 1rem',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            opacity: 0,
                            animation: 'fadeIn 0.5s ease-in forwards',
                            animationDelay: '3s'
                        }}
                    >
                        Stuck? Reset Session
                    </button>
                    <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => {
    return useContext(AuthContext);
};
