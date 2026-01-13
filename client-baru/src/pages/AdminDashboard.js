import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Tambahkan Link

const AdminDashboard = () => {
    const navigate = useNavigate();

    // --- STATE MANAGEMENT ---
    const [tab, setTab] = useState('products'); // products, users, keys
    const [dataList, setDataList] = useState([]);
    const [loading, setLoading] = useState(false);

    // State Edit Produk & User
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [prodForm, setProdForm] = useState({
        productName: '', category: 'Laptop', price: '', stock: '', description: '', image: ''
    });
    const [userForm, setUserForm] = useState({ name: '', email: '', role: 'user' });

    // State untuk MONITOR LOG (TERMINAL)
    const [showMonitor, setShowMonitor] = useState(false);
    const [monitorLogs, setMonitorLogs] = useState([]);
    const [monitorUserName, setMonitorUserName] = useState('');
    const [monitorLoading, setMonitorLoading] = useState(false);

    const token = localStorage.getItem('token');

    // --- EFFECT ---
    useEffect(() => {
        const role = localStorage.getItem('role');
        if (!token || role !== 'admin') {
            navigate('/login');
        } else {
            fetchData();
        }
    }, [tab]);

    // --- FETCH DATA ---
    const fetchData = async () => {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            let res;
            if (tab === 'users') {
                res = await axios.get('http://localhost:5000/api/admin/users', config);
                setDataList(res.data);
            } else if (tab === 'keys') {
                res = await axios.get('http://localhost:5000/api/admin/keys', config);
                setDataList(res.data);
            } else {
                // Default: Products
                res = await axios.get('http://localhost:5000/api/v1/catalog-preview');
                setDataList(res.data.data);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setDataList([]);
        }
        setLoading(false);
    };

    // --- HANDLERS: MONITORING ---
    const handleViewLogs = async (userId, userName) => {
        setMonitorUserName(userName);
        setShowMonitor(true);
        setMonitorLoading(true);
        setMonitorLogs([]); // Reset log sebelumnya

        try {
            const res = await axios.get(`http://localhost:5000/api/admin/users/${userId}/logs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMonitorLogs(res.data);
        } catch (err) {
            console.error("Gagal ambil log:", err);
        }
        setMonitorLoading(false);
    };

    // --- HANDLERS: REGENERATE KEY ---
    const handleRegenerateKey = async (id, userName) => {
        if (!window.confirm(`⚠️ PERINGATAN: Regenerate Key untuk user "${userName}"?\n\nKey lama tidak akan bisa dipakai lagi.`)) return;

        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`http://localhost:5000/api/admin/keys/${id}/regenerate`, {}, config);
            alert("✅ Key berhasil di-regenerate!");
            fetchData(); // Refresh data tabel
        } catch (err) {
            alert("Gagal memperbarui key.");
            setLoading(false);
        }
    };

    // --- HANDLERS: CRUD PRODUCT & USER ---
    const handleSaveProduct = async (e) => {
        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            if (isEditing) await axios.put(`http://localhost:5000/api/admin/products/${editId}`, prodForm, config);
            else await axios.post(`http://localhost:5000/api/admin/products`, prodForm, config);
            alert("Berhasil disimpan!"); resetForm(); fetchData();
        } catch (err) { alert("Error menyimpan produk"); }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Hapus produk ini?")) return;
        try { await axios.delete(`http://localhost:5000/api/admin/products/${id}`, { headers: { Authorization: `Bearer ${token}` } }); fetchData(); } catch (err) { }
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            if (isEditing) await axios.put(`http://localhost:5000/api/admin/users/${editId}`, userForm, config);
            alert("User updated!"); resetForm(); fetchData();
        } catch (err) { alert("Error update user"); }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Hapus user ini?")) return;
        try { await axios.delete(`http://localhost:5000/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } }); fetchData(); } catch (err) { }
    };

    const startEditProduct = (item) => {
        setIsEditing(true); setEditId(item.id);
        setProdForm({ productName: item.productName, category: item.category, price: item.price, stock: item.stock, description: item.description, image: item.image || '' });
        window.scrollTo(0, 0);
    };

    const startEditUser = (u) => {
        setIsEditing(true); setEditId(u.id);
        setUserForm({ name: u.name, email: u.email, role: u.role });
        window.scrollTo(0, 0);
    };

    const resetForm = () => {
        setIsEditing(false); setEditId(null);
        setProdForm({ productName: '', category: 'Laptop', price: '', stock: '', description: '', image: '' });
        setUserForm({ name: '', email: '', role: 'user' });
    };

    return (
        <div className="app-container">
            <Navbar />

            <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                <h1 className="page-title">Admin Console</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>

                    {/* --- SIDEBAR --- */}
                    <div className="glass-card" style={{ height: 'fit-content', padding: '1rem', position: 'sticky', top: '100px' }}>
                        <div style={{ marginBottom: '1.5rem', padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ fontSize: '1.5rem' }}>⚙️</div>
                            <div>
                                <h4 style={{ fontWeight: 'bold' }}>Admin Panel</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>System Manager</p>
                            </div>
                        </div>
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[
                                { id: 'products', icon: '📦', label: 'Products' },
                                { id: 'users', icon: '👥', label: 'Users' },
                                { id: 'keys', icon: '🔑', label: 'API Keys' },
                            ].map((menu) => (
                                <button key={menu.id} onClick={() => { setTab(menu.id); resetForm(); }}
                                    style={{
                                        textAlign: 'left', padding: '12px 16px', borderRadius: '10px',
                                        background: tab === menu.id ? 'rgba(0, 243, 255, 0.1)' : 'transparent',
                                        color: tab === menu.id ? 'var(--neon-blue)' : 'var(--text-muted)',
                                        border: tab === menu.id ? '1px solid var(--neon-blue)' : '1px solid transparent',
                                        cursor: 'pointer', transition: '0.3s', display: 'flex', gap: '10px', alignItems: 'center', fontWeight: 'bold'
                                    }}>
                                    <span>{menu.icon}</span> {menu.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* --- CONTENT --- */}
                    <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '2rem', textTransform: 'capitalize' }}>Manage <span style={{ color: 'var(--neon-blue)' }}>{tab}</span></h2>
                            <button onClick={fetchData} className="btn-neon" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↺</button>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Fetching Data...</div>
                        ) : (
                            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>

                                {/* TAB PRODUCTS */}
                                {tab === 'products' && (
                                    <div style={{ padding: '2rem' }}>
                                        
                                        {/* TOMBOL LIHAT CATALOG DI SINI */}
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                                            <Link to="/docs" className="btn-neon secondary" style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                📄 Lihat Katalog
                                            </Link>
                                        </div>

                                        <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--neon-green)' }}>{isEditing ? '✏️ Edit Product' : '✨ Add New Product'}</h3>
                                            <form onSubmit={handleSaveProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <input placeholder="Product Name" value={prodForm.productName} onChange={e => setProdForm({ ...prodForm, productName: e.target.value })} required style={{ gridColumn: 'span 2' }} />
                                                <select value={prodForm.category} onChange={e => setProdForm({ ...prodForm, category: e.target.value })}>
                                                    <option>Laptop</option><option>Graphic Card</option><option>Processor</option><option>RAM</option><option>SSD/Storage</option><option>Monitor</option><option>Gaming Gear</option><option>Power Supply</option><option>Cooling</option>
                                                </select>
                                                <input type="number" placeholder="Price" value={prodForm.price} onChange={e => setProdForm({ ...prodForm, price: e.target.value })} required />
                                                <input type="number" placeholder="Stock" value={prodForm.stock} onChange={e => setProdForm({ ...prodForm, stock: e.target.value })} required />
                                                <textarea placeholder="Description" rows="3" value={prodForm.description} onChange={e => setProdForm({ ...prodForm, description: e.target.value })} style={{ gridColumn: 'span 2' }} />
                                                <input placeholder="Image URL" value={prodForm.image} onChange={e => setProdForm({ ...prodForm, image: e.target.value })} style={{ gridColumn: 'span 2' }} />
                                                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                    <button type="submit" className="btn-neon" style={{ flex: 1 }}>{isEditing ? 'Save Changes' : 'Publish Product'}</button>
                                                    {isEditing && <button type="button" onClick={resetForm} className="btn-neon secondary">Cancel</button>}
                                                </div>
                                            </form>
                                        </div>

                                        <div style={{ overflowX: 'auto' }}>
                                            <table className="neon-table">
                                                <thead><tr><th>Product</th><th>Price</th><th>Stock</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                                                <tbody>
                                                    {dataList.map(item => (
                                                        <tr key={item.id}>
                                                            <td style={{ fontWeight: 'bold' }}>{item.productName}</td>
                                                            <td>Rp {parseInt(item.price).toLocaleString()}</td>
                                                            <td>
                                                                <span style={{ color: item.stock > 0 ? 'var(--neon-green)' : 'red' }}>{item.stock}</span>
                                                            </td>
                                                            <td style={{ textAlign: 'right', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                                                <button onClick={() => startEditProduct(item)} style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '1.2rem' }}>✏️</button>
                                                                <button onClick={() => handleDeleteProduct(item.id)} style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '1.2rem' }}>🗑️</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* TAB USERS */}
                                {tab === 'users' && (
                                    <div style={{ padding: '2rem' }}>
                                        {isEditing && (
                                            <div style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid var(--neon-blue)', borderRadius: '12px' }}>
                                                <h3 style={{ marginBottom: '1rem' }}>Edit User</h3>
                                                <form onSubmit={handleSaveUser} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                                    <input value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} placeholder="Name" style={{ flex: 1 }} />
                                                    <input value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} placeholder="Email" style={{ flex: 1 }} />
                                                    <select value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })} style={{ width: '150px' }}>
                                                        <option value="user">User</option><option value="admin">Admin</option>
                                                    </select>
                                                    <button type="submit" className="btn-neon">Update</button>
                                                    <button type="button" onClick={resetForm} className="btn-neon secondary">Cancel</button>
                                                </form>
                                            </div>
                                        )}
                                        <table className="neon-table">
                                            <thead><tr><th>User</th><th>Email</th><th>Role</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                                            <tbody>
                                                {dataList.map(u => (
                                                    <tr key={u.id}>
                                                        <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <div style={{ width: '30px', height: '30px', background: 'var(--neon-purple)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{u.name ? u.name.charAt(0) : '?'}</div>
                                                            {u.name}
                                                        </td>
                                                        <td>{u.email}</td>
                                                        <td>
                                                            <span style={{
                                                                padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem',
                                                                border: u.role === 'admin' ? '1px solid #ff0055' : '1px solid var(--text-muted)',
                                                                color: u.role === 'admin' ? '#ff0055' : 'var(--text-muted)'
                                                            }}>{u.role}</span>
                                                        </td>
                                                        <td style={{ textAlign: 'right' }}>
                                                            <button onClick={() => handleViewLogs(u.id, u.name)} className="btn-neon" style={{ padding: '5px 10px', fontSize: '0.8rem', marginRight: '10px' }}>Monitor</button>
                                                            <button onClick={() => startEditUser(u)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}>✏️</button>
                                                            {u.role !== 'admin' && <button onClick={() => handleDeleteUser(u.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* TAB KEYS */}
                                {tab === 'keys' && (
                                    <div style={{ padding: '0' }}>
                                        <div style={{ overflowX: 'auto' }}>
                                            <table className="neon-table">
                                                <thead><tr><th>Owner</th><th>API Key</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                                                <tbody>
                                                    {dataList.map(k => (
                                                        <tr key={k.id}>
                                                            <td>
                                                                <div>{k.user ? k.user.name : 'Unknown'}</div>
                                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{k.user ? k.user.email : ''}</div>
                                                            </td>
                                                            <td><code style={{ color: 'var(--neon-blue)' }}>{k.key ? k.key.substring(0, 20) : 'DELETED'}...</code></td>
                                                            <td><span style={{ color: 'var(--neon-green)' }}>Active</span></td>
                                                            <td style={{ textAlign: 'right' }}>
                                                                <button onClick={() => handleRegenerateKey(k.id, k.user?.name)} className="btn-neon secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Regen</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* --- MODAL TERMINAL MONITOR --- */}
                {showMonitor && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="glass-card" style={{ width: '90%', maxWidth: '800px', height: '80vh', display: 'flex', flexDirection: 'column', padding: 0, background: '#0d1117' }}>
                            <div style={{ padding: '10px 20px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#161b22' }}>
                                <div style={{ fontFamily: 'monospace', color: '#ccc' }}>root@compuapi:~/logs/{monitorUserName}</div>
                                <button onClick={() => setShowMonitor(false)} style={{ background: 'none', border: 'none', color: '#ff5555', fontWeight: 'bold', cursor: 'pointer' }}>CLOSE</button>
                            </div>
                            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', fontFamily: 'monospace', color: '#0f0' }}>
                                <div style={{ color: '#888', marginBottom: '10px' }}>Scanning activity...</div>
                                {monitorLoading ? (
                                    <div>Loading...</div>
                                ) : monitorLogs.length > 0 ? (
                                    monitorLogs.map((log, index) => (
                                        <div key={index} style={{ marginBottom: '5px' }}>
                                            <span style={{ color: '#555' }}>{new Date(log.createdAt).toLocaleTimeString()}</span>{' '}
                                            <span style={{ color: '#fff' }}>User {monitorUserName}</span>{' '}
                                            {log.endpoint.includes('REGENERATE') ? <span style={{ color: 'yellow' }}>REGENERATED KEY</span> : 'accessed data'}
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ color: '#555' }}>No activity found.</div>
                                )}
                                <div className="animate-pulse" style={{ marginTop: '10px' }}>_</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;