import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import './style.scss';
function BookingHistory() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const userId = localStorage.getItem('user_id'); // Lấy user_id từ localStorage
                if (!userId) {
                    throw new Error('User ID is missing');
                }
                const response = await axios.get('http://localhost:5000/api/bookings');
                console.log('Response Status:', response.status);  // Kiểm tra mã trạng thái HTTP
                console.log('Bookings Data:', response.data);  
                console.log('UserId : ' ,userId)      // Kiểm tra dữ liệu trả về
    
                if (response.status === 200) {
                    const filteredBookings = response.data.filter(
                        (booking) => String(booking.user_id) === userId // Lọc chỉ giữ các booking của user hiện tại
                    );
                    const formattedBookings = filteredBookings.map((booking) => ({
                        ...booking,
                        checkin: format(new Date(booking.checkin), 'yyyy-MM-dd '),
                        checkout: format(new Date(booking.checkout), 'yyyy-MM-dd '),
                        bookingTime: format(new Date(booking.bookingTime), 'yyyy-MM-dd HH:mm') 
                    }));
    
                    setBookings(formattedBookings);
                    setLoading(false);
                } else {
                    throw new Error('Failed to fetch bookings');
                }
            } catch (err) {
                console.error('Error fetching booking history:', err);
                setError('Error fetching booking history');
                setLoading(false);
            }
        };
    
        fetchBookings();
    }, []);
    

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleCancelBooking = async (bookingId) => {
        try {
            await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`); // Xóa đặt phòng
            setBookings((prev) => prev.filter((booking) => booking.id !== bookingId)); // Cập nhật danh sách đặt phòng
        } catch (err) {
            console.error('Error cancelling booking:', err);
        }
    };

    return (
        <section className="booking-history-container">
            <h2 className="section-title">Booking History</h2>
            <div className="booking-list">
                {bookings.length === 0 ? (
                    <p className="no-bookings">No bookings found.</p>
                ) : (
                    <table className="table booking-table">
                        <thead>
                            <tr>
                                <th>Tên phòng</th>
                                <th>Ngày tới</th>
                                <th>Ngày đi</th>
                                <th>Người lớn</th>
                                <th>Trẻ em</th>
                                <th>Tổng tiền</th>
                                <th>Thời gian đặt phòng</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>{booking.room_name}</td>
                                    <td>{booking.checkin}</td>
                                    <td>{booking.checkout}</td>
                                    <td>{booking.adults}</td>
                                    <td>{booking.children}</td>
                                    <td>{booking.totalPrice}</td>
                                    <td>{booking.bookingTime}</td>
                                    <td>
                                    {booking.status === 'confirmed'
                                        ? 'Đặt phòng thành công'
                                        : booking.status === 'rejected'
                                        ? 'Từ chối đặt phòng'
                                        : 'Chưa được xác nhận'}
                                </td>
                                    <td>
                                    {(
                                        <button className="cancel-btn" onClick={() => handleCancelBooking(booking.id)}>Hủy phòng</button>
                                    )}
                                </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </section>
    );
}

export default BookingHistory;
