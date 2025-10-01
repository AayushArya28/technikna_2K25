import Landing from "./Landing";
import PreTechnika from "./PreTechnika";
import Footer from "./Footer";
import { Slider } from "../components/Slider";
import CircularGallery from '../components/CircularGallery'


const Home = () => {
  return (
    <>
      <Landing />
      <div style={{ width: '98vw', height: '100vh' }}>
        <PreTechnika />
      </div>
      <div className="mb-15" style={{ height: '600px', position: 'relative' }}>
        <CircularGallery bend={3} textColor="#ffffff" borderRadius={0.05} scrollEase={0.02} />
      </div>
      {/* <Slider /> */}
      <Footer />
    </>
  )
}

export default Home
