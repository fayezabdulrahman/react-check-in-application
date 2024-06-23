import { useContext, createContext, useState } from 'react';
import { INTIAL_CHECKIN_STATE } from '../constants/application';

const AdminContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAdmin = () => {
  const adminContext = useContext(AdminContext);

  if (!AdminContext) {
    throw new Error('useAdmin must be used within a AdminProvider');
  }

  return adminContext;
};
const AdminProvider = ({ children }) => {
  const [checkIn, setCheckIn] = useState(INTIAL_CHECKIN_STATE);
  const [submittedCheckIns, setSubmittedCheckIns] = useState([]);
  const [publishedCheckIn, setPublishedCheckIn] = useState(INTIAL_CHECKIN_STATE);

  function publishCheckIn() {
    setCheckIn((prevState) => ({
      ...prevState,
      published: true
    }));
  }


  const ctxValue = {
    publishCheckIn,
    setCheckIn,
    checkIn,
    submittedCheckIns,
    setSubmittedCheckIns,
    publishedCheckIn,
    setPublishedCheckIn
  };

  return (
    <AdminContext.Provider value={ctxValue}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
