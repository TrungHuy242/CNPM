// src/layouts/HeadFoot/AuthLayout.js
import React from 'react';
import Header from '../../components/Header';  // Đảm bảo đường dẫn chính xác
import Footer from '../../components/Footer';

const AuthLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;
