// bookingRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Kết nối cơ sở dữ liệu

// Route để lấy thông tin lịch sử đặt phòng
router.get('/bookings', async (req, res) => {
    try {
        // Câu truy vấn lấy tất cả thông tin bookings
        const query = `SELECT b.*, r.name AS room_name 
                       FROM bookings b 
                       JOIN rooms r ON b.room_id = r.id`;

        const [rows] = await db.promise().query(query);

        // Trả về danh sách đặt phòng
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Error fetching booking history' });
    }
});






// Route để lưu thông tin đặt phòng
router.post('/bookings', async (req, res) => {
    const {room, checkin, checkout, adults, children, totalPrice, bookingTime, status, room_id, user_id } = req.body;

    try {
        const query = `INSERT INTO bookings (room, checkin, checkout, adults, children, totalPrice, bookingTime, status, room_id, user_id)
                       VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        await db.promise().query(query, [room,checkin, checkout, adults, children, totalPrice, bookingTime, status, room_id, user_id]);

        res.status(201).json({ message: 'Booking created successfully' });
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({ message: 'Database error', error: error.message });
    }
});




// Cập nhật trạng thái đặt phòng (confirm hoặc reject)
router.put('/bookings/:id', (req, res) => {
    const { status } = req.body;  // status có thể là 'confirmed', 'rejected'
    const { id } = req.params;

    if (!['confirmed', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Trạng thái không hợp lệ!' });
    }

    const query = `UPDATE bookings SET status = ? WHERE id = ?`;
    
    db.query(query, [status, id], (err, results) => {
        if (err) {
            console.error('Error updating booking status:', err);
            return res.status(500).json({ error: 'Lỗi khi cập nhật trạng thái!' });
        }
        res.status(200).json({ message: 'Trạng thái đặt phòng đã được cập nhật!' });
    });
});


// Xóa booking
router.delete('/bookings/:id', async (req, res) => {
    const bookingId = req.params.id;
    console.log('ID received:', bookingId);

    try {
        // Kiểm tra booking có tồn tại không
        const [bookingResult] = await db.promise().query('SELECT * FROM bookings WHERE id = ?', [bookingId]);
        if (bookingResult.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Trước khi xóa booking, xóa các phòng (nếu có liên kết khóa ngoại)
        await db.promise().query('UPDATE rooms SET status = "available" WHERE id IN (SELECT room_id FROM bookings WHERE id = ?)', [bookingId]);

        // Xóa booking
        const query = `DELETE FROM bookings WHERE id = ?`;
        const [result] = await db.promise().query(query, [bookingId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking deleted successfully!' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Error deleting booking', error: error.message });
    }
});



module.exports = router;
