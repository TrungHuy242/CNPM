import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../layouts/Context/AuthContext'; // Điều chỉnh đường dẫn từ components
import './style.scss';
import axios from 'axios';

function Header() {
    const [show, setShow] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout } = useAuth(); // Lấy thông tin từ context
    const showClass = show ? `d-flex text-center` : `d-none`;
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const userId = localStorage.getItem('user_id');
                if (!userId) return;

                const response = await axios.get(`http://localhost:5000/api/notifications?user_id=${userId}`);
                setNotifications(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy thông báo:', error);
            }
        };

        if (user) {
            fetchNotifications();
        }
    }, [user]);
    // Xử lý thay đổi kích thước cửa sổ
    const getWindowSize = () => (window.innerWidth <= 768) ? setShow(false) : setShow(true);

    useEffect(() => {
        window.addEventListener('resize', getWindowSize);
        getWindowSize(); // Kiểm tra kích thước khi tải trang
    }, []);

    return (
        <header className='header'>
            <nav className='container d-flex align-items-center justify-content-center py-3 nav'>
                <div className={`menu ${showClass}`}>
                    <NavLink to='/' exact>
                        HOME
                    </NavLink>
                    <NavLink to='/about'>
                        ABOUT
                    </NavLink>
                    <NavLink to='/rooms'>
                        ROOMS & RATES
                    </NavLink>
                    <NavLink to='/'>
                        <img src='/images/logo.png' className='logo' alt='Cocos' />
                    </NavLink>
                    <NavLink to='/blog'>
                        BLOG
                    </NavLink>
                    <NavLink to='/gallery'>
                        GALLERY
                    </NavLink>
                    <NavLink to='/contact'>
                        CONTACT
                    </NavLink>
                    {user && (
                        <div className="notification-icon">
                            <NavLink to='/notifications'> {/* Điều hướng tới trang thông báo */}
                                <i className="bi bi-bell-fill"></i>
                                {notifications.length > 0 && (
                                    <span className="badge">{notifications.length}</span>
                                )}
                            </NavLink>
                        </div>
                    )}

                </div>
                <div className='user-icon'>
                    <div className='position-relative'>
                        <i
                            className="bi bi-person-circle"
                            onClick={() => setMenuOpen(!menuOpen)}
                        ></i>
                        {menuOpen && (
                            <div className='dropdown-menu'>
                                {user ? (
                                    <>
                                        <span className='dropdown-item'>Xin chào, {user.username}</span>
                                        {user.role === 1 ? ( // Kiểm tra nếu role là admin
                                            <NavLink
                                                to='/admin'
                                                className='dropdown-item'
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                Trang quản trị
                                            </NavLink>
                                        ) : (
                                            <NavLink
                                                to='/history'
                                                className='dropdown-item'
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                Lịch sử đặt phòng
                                            </NavLink>
                                        )}
                                        <button
                                            className='dropdown-item'
                                            onClick={() => {
                                                logout(); // Đăng xuất
                                                setMenuOpen(false); // Ẩn menu
                                            }}
                                        >
                                            Đăng xuất
                                        </button>
                                    </>
                                ) : (
                                    <NavLink
                                        to='/login'
                                        className='dropdown-item'
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Đăng nhập
                                    </NavLink>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className='mobile-nav' onClick={() => setShow(!show)}>
                    <button className='navbar-toggle'>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                    </button>
                </div>
            </nav>
        </header>
    );
}

export default Header;
