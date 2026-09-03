import { Navigate, Route, Routes, useNavigate } from "react-router";
import Home from "./page/Home";
import Login from "./page/Login";
import { Toaster } from "react-hot-toast";
import VerifyOTP from "./page/VerifyOTP";
import DashboardLayout from "./components/DashboardLayout";
import HomeBackground from "./components/HomeBackground";
import Dashboard from "./page/Dashboard";
import { useAuth } from "./context/AuthContext";
import Page404 from "./page/Page404";
import { FullScreenLoader } from "./components/Loaders";
const App = () => {
  const { token, isAuthenticating } = useAuth();

  if (isAuthenticating) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <Toaster />
      <Routes>
        {/* Home */}
        <Route element={<HomeBackground />}>
          <Route
            path="/"
            element={token ? <Navigate to="/dashboard" replace /> : <Home />}
          />

          <Route
            path="/auth"
            element={token ? <Navigate to="/dashboard" replace /> : <Login />}
          />

          <Route
            path="/verify-otp"
            element={
              token ? <Navigate to="/dashboard" replace /> : <VerifyOTP />
            }
          />
        </Route>

        {/* Dashboard */}
        {!isAuthenticating && token && (
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
        )}

        <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  );
};

export default App;
