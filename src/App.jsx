import Homepage from './components/user/Homepage';
import ProtectedRoute from './Pages/ProtectedRoute';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './Pages/Landing';
import LocalAuthProvider from './context/LocalAuthProvider';
import AdminHomepage from './components/admin/AdminHomepage';
import DetailedPublishedCheckIn from './components/admin/DetailedPublishedCheckIn';
import AvailableCheckIn from './components/admin/AvailableCheckIn';
import ProtectedComponents from './components/shared/ProtectedComponents';
import SubmittedCheckIn from './components/user/SubmittedCheckIn';
import Layout from './Pages/Layout';
import CheckInForm from './components/user/CheckInForm';
import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';
import Loading from './components/shared/Loading';

function App() {
  const { isLoading, error} = useAuth0();
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
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
      </BrowserRouter>
    </>
  );
}

export default App;
