import Landing from "./Landing";
import PreTechnika from "./PreTechnika";
import { Slider } from "../components/Slider";
import CircularGallery from "../components/CircularGallery";
import { useFirstLoad } from "../hooks/useFirstLoad";
import ImageCarousel from "../components/ImageCarousel";
import { Fade } from "react-awesome-reveal";
import RollingGallery from '../components/RollingGallery';
import { AboutTechnika, AboutPatna } from '../components/AboutSections';

const Home = () => {
  const isFirstLoad = useFirstLoad();

  return (
    <div className="overflow-x-hidden" style={{ backgroundColor: '#141414' }}>
      <Landing animate={isFirstLoad} />

      {/* Pre-Technika Photos */}
      <div className="relative z-0 mt-12 mb-20">
        <Fade triggerOnce={true} direction="up" delay={200}>
          <div className="m-10 lg:w-5/12 flex flex-col justify-start">
            <h1 className="text-5xl lg:text-4xl font-light leading-tight">
              Previous Technika
            </h1>
            <p className="text-sm tracking-wider text-gray-500 mb-6">
              Featured Photos
            </p>
          </div>
          <ImageCarousel />
        </Fade>
      </div>

      {/* About Sections */}
      <AboutTechnika />
      <AboutPatna />

      {/* Sponsors Section */}
      <div className="relative z-0 mt-20 mb-20">
        <Fade triggerOnce={true} direction="up" delay={100} duration={800} fraction={0.3}>
          <div className="m-10 flex flex-col items-center text-center mb-8">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Our Sponsors
            </h1>
            <p className="text-base tracking-wider text-gray-600 max-w-2xl">
              Proudly supported by our amazing partners who make Technika possible
            </p>
          </div>
        </Fade>
        <Fade triggerOnce={true} direction="up" delay={300} duration={1000} cascade damping={0.1}>
          <RollingGallery autoplay={true} pauseOnHover={true} />
        </Fade>
      </div>

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