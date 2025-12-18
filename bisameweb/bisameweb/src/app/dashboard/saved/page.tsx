import DashboardSideBar from "@/app/components/DashboardSideBar/DashboardSideBar";
import SavedProducts from "./../../components/SavedProducts/SavedProducts";

const SavedProductsPage = () => {
  return (
    <>
      <div className="flex flex-row md:gap-8 px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-56 gap-2">
        <DashboardSideBar />
        <div className="flex-1 w-4/5 md:w-full">
          <SavedProducts />
        </div>
      </div>
    </>
  );
};

export default SavedProductsPage;
