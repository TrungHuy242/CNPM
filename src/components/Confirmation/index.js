import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { SearchContext } from '../../store/SearchContext';

function Confirmation() {
    const [data] = useContext(SearchContext);
    const { step, finished } = data;
    let history = useHistory();

    if (step < 4 && !finished) {
        history.push('/');
        return null;
    }

    return (
        <div className="vh-100 d-flex justify-content-center flex-column text-center dark-blue">
            <h1>Cảm ơn bạn đã đặt phòng!</h1>
            <h2>Chúng tôi đã nhận được thanh toán của bạn. Vui lòng kiểm tra lịch sử đặt phòng để biết thêm chi tiết.</h2>
            <div>
                <button 
                    onClick={ev => history.push('/')} 
                    className="btn btn-primary my-3">
                    <span>Trở về trang chủ </span>
                </button>
            </div>
        </div>
    );
}

export default Confirmation;
