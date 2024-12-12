import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";
import { DiscountContext } from '../../store/DiscountContext';
import { useSearchValue } from '../../store/SearchContext';
import { formatDateView } from '../../utils/formatDate';
import { useAuth } from '../../layouts/Context/AuthContext';
import SelectList from './../SelectList/index';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './style.scss';

function Reservation() {
    let history = useHistory();
    const { user } = useAuth();
    const [data, dispatch] = useSearchValue();
    const discount = useContext(DiscountContext);
    const { room, extra, step } = data;
    const price = parseFloat(room.price) || 0; // Chuyển đổi thành số
    const sum = (acc, cur) => acc + cur;

    // Tính tổng với điều kiện kiểm tra kiểu dữ liệu
    const totalExtraPrice = extra.length ? extra.map(el => parseFloat(el.price) || 0).reduce(sum, 0) : 0; // Tổng giá cho dịch vụ
    const total = price + totalExtraPrice; // Tổng giá

    // State cho ngày đặt phòng
    const [checkinDate, setCheckinDate] = useState(new Date(data.checkin));
    const [checkoutDate, setCheckoutDate] = useState(new Date(data.checkout));
    const [errorMessage, setErrorMessage] = useState('');

    // Cập nhật ngày đặt phòng
    const handleCheckinChange = (date) => {
        setCheckinDate(date);
        dispatch({
            type: 'changeSearch',
            payload: { checkin: date.toISOString().split('T')[0] }
        });
    };

    const handleCheckoutChange = (date) => {
        setCheckoutDate(date);
        dispatch({
            type: 'changeSearch',
            payload: { checkout: date.toISOString().split('T')[0] }
        });
    };


    const handleContinue = () => {
        if (!user) {
            setErrorMessage('Bạn cần đăng nhập để tiếp tục.');
            return;
        }
        dispatch({
            type: 'changeSearch',
            payload: {
                step: (step >= 3 ? 1 : step + 1),
                finished: step >= 3 ? true : false
            }
        });
        
        // Chuyển hướng đến trang thanh toán nếu bước >= 3
        if (step >= 3) {
            history.push('/payment');
        }
    };

    return (
        <section className='card'>
            <h2 className='mb-4'>
                Đặt phòng
            </h2>
            <div className='d-flex justify-content-between'>
                <h3>
                    {room.name}
                </h3>
                <SelectList name='rooms' start={1} />
            </div>
            <div className='d-flex justify-content-between mb-3'>
                <div>
                    <div className='font-weight-bold'>Ngày đến </div>
                    <DatePicker
                        selected={checkinDate}
                        onChange={handleCheckinChange}
                        dateFormat="dd/MM/yyyy"
                        className="form-item"
                    />
                </div>
                <div>
                    <div className='font-weight-bold'>Ngày đi</div>
                    <DatePicker
                        selected={checkoutDate}
                        onChange={handleCheckoutChange}
                        dateFormat="dd/MM/yyyy"
                        className="form-item"
                    />
                </div>
            </div>
            <div className='mb-3'>
                <div className='font-weight-bold'>Ngày đặt phòng </div>
                <div>Từ <strong>{formatDateView(data.checkin)}</strong> đến <strong>{formatDateView(data.checkout)}</strong></div>
            </div>
            <div className='mb-3'>
                <div className='font-weight-bold'>Số người</div>
                <div>
                    <SelectList name='adults' text='Người lớn' start={1} end={10} num={data.adults} onChange={ev => dispatch({ type: 'changeSearch', payload: { adults: ev.adults } })} />
                </div>
                <div>
                    <SelectList name='children' text='Trẻ em' start={0} end={10} num={data.children} onChange={ev => dispatch({ type: 'changeSearch', payload: { children: ev.children } })} />
                </div>
            </div>
            <div className='card-total'>
                {discount > 0 && (
                    <>
                         <div>
                            <div>Promo Code</div>
                            <div>-{discount}%</div>
                        </div>
                        <div>
                            <div>Giá phòng</div>
                            <div>€ <del>{price.toFixed(2)}</del></div> {/* Sử dụng toFixed() */}
                        </div>
                    </>
                )}
                <div className='mb-3'>
                    <div>
                        <div className='price'>Tổng</div>
                    </div>
                    <div className='price'>€ {discount
                        ? (total - (discount / 100) * total).toFixed(2) // Sử dụng toFixed() ở đây
                        : total.toFixed(2)}
                    </div>
                </div>
                {extra && extra.map(item => (
                    <div key={item.id}>
                        <div>{item.name}</div>
                        <div>€ {parseFloat(item.price).toFixed(2)}</div> {/* Chuyển đổi thành số và sử dụng toFixed() */}
                    </div>
                ))}
            </div>

            {/* Hiển thị thông báo lỗi nếu cần */}
            {errorMessage && (
                <div className='alert alert-danger'>
                    {errorMessage}
                </div>
            )}

            <button type='button' className='btn btn-primary btn-group-justified'
                onClick={handleContinue}>
              <span>Tiếp tục</span>
            </button>
        </section>
    )
}

export default Reservation;