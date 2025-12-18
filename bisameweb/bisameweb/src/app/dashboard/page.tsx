import DashboardSideBar from "../components/DashboardSideBar/DashboardSideBar";
import DashboardContent from "../components/Dashboard/DashboardContent";
import BrowsingHistory from "../components/BrowsingHistory/BrowsingHistory";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import { BottomNavigation } from "../components/BottomNavigation";

const DashboardPage = () => {
  return (
    <>
      <div>
        <div className="flex flex-row md:gap-8 px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-56 gap-2 relative ">
          <DashboardSideBar />
          <div className="flex-1 md:w-full my-2 mr-2 md:mr-0 md:my-5">
            <DashboardHeader />
            <DashboardContent />
            <BrowsingHistory />
          </div>
        </div>
      </div>
      <BottomNavigation />
    </>
  );
};

export default DashboardPage;
