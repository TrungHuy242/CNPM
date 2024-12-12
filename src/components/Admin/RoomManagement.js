import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './room-management.scss';
function RoomManagement() {
    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState({
        name: '',
        capacity: '',
        beds: '',
        size: '',
        description: '',
        photo: '',
        price: '',
        status: '',
    });
    const [editingRoom, setEditingRoom] = useState(null); // Thêm state cho phòng đang sửa

    // Lấy danh sách phòng
    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/rooms');
            setRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    // Thêm phòng
    const handleAddRoom = async () => {
        try {
            if (!newRoom.name || !newRoom.capacity || !newRoom.price) {
                alert('Vui lòng nhập đầy đủ thông tin phòng!');
                return;
            }

            const roomData = {
                ...newRoom,
                capacity: parseInt(newRoom.capacity, 10),
                beds: parseInt(newRoom.beds, 10),
                size: parseFloat(newRoom.size),
                price: parseFloat(newRoom.price),
            };

            console.log('Data to be sent:', JSON.stringify(roomData, null, 2));
            await axios.post('http://localhost:5000/api/rooms', roomData);
            fetchRooms(); // Làm mới danh sách phòng
            setNewRoom({
                name: '',
                capacity: '',
                beds: '',
                size: '',
                description: '',
                photo: '',
                price: '',
                status:'',
            });
        } catch (error) {
            console.error('Error adding room:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi thêm phòng!');
        }
    };

    // Sửa phòng
    const handleEditRoom = (room) => {
        setEditingRoom(room); // Thiết lập phòng đang sửa
    };

    const handleSaveEditRoom = async () => {
        try {
            if (!editingRoom.name || !editingRoom.capacity || !editingRoom.price) {
                alert('Vui lòng nhập đầy đủ thông tin phòng!');
                return;
            }

            const roomData = {
                ...editingRoom,
                capacity: parseInt(editingRoom.capacity, 10),
                beds: parseInt(editingRoom.beds, 10),
                size: parseFloat(editingRoom.size),
                price: parseFloat(editingRoom.price),
            };

            await axios.put(`http://localhost:5000/api/rooms/${editingRoom.id}`, roomData);
            fetchRooms(); // Làm mới danh sách phòng
            setEditingRoom(null); // Đóng form chỉnh sửa
        } catch (error) {
            console.error('Error saving edited room:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu phòng!');
        }
    };

    // Xóa phòng
    const handleDeleteRoom = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/rooms/${id}`);
            fetchRooms(); // Làm mới danh sách phòng
        } catch (error) {
            console.error('Error deleting room:', error);
            alert('Phòng đang được đặt không thể xóa. Vui lòng thử lại!');
        }
    };

    const updateRoomStatus = async (roomId, status) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/rooms/${roomId}`, {
                status: status,
            });
            console.log('Response:', response.data);
            // Update room status in the state after the backend update
            updateRoomStatusInState(roomId, status);
        } catch (error) {
            console.error('Error updating room status:', error.response || error);
        }
    };
    
    const updateRoomStatusInState = (roomId, status) => {
        const updatedRooms = rooms.map((room) =>
            room.id === roomId ? { ...room, status } : room
        );
        setRooms(updatedRooms);
    };
    
    

    return (
        <div className="rm-container">
    <h2 className="rm-title">Quản lý phòng</h2>

    {/* Form Thêm Phòng */}
    <div className="rm-form">
        <h3 className="rm-form-title">Thêm phòng mới</h3>
        <input
            type="text"
            className="rm-input"
            placeholder="Tên phòng"
            value={newRoom.name}
            onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
        />
        <input
            type="number"
            className="rm-input"
            placeholder="Sức chứa"
            value={newRoom.capacity}
            onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
        />
        <input
            type="number"
            className="rm-input"
            placeholder="Số giường"
            value={newRoom.beds}
            onChange={(e) => setNewRoom({ ...newRoom, beds: e.target.value })}
        />
        <input
            type="number"
            className="rm-input"
            placeholder="Diện tích"
            value={newRoom.size}
            onChange={(e) => setNewRoom({ ...newRoom, size: e.target.value })}
        />
        <textarea
            className="rm-textarea"
            placeholder="Mô tả"
            value={newRoom.description}
            onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
        />
        <input
            type="text"
            className="rm-input"
            placeholder="Giá phòng"
            value={newRoom.price}
            onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
        />
        <input
            type="text"
            className="rm-input"
            placeholder="Ảnh (URL)"
            value={newRoom.photo}
            onChange={(e) => setNewRoom({ ...newRoom, photo: e.target.value })}
        />
        <select
            className="rm-select"
            value={newRoom.status}
            onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value })}
        >
            <option value="">Chọn trạng thái</option>
            <option value="available">Trống</option>
            <option value="booked">Đã Đặt</option>
        </select>
        <button className="rm-button rm-add-button" onClick={handleAddRoom}>Thêm Phòng</button>
    </div>

   {/* Form Sửa Phòng */}
{editingRoom && (
    <div className="rm-edit-form">
        <h3 className="rm-form-title">Sửa phòng</h3>
        <input
            type="text"
            className="rm-input"
            placeholder="Tên phòng"
            value={editingRoom.name}
            onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
        />
        <input
            type="number"
            className="rm-input"
            placeholder="Sức chứa"
            value={editingRoom.capacity}
            onChange={(e) => setEditingRoom({ ...editingRoom, capacity: e.target.value })}
        />
        <input
            type="number"
            className="rm-input"
            placeholder="Số giường"
            value={editingRoom.beds}
            onChange={(e) => setEditingRoom({ ...editingRoom, beds: e.target.value })}
        />
        <input
            type="number"
            className="rm-input"
            placeholder="Diện tích"
            value={editingRoom.size}
            onChange={(e) => setEditingRoom({ ...editingRoom, size: e.target.value })}
        />
        <textarea
            className="rm-textarea"
            placeholder="Mô tả"
            value={editingRoom.description}
            onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })}
        />
        <input
            type="text"
            className="rm-input"
            placeholder="Giá phòng"
            value={editingRoom.price}
            onChange={(e) => setEditingRoom({ ...editingRoom, price: e.target.value })}
        />
        <input
            type="text"
            className="rm-input"
            placeholder="Ảnh (URL)"
            value={editingRoom.photo}
            onChange={(e) => setEditingRoom({ ...editingRoom, photo: e.target.value })}
        />
        <select
            className="rm-select"
            value={editingRoom.status}
            onChange={(e) => setEditingRoom({ ...editingRoom, status: e.target.value })}
        >
            <option value="available">Trống</option>
            <option value="booked">Đã Đặt</option>
        </select>
        <div className="rm-edit-buttons">
            <button className="rm-button rm-save-button" onClick={handleSaveEditRoom}>Lưu Sửa</button>
            <button className="rm-button rm-cancel-button" onClick={() => setEditingRoom(null)}>Hủy</button>
        </div>
    </div>
)}

    {/* Danh Sách Phòng */}
    <div className="rm-table-container">
        <h3 className="rm-table-title">Danh sách phòng</h3>
        <table className="rm-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Sức chứa</th>
                    <th>Giường</th>
                    <th>Diện tích</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {rooms.map((room) => (
                    <tr key={room.id} className="rm-row">
                        <td>{room.id}</td>
                        <td>{room.name}</td>
                        <td>{room.capacity}</td>
                        <td>{room.beds}</td>
                        <td>{room.size} m²</td>
                        <td className={`rm-status ${room.status === 'available' ? 'rm-available' : 'rm-booked'}`}>
                            {room.status === 'available' ? 'Trống' : 'Đã Đặt'}
                        </td>
                        <td>
                            <button className="rm-button rm-edit-button" onClick={() => handleEditRoom(room)}>Sửa</button>
                            <button className="rm-button rm-delete-button" onClick={() => handleDeleteRoom(room.id)}>Xóa</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</div>

    );
}

export default RoomManagement;
