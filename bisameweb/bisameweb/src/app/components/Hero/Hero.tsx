import MainBanner from "./MainBanner";
import SideBanner from "./SideBanner";

const Hero = () => {
  return (
    <div className="bg-white">
      <div className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-56 py-4 sm:py-6 md:py-8">
        <div className="grid items-stretch gap-6 md:grid-cols-3 md:gap-6 md:min-h-[400px] lg:min-h-[500px]">
          <div className="col-span-1 md:col-span-2 md:h-full">
            <MainBanner />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-6 md:h-full">
            <div className="h-32 sm:h-40 md:flex-1 md:h-auto">
              <SideBanner title="Bisame Tv" isDark={true} type="tv" />
            </div>
            <div className="h-32 sm:h-40 md:flex-1 md:h-auto">
              <SideBanner title="Bisame Trade Assurance" type="shop" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
