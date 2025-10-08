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
import Login from "./pages/Login";
import Devs from "./pages/Devs";
import { useState } from "react";
import TransitionComponent from "./components/Transition.jsx";
import { TransitionProvider } from "./context/transition.jsx";
import { Analytics } from "@vercel/analytics/react";


function App() {
  const routes = [
    { path: "/", Component: Home },
    { path: "/events", Component: Events },
    { path: "/merchandise", Component : Merchandise },
    { path: "/core", Component: Core },
    { path: "/workshop", Component: Workshop },
    { path: "/login", Component: Login },
    { path: "/contact", Component: ContactUs },
    { path: "/devs", Component: Devs },
  ];

  // Skipping loading screen in development mode, comment this line and uncomment the next to enable loading screen while working on it
  // const [loadingDone, setLoadingDone] = useState(import.meta.env.DEV);
  const [loadingDone, setLoadingDone] = useState(false);

  return (
    <BrowserRouter>
      {!loadingDone && <Loading onFinish={() => setLoadingDone(true)} />}
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
