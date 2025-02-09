import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute.jsx";
import Login from "../pages/Login";
import Home from "../pages/Home";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* <Route path="/" element={<PrivateRoute element={<Home />} />} /> */}
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
