import Homepage from './components/user/Homepage';
import ProtectedRoute from './Pages/ProtectedRoute';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './Pages/Landing';
import LocalAuthProvider from './context/LocalAuthProvider';
import AdminHomepage from './components/admin/AdminHomepage';
import DetailedPublishedCheckIn from './components/admin/DetailedPublishedCheckIn';
import { Auth0Provider } from '@auth0/auth0-react';
import AvailableCheckIn from './components/admin/AvailableCheckIn';
import ProtectedComponents from './components/shared/ProtectedComponents';
import SubmittedCheckIn from './components/user/SubmittedCheckIn';
import Layout from './Pages/Layout';
import CheckInForm from './components/user/CheckInForm';
import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';
import Loading from './components/shared/Loading';

function App() {
  const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  const { isLoading, error} = useAuth0(); // Add this
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    console.log('is loading auth 0 ', isLoading);
    console.log('is loading auth 0 ', error);
    if (!isLoading || error) {
      setAppLoading(false);
    }
  }, [isLoading, error]);

  if (appLoading) {
    return <Loading />;
  }
  if (error) {
    return <>Error {error.message}</>;
  }

  return (
    <>
      <BrowserRouter>
        {/* <Auth0Provider
          domain={auth0Domain}
          clientId={auth0ClientId}
          authorizationParams={{
            redirect_uri: window.location.origin,
            audience: auth0Audience
          }}
          cacheLocation="localstorage"
          useRefreshTokens={true}
          onError={(error) => console.error('Auth0 Error:', error)}
        > */}
          <LocalAuthProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                <Route element={<Layout />}>
                  <Route path="/home" index element={<Homepage />} />
                  <Route
                    path="/home/availableCheckIn"
                    element={<CheckInForm />}
                  />

                  <Route
                    path="/user/submitted"
                    element={<SubmittedCheckIn />}
                  />
                </Route>
              </Route>
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route element={<Layout />}>
                  <Route path="/admin" element={<AdminHomepage />} />
                  <Route
                    path="/admin/publishedCheckIn"
                    element={<DetailedPublishedCheckIn />}
                  />
                  <Route
                    path="/admin/availableCheckIn"
                    element={<AvailableCheckIn />}
                  />
                </Route>
              </Route>
            </Routes>
            <ProtectedComponents />
          </LocalAuthProvider>
        {/* </Auth0Provider> */}
      </BrowserRouter>
    </>
  );
}

export default App;
