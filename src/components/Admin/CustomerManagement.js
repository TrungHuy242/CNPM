import React, { useState, useEffect } from 'react';
import './CustomerManagement.scss';

const CustomerManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    // Fetch danh sách người dùng
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    console.error('Failed to fetch users');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    // Khi nhấp vào user
    const handleUserClick = (user) => {
        setSelectedUser(user); // Gán trực tiếp thông tin user khi nhấp
    };

    // Định dạng ngày
    const formatDate = (dateString, isCreatedAt = false) => {
        const date = new Date(dateString);
        return isCreatedAt ? date.toLocaleString() : date.toLocaleDateString();
    };

    return (
        <div>
            <h2>Quản lý Khách Hàng</h2>

            {/* Danh sách người dùng */}
            <div className="avatar-container">
                {users.map(user => (
                    <div
                        key={user.id}
                        className="avatar"
                        onClick={() => handleUserClick(user)}
                    >
                        <div className="avatar-image">
                            <span>{user.username.charAt(0).toUpperCase()}</span>
                        </div>
                        <p>{user.username}</p>
                    </div>
                ))}
            </div>

            {/* Hiển thị thông tin người dùng dưới danh sách */}
            {selectedUser && (
                <div className="user-details">
    <h3>Thông tin của {selectedUser.full_name}</h3>
    <table>
        <tbody>
            <tr>
                <th>Tên đăng nhập</th>
                <td>{selectedUser.username}</td>
            </tr>
            <tr>
                <th>Họ và tên</th>
                <td>{selectedUser.full_name}</td>
            </tr>
            <tr>
                <th>Email</th>
                <td>{selectedUser.email}</td>
            </tr>
            <tr>
                <th>Số điện thoại</th>
                <td>{selectedUser.phone}</td>
            </tr>
            <tr>
                <th>Ngày sinh</th>
                <td>{formatDate(selectedUser.dob)}</td>
            </tr>
            <tr>
                <th>Giới tính</th>
                <td>{selectedUser.gender === 'male' ? 'Nam' : 'Nữ'}</td>
            </tr>
            <tr>
                <th>Ngày tạo tài khoản</th>
                <td>{formatDate(selectedUser.created_at, true)}</td>
            </tr>
            <tr>
                <th>Quyền</th>
                <td>{selectedUser.role === 1 ? 'Quản trị viên' : 'Người dùng'}</td>
            </tr>
        </tbody>
    </table>
</div>

            )}
        </div>
    );
};

export default CustomerManagement;
