import { BrowserRouter as Router } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/slice/authSlice";
import AppRoutes from "./routes/AppRoutes";


// Context Providers
import { NotificationProvider } from "./context/NotificationProvider";
import { LoaderProvider } from "./context/LoaderContext";
import { ModalProvider } from "./context/ModalContext";
import ErrorBoundary from "./context/ErrorBoundary";
import NotificationListener from "./utils/NotificationListener";

// Global Components
import Layout from "./components/Layout";

// Styles
import "./index.css";


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
    <ErrorBoundary>
      <Router>
        <LoaderProvider>
          <NotificationProvider>
            <ModalProvider>
              <Layout>
                <NotificationListener /> 
                <AppRoutes />
              </Layout>
            </ModalProvider>
          </NotificationProvider>
        </LoaderProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
