import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useSelector } from "react-redux";
import useGetCity from "./hooks/useGetCity";
import useGetMyShop from "./hooks/useGetMyShop";
import CreateEditShop from "./pages/CreateEditShop";
import AddItemModal from "./components/AddItemModal";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import CategoryPage from "./pages/CategoryPage";
import BuyItemPage from "./pages/BuyItemPage";
import CustomBoxPage from "./pages/CustomBoxPage";

export const serverUrl = "http://localhost:9000";

function App() {
  useGetCurrentUser();
  useGetCity();
  useGetMyShop();

  const { userData } = useSelector((state) => state.user);

  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/" />}
      />

      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to="/" />}
      />

      <Route
        path="/forgot-password"
        element={!userData ? <ForgotPassword /> : <Navigate to="/" />}
      />
      <Route
        path="/create-edit-shop"
        element={userData ? <CreateEditShop /> : <Navigate to="/signin" />}
      />
      <Route
        path="/add-item-modal"
        element={userData ? <AddItemModal /> : <Navigate to="/signin" />}
      />
      <Route
        path="/orders"
        element={userData ? <MyOrders /> : <Navigate to="/signin" />}
      />
      <Route
        path="/profile"
        element={userData ? <Profile /> : <Navigate to="/signin" />}
      />
      <Route
        path="/settings"
        element={userData ? <Settings /> : <Navigate to="/signin" />}
      />
      <Route
        path="/category/:categoryName"
        element={<CategoryPage />}
      />
      <Route
        path="/buy-item/:itemId"
        element={userData ? <BuyItemPage /> : <Navigate to="/signin" />}
      />
      <Route
        path="/custom-box"
        element={userData ? <CustomBoxPage /> : <Navigate to="/signin" />}
      />
    </Routes>
  );
}

export default App;