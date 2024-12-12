import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.scss';
import BookingSteps from './components/BookingSteps/index';
import Confirmation from './components/Confirmation/index';
import NotFound from './components/NotFound/index';
import DefaultLayout from './layouts/default/index';
import BookingRoutes from './routes/booking-routes';
import Login from './components/Login/index';
import AuthLayout from './layouts/HeadFoot/AuthLayout';
import RegisterUser from './components/RegisterUser/index'; 
import PaymentPage from './components/PaymentPage/index';
import { AuthProvider } from './layouts/Context/AuthContext';
import ParentComponent from './components/ParentComponent'; 
import BookingHistory from './components/BookingHistory/index';
import AdminRoute from './components/Admin/AdminRoute';
import AdminDashboard from './components/Admin/AdminDashboard';
import Notifications from './components/Notifications/index';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <BookingRoutes path="/" exact component={BookingSteps} />

          <Route path="/payment">
            <DefaultLayout>
              <PaymentPage />
            </DefaultLayout>
          </Route>

          <Route path="/confirmation">
            <DefaultLayout>
              <Confirmation />
            </DefaultLayout>
          </Route>

          <Route path="/login">
            <AuthLayout>  {/* Bao bọc Login trong AuthLayout */}
              <Login />
            </AuthLayout>
          </Route>

          <Route path="/register">
            <AuthLayout>
              <RegisterUser />
            </AuthLayout>
          </Route>

          <Route path="/parent">
            <DefaultLayout>
              <ParentComponent /> {/* Use the ParentComponent here */}
            </DefaultLayout>
          </Route>

          <Route path="/history">  {/* Thêm Route cho BookingHistory */}
            <DefaultLayout>
              <BookingHistory />  {/* Hiển thị BookingHistory */}
            </DefaultLayout>
          </Route> 

          <Route path="/notifications">  
            <DefaultLayout>
              <Notifications /> 
            </DefaultLayout>
          </Route> 

          <Route path="/admin">
              <AdminRoute>
                  <AdminDashboard /> {/* Trang quản trị dành cho admin */}
              </AdminRoute>
          </Route>

          <Route>
            <DefaultLayout>
              <NotFound />
            </DefaultLayout>
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
