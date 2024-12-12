import React, { createContext, useState, useEffect, useContext } from 'react';

// Tạo context cho Authentication
export const AuthContext = createContext();

// Tạo hook useAuth để dễ dàng sử dụng context ở các component khác
export const useAuth = () => {
  return useContext(AuthContext);  // Lấy context từ AuthContext
};

// Tạo provider để bao bọc các component khác và cung cấp context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Stored User:", parsedUser);  // Kiểm tra người dùng đã lưu
      setUser(parsedUser);  // Cập nhật user trong context
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
