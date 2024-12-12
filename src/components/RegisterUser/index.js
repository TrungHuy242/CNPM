import React, { useState } from 'react';
import axios from 'axios';
import './style.scss';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Thêm khai báo cho successMessage

  const handleRegister = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu và mật khẩu nhập lại không khớp!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        fullName,
        username,
        dob,
        gender,
        phone,
        email,
        password,
      });
      setSuccessMessage('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
      setErrorMessage('');
      setTimeout(() => {
        window.location.href = '/login';  // Điều hướng tới trang đăng nhập
      }, 0);
    } catch (error) {
      console.error(error);
      
      // Kiểm tra lỗi có từ phản hồi trả về từ server
      if (error.response) {
        // Nếu có phản hồi từ server, bạn có thể truy cập error.response.data để lấy chi tiết thông báo lỗi
        setErrorMessage(error.response.data.message || 'Đăng ký thất bại');
      } else {
        // Nếu không có phản hồi (ví dụ, lỗi mạng), thông báo lỗi chung
        setErrorMessage('Đăng ký thất bại do lỗi mạng hoặc server không phản hồi');
      }
      setSuccessMessage('');
    }
};

  return (
    <div className="register-background">
      <div className="register-container">
        <img src="https://inkythuatso.com/uploads/thumbnails/800/2021/12/logo-truong-dai-hoc-kien-truc-da-nang-inkythuatso-01-25-15-58-10.jpg" className="register-logo" />
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="fullName">Họ và tên</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
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
            <label htmlFor="dob">Năm sinh</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Giới tính</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Đăng ký</button>
        </form>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {/* Hiển thị successMessage */}
        <p>
          Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
