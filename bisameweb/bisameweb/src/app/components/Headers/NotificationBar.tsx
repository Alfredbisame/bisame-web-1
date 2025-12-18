import { FC } from "react";

// interface NotificationBarProps {
//   // Component props will be defined here
// }

const NotificationBar: FC = () => {
  return (
    <div className="relative flex justify-between items-center bg-black text-white p-2 md:p-3 lg:p-4">
      <div className="text-center w-full">
        <span className="md:text-2xl font-bold">NOTIFICATION BAR</span>
      </div>
      {/* <div className="absolute right-12">
        <button className="text-white">
          <FaTimes size={24} color="#fff" />
        </button>
      </div> */}
    </div>
  );
};

export default NotificationBar;
