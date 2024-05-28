import Homepage from './components/Homepage';
import AdminHomepage from './components/AdminHomepage';
import ProtectedRoute from './Pages/ProtectedRoute';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from './components/Signup';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Signup />
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
      <RouterProvider router={router} />;
    </>
  );
}

export default App;
