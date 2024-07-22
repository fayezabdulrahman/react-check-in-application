import Homepage from './components/user/Homepage';
import ProtectedRoute from './Pages/ProtectedRoute';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Registration from './Pages/Registration';
import AuthProvider from './context/AuthProvider';
import AdminHomepage from './components/admin/AdminHomepage';
import AdminProvider from './context/AdminProvider';
import UserProvider from './context/UserProvider';
import DetailedPublishedCheckIn from './components/admin/DetailedPublishedCheckIn';
import EditCheckIn from './components/admin/EditCheckIn';
import ChatPage from './Pages/ChatPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <AdminProvider>
            <UserProvider>
                <Routes>
                  <Route path="/" element={<Registration />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/home" index element={<Homepage />} />
                    <Route path="/admin" element={<AdminHomepage />} />
                    <Route
                      path="/admin/publishedCheckIn"
                      element={<DetailedPublishedCheckIn />}
                    />
                    <Route
                      path="/admin/editCheckIn"
                      element={<EditCheckIn />}
                    />
                    <Route path="/chat" element={<ChatPage />} />
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
