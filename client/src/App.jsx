import { Route, Routes } from "react-router";
import MainLayout from "./page/MainLayout";
import Home from "./page/Home";
import Login from "./page/Login";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        {/* Home */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/auth" element={<Login />} />
        {/* Dashboard */}
      </Routes>
    </>
  );
};

export default App;
