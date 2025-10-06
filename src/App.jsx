import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loading from "./pages/Loading";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import { Events } from "./pages/Events";
import { Workshop } from "./pages/Workshop.jsx";
import { ContactUs } from "./pages/ContactUs.jsx";
import { Core } from "./pages/Core.jsx";
import Merchandise from "./pages/Merchandise.jsx";
import { Footer } from "./components/Footer.jsx";
import PreTechnika from "./pages/PreTechnika";
import Login from "./pages/Login";
import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import TransitionComponent from "./components/Transition.jsx";
import { TransitionProvider } from "./context/transition.jsx";

function App() {
  const routes = [
    { path: "/", Component: Home },
    { path: "/events", Component: Events },
    { path: "/merchandise", Component: Merchandise },
    { path: "/core", Component: Core },
    { path: "/workshop", Component: Workshop },
    { path: "/login", Component: Login },
    { path: "/contact", Component: ContactUs },
  ];

  const [loadingDone, setLoadingDone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  //Loading page on mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //Loading the page only for once
  useEffect(() => {
    const hasLoadedBefore = localStorage.getItem("hasLoadedBefore");
    if (hasLoadedBefore) {
      setLoadingDone(true);
    }
  }, []);

  const handleLoadingFinish = () => {
    setLoadingDone(true);
    localStorage.setItem("hasLoadedBefore", "true");
  };

  return (
    <BrowserRouter>
      {!loadingDone && <Loading onFinish={handleLoadingFinish} />}
      {loadingDone && (
        <>
          <Nav />
          <TransitionProvider>
            <Routes>
              {routes.map(({ path, Component }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <TransitionComponent>
                      <>
                        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[100] overflow-hidden">
                          <img
                            src="/images/left-door.jpg"
                            className="absolute top-0 left-0 w-auto min-w-[50vw] min-h-screen h-auto object-right door left-door translate-x-[-100%]"
                          />
                          <img
                            src="/images/right-door.jpg"
                            className="absolute top-0 left-[50%] w-auto min-w-[50vw] min-h-screen h-auto object-left door right-door translate-x-[100%]"
                          />
                        </div>
                        {Component && <Component />}
                      </>
                    </TransitionComponent>
                  }
                  exact
                />
              ))}
            </Routes>
          </TransitionProvider>
          <Footer />
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
