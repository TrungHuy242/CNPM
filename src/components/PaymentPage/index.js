import React, { useContext, useState } from 'react';
import './style.scss';
import { useSearchValue } from '../../store/SearchContext'; 
import { DiscountContext } from '../../store/DiscountContext';
import { useHistory } from 'react-router-dom';
import { formatDateView } from '../../utils/formatDate';
import qrCodeImage from '../../assets/images/qr-code.png';
import axios from 'axios';
import { format } from 'date-fns';
function PaymentPage(req) {
    const [data, dispatch] = useSearchValue();
    const discount = useContext(DiscountContext);
    const { room, extra, checkin, checkout } = data;
    const history = useHistory();

    // Hàm format thời gian (được định nghĩa trước khi sử dụng)
    function formatTime(date) {
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }

    // Lấy thời gian đặt phòng
    const [bookingTime] = useState(() => {
        const now = new Date();
        return format(now, 'yyyy-MM-dd HH:mm:ss'); // Định dạng ngày giờ
    });
    

    // Calculate total price
    const sum = (acc, cur) => acc + cur;
    const totalRoomPrice = parseFloat(room.price) || 0;
    const totalExtraPrice = extra.length
        ? extra.map((el) => parseFloat(el.price) || 0).reduce(sum, 0)
        : 0;
    const total = totalRoomPrice + totalExtraPrice;

    // Tính số đêm
    const numberOfNights = Math.ceil(
        (new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24)
    );

    // Bank account information
    const accountDetails = {
        accountName: 'TRUONG MINH TRUNG HUY',
        accountNumber: '6868680610204',
        bank: 'Ngân hàng MB Bank',
        qrCodeUrl: qrCodeImage,
    };

    const handleConfirmPayment = async () => {
        const bookingInfo = {
            room: room.name,  // Phòng đang được chọn
            room_id: room.id, // ID phòng
            checkin,
            checkout,
            adults: data.adults,
            children: data.children,
            totalPrice: discount ? (total - (discount / 100) * total).toFixed(2) : total.toFixed(2),
            bookingTime,
            status: 'cancelled',  // Bạn có thể thay đổi trạng thái tùy theo logic của bạn
        };
    
        // Lấy user_id từ localStorage hoặc từ session
        const user_id = localStorage.getItem('user_id');
        if (!user_id) {
            console.log('User not authenticated');
            return;
        }
        bookingInfo.user_id = user_id;
    
        console.log('Booking Info:', bookingInfo);  // Log để kiểm tra thông tin gửi đi
    
        try {
            const response = await axios.post('http://localhost:5000/api/bookings', bookingInfo, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            console.log('Booking response:', response.data);
        } catch (error) {
            console.error('Error while saving booking:', error.response?.data || error.message);
            alert('Có lỗi xảy ra khi lưu thông tin đặt phòng');
        }
    
        dispatch({ type: 'resetSearch' });
        history.push('/');
    };
    
    
    
    
    return (
        <section className="payment-card container">
            <div className="row">
                <div className="col-md-8 payment-details">
                    <h2 className="payment-title">Hóa đơn thanh toán</h2>

                    <div className="booking-info card mb-4">
                        <div className="card-header">
                            <h3>Thông tin đặt phòng</h3>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <strong>Ngày đến:</strong> {formatDateView(checkin)} - 15:00h
                                </div>
                                <div className="col-md-6">
                                    <strong>Ngày đi:</strong> {formatDateView(checkout)} - 12:00h
                                </div>
                                <div className="col-12 mt-2">
                                    <strong>Số đêm:</strong> {numberOfNights}
                                </div>
                                <div className="col-12 mt-2">
                                    <strong>Thời gian đặt phòng:</strong>  {bookingTime || "Chưa xác định"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="room-info card mb-4">
                        <div className="card-header">
                            <h3>Thông tin phòng</h3>
                        </div>
                        <div className="card-body">
                            <div>
                                <strong>Tên phòng:</strong> {room.name}
                            </div>
                            <div>
                                <strong>Giá phòng:</strong> € {totalRoomPrice.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    <div className="extra-info card">
                        <div className="card-header">
                            <h3>Thông tin dịch vụ thêm</h3>
                        </div>
                        <div className="card-body">
                            {extra.length > 0 ? (
                                extra.map((item) => (
                                    <div
                                        key={item.id}
                                        className="extra-item d-flex justify-content-between"
                                    >
                                        <strong>{item.name}</strong>
                                        <span>€ {parseFloat(item.price).toFixed(2)}</span>
                                    </div>
                                ))
                            ) : (
                                <div>Không có dịch vụ thêm.</div>
                            )}

                            <hr />
                            <div className="total-info d-flex justify-content-between">
                                <div className="font-weight-bold">Tổng tiền</div>
                                <div className="font-weight-bold">
                                    €{' '}
                                    {discount
                                        ? (total - (discount / 100) * total).toFixed(2)
                                        : total.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 payment-bank-info">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="payment-title">Thông tin chuyển khoản</h2>
                        </div>
                        <div className="card-body">
                            <p>
                                <strong>Tên tài khoản:</strong> {accountDetails.accountName}
                            </p>
                            <p>
                                <strong>Số tài khoản:</strong> {accountDetails.accountNumber}
                            </p>
                            <p>
                                <strong>Ngân hàng:</strong> {accountDetails.bank}
                            </p>
                            <div className="qr-code text-center">
                                <img
                                    src={accountDetails.qrCodeUrl}
                                    alt="QR Code"
                                    className="qr-image img-fluid"
                                />
                            </div>
                            <div className="payment-option mt-3">
                                <div className="custom-control custom-checkbox">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="atCounter"
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="atCounter"
                                    >
                                        Chọn thanh toán tại quầy
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center mt-4">
                <button
                    className="btn btn-primary btn-lg btn-confirm"
                    onClick={handleConfirmPayment}
                >
                    <span>Xác nhận đặt phòng</span>
                </button>
            </div>
        </section>
    );
}

export default PaymentPage;
