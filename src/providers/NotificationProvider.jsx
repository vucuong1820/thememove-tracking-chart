import { Toast } from '@shopify/polaris';
import { createContext, useContext, useState } from 'react';

const defaultOptionToast = {
  message: 'Toast',
  duration: 3000,
  error: false,
};

const NotificationContext = createContext({
  showToast: () => {},
});

export const useNotificationStore = () => useContext(NotificationContext);

const NotificationProvider = ({ children }) => {
  const [openToast, setOpenToast] = useState(false);
  const [optionsToast, setOptionsToast] = useState(defaultOptionToast);

  const toggleToast = () => {
    setOpenToast(false);
  };
  const showToast = (optionsInp) => {
    setOptionsToast({
      ...defaultOptionToast,
      ...optionsInp,
    });
    setOpenToast(true);
  };
  const ctx = {
    showToast,
  };
  return (
    <NotificationContext.Provider value={ctx}>
      {children}
      {openToast && <Toast content={optionsToast.message} error={optionsToast.error} duration={optionsToast.duration} onDismiss={toggleToast} />}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
