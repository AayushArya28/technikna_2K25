import Landing from "./Landing";
import PreTechnika from "./PreTechnika";
import { Slider } from "../components/Slider";
import CircularGallery from "../components/CircularGallery";
import { useFirstLoad } from "../hooks/useFirstLoad";
import ImageCarousel from "../components/ImageCarousel";
import { Fade } from "react-awesome-reveal";
import RollingGallery from "../components/RollingGallery";
import { AboutTechnika, AboutPatna } from "../components/AboutSections";

const Home = () => {
  const isFirstLoad = useFirstLoad();

  return (
    <div className="overflow-x-hidden bg-gradient-to-b from-[#050509] via-[#0a0a0f] to-[#050509] text-gray-100">
      <Landing animate={isFirstLoad} />

      {/* Pre-Technika Photos */}
      <div className="relative flex flex-col justify-center items-center z-0 py-20 px-4">
        <Fade triggerOnce={true} direction="up" delay={200}>
          <div className="mb-12 flex flex-col justify-center items-center text-center max-w-4xl mx-auto">
            <div className="inline-block mb-4">
              <h1 className="text-5xl lg:text-7xl font-black mb-2 bg-gradient-to-r from-[#ff001e] via-pink-500 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
                Previous Technika
              </h1>
              <div className="w-32 h-1.5 bg-gradient-to-r from-[#ff001e] to-pink-600 mx-auto rounded-full shadow-lg shadow-[#ff001e]/50"></div>
            </div>
            <p className="text-base tracking-[0.2em] text-gray-400 uppercase mt-4">
              Relive the Moments
            </p>
            <p className="text-sm text-gray-500 mt-2 max-w-2xl">
              Experience the energy and excitement from our previous editions
            </p>
          </div>
          <div className="w-full max-w-7xl">
            <ImageCarousel />
          </div>
        </Fade>
      </div>

      {/* Divider */}
      <div className="flex justify-center items-center py-12">
        <div className="h-px w-3/4 bg-gradient-to-r from-transparent via-[#ff001e]/30 to-transparent"></div>
      </div>

      {/* About Sections */}
      <div className="relative">
        <AboutTechnika />
        <div className="flex justify-center items-center py-12">
          <div className="h-px w-3/4 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>
        <AboutPatna />
      </div>

      {/* Sponsors Section */}
      {/* <div className="relative z-0 mt-20 mb-20">
        <Fade
          triggerOnce={true}
          direction="up"
          delay={100}
          duration={800}
          fraction={0.3}
        >
          <div className="m-10 flex flex-col items-center text-center mb-8">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-3 bg-gradient-to-r from-red-500 to-rose-400 bg-clip-text text-transparent">
              Our Sponsors
            </h1>
            <p className="text-base tracking-wider text-gray-300 max-w-2xl">
              Proudly supported by our amazing partners who make Technika
              possible
            </p>
          </div>
        </Fade>
        <Fade
          triggerOnce={true}
          direction="up"
          delay={300}
          duration={1000}
          cascade
          damping={0.1}
        >
          <RollingGallery autoplay={true} pauseOnHover={true} />
        </Fade>
      </div> */}

      {/* <div style={{ width: "98vw", height: "100vh" }}>
        <PreTechnika />
      </div> */}
      {/* <div className="mb-15" style={{ height: "600px", position: "relative" }}>
        <CircularGallery
          bend={3}
          textColor="beige"
          borderRadius={0.05}
          scrollEase={0.02}
        />
      </div> */}
      {/* <Slider /> */}
    </div>
  );
};

export default Home;
