const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
    const { fullName, username, password, email, phone, dob, gender, role = 0 } = req.body;

    try {
        // Kiểm tra trùng username hoặc email
        const checkQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
        db.query(checkQuery, [username, email], async (err, results) => {
            if (err) return res.status(500).json({ error: 'Lỗi kiểm tra dữ liệu!' });

            if (results.length > 0) {
                return res.status(400).json({ error: 'Tên đăng nhập hoặc email đã tồn tại!' });
            }

            // Hash mật khẩu và thêm role
            const hashedPassword = await bcrypt.hash(password, 10);
            const insertQuery = `
                INSERT INTO users (full_name, username, password, email, phone, dob, gender, role)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            db.query(insertQuery, [fullName, username, hashedPassword, email, phone, dob, gender, role], (err) => {
                if (err) return res.status(500).json({ error: 'Đăng ký thất bại!' });
                res.status(201).json({ message: 'Đăng ký thành công!' });
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Có lỗi xảy ra!' });
    }
};


// Đăng nhập người dùng
exports.loginUser = (req, res) => {
    const { username, password } = req.body;

    const query = `SELECT * FROM users WHERE username = ?`;
    db.query(query, [username], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng!' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng!' });
        }

        // Kiểm tra giá trị của 'role' trước khi trả về
        if (typeof user.role !== 'number') {
            return res.status(500).json({ error: 'Quyền hạn không hợp lệ!' });
        }
        res.status(200).json({
            message: 'Đăng nhập thành công!',
            user: { id: user.id, username: user.username, role: user.role },  // role được trả về đúng
        });
        
    });
};



