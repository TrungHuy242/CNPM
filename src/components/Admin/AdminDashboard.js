import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './style.scss';
import RoomManagement from './RoomManagement';
import BookingManagement from './BookingManagement';
import CustomerManagement from './CustomerManagement';

const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const [activeMenu, setActiveMenu] = useState('rooms');
    const history = useHistory();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        } else {
            history.push('/login');
        }
    }, [history]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        history.push('/login');
    };

    const handleGoHome = () => {
        history.push('/');
    };

    const renderContent = (menu) => {
        switch (menu) {
            case 'rooms':
                return <RoomManagement />;
            case 'bookings':
                return <BookingManagement />;
            case 'customers':
                return <CustomerManagement />;
            default:
                return <div>Chọn một mục trong menu</div>;
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="admin-dashboard">
            <div className="sidebar">
                <h2>Admin Dashboard</h2>
                <div className="avatar" onClick={handleGoHome} style={{ cursor: 'pointer' }}>
                    <img
                        src="https://th.bing.com/th/id/OIP.SlQVuppxkbBIHwXGiPqAYQHaHa?rs=1&pid=ImgDetMain" // Đường dẫn đến ảnh avatar
                        alt="User Avatar"
                        title="Nhấp vào đây để về trang chủ"
                    />
                </div>
                <ul>
                    <li
                        onClick={() => setActiveMenu('rooms')}
                        className={activeMenu === 'rooms' ? 'active' : ''}
                    >
                        Quản lý Phòng
                    </li>
                    <li
                        onClick={() => setActiveMenu('bookings')}
                        className={activeMenu === 'bookings' ? 'active' : ''}
                    >
                        Quản lý Đặt Phòng
                    </li>
                    <li
                        onClick={() => setActiveMenu('customers')}
                        className={activeMenu === 'customers' ? 'active' : ''}
                    >
                        Quản lý Khách Hàng
                    </li>
                </ul>
                <button onClick={handleLogout}>Đăng xuất</button>
            </div>
            <div className="content">
                <h1>Welcome, {user.username}</h1>
                {renderContent(activeMenu)}
            </div>
        </div>
    );
};

export default AdminDashboard;
