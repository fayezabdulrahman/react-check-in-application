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
import Loading from './components/shared/Loading';
import ErrorMessage from './components/shared/ErrorMesssage';
import Logout from './Pages/Logout';

function App() {
  const { isLoading, error } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorMessage message="An Error Occured. Please try again later..." />
    );
  }

  return (
    <>
      <BrowserRouter>
        <LocalAuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/logout" element={<Logout />} />
            <Route element={<ProtectedRoute allowedRoles={['user']} />}>
              <Route element={<Layout />}>
                <Route path="/home" index element={<Homepage />} />
                <Route
                  path="/home/availableCheckIn"
                  element={<CheckInForm />}
                />

                <Route path="/user/submitted" element={<SubmittedCheckIn />} />
              </Route>
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route element={<Layout />}>
                <Route path="/admin" element={<AvailableCheckIn />} />
                <Route path="/admin/create" element={<AdminHomepage />} />

                <Route
                  path="/admin/checkInResults"
                  element={<DetailedPublishedCheckIn />}
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
