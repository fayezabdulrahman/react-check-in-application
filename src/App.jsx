import Homepage from './components/user/Homepage';
import ProtectedRoute from './Pages/ProtectedRoute';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './Pages/Landing';
import LocalAuthProvider from './context/LocalAuthProvider';
import AdminHomepage from './components/admin/AdminHomepage';
import AdminProvider from './context/AdminProvider';
import UserProvider from './context/UserProvider';
import DetailedPublishedCheckIn from './components/admin/DetailedPublishedCheckIn';
import EditCheckIn from './components/admin/EditCheckIn';
import ChatPage from './Pages/ChatPage';
import { Auth0Provider } from '@auth0/auth0-react';

function App() {
  const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  return (
    <>
      <BrowserRouter>
        <Auth0Provider
          domain={auth0Domain}
          clientId={auth0ClientId}
          authorizationParams={{
            redirect_uri: window.location.origin,
            audience: auth0Audience
          }}
        >
          <LocalAuthProvider>
          <AdminProvider>
            <UserProvider>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                  <Route path="/home" index element={<Homepage />} />
                  <Route path="/chat" element={<ChatPage />} />
                </Route>
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin" element={<AdminHomepage />} />
                  <Route
                    path="/admin/publishedCheckIn"
                    element={<DetailedPublishedCheckIn />}
                  />
                  <Route path="/admin/editCheckIn" element={<EditCheckIn />} />
                </Route>
              </Routes>
            </UserProvider>
          </AdminProvider>
          </LocalAuthProvider>
        </Auth0Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
