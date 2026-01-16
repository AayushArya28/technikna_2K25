import { Routes, Route, useLocation } from "react-router-dom";
import Loading from "./pages/Loading";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import { Events } from "./pages/Events";
import Technical from "./events/Technical.jsx";
import Cultural from "./events/Cultural.jsx";
import Esports from "./events/Esports.jsx";
import ArtCraft from "./events/ArtCraft.jsx";
import FrameFocus from "./events/FrameFocus.jsx";
import { ContactUs } from "./pages/ContactUs.jsx";
import { Core } from "./pages/Core.jsx";
import Merchandise from "./pages/Merchandise.jsx";
import { Footer } from "./components/Footer.jsx";
import Login from "./pages/Login";
import Devs from "./pages/Devs";
import Alumni from "./pages/Alumni";
import Delegate from "./pages/Delegate";
import DelegateRegistration from "./pages/DelegateRegistration";
import DelegateGroupRegistration from "./pages/DelegateGroupRegistration";
import Accommodation from "./pages/Accommodation";
import Profile from "./pages/Profile";
import Timeline from "./pages/Timeline";
import { useEffect, useState } from "react";
import { pageview } from "./analytics";
import TransitionComponent from "./components/Transition.jsx";
import { TransitionProvider } from "./context/transition.jsx";
import { AuthProvider } from "./context/auth.jsx";
import { PopupProvider } from "./context/popup.jsx";
import { EntitlementsProvider } from "./context/EntitlementsProvider.jsx";
import Lenis from "@studio-freight/lenis";
import EventTimelineAutoScroll from "./components/EventTimelineAutoscroll.jsx";


function App() {
  const location = useLocation();
  const routes = [
    { path: "/", Component: Home },
    { path: "/events", Component: Events },
    { path: "/technical", Component: Technical },
    { path: "/cultural", Component: Cultural },
    { path: "/art-craft", Component: ArtCraft },
    { path: "/frame-focus", Component: FrameFocus },
    { path: "/esports", Component: Esports },
    { path: "/merchandise", Component: Merchandise },
    { path: "/core", Component: Core },
    { path: "/login", Component: Login },
    { path: "/contact", Component: ContactUs },
    { path: "/timeline", Component: Timeline },
    { path: "/devs", Component: Devs },
    { path: "/alumni", Component: Alumni },
    { path: "/delegate", Component: Delegate },
    { path: "/delegate-registration", Component: DelegateRegistration },
    { path: "/delegate-group-registration", Component: DelegateGroupRegistration },
    { path: "/accommodation", Component: Accommodation },
    { path: "/profile", Component: Profile },
    { path: "/event-timeline-autoscroll", Component: EventTimelineAutoScroll },
  ];

  // Skipping loading screen in development mode, comment this line and uncomment the next to enable loading screen while working on it
  // const [loadingDone, setLoadingDone] = useState(import.meta.env.DEV);
  const [loadingDone, setLoadingDone] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: false,
      lerp: 0.08,
    });

    let frameId;

    const raf = (time) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    pageview(location.pathname);
  }, [location]);

  return (
    <>
      {!loadingDone && <Loading onFinish={() => setLoadingDone(true)} />}
      {loadingDone && (
        <AuthProvider>
          <PopupProvider>
            <EntitlementsProvider>
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
                            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999] overflow-hidden">
                              <img
                                src="/images/left-door.jpg"
                                className="absolute top-0 left-0 w-[50vw] h-full object-cover object-right door left-door translate-x-[-100%]"
                              />
                              <img
                                src="/images/right-door.jpg"
                                className="absolute top-0 left-[50%] w-[50vw] h-full object-cover object-left door right-door translate-x-[100%]"
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
            </EntitlementsProvider>
          </PopupProvider>
        </AuthProvider>
      )}
    </>
  );
}

export default App;
