import { Navigate, Route, Routes, useNavigate } from "react-router";
import Home from "./page/Home";
import Login from "./page/Login";
import { Toaster } from "react-hot-toast";
import VerifyOTP from "./page/VerifyOTP";
import DashboardLayout from "./components/DashboardLayout";
import HomeBackground from "./components/HomeBackground";
import { useAuth } from "./context/AuthContext";
import Page404 from "./page/Page404";
import { FullScreenLoader } from "./components/Loaders";
import Settings from "./page/Settings";
import Repositories from "./page/Repositories";
import Conversation from "./page/Conversation";
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
            path="/home"
            element={token ? <Navigate to="/repositories" replace /> : <Home />}
          />

          <Route
            path="/auth"
            element={token ? <Navigate to="/repositories" replace /> : <Login />}
          />

          <Route
            path="/verify-otp"
            element={
              token ? <Navigate to="/repositories" replace /> : <VerifyOTP />
            }
          />
        </Route>

        {/* Dashboard */}
        {!isAuthenticating && token && (
          <Route element={<DashboardLayout />}>
            <Route path="/repositories" element={<Repositories />} />
            <Route path="/c/:conversationId" element={<Conversation />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        )}

        <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  );
};

export default App;
