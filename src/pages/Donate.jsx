import { useState } from 'react';

const Donate = () => {
    const [amount, setAmount] = useState('');
    const [customAmount, setCustomAmount] = useState('');

    const handleDonate = (e) => {
        e.preventDefault();
        const finalAmount = amount === 'custom' ? customAmount : amount;
        if (!finalAmount) {
            alert('Please select or enter an amount');
            return;
        }
        alert(`Thank you for your generous donation of $${finalAmount}! (Payment integration to be added)`);
    };

    return (
        <div className="container" style={{ padding: '4rem 0', maxWidth: '800px' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>Make a Difference</h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>
                    Your contribution helps provide food, shelter, and hope to refugees in need.
                </p>
            </div>

            <div className="card">
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Select Donation Amount</h3>

                <form onSubmit={handleDonate}>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                        {['25', '50', '100', '250', '500'].map((val) => (
                            <button
                                key={val}
                                type="button"
                                onClick={() => { setAmount(val); setCustomAmount(''); }}
                                className={`btn ${amount === val ? 'btn-primary' : 'btn-outline'}`}
                                style={{ padding: '1rem', fontSize: '1.25rem' }}
                            >
                                ${val}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => setAmount('custom')}
                            className={`btn ${amount === 'custom' ? 'btn-primary' : 'btn-outline'}`}
                            style={{ padding: '1rem', fontSize: '1.25rem' }}
                        >
                            Custom
                        </button>
                    </div>

                    {amount === 'custom' && (
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Enter Amount</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>$</span>
                                <input
                                    type="number"
                                    value={customAmount}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                    style={{ width: '100%', padding: '1rem 1rem 1rem 2.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1.25rem' }}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.25rem' }}>
                        Donate Now
                    </button>
                </form>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <span>🔒 Secure Payment</span>
                    <span>✓ Tax Deductible</span>
                </div>
            </div>
        </div>
    );
};

export default Donate;
