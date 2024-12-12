import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // Sử dụng useHistory cho React Router v5

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const history = useHistory(); // Khởi tạo useHistory

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const userId = localStorage.getItem('user_id');
                console.log('user_id từ localStorage:', userId); // Kiểm tra xem giá trị có đúng không
                if (!userId) return;

                const response = await axios.get(`http://localhost:5000/api/notifications?user_id=${userId}`);
                console.log('Thông báo nhận từ API:', response.data); // Kiểm tra dữ liệu nhận từ API
                setNotifications(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy thông báo:', error);
            }
        };

        fetchNotifications();
    }, []); // Chạy hàm khi component được mount

    // Hàm xử lý khi nhấp vào thông báo
    const handleNotificationClick = (notificationId) => {
        // Chuyển hướng đến trang lịch sử đặt phòng
        history.push(`/history/${notificationId}`);
    };

    // Hàm xử lý xóa một thông báo
    const handleDeleteNotification = async (notificationId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/notifications/${notificationId}`);
            console.log('Kết quả xóa:', response.data);
            setNotifications(notifications.filter(notification => notification.id !== notificationId)); // Cập nhật lại danh sách thông báo
        } catch (error) {
            console.error('Lỗi khi xóa thông báo:', error.response ? error.response.data : error.message);
        }
    };

    // Hàm xử lý xóa tất cả thông báo
    const handleDeleteAllNotifications = async () => {
        const userId = localStorage.getItem('user_id'); // Lấy user_id từ localStorage
        try {
            await axios.delete('http://localhost:5000/api/notifications', { data: { user_id: userId } }); // Gửi user_id trong body
            setNotifications([]); // Xóa tất cả thông báo khỏi UI
        } catch (error) {
            console.error('Lỗi khi xóa tất cả thông báo:', error);
        }
    };

    return (
        <div className="notifications-page">
            <h1>Thông báo của bạn</h1>

            {/* Nút xóa tất cả thông báo */}
            <button onClick={handleDeleteAllNotifications}>Xóa tất cả thông báo</button>

            {notifications.length > 0 ? (
                notifications.map((notification) => (
                    <div key={notification.id} className="notification-item">
                        <p onClick={() => handleNotificationClick(notification.id)}>{notification.message}</p>
                        <small>{new Date(notification.created_at).toLocaleString()}</small>
                        <button onClick={() => handleDeleteNotification(notification.id)}>Xóa</button>
                    </div>
                ))
            ) : (
                <p>Không có thông báo mới.</p>
            )}
        </div>
    );
}

export default Notifications;
