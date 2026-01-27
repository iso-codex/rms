import AuthForm from '../components/AuthForm';
import { Link } from 'react-router-dom';

const Register = () => {
    return (
        <div className="container" style={{ padding: '4rem 0', minHeight: 'calc(100vh - 4rem - 300px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ maxWidth: '32rem', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Create an Account</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Join us to make a difference</p>
                </div>

                <div style={{
                    marginBottom: '2rem',
                    padding: '1.5rem',
                    border: '1px solid #dbeafe',
                    backgroundColor: '#eff6ff',
                    borderRadius: 'var(--radius)',
                    textAlign: 'center'
                }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e40af' }}>Are you a Refugee?</h3>
                    <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#1e3a8a' }}>
                        We have a dedicated application process to better assist you.
                    </p>
                    <Link to="/apply-refugee" className="btn btn-primary" style={{ width: '100%', display: 'inline-block', backgroundColor: '#2563eb' }}>
                        Apply for Support
                    </Link>
                </div>

                <div style={{ position: 'relative', margin: '2rem 0', textAlign: 'center' }}>
                    <span style={{ backgroundColor: '#fff', padding: '0 1rem', color: 'var(--text-muted)', position: 'relative', zIndex: 1, fontSize: '0.75rem', fontWeight: 600 }}>OR REGISTER AS STAFF/DONOR</span>
                    <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', backgroundColor: 'var(--border)', zIndex: 0 }}></div>
                </div>

                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>Standard Registration</h3>
                <AuthForm type="register" />

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
