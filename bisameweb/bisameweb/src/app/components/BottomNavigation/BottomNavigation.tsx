"use client";

import React from "react";
import { useRouter } from "next/navigation";
import BottomNavItem from "./BottomNavItem";
import { TbCategory2, TbHomeRibbon } from "react-icons/tb";
import { GoPlusCircle } from "react-icons/go";
import { TiMessages } from "react-icons/ti";
import { LuUserCheck } from "react-icons/lu";
import { IconType } from "react-icons";
import useActiveTab, { defaultActive } from "./hooks/useActiveTab";

interface NavigationItem {
  id: defaultActive;
  icon: IconType;
  label: string;
  href?: string;
}

interface BottomNavigationProps {
  className?: string;
  items?: NavigationItem[];
  activeTab?: defaultActive;
  defaultActive?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  className = "",
  items,
  activeTab,
}) => {
  const { active, setActiveTab } = useActiveTab(activeTab);
  const router = useRouter();

  const defaultItems: NavigationItem[] = [
    { id: "home", icon: TbHomeRibbon, label: "Home", href: "/" },
    {
      id: "categories",
      icon: TbCategory2,
      label: "Categories",
      href: "/categories",
    },
    { id: "post", icon: GoPlusCircle, label: "Post", href: "/posts" },
    {
      id: "messages",
      icon: TiMessages,
      href: "/dashboard/chat-messages",
      label: "Messages",
    },
    {
      id: "my-bisame",
      icon: LuUserCheck,
      label: "My Bisame",
      href: "/dashboard",
    },
  ];

  const navigationItems = items || defaultItems;

  const handleItemClick = (item: NavigationItem) => {
    setActiveTab(item.id);
    if (item.href) router.push(item.href);
  };

  return (
    <nav
      className={`my-10 mx-5 max-w-sm sm:max-w-md bg-gradient-to-r from-blue-900 to-blue-800 rounded-full p-3 sm:p-4 flex justify-between items-center shadow-[0_0_10px_#2563eb] md:hidden ${className}`}
    >
      {navigationItems.map((item) => (
        <BottomNavItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          isActive={active === item.id}
          onClick={() => handleItemClick(item)}
        />
      ))}
    </nav>
  );
};

export default BottomNavigation;
