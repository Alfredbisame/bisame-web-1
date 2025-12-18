"use client";
import DashboardSideBar from "@/app/components/DashboardSideBar/DashboardSideBar";
import Messages from "../../Messages/Messages";
import { useProfileData } from "@/app/components/Dashboard/useProfileData";
import ChatContextProvider from "@/app/Messages/context/ChatContext";
import { BottomNavigation } from "@/app/components/BottomNavigation";

interface Message {
  productTitle?: string;
  userId?: string;
  userName?: string;
}
const MessagePage = () => {
  const { data, fullName } = useProfileData();

  const initialContext: Message = {
    userId: data?.id,
    userName: fullName,
  };

  return (
    <>
      <div className="flex flex-row md:gap-8 px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-56 gap-2 relative ">
        <DashboardSideBar />
        <div className="flex-1 md:w-full my-2 mr-2 md:my-5 md:mr-0">
          <ChatContextProvider>
            <Messages initialContext={initialContext} />
          </ChatContextProvider>
        </div>
      </div>
      <BottomNavigation activeTab="my-bisame" />
    </>
  );
};

export default MessagePage;
