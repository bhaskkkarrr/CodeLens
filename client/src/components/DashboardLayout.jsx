import { Outlet } from "react-router";
import SideBar from "./SideBar";
import DashNavBar from "./DashNavBar";

const DashboardLayout = () => {
  return (
    <div className="w-full  min-h-screen bg-hunter-green-50">
      <div className="flex  ">
        <div className="w-1/5 hidden md:block">
          <SideBar />
        </div>
        <div className="w-full">
          <DashNavBar />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
