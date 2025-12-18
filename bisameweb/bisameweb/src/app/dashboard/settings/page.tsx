import AccountSettings from "@/app/components/AccountSettings/AccountSettings";
import DashboardSideBar from "@/app/components/DashboardSideBar/DashboardSideBar";

const SettingsPage = () => {
  return (
    <>
      <div className="flex gap-6 px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-56 h-full">
        <DashboardSideBar />
        <div className="flex-1 md:my-5">
          <AccountSettings />
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
