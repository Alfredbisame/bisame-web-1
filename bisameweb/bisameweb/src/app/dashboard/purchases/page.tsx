import DashboardSideBar from "@/app/components/DashboardSideBar/DashboardSideBar";
import PromotionPlan from "@/app/components/PromotionPlan/PromotionPlan";

const purchasesPage = () => {
  return (
    <>
      <div className="flex flex-row md:gap-8 px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-56 gap-2">
        <DashboardSideBar />
        <div className="flex-1 w-[87%] md:w-full my-2">
          <PromotionPlan />
        </div>
      </div>
    </>
  );
};

export default purchasesPage;
