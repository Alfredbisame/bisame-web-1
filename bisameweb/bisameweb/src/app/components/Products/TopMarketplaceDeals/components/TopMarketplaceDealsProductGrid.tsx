"use client";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Product } from "../types";
import TopMarketplaceDealsProductCard from "./TopMarketplaceDealsProductCard";
import { useRef, useState } from "react";

interface TopMarketplaceDealsProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const TopMarketplaceDealsProductGrid = ({
  products,
  onProductClick,
}: TopMarketplaceDealsProductGridProps) => {
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
        className="flex overflow-y-auto md:overflow-y-visible scroll-smooth scrollbar-hide md:grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-4 gap-6"
      >
        {products.map((product: Product, index: number) => (
          <TopMarketplaceDealsProductCard
            key={index}
            product={product}
            index={index}
            onClick={onProductClick}
          />
        ))}
      </div>

      <div className="right-nav absolute -right-4 inset-y-0 h-full flex justify-center items-center p-2 z-[99] md:hidden">
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

export default TopMarketplaceDealsProductGrid;
