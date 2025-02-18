import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute.jsx";
import Login from "../pages/Login";
import Home from "../pages/Home";
import FouroFour from "../components/Errors/FouroFour.jsx";
import Help from "../pages/Help";
import Cart from "../pages/Cart";
import Offers from "../pages/Offers";

const AppRoutes = () => {

  return (
    <Routes>
      <Route path="*" element={<FouroFour />} />
      <Route path="/help" element={<Help />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/offers" element={<Offers />} />
      {/* <Route path="/" element={<PrivateRoute element={<Home />} />} /> */}
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
