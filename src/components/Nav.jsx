import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

function Nav() {
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

  return (
    <nav
      className="mt-10 fixed top-0 left-0 w-full 
                text-black font-bold text-3xl flex justify-center 
                items-center px-12 py-6 z-50"
    >
      {/* Centered Links */}
      <div className="flex gap-12 text-shadow-lg/23 font-serif text-xl">
        <NavLink to="/" label="Home" jp="私たちに関しては" />
        <NavLink to="/events" label="Events" jp="イベント" />
        <NavLink to="/merchandise" label="Merchandise" jp="商品" />
        <NavLink to="/members" label="Members" jp="メンバー" />
        <NavLink to="/contact" label="Contact Us" jp="連絡先" />
      </div>

      {/* Right Auth (hidden but keeps structure) */}
      <div className="flex gap-6 opacity-0 pointer-events-none">
        {/* <NavLink to="/login" label="Log-In/Sign-Up" jp="ログイン/サインアップ" /> */}
        {/* <NavLink to="/signup" label="Sign Up" jp="" /> */}
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
