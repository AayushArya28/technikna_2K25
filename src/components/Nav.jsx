import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import StaggeredMenu from "./StaggeredMenu";

gsap.registerPlugin(useGSAP);

function Nav() {
  const navRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Menu items for mobile - matching PC nav exactly
  const menuItems = [
    { label: "Home", ariaLabel: "Go to home page", link: "/" },
    { label: "Events", ariaLabel: "View events", link: "/events" },
    {
      label: "Merchandise",
      ariaLabel: "Browse merchandise",
      link: "/merchandise",
    },
    { label: "Core Team", ariaLabel: "Meet the core team", link: "/core" },
    { label: "WorkShop", ariaLabel: "Explore workshops", link: "/workshop" },
    { label: "Contact Us", ariaLabel: "Get in touch", link: "/contact" },
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
          backgroundColor: "rgba(245, 241, 232, 0.2)",
          backdropFilter: "blur(2px)",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(navRef.current, {
          backgroundColor: "rgba(245, 241, 232, 0)",
          backdropFilter: "blur(0px)",
          boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
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
          zIndex: 9998,
          pointerEvents: "auto",
          overflow: "hidden",
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
          onMenuOpen={() => console.log("Menu opened")}
          onMenuClose={() => console.log("Menu closed")}
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
        <NavLink to="/" label="Home" jp="ホーム" />
        <NavLink to="/events" label="Events" jp="イベント" />
        <NavLink to="/merchandise" label="Merchandise" jp="グッズ" />
        <NavLink to="/core" label="Core Team" jp="コアチーム" />
        <NavLink to="/workshop" label="WorkShop" jp="ワークショップ" />
        <NavLink to="/contact" label="Contact Us" jp="連絡先" />
      </div>
    </nav>
  );
}

/* Reusable NavLink component */
function NavLink({ to, label, jp }) {
  return (
    <Link to={to} className="nav-link text-center">
      <span className="en-label block">{label}</span>
      <span className="jp-label inline-block text-sm text-black whitespace-nowrap opacity-0">
        {jp}
      </span>
    </Link>
  );
}

export default Nav;
