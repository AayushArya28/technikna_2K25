import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from './pages/Loading';
import Nav from "./components/Nav";
import Home from "./pages/Home";
import { Events } from "./pages/Events";
import { ContactUs } from './pages/ContactUs.jsx'
import PreTechnika from "./pages/PreTechnika";
import Login from "./pages/Login";
import { useState} from "react";
import { Analytics } from "@vercel/analytics/next"

function Merchandise() {
  return <h1 className="p-20">Merchandise Page</h1>;
}
function Members() {
  return <h1 className="p-20">Members Page</h1>;
}

function Contact() {
  return <h1 className="p-20">Contact Page</h1>;
}

function App() {
  const [loadingDone, setLoadingDone] = useState(false);
  return (
    <BrowserRouter>
      {!loadingDone && <Loading onFinish={() => setLoadingDone(true)} />}
      {loadingDone && (
        <>
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/merchandise" element={<Merchandise />} />
            <Route path="/members" element={<Members />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<ContactUs />} />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
