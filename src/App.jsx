import Homepage from './components/Homepage';
import ProtectedRoute from './Pages/ProtectedRoute';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Registration from './Pages/Registration';
import AuthProvider from './context/AuthProvider';
const router = createBrowserRouter([
  {
    path: '/',
    index: true,
    element: (
      <ProtectedRoute>
        <Homepage />
      </ProtectedRoute>
    )
  },
  {
    path: '/register',
    element: <Registration />
  }
]);
function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />;
      </AuthProvider>
    </>
  );
}

export default App;
