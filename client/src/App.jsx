import { BrowserRouter as Router } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/slice/authSlice";
import AppRoutes from "./routes/AppRoutes";
import { NotificationProvider } from "./context/NotificationProvider";
import { LoaderProvider } from "./context/LoaderContext";
import "./index.css";
import ErrorBoundary from "./context/ErrorBoundary";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      dispatch(setUser({ user: JSON.parse(storedUser), token: storedToken }));
    }
  }, [dispatch]);

  return (
    <Router>
      <ErrorBoundary>
        <LoaderProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </LoaderProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
