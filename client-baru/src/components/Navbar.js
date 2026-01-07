import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                {/* LOGO */}
                <Link to="/" className="nav-logo">
                    <div className="logo-box">C</div>
                    <span>CompuAPI</span>
                </Link>

                {/* MENU DESKTOP */}
                <div className="nav-links">
                    {role === 'admin' ? (
                        <span className="nav-link active" style={{ color: '#ff0055', boxShadow: '0 0 10px rgba(255,0,85,0.3)' }}>
                            🛡️ Admin Mode
                        </span>
                    ) : (
                        <>
                            <Link to="/" className={isActive('/')}>Home</Link>
                            <Link to="/docs" className={isActive('/docs')}>Catalog</Link>
                            <Link to="/about" className={isActive('/about')}>About</Link>
                        </>
                    )}
                </div>

                {/* BUTTONS */}
                <div className="nav-actions">
                    {token ? (
                        <>
                            <Link
                                to={role === 'admin' ? "/admin-dashboard" : "/dashboard"}
                                className="btn-neon"
                            >
                                Dashboard
                            </Link>
                            <button onClick={handleLogout} className="btn-neon secondary">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">
                                Login
                            </Link>
                            <Link to="/register" className="btn-neon">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;