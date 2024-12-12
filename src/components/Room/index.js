import React, { useContext } from 'react';
import './style.scss';
import { SearchContext } from '../../store/SearchContext';
import { DiscountContext } from '../../store/DiscountContext';

function Room({ info, selected }) {
    const [, dispatch] = useContext(SearchContext);
    const discount = useContext(DiscountContext);
    const { price } = info;

    // Định dạng giá phòng
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);

    // Định dạng giá sau giảm
    const discountedPrice = discount > 0 ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price - (discount / 100 * price)) : null;

    return (
        <div className={`card ${selected ? `card-active` : ``} flex flex-row pl-0`}
            onClick={ev => dispatch({
                type: 'changeSearch',
                payload: {
                    room: {
                        id: info.id,
                        name: info.name,
                        price: info.price,
                    }
                }
            })}>
            <img src={`/images/${info.photo || 'default-room.jpg'}`} alt={info.name} className='card-img' />
            <div>
                <h3>{info.name}</h3>
                <p>{info.description}</p>
                <p>Diện tích: {info.size}m2</p>
                <div className='d-flex align-items-end justify-content-between'>
                    <div>
                        <img src="/images/icons/double-bed.svg" width="40" alt='' />
                        <div>Giường: {info.beds}</div>
                    </div>
                    <div>
                        Số người: {info.capacity}
                    </div>
                    <div className='price'>
                        {discountedPrice && (
                            <>
                                <div className='font-weight-normal text-right'>
                                    <small><del>{formattedPrice}</del></small>
                                </div>
                                <div>{discountedPrice}</div>
                            </>
                        )}
                        {!discountedPrice && <span>{formattedPrice}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Room;
