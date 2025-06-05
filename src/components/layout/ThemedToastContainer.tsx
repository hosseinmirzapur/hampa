import React from 'react';
import { ToastContainer, Slide, ToastContainerProps } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../../contexts/ThemeContext';

const ThemedToastContainer: React.FC<ToastContainerProps> = (props) => {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={true} // Assuming RTL is still desired based on original App.tsx
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme} // Dynamically set theme from context
      transition={Slide}
      {...props} // Spread any additional props
    />
  );
};

export default ThemedToastContainer;
