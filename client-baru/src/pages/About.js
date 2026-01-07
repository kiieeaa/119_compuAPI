import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="app-container">
            <Navbar />

            <div className="main-content">
                <div style={{ textAlign: 'center', marginBottom: '4rem', animation: 'slideUp 0.8s ease-out' }}>
                    <h1 className="page-title">Tentang Kami</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                        Platform penyedia data hardware Open API terbesar untuk developer.
                    </p>
                </div>

                <div className="glass-card" style={{ padding: '3rem', marginBottom: '3rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(var(--neon-blue), transparent)', opacity: 0.1, borderRadius: '50%' }}></div>
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '2.5rem' }}>💡</span> Cerita Kami
                        </h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}>
                            Membangun aplikasi toko online itu rumit jika harus memikirkan datanya dari nol.
                            <br /><br />
                            Kami menyediakan <strong style={{ color: 'var(--text-main)' }}>Dataset Real-World</strong> mulai dari Laptop, Processor, hingga Gaming Gear agar aplikasi buatanmu terasa lebih hidup, profesional, dan siap dipamerkan.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    <div className="glass-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--neon-blue)' }}>Mahasiswa</h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Tugas akhir jadi lebih mudah tanpa pusing input data manual satu per satu. Fokus pada coding logika aplikasi Anda.
                        </p>
                    </div>

                    <div className="glass-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--neon-purple)' }}>Startup</h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Butuh dummy data realistis untuk presentasi MVP ke investor? Kami punya ribuan item siap pakai.
                        </p>
                    </div>
                </div>

                <div style={{ textAlign: 'center', animation: 'fadeIn 1s ease-out 0.5s backwards' }}>
                    <Link
                        to="/register"
                        className="btn-neon"
                        style={{ padding: '16px 40px', fontSize: '1.2rem' }}
                    >
                        Mulai Sekarang
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default About;