import { Route, Routes } from "react-router";
import Home from "./page/Home";
import Login from "./page/Login";
import { Toaster } from "react-hot-toast";
import VerifyOTP from "./page/VerifyOTP";
import DashboardLayout from "./components/DashboardLayout";
import HomeBackground from "./components/HomeBackground";
import Dashboard from "./page/Dashboard";
const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        {/* Home */}
        <Route element={<HomeBackground />}>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
        </Route>
        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="/dashboard/" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
