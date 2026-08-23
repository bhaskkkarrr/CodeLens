import { motion } from "motion/react";
import GitAuth from "./components/gitAuth";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router";
import MainLayout from "./page/MainLayout";
import Home from "./page/Home";

const App = () => {
  return (
    <Routes>
      {/* Home */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
      {/* Dashboard */}
    </Routes>
  );
};

export default App;
