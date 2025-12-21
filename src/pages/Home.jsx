import Landing from "./Landing";
import Timeline from "./Timeline";
import PreTechnika from "./PreTechnika";
import CircularGallery from "../components/CircularGallery";
import { useFirstLoad } from "../hooks/useFirstLoad";
import ImageCarousel from "../components/ImageCarousel";
import { Fade } from "react-awesome-reveal";
import RollingGallery from "../components/RollingGallery";
import { AboutTechnika, AboutPatna } from "../components/AboutSections";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
  const isFirstLoad = useFirstLoad();

  return (
    <div className="overflow-x-hidden bg-gradient-to-b from-[#050509] via-[#0a0a0f] to-[#050509] text-gray-100">
      <Landing animate={isFirstLoad} />

      {/* Prize Pool */}
      <div className="px-4 sm:px-6 lg:px-8 mt-10">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-gradient-to-b from-[#050509] via-[#0a0a0f] to-[#050509] backdrop-blur-sm p-6 text-center shadow-lg">
          <div className="text-xs uppercase tracking-[0.35em] text-gray-400">
            Prize Pool
          </div>
          <Motion.div
            className="
            mt-2
            text-4xl sm:text-5xl lg:text-6xl
            font-semibold
            tracking-tight
            text-white
          "
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/65">
              5 Lakhs+
            </span>
          </Motion.div>
          <div className="mt-3 text-sm text-gray-300">
            Cash prizes + goodies across Technical, Cultural & Fun.
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/events"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition text-sm"
            >
              All Events
            </Link>
            <Link
              to="/technical"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition text-sm"
            >
              Technical
            </Link>
            <Link
              to="/cultural"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition text-sm"
            >
              Cultural
            </Link>
            <Link
              to="/fun"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition text-sm"
            >
              Fun
            </Link>
          </div>
        </div>
      </div>
      <div className="relative z-0 py-0">
        <Timeline />
      </div>
      {/* Previous Technika */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#16060b] to-black px-6 pb-0 pt-0 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-10 left-10 h-64 w-64 rounded-full bg-[#ff0030]/15 blur-[120px]" />
          <div className="absolute bottom-0 right-16 h-72 w-72 rounded-full bg-[#4100ff]/10 blur-[140px]" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-6xl rounded-[36px] border border-white/12 bg-black/55 p-6 md:p-10 shadow-[0_50px_180px_rgba(255,0,40,0.25)] backdrop-blur-xl">
          {/* Header */}
          <div className="mb-16">
            <span className="inline-flex mb-4 w-fit items-center rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.38em] text-white/70">
              Technika 2K25
            </span>

            <h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-[0.22em]">
              Previous Technika
            </h1>
          </div>
          <div
            className="
              relative overflow-hidden rounded-[28px]
              border border-white/15
              bg-white/5 backdrop-blur-xl
              p-3 md:p-4
              shadow-[0_30px_120px_rgba(255,0,48,0.18)]
              min-h-[400px] md:min-h-[500px]
              flex items-center justify-center
            "
          >
            <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-[#ff0030]/20 blur-[140px]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,0,48,0.18),_transparent_65%)]" />
            <div className="relative z-10">
              <ImageCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center items-center py-0">
        <div className="h-px w-3/4 bg-gradient-to-r from-transparent via-[#ff001e]/30 to-transparent"></div>
      </div>

      {/* About Sections */}
      <div className="relative">
        <AboutTechnika />
        <div className="flex justify-center items-center py-0">
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
    </div>
  );
};

export default Home;
