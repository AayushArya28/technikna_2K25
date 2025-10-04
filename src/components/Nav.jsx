import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";

gsap.registerPlugin(useGSAP);

function Nav() {
  const navRef = useRef(null);

  useGSAP(() => {
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
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      if (scrollPosition > 50) {
        // Add translucent background when scrolled down
        gsap.to(navRef.current, {
          backgroundColor: "rgba(245, 241, 232, 0.2)",
          backdropFilter: "blur(2px)",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        // Remove background when at top
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
  }, []);

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
        <NavLink to="/members" label="Core Team" jp="コアチーム" />
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
