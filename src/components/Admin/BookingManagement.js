import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://localhost:5000/api/bookings');
                // Định dạng ngày giờ cho checkin, checkout và bookingTime
                const formattedBookings = response.data.map((booking) => ({
                    ...booking,
                    checkin: format(new Date(booking.checkin), 'yyyy-MM-dd'), // Lấy ngày mà không có giờ
                    checkout: format(new Date(booking.checkout), 'yyyy-MM-dd'), // Lấy ngày mà không có giờ
                    bookingTime: format(new Date(booking.bookingTime), 'yyyy-MM-dd HH:mm') // Định dạng bookingTime
                }));
                setBookings(formattedBookings);
            } catch (err) {
                console.error('Error fetching booking data:', err);
                setError('Không thể tải dữ liệu đặt phòng.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleUpdateStatus = async (id, status, userId) => {
        try {
            console.log('Sending request to update status:', { id, status,  userId }); // Log request data
             

            await axios.put(`http://localhost:5000/api/bookings/${id}`, { status });
            setBookings((prev) =>
                prev.map((booking) => (booking.id === id ? { ...booking, status } : booking))
            );

            const message = status === 'confirmed' ? 'Đặt phòng của bạn đã được xác nhận !.' : 'Đặt phòng của bạn đã bị từ chối !.';
            await axios.post('http://localhost:5000/api/notifications', { user_id: userId, message });
           
        } catch (err) {
            console.error('Error updating booking status:', err);
        }
    };

    const handleDeleteBooking = async (id, userId) => {
        try {
            console.log('Deleting booking ID:', id); // Log ID để kiểm tra

            const response = await axios.delete(`http://localhost:5000/api/bookings/${id}`);
    
            if (response.status === 200) {
                setBookings((prev) => prev.filter((booking) => booking.id !== id));
                alert('Đã xóa lịch sử đặt phòng!');
                const message = 'Đặt phòng của bạn đã bị xóa!';
                await axios.post('http://localhost:5000/api/notifications', { user_id: userId, message });
            } else {
                alert('Không thể xóa lịch sử đặt phòng. Vui lòng thử lại!');
            }
        } catch (err) {
            console.error('Error deleting booking:', err);
            alert('Không thể xóa lịch sử đặt phòng. Vui lòng thử lại!');
        }
    };
    
    

    return (
        <div className="booking-management">
            <h2>Quản lý Đặt Phòng</h2>
            {isLoading && <p>Đang tải dữ liệu...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!isLoading && !error && (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Room</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                            <th>Booking Time</th> {/* Thêm cột bookingTime */}
                            <th>Total Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td>{booking.room}</td>
                                <td>{booking.checkin}</td>
                                <td>{booking.checkout}</td>
                                <td>{booking.bookingTime}</td> {/* Hiển thị bookingTime */}
                                <td>{booking.totalPrice}€</td>
                                <td>
                                    {booking.status === 'confirmed'
                                        ? 'Đặt phòng thành công'
                                        : booking.status === 'rejected'
                                        ? 'Từ chối đặt phòng'
                                        : 'Chưa được xác nhận'}
                                </td>
                                <td>
                                    <button onClick={() => handleUpdateStatus(booking.id, 'confirmed', booking.user_id)}>
                                        Xác nhận
                                    </button>
                                    <button onClick={() => handleUpdateStatus(booking.id, 'rejected',  booking.user_id)}>
                                        Từ chối
                                    </button>
                                    <button onClick={() => handleDeleteBooking(booking.id, booking.user_id)} style={{ color: 'red' }}>
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BookingManagement;
