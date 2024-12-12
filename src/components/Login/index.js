import React, { useState } from 'react';
import { useAuth } from '../../layouts/Context/AuthContext';  // Import useAuth hook
import axios from 'axios';
import { useHistory } from 'react-router-dom';  // Import useHistory
import './style.scss';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useAuth();  // Dùng login từ context
  const history = useHistory();  // Khai báo useHistory để điều hướng

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            username,
            password,
        });

        const { username: userName, role ,id} = response.data.user;
        console.log("Role:", role);  // Kiểm tra xem role có phải là 1 không

        login({ username: userName, role });

        // Lưu thông tin vào localStorage
        localStorage.setItem('user', JSON.stringify({ username: userName, role }));
        localStorage.setItem('user_id', id);  // Lưu user_id vào localStorage
        localStorage.setItem('role', role);
        console.log('Đăng nhập thành công, user_id lưu vào localStorage:', id);  // Kiểm tra giá trị user_id

        setSuccessMessage(response.data.message);
        setErrorMessage('');

        setTimeout(() => {
            if (role === 1) {
                console.log("Redirecting to admin page");  // Kiểm tra điều hướng
                history.push('/admin');
            } else {
                history.push('/');
            }
        }, 1000);
    } catch (error) {
        console.error(error);
        if (error.response) {
            setErrorMessage(error.response.data.error || 'Đăng nhập thất bại');
        } else {
            setErrorMessage('Đăng nhập thất bại do lỗi mạng hoặc server không phản hồi');
        }
        setSuccessMessage('');
    }
};


  
  

  return (
    <div className="login-background">
      <div className="login-container">
      <img src="https://inkythuatso.com/uploads/thumbnails/800/2021/12/logo-truong-dai-hoc-kien-truc-da-nang-inkythuatso-01-25-15-58-10.jpg" className="login-logo" />
        <h1>Đăng Nhập</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Đăng nhập</button>
        </form>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

        <p>
          Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
        </p>
      </div>
    </div>
  );
};

export default Login;