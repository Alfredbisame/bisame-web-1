import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  count: string | number;
  label: string;
  bgColor: string;
  borderColor?: string;
  hoverColor?: string;
}

const StatCard = ({
  icon,
  count,
  label,
  bgColor,
  hoverColor = "hover:shadow-gray-200/50",
}: StatCardProps) => {
  return (
    <div
      className={`
      ${bgColor} p-2 md:p-4 rounded-xl shadow-sm
      transition-all duration-300 ease-in-out
      hover:shadow-lg ${hoverColor} hover:scale-[1.02]
      cursor-pointer group
      md:min-h-[140px]
    `}
    >
      <div className="flex items-center justify-between h-full">
        {/* Left side - Icon */}
        <div
          className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-lg 
                       bg-white/70 group-hover:bg-white/70 transition-colors
                       flex-shrink-0"
        >
          {icon}
        </div>

        {/* Right side - Count and Label */}
        <div className="flex flex-col items- flex-1 ml-2 sm:ml-4">
          <div
            className="sm:text-xl lg:text-2xl font-semibold text-gray-500 mb-1 
                         group-hover:text-gray-900 transition-colors"
          >
            {count}
          </div>
          <div
            className="text-xs sm:text-sm font-medium text-gray-500 
                         group-hover:text-gray-700 transition-colors"
          >
            {label}
          </div>
        </div>
      </div>

      {/* Subtle accent line */}
      <div className="mt-4 h-1 bg-white/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-white/60 rounded-full w-3/4 
                       group-hover:w-full transition-all duration-500"
        ></div>
      </div>
    </div>
  );
};

export default StatCard;
