import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute.jsx";
import Login from "../pages/Login";
import Home from "../pages/Home";
import FouroFour from "../components/Errors/FouroFour.jsx";
import Help from "../pages/Help";
import Cart from "../pages/Cart";
import Offers from "../pages/Offers";
import EditProfile from "../pages/EditProfile";
import Orders from "../pages/Orders";
import BranchDetails from "../components/ordersDependency/BranchDetails.jsx";
import CheckoutPage from "../pages/CheckoutPage.jsx";
import OrderSummary from "../components/ordersDependency/OrderSummary.jsx";

//utils
import ScrollToTop from "../utils/ScrollToTop.jsx";

const AppRoutes = () => {
  return (
    <>
      {/* ScrollToTop component should be outside Routes */}
      <ScrollToTop />

      <Routes>
        <Route path="*" element={<FouroFour />} />
        <Route path="/help" element={<Help />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/order-food" element={<Orders />} />
        <Route path="/order-food/:branchSlug" element={<BranchDetails />} />
        <Route path="/cart/:id" element={<CheckoutPage />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        {/* <Route path="/" element={<PrivateRoute element={<Home />} />} /> */}
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
