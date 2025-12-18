"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  { id: 1, image: "/B1.jpg" },
  { id: 2, image: "/B2.jpg" },
  { id: 3, image: "/B3.jpg" },
  { id: 4, image: "/B4.jpg" },
];

export default function MainBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const handleSlideChange = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const active = useMemo(() => slides[currentSlide], [currentSlide]);

  return (
    <div className="relative w-full overflow-hidden h-[220px] sm:h-[300px] md:h-full rounded-lg">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active.id} // stable key per slide (not index)
          className="absolute inset-0 rounded-lg" // lock layer size/position
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        >
          <Image
            src={active.image}
            alt="Bisame Banner"
            fill
            sizes="100vw"
            className="object-cover rounded-lg"
            // Only prioritize the first slide, not all of them
            priority={currentSlide === 0}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center">
        {slides.map((_, index) => (
          <button
            key={`slide-${index}`}
            onClick={() => handleSlideChange(index)}
            className={`h-2 w-2 rounded-full mr-2 transition-all duration-300 ${
              currentSlide === index ? "bg-white w-4" : "bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
