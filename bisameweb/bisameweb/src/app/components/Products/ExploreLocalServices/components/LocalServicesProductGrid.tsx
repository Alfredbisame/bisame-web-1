"use client";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Product } from "../types";
import LocalServicesProductCard from "./LocalServicesProductCard";
import { useRef, useState } from "react";

interface LocalServicesProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const LocalServicesProductGrid = ({
  products,
  onProductClick,
}: LocalServicesProductGridProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (scrollAmount: number) => {
    const newScrollPosition = scrollPosition + scrollAmount;
    if (scrollRef.current && newScrollPosition >= 0) {
      setScrollPosition(newScrollPosition);
      scrollRef.current.scrollLeft = newScrollPosition;
    }
  };

  return (
    <div className="relative">
      <div
        className={`right-nav absolute -left-4 inset-y-0 h-full flex justify-center items-center z-[99]  ${
          products.length > 5 ? "md:flex" : "md:hidden"
        } ${scrollPosition == 0 ? "hidden" : ""} `}
      >
        <MdKeyboardArrowLeft
          size={30}
          color="white"
          className="bg-[#00000022] rounded-full cursor-pointer"
          onClick={() => handleScroll(-200)}
        />
      </div>
      <div
        ref={scrollRef}
        className="flex overflow-y-auto scroll-smooth md:overflow-y-visible scrollbar-hide md:grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-4 gap-6 p-2"
      >
        {products.map((product: Product, index: number) => (
          <LocalServicesProductCard
            key={index}
            product={product}
            index={index}
            onClick={onProductClick}
          />
        ))}
      </div>
      <div className="right-nav absolute -right-4 inset-y-0 h-full flex justify-center items-center z-[99] md:hidden">
        <MdKeyboardArrowRight
          size={30}
          color="white"
          className="bg-[#00000033] rounded-full"
          onClick={() => handleScroll(200)}
        />
      </div>
    </div>
  );
};

export default LocalServicesProductGrid;
