import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Catalog = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const token = localStorage.getItem('token');

    const categories = [
        'All', 'Laptop', 'Processor', 'Graphic Card', 'Motherboard',
        'RAM', 'SSD/Storage', 'Casing PC', 'Monitor', 'Gaming Gear',
        'Power Supply', 'Cooling'
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/catalog-preview');
                setProducts(response.data.data);
            } catch (error) {
                console.error("Error fetching catalog", error);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

    const filteredProducts = products.filter(item => {
        const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const displayProducts = token ? filteredProducts : filteredProducts.slice(0, 8);

    const handleSelectCategory = (cat) => {
        setSelectedCategory(cat);
        setIsDropdownOpen(false);
    };

    return (
        <div className="app-container">
            <Navbar />

            <div className="main-content">
                <div style={{ textAlign: 'center', marginBottom: '3rem', animation: 'slideUp 0.8s ease-out' }}>
                    <div style={{
                        display: 'inline-block', padding: '5px 15px', borderRadius: '20px',
                        background: 'rgba(0, 243, 255, 0.1)', color: 'var(--neon-blue)',
                        border: '1px solid var(--neon-blue)', fontSize: '0.8rem', fontWeight: 'bold',
                        marginBottom: '1rem', letterSpacing: '1px'
                    }}>
                        LIVE DATABASE
                    </div>
                    <h1 className="page-title" style={{ fontSize: '3rem' }}>
                        Katalog <span style={{ color: 'var(--neon-purple)', textShadow: '0 0 15px var(--neon-purple)' }}>Hardware</span>
                    </h1>

                    {/* Search Bar */}
                    <div style={{ maxWidth: '600px', margin: '2rem auto', position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Cari produk (RTX 4090, ASUS ROG)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%', padding: '16px 24px', paddingLeft: '50px',
                                background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
                                border: '1px solid var(--glass-border)', borderRadius: '50px',
                                fontSize: '1.1rem', color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                            }}
                        />
                        <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem' }}>🔍</span>
                    </div>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem', position: 'relative', zIndex: 10 }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="glass-card"
                            style={{
                                width: '100%', padding: '15px 20px', display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', cursor: 'pointer', borderRadius: '12px'
                            }}
                        >
                            <span style={{ color: 'var(--text-muted)' }}>Kategori: <strong style={{ color: 'var(--neon-blue)', marginLeft: '5px' }}>{selectedCategory === 'All' ? 'Semua' : selectedCategory}</strong></span>
                            <span>▼</span>
                        </button>

                        {isDropdownOpen && (
                            <div className="glass-card" style={{
                                position: 'absolute', top: '110%', left: 0, width: '100%', padding: '10px 0',
                                maxHeight: '300px', overflowY: 'auto', borderRadius: '12px'
                            }}>
                                {categories.map(cat => (
                                    <div
                                        key={cat}
                                        onClick={() => handleSelectCategory(cat)}
                                        style={{
                                            padding: '10px 20px', cursor: 'pointer', transition: '0.2s',
                                            color: selectedCategory === cat ? 'var(--neon-blue)' : 'var(--text-main)',
                                            background: selectedCategory === cat ? 'rgba(0, 243, 255, 0.1)' : 'transparent'
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                        onMouseLeave={(e) => e.target.style.background = selectedCategory === cat ? 'rgba(0, 243, 255, 0.1)' : 'transparent'}
                                    >
                                        {cat === 'All' ? 'Semua Produk' : cat}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading Catalog...</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                        {displayProducts.map(item => (
                            <div key={item.id} className="glass-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ height: '200px', background: '#000', position: 'relative', overflow: 'hidden' }}>
                                    <img
                                        src={item.image || 'https://placehold.co/400?text=Hardware'}
                                        alt={item.productName}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8, transition: '0.5s' }}
                                        onMouseEnter={(e) => { e.target.style.transform = 'scale(1.1)'; e.target.style.opacity = 1; }}
                                        onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.opacity = 0.8; }}
                                    />
                                    <div style={{
                                        position: 'absolute', top: '10px', left: '10px', padding: '5px 10px',
                                        background: 'rgba(0,0,0,0.7)', borderRadius: '6px', fontSize: '0.8rem',
                                        color: 'var(--neon-blue)', border: '1px solid var(--neon-blue)'
                                    }}>
                                        {item.category}
                                    </div>
                                </div>
                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', minHeight: '3rem' }}>{item.productName}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {item.description}
                                    </p>
                                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                                            {formatRupiah(item.price)}
                                        </div>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                                            background: item.stock > 0 ? 'rgba(0, 255, 100, 0.2)' : 'rgba(255, 50, 50, 0.2)',
                                            color: item.stock > 0 ? '#0aff00' : '#ff3232'
                                        }}>
                                            {item.stock > 0 ? `${item.stock} Unit` : 'Habis'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!token && filteredProducts.length > 0 && (
                    <div style={{ marginTop: '4rem', padding: '3rem', background: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9))', borderRadius: '20px', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔒 Mode Preview Terbatas</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            Dapatkan <strong>API Key</strong> sekarang untuk akses penuh ke 200+ produk.
                        </p>
                        <Link to="/register" className="btn-neon">Daftar Akun Gratis</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Catalog;