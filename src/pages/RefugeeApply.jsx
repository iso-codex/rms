import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

const RefugeeApply = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        gender: 'Other',
        dob: '',
        nationality: '',
        idDocument: null, // Placeholder for file upload
        services: [],
    });

    const availableServices = [
        'Food Aid', 'Medical Assistance', 'Legal Aid', 'Shelter', 'Education', 'Psychosocial Support'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'services') {
            const currentServices = formData.services;
            if (checked) {
                setFormData({ ...formData, services: [...currentServices, value] });
            } else {
                setFormData({ ...formData, services: currentServices.filter(s => s !== value) });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Sign Up the user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        role: 'refugee',
                        gender: formData.gender,
                        nationality: formData.nationality,
                        date_of_birth: formData.dob,
                        requested_services: formData.services,
                        // In a real app, handle file upload to Storage bucket here and save URL
                    },
                },
            });

            if (authError) throw authError;

            // 2. Additional data is handled by Trigger usually, or we can update profile if RLS allows (which we set up)
            // Since we passed metadata, if we have a trigger it handles it. 
            // If not, we might need to manually insert into profiles if they aren't auto-created.
            // Our existing setup likely relies on the client creating the profile or a trigger.
            // Ideally, Supabase Auth hook is safest, but per our previous plan we might be relying on client-side insert.
            // Let's do a manual profile update just in case to ensure extra fields are saved if using public.profiles directly.

            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    gender: formData.gender,
                    date_of_birth: formData.dob,
                    nationality: formData.nationality,
                    requested_services: formData.services,
                    // identification_document: uploadedFileUrl
                })
                .eq('id', authData.user.id);

            if (profileError) {
                console.warn("Profile update warning:", profileError);
                // Don't block registration on this, but log it.
            }

            alert('Application submitted successfully! Please check your email for confirmation or login.');
            navigate('/dashboard');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 0', maxWidth: '800px' }}>
            <div className="card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Apply for Support</h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Please fill out this form to register as a refugee and request assistance.
                    </p>
                </div>

                {error && (
                    <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>

                    {/* Personal Information */}
                    <section>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary)' }}>Personal Information</h3>
                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Name</label>
                                <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Gender</label>
                                <select name="gender" required value={formData.gender} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Date of Birth</label>
                                <input type="date" name="dob" required value={formData.dob} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nationality</label>
                                <input type="text" name="nationality" required value={formData.nationality} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                            </div>
                        </div>
                    </section>

                    {/* Account Details */}
                    <section>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary)' }}>Account Details</h3>
                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
                                <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
                                <input type="password" name="password" required value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                            </div>
                        </div>
                    </section>

                    {/* Documents & Services */}
                    <section>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary)' }}>Documents & Needs</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Upload ID Document (Optional for now)</label>
                            <input type="file" disabled title="File upload requires storage setup" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px dashed var(--border)', backgroundColor: '#f9fafb' }} />
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>* Support for file upload will be enabled soon.</p>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Service Help Needed</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
                                {availableServices.map(service => (
                                    <label key={service} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                                        <input
                                            type="checkbox"
                                            name="services"
                                            value={service}
                                            checked={formData.services.includes(service)}
                                            onChange={handleChange}
                                        />
                                        {service}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </section>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '1rem' }} disabled={loading}>
                            {loading ? 'Submitting Application...' : 'Submit Application'}
                        </button>
                        <Link to="/register" className="btn btn-outline" style={{ padding: '1rem' }}>Cancel</Link>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default RefugeeApply;
