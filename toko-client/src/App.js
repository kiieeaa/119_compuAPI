import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const fetchProducts = async () => {
    if (!apiKey.trim()) {
      setError('Masukkan API Key terlebih dahulu!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get('http://localhost:5000/api/v1/products', {
        headers: { 'x-api-key': apiKey }
      });

      setProducts(response.data.data);
      setError('');
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('API Key tidak valid atau tidak aktif!');
      } else {
        setError('Gagal mengambil data. Periksa koneksi Anda.');
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🛒 Toko Hardware </h1>
        <p>Implementasi API Produk dengan Gaya</p>
      </div>

      <div className="api-box">
        <h3>🔒 Secure Access Channel</h3>
        <p style={{ color: 'var(--text-muted)' }}>Masukkan API Key untuk membuka portal data produk.</p>

        <div className="input-group">
          <input
            type="text"
            placeholder="Paste your API Key here..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchProducts()}
          />
          <button onClick={fetchProducts} disabled={loading}>
            {loading ? 'CONNECTING...' : 'ACCESS DATA'}
          </button>
        </div>

        {error && <div className="status-badge status-error">{error}</div>}
        {!error && products.length > 0 && (
          <div className="status-badge status-success">
            ACCESS GRANTED: Found {products.length} Items
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--neon-blue)' }}>
          <p className="loading-text">ESTABLISHING CONNECTION...</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div className="card" key={product.id}>
              <img
                className="card-img"
                src={product.image || 'https://placehold.co/400?text=Hardware'}
                alt={product.productName}
              />
              <div className="card-body">
                <div className="category">{product.category}</div>
                <div className="title">{product.productName}</div>
                <div className="price">{formatRupiah(product.price)}</div>
                <div className="stock">Available: {product.stock} units</div>
                <div className="desc">{product.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && !error && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '16px',
          border: '1px dashed var(--text-muted)'
        }}>
          <h3>Data Locked</h3>
          <p style={{ color: 'var(--text-muted)' }}>Input API Key to view catalog</p>
        </div>
      )}
    </div>
  );
}

export default App;