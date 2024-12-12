const db = require('./config/db'); // Đường dẫn đến file db.js

// Kiểm tra kết nối
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');

    // Thực hiện truy vấn để lấy dữ liệu từ bảng rooms
    const query = 'SELECT * FROM rooms';
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching rooms:', error);
        } else {
            console.log('Rooms data:', results);
        }
        
        // Giải phóng kết nối
        connection.release();
    });
});