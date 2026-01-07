import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const [apiKey, setApiKey] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copyStatus, setCopyStatus] = useState('Salin Key');
    const navigate = useNavigate();

    const getToken = () => localStorage.getItem('token');

    useEffect(() => {
        fetchKey();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchKey = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/keys/my-key', {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            if (response.data.apiKey) setApiKey(response.data.apiKey);
        } catch (error) {
            if (error.response?.status === 403) navigate('/login');
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/keys/generate', {}, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setApiKey(response.data.apiKey);
        } catch (error) {
            alert("Gagal generate key");
        }
        setLoading(false);
    };

    const handleRegenerate = async () => {
        const confirmReset = window.confirm("⚠️ PERHATIAN:\nApakah Anda yakin ingin mereset API Key?\n\nKey lama akan hangus!");

        if (!confirmReset) return;

        setLoading(true);
        try {
            const response = await axios.put('http://localhost:5000/api/keys/regenerate', {}, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setApiKey(response.data.apiKey);
            alert("✅ Sukses! API Key baru telah dibuat.");
        } catch (error) {
            alert("Gagal mereset key: " + (error.response?.data?.msg || "Server Error"));
        }
        setLoading(false);
    };

    const handleCopy = () => {
        if (!apiKey) return;
        navigator.clipboard.writeText(apiKey);
        setCopyStatus('Disalin! ✅');
        setTimeout(() => setCopyStatus('Salin Key'), 2000);
    };

    return (
        <div className="app-container">
            <Navbar />

            <div className="main-content">
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '4rem', animation: 'slideUp 0.8s ease-out' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>🚀</div>
                    <h1 className="page-title">Developer Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        Kelola akses API dan pantau penggunaan aplikasi Anda
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>

                    {/* API Key Section */}
                    <div className="glass-card" style={{ gridColumn: 'span 2', animation: 'fadeIn 1s ease-out 0.2s backwards' }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <span style={{ color: 'var(--neon-blue)' }}>🔐</span> Access Key
                        </h2>

                        {apiKey ? (
                            <div>
                                <div style={{
                                    background: 'rgba(0, 0, 0, 0.4)',
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--neon-blue)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: '1rem',
                                    boxShadow: '0 0 15px rgba(0, 243, 255, 0.1)'
                                }}>
                                    <code style={{ color: 'var(--neon-blue)', fontSize: '1.1rem', wordBreak: 'break-all' }}>
                                        {apiKey}
                                    </code>

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button onClick={handleCopy} className="btn-neon">
                                            {copyStatus}
                                        </button>
                                        <button onClick={handleRegenerate} className="btn-neon secondary" style={{ borderColor: '#ff0055', color: '#ff0055' }} disabled={loading}>
                                            {loading ? '...' : 'Reset'}
                                        </button>
                                    </div>
                                </div>
                                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--neon-green)' }}>
                                    <span style={{ display: 'inline-block', width: '10px', height: '10px', background: 'var(--neon-green)', borderRadius: '50%', boxShadow: '0 0 10px var(--neon-green)' }}></span>
                                    Status: Active
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎁</div>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Anda belum memiliki API Key.</p>
                                <button onClick={handleGenerate} className="btn-neon" disabled={loading}>
                                    {loading ? 'Memproses...' : 'Generate API Key'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Stats & Docs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="glass-card" style={{ animation: 'fadeIn 1s ease-out 0.4s backwards' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>📊 Statistik</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Paket</span>
                                <span style={{ color: 'var(--neon-purple)', fontWeight: 'bold' }}>FREE TIER</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Limit</span>
                                <span style={{ color: 'var(--neon-blue)', fontWeight: 'bold' }}>Unlimited ∞</span>
                            </div>
                        </div>

                        <div className="glass-card" style={{ animation: 'fadeIn 1s ease-out 0.6s backwards', background: 'linear-gradient(135deg, rgba(20,25,40,0.8), rgba(0, 243, 255, 0.1))' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📚 Katalog</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                Ingin melihat data apa saja yang di dapat ?.
                            </p>
                            <a href="/docs" className="btn-neon" style={{ width: '100%', textAlign: 'center' }}>
                                Buka Katalog
                            </a>
                        </div>
                    </div>

                    {/* Code Example */}
                    <div className="glass-card" style={{ gridColumn: '1 / -1', animation: 'fadeIn 1s ease-out 0.8s backwards' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>💻 Contoh Integrasi</h3>
                        <pre style={{ background: '#000', padding: '1.5rem', borderRadius: '12px', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <code style={{ color: 'var(--neon-green)', fontFamily: 'monospace' }}>
                                {`// Javascript Fetch Example
const getProducts = async () => {
  const res = await fetch('http://localhost:5000/api/v1/products', {
    headers: {
      'x-api-key': '${apiKey || 'YOUR_API_KEY'}'
    }
  });
  const data = await res.json();
  console.log(data);
};`}
                            </code>
                        </pre>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;