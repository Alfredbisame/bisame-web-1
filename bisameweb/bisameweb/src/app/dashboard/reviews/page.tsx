import DashboardSideBar from "@/app/components/DashboardSideBar/DashboardSideBar";
import ReviewsSection from "@/app/components/ReviewsSection/ReviewsSection";

const ReviewsPage = () => {
  return (
    <>
      <div className="flex gap-6 px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-56  h-full">
        <DashboardSideBar />
        <div className="flex-1">
          <ReviewsSection />
        </div>
      </div>
    </>
  );
};

export default ReviewsPage;
