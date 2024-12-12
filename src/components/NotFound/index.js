import React from 'react';
import { useHistory } from 'react-router-dom';

function NotFound() {
    let history = useHistory();

    return (
        <div className='vh-100 d-flex justify-content-center text-center flex-column align-items-center'>
            <img src='/images/not-found.png' width='350' alt='page not found' />
            <h1 className='my-4'>Trang này hiện chưa nằm trong hệ thống</h1>
            <button onClick={ev => history.push('/')} className='btn btn-primary'><span>Trở về trang chủ</span></button>
        </div>
    )
}

export default NotFound
