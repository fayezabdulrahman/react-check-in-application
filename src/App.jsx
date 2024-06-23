import Homepage from './components/Homepage';
import ProtectedRoute from './Pages/ProtectedRoute';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Registration from './Pages/Registration';
import AuthProvider from './context/AuthProvider';
import AdminHomepage from './components/admin/AdminHomepage';
import AdminProvider from './context/AdminProvider';
import UserProvider from './context/UserProvider';

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <AdminProvider>
            <UserProvider>
              <Routes>
                <Route path="/register" element={<Registration />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/" index element={<Homepage />} />
                  <Route path="/admin" element={<AdminHomepage />} />
                </Route>
              </Routes>
            </UserProvider>
          </AdminProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
