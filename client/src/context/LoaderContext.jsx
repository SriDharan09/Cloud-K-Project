import React, { createContext, useState, useContext } from "react";
import { Spin } from "antd";
import "../index.css";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
      {loading && <FullScreenLoader />}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);

const FullScreenLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px] z-50">
    <Spin size="large" />
  </div>
);
