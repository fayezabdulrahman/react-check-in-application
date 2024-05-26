import Homepage from './components/Homepage';
import Navigation from './components/Navigation';
import AdminHomepage from './components/AdminHomepage';
function App() {
  const isAdmin = true;
  return (
    <>
      <Navigation />
      {isAdmin ? <AdminHomepage /> : <Homepage />}
    </>
  );
}

export default App;
