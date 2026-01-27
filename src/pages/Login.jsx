import AuthForm from '../components/AuthForm';
import { Link } from 'react-router-dom';
import ConnectionTest from '../components/ConnectionTest';

const Login = () => {
    return (
        <div className="container" style={{ padding: '4rem 0', minHeight: 'calc(100vh - 4rem - 300px)' /* rough calc for footer/nav */, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ maxWidth: '28rem', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Login to access your dashboard</p>
                </div>

                <AuthForm type="login" />

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    Don&apos;t have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>Sign up</Link>
                </div>

                <ConnectionTest />
            </div>
        </div>
    );
};

export default Login;
