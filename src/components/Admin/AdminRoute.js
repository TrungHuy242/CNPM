import { useAuth } from '../../layouts/Context/AuthContext'; 
import { Redirect, Route } from 'react-router-dom';

const AdminRoute = ({ children, ...rest }) => {
    const { user } = useAuth();  // Lấy thông tin người dùng từ context

    return (
        <Route
            {...rest}
            render={({ location }) =>
                user ? (
                    user.role === 1 ? (  // Kiểm tra xem user có phải là admin không
                        children
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/",
                                state: { from: location }
                            }}
                        />
                    )
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
};

  
  

export default AdminRoute;  // Đảm bảo rằng bạn đã export component này