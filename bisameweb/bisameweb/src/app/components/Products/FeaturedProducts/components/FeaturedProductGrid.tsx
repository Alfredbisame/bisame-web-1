import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Product } from "../types";
import FeaturedProductCard from "./FeaturedProductCard";
import { useRef, useState } from "react";

interface FeaturedProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const FeaturedProductGrid = ({
  products,
  onProductClick,
}: FeaturedProductGridProps) => {
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
        className="flex overflow-y-auto overflow-x-scroll overflow-hidden  scroll-smooth scrollbar-hide space-x-2 md:space-x-3 p-2"
      >
        {products.map((product: Product, index: number) => (
          <FeaturedProductCard
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

export default FeaturedProductGrid;
