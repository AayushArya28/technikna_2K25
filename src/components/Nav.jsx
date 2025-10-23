import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import StaggeredMenu from "./StaggeredMenu";

gsap.registerPlugin(useGSAP);

function Nav() {
  const navRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Function to scroll to top when navigating
  const handleNavClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  };

  // Menu items for mobile - matching PC nav exactly
  const menuItems = [
    { label: "Home", ariaLabel: "Go to home page", link: "/", onClick: handleNavClick },
    { label: "Events", ariaLabel: "View events", link: "/events", onClick: handleNavClick },
    { label: "Merchandise", ariaLabel: "Browse merchandise", link: "/merchandise", onClick: handleNavClick },
    { label: "Core Team", ariaLabel: "Meet the core team", link: "/core", onClick: handleNavClick },
    { label: "WorkShop", ariaLabel: "Explore workshops", link: "/workshop", onClick: handleNavClick },
    { label: 'Developers', ariaLabel: 'Learn about Devs', link: '/devs', onClick: handleNavClick },
    { label: "Contact Us", ariaLabel: "Get in touch", link: "/contact", onClick: handleNavClick },
  ];

  const socialItems = [
    { label: "Twitter", link: "https://twitter.com" },
    { label: "GitHub", link: "https://github.com" },
    { label: "LinkedIn", link: "https://linkedin.com" },
  ];

  // Check screen size on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Desktop nav animations
  useGSAP(() => {
    if (isMobile) return;

    const navLinks = gsap.utils.toArray(".nav-link");

    navLinks.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        gsap.to(link.querySelector(".en-label"), {
          y: -5,
          scale: 0.85,
          duration: 0.5,
          ease: "power2.out",
        });

        gsap.to(link.querySelector(".jp-label"), {
          y: -5,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        });
      });

      link.addEventListener("mouseleave", () => {
        gsap.to(link.querySelector(".en-label"), {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
        });

        gsap.to(link.querySelector(".jp-label"), {
          y: 0,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      });
    });
  }, [isMobile]);

  // Scroll effect for desktop nav
  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      if (scrollPosition > 50) {
        gsap.to(navRef.current, {
          backgroundColor: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(navRef.current, {
          backgroundColor: "rgba(255, 255, 255, 0)",
          backdropFilter: "blur(0px)",
          boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
          borderBottom: "1px solid rgba(0, 0, 0, 0)",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile]);

  // Mobile view
  if (isMobile) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100vh",
          zIndex: isMenuOpen ? 9998 : 50,
          pointerEvents: isMenuOpen ? "auto" : "none",
        }}
      >
        <StaggeredMenu
          position="right"
          items={menuItems}
          socialItems={socialItems}
          displaySocials={true}
          displayItemNumbering={true}
          menuButtonColor="#000"
          openMenuButtonColor="#000"
          changeMenuColorOnOpen={false}
          colors={["#B19EEF", "#5227FF"]}
          logoUrl="/images/favicon.png"
          accentColor="#ff6b6b"
          fontSize="1.0rem"
          onMenuOpen={() => {
            console.log("Menu opened");
            setIsMenuOpen(true);
          }}
          onMenuClose={() => {
            console.log("Menu closed");
            setIsMenuOpen(false);
          }}
        />
      </div>
    );
  }

  // Desktop view
  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 w-full
                text-black font-bold text-3xl flex justify-center 
                items-center px-12 pt-7 pb-2 z-50"
    >
      {/* Centered Links */}
      <div className="flex gap-12 text-shadow-lg/23 font-serif text-xl">
        <NavLink to="/" label="Home" jp="ホーム" onClick={handleNavClick} />
        <NavLink to="/events" label="Events" jp="イベント" onClick={handleNavClick} />
        <NavLink to="/merchandise" label="Merchandise" jp="グッズ" onClick={handleNavClick} />
        <NavLink to="/core" label="Core Team" jp="コアチーム" onClick={handleNavClick} />
        <NavLink to="/workshop" label="WorkShop" jp="ワークショップ" onClick={handleNavClick} />
        <NavLink to="/devs" label="Developers" jp="開発者" onClick={handleNavClick} />
        <NavLink to="/contact" label="Contact Us" jp="連絡先" onClick={handleNavClick} />
      </div>
    </nav>
  );
}

/* Reusable NavLink component */
function NavLink({ to, label, jp, onClick }) {
  return (
    <Link to={to} className="nav-link text-center" onClick={onClick}>
      <span className="en-label block">{label}</span>
      <span className="jp-label inline-block text-sm text-black whitespace-nowrap opacity-0">
        {jp}
      </span>
    </Link>
  );
}

export default Nav;
