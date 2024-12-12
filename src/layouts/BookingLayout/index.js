import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from '../../components/Footer/index';
import Header from '../../components/Header/index';
import Reservation from '../../components/Reservation/index';
import Search from '../../components/Search/index';
import { DiscountProvider } from '../../store/DiscountContext';
import { RoomProvider } from '../../store/RoomContext';
import { SearchProvider } from '../../store/SearchContext';
import './style.scss';

function BookingLayout({ children }) {
    const [discount, setDiscount] = useState(0);
    const path = useLocation().search;

    useEffect(() => {
        if (path) {
            const promo_code = path.match(/promo_code=\d{1,3}/ig);
            if (promo_code) {
                setDiscount(parseInt(promo_code[0].split("=")[1]));
            }
        }
    }, []);

    return (
        <DiscountProvider initVal={discount}>
            <SearchProvider>
                <RoomProvider>
                    <div className='app'>
                        <Header />
                        <Search />
                        <div className='container'>
                            <div className='row'>
                                <main className='col-md-8'>
                                    {children}
                                </main>
                                <aside className='col-md-4'>
                                    <section className='mb-4'>
                                        <img src='/images/coco-drink.png' width='300' alt='' />
                                        <h2 className='text-uppercase font-weight-bold'>DUY NHẤT HÔM NAY: GIẢM 10% </h2>
                                        <p>Đặt phòng <span className='text-underline'>hôm nay</span> và nhận ưu đãi <strong>10% độc quyền</strong> cho kỳ nghĩ của bạn.</p>
                                        <button className='btn btn-primary text-uppercase'><span>Tận hưởng</span></button>
                                    </section>
                                    <Reservation />
                                </aside>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </RoomProvider>
            </SearchProvider >
        </DiscountProvider>
    )
}

export default BookingLayout  