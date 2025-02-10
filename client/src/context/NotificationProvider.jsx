import React, { createContext, useContext } from "react";
import { notification } from "antd";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  const statusToType = {
    200: "success",
    201: "success",
    400: "error",
    401: "error",
    403: "error",
    404: "warning",
    500: "error",
  };

  // Open notification safely
  const openNotification = ( status, message, description ) => {
    console.log(status, message, description);
    
    const type = statusToType[status] || "info"; 
    
    if (!message || !description) return; 

    api[type]({
      message: String(message),
      description: String(description),
    });
  };

  return (
    <NotificationContext.Provider value={openNotification}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
