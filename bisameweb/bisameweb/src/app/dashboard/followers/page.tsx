import DashboardSideBar from "@/app/components/DashboardSideBar/DashboardSideBar";
import FollowersFollowing from "@/app/components/FollowersFollowing/FollowersFollowing";

const FollowingPage = () => {
  return (
    <>
      <div className="flex flex-row md:gap-8 px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-56 gap-2">
        <DashboardSideBar />
        <div className="flex-1 w-4/5 md:w-full">
          <FollowersFollowing />
        </div>
      </div>
    </>
  );
};

export default FollowingPage;
