import React from 'react';
import './styles.scss'

function Footer() {
    return (
        <footer className='footer mt-5'>
            <ul className='d-flex flex-wrap justify-content-center align-items-center py-4'>
                <li>
                    <img src='/images/logo_mobile.png' alt='Cocos' height='36' />
                </li>
                <li>
                    <span className='ico ico-logo'></span>
                </li>
                <li>
                    <a href='/'>Điều khoản &amp; Điều kiện</a>
                </li>
                <li>
                    <a href='/'>Chính sách bảo mật</a>
                </li>
                <li>
                    <a href='/'>Hợp tác</a>
                </li>
                <li>
                    <a href='/' className='dark-blue'>sunset@gmail.com</a>
                </li>
                <li >
                    <a href='/' className='dark-blue'>SĐT: +84 795 508 242</a>
                </li>
                <li>
                    <div className='ico'></div>
                </li>
            </ul>
        </footer>
    )
}

export default Footer
