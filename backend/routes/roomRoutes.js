const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Kết nối cơ sở dữ liệu

// Lấy danh sách phòng
router.get('/rooms', async (req, res) => {
    try {
        const [rooms] = await db.promise().query('SELECT * FROM rooms');
        res.json(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ message: 'Error fetching rooms' });
    }
});

// Thêm phòng mới
router.post('/rooms', async (req, res) => {
    try {
        console.log('Data received from client:', req.body);

        const { name, description, size, beds, capacity, price, photo, status } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!name || !description || !size || !beds || !capacity || !price || !photo || !status) {
            console.error('Missing required fields:', req.body);
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Thực hiện truy vấn
        const query = `INSERT INTO rooms (name, description, size, beds, capacity, price, photo, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        await db.promise().query(query, [name, description, size, beds, capacity, price, photo, status]);

        res.status(201).json({ message: 'Room added successfully' });
    } catch (error) {
        console.error('Error in POST /rooms:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Sửa phòng
router.put('/rooms/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, size, beds, capacity, price, photo, status } = req.body;

    if (!name || !description || !size || !beds || !capacity || !price || !photo || !status) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const query = `UPDATE rooms SET name=?, description=?, size=?, beds=?, capacity=?, price=?, photo=?, status=? WHERE id=?`;
        await db.promise().query(query, [name, description, size, beds, capacity, price, photo, status, id]);

        res.json({ message: 'Room updated successfully' });
    } catch (error) {
        console.error('Error updating room:', error.message);
        res.status(500).json({ message: 'Error updating room' });
    }
});


// Xóa phòng
router.delete('/rooms/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.promise().query(`DELETE FROM rooms WHERE id=?`, [id]);
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ message: 'Error deleting room' });
    }
});

// Route để cập nhật trạng thái phòng (khi booking được xác nhận)
router.put('/rooms/:id', async (req, res) => {
    const { status } = req.body;
    const roomId = req.params.id;

    try {
        console.log(`Updating room ${roomId} status to ${status}`); 
        const query = `UPDATE rooms SET status = ? WHERE id = ?`;
        await db.promise().query(query, [status, roomId]);
        res.status(200).json({ message: 'Room status updated successfully!' });
    } catch (error) {
        console.error('Error updating room status:', error);
        res.status(500).json({ message: 'Error updating room status' });
    }
});



module.exports = router;
