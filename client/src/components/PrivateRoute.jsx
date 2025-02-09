import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState,useEffect } from "react";

const PrivateRoute = ({ element }) => {
  const { user } = useSelector((state) => state.auth);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [user]);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return user ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
