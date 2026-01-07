import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const Home = () => {
    // 1. Ambil Token dan Role dari penyimpanan browser
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // 2. LOGIKA PINTAR UNTUK TOMBOL:
    let destinationLink = "/register"; // Default kalau belum login

    if (token) {
        // Kalau sudah login, cek dia siapa?
        if (role === 'admin') {
            destinationLink = "/admin-dashboard"; // Admin masuk sini
        } else {
            destinationLink = "/dashboard"; // User biasa masuk sini
        }
    }

    return (
        <div className="app-container">
            <Navbar />

            <div className="main-content" style={{ textAlign: 'center', paddingTop: '8rem' }}>
                <h1 className="page-title" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', animation: 'slideUp 0.8s ease-out' }}>
                    Database Hardware <span style={{ color: 'var(--neon-blue)', textShadow: '0 0 20px var(--neon-blue)' }}>Paling Lengkap</span>
                </h1>

                <p style={{
                    fontSize: '1.2rem',
                    color: 'var(--text-muted)',
                    maxWidth: '700px',
                    margin: '0 auto 3rem',
                    lineHeight: '1.6',
                    animation: 'slideUp 0.8s ease-out 0.2s backwards'
                }}>
                    Bangun aplikasi Toko Komputer impianmu tanpa pusing memikirkan data.
                    Akses ribuan produk real-time melalui API yang cepat dan handal.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '5rem', animation: 'slideUp 0.8s ease-out 0.4s backwards' }}>
                    {/* 3. Terapkan variabel destinationLink di sini */}
                    <Link
                        to={destinationLink}
                        className="btn-neon"
                        style={{ padding: '15px 40px', fontSize: '1.1rem' }}
                    >
                        {token ? "Buka Dashboard" : "Dapatkan API Key"}
                    </Link>

                    <Link
                        to="/docs"
                        className="btn-neon secondary"
                        style={{ padding: '15px 40px', fontSize: '1.1rem' }}
                    >
                        Lihat Katalog
                    </Link>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '2rem',
                    maxWidth: '900px',
                    margin: '0 auto 6rem',
                    animation: 'fadeIn 1s ease-out 0.6s backwards'
                }}>
                    <div className="glass-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--neon-blue)', textShadow: '0 0 15px var(--neon-blue)' }}>200+</div>
                        <div style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Premium Products</div>
                    </div>
                    <div className="glass-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--neon-purple)', textShadow: '0 0 15px var(--neon-purple)' }}>50ms</div>
                        <div style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Ultra Low Latency</div>
                    </div>
                    <div className="glass-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--neon-green)', textShadow: '0 0 15px var(--neon-green)' }}>100%</div>
                        <div style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Free for Developers</div>
                    </div>
                </div>

                {/* Features Section */}
                <div style={{ marginTop: '4rem', paddingBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '3rem', color: 'var(--text-main)' }}>Mengapa Kami?</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <div className="glass-card">
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--neon-blue)' }}>Super Cepat</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Response time di bawah 50ms membuat aplikasi Anda terasa instan.</p>
                        </div>

                        <div className="glass-card">
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💎</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--neon-purple)' }}>Data Realistis</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Data produk nyata lengkap dengan gambar, deskripsi, dan harga terupdate.</p>
                        </div>

                        <div className="glass-card">
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--neon-green)' }}>Aman</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Dilengkapi dengan sistem API Key dan rate limiting untuk keamanan.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;