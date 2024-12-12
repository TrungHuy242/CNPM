const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST route for creating notifications
router.post('/notifications', (req, res) => {
    const { user_id, message } = req.body;
    const query = `INSERT INTO notifications (user_id, message, is_read, created_at) VALUES (?, ?, false, NOW())`;
    db.query(query, [user_id, message], (err) => {
        if (err) return res.status(500).json({ error: 'Lỗi khi tạo thông báo!' });
        res.status(201).json({ message: 'Thông báo đã được gửi!' });
    });
});

// GET route for fetching notifications
router.get('/notifications', (req, res) => {
    const userId = req.query.user_id;
    console.log('user_id nhận từ frontend:', userId); // Log giá trị user_id
    const query = `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`;
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Lỗi khi lấy thông báo!' });
        res.status(200).json(results);
    });
});

router.delete('/notifications/:id', (req, res) => {  // Chuyển từ :user_id thành :id
    const { id } = req.params;  // Lấy id từ params
    const query = `DELETE FROM notifications WHERE id = ?`;  // Đảm bảo xóa bằng ID
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Lỗi khi xóa thông báo!' });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Thông báo không tìm thấy.' });
        }
        res.status(200).json({ message: 'Thông báo đã được xóa thành công.' });
    });
});


// DELETE route for deleting all notifications for a user
router.delete('/notifications', (req, res) => {
    const { user_id } = req.body;
    const query = `DELETE FROM notifications WHERE user_id = ?`;
    db.query(query, [user_id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Lỗi khi xóa tất cả thông báo!' });
        res.status(200).json({ message: 'Đã xóa tất cả thông báo.' });
    });
});


module.exports = router;
