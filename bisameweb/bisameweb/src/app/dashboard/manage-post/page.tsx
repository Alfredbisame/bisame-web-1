import DashboardSideBar from "@/app/components/DashboardSideBar/DashboardSideBar";
import ProductTabs from "@/app/components/ManagePost/ProductTabs";

const PostPage = () => {
  return (
    <>
      <div className="flex flex-row md:gap-8 px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-56 gap-2 relative ">
        <DashboardSideBar />
        <div className="md:w-full mr-3 md:my-5">
          <ProductTabs />
        </div>
      </div>
    </>
  );
};

export default PostPage;
