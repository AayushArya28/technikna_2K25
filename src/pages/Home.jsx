import Landing from "./Landing";
import PreTechnika from "./PreTechnika";
import { Slider } from "../components/Slider";
import CircularGallery from "../components/CircularGallery";
import { useFirstLoad } from "../hooks/useFirstLoad";

const Home = () => {
  const isFirstLoad = useFirstLoad();

  return (
    <div className="overflow-x-hidden">
      <Landing animate={isFirstLoad} />
      <div style={{ width: "98vw", height: "100vh" }}>
        <PreTechnika />
      </div>
      {/* <div className="mb-15" style={{ height: "600px", position: "relative" }}>
        <CircularGallery
          bend={3}
          textColor="beige"
          borderRadius={0.05}
          scrollEase={0.02}
        />
      </div> */}
      <Slider />
      
    </div>
  );
};

export default Home;
