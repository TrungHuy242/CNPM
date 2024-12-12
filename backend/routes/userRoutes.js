const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Kết nối cơ sở dữ liệu

// Endpoint lấy tất cả thông tin người dùng
router.get('/users', async (req, res) => {
    try {
        console.log('Fetching users...');
        const [users] = await db.promise().query(
            'SELECT id, full_name, username, email, phone, dob, gender, created_at, role FROM users'
        );

        console.log('Users fetched:', users);

        if (users.length === 0) {
            console.log('No users found');
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});



module.exports = router;
