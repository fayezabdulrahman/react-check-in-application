import Homepage from './components/Homepage';
import AdminHomepage from './components/AdminHomepage';
import ProtectedRoute from './Pages/ProtectedRoute';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Registration from './Pages/Registration';
import UserProvider from './hooks/auth';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Registration />
  },
  {
    path: '/homepage',
    element: <ProtectedRoute role="user" redirectTo="/" />,
    children: [{ index: true, element: <Homepage /> }]
  },
  {
    path: '/admin',
    element: <ProtectedRoute role="admin" redirectTo="/" />,
    children: [{ index: true, element: <AdminHomepage /> }]
  }
]);
function App() {
  return (
    <>
      <UserProvider>
        <RouterProvider router={router} />;
      </UserProvider>
    </>
  );
}

export default App;
