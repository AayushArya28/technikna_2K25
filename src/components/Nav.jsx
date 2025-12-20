import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import StaggeredMenu from "./StaggeredMenu";
import { useAuth } from "../context/useAuth.jsx";

const BASE_API_URL = "https://api.technika.co";

gsap.registerPlugin(useGSAP);

function Nav() {
  const navRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuCloseTimeout = useRef(null);
  const location = useLocation();
  const { user } = useAuth();
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  useEffect(() => {
    let cancelled = false;

    const loadProfileName = async () => {
      if (!user?.uid) {
        setProfileName("");
        return;
      }

      try {
        const docRef = doc(db, "auth", user.uid);
        const docSnap = await getDoc(docRef);
        if (cancelled) return;

        if (docSnap.exists()) {
          const name = docSnap.data()?.name?.trim();
          if (name) {
            setProfileName(name);
            return;
          }
        }
      } catch {}

      try {
        const token = await user.getIdToken();
        const headers = { Authorization: `Bearer ${token}` };

        const [delegateRes, alumniRes] = await Promise.all([
          fetch(`${BASE_API_URL}/delegate/status/user`, { headers }),
          fetch(`${BASE_API_URL}/alumni/status`, { headers }),
        ]);

        const delegateData = delegateRes.ok ? await delegateRes.json() : null;
        const alumniData = alumniRes.ok ? await alumniRes.json() : null;

        const candidateName =
          delegateData?.name?.trim() ||
          alumniData?.name?.trim() ||
          "";

        if (!cancelled) setProfileName(candidateName);
      } catch {
        if (!cancelled) setProfileName("");
      }
    };

    loadProfileName();
    return () => { cancelled = true; };
  }, [user?.uid]);

  const displayName =
    profileName ||
    user?.displayName ||
    (user?.email ? user.email.split("@")[0] : "User");

  const firstName = displayName.split(/\s+/)[0];
  const avatarLetter = firstName[0].toUpperCase();

  const handleSignOut = async () => {
    await signOut(auth);
    setUserMenuOpen(false);
  };

  const menuItems = [
    { label: "Home", link: "/", onClick: handleNavClick },
    { label: "Delegates", link: "/delegate", onClick: handleNavClick },
    { label: "Events", link: "/events", onClick: handleNavClick },
    { label: "Merchandise", link: "/merchandise", onClick: handleNavClick },
    { label: "Core Team", link: "/core", onClick: handleNavClick },
    { label: "Alumni", link: "/alumni", onClick: handleNavClick },
    { label: "Accommodation", link: "/accommodation", onClick: handleNavClick },
    { label: "Developers", link: "/devs", onClick: handleNavClick },
    { label: "Contact Us", link: "/contact", onClick: handleNavClick },
  ];

  const desktopNavItems = [
    { label: "Home", jp: "ホーム", link: "/" },
    {
      label: "Registrations",
      jp: "登録",
      dropdown: [
        { label: "Events", link: "/events" },
        { label: "Merchandise", link: "/merchandise" },
        { label: "Accommodation", link: "/accommodation" },
      ],
    },
    {
      label: "Members",
      jp: "メンバー",
      dropdown: [
        { label: "Core Team", link: "/core" },
        { label: "Developers", link: "/devs" },
      ],
    },
    { label: "Delegates", jp: "デリゲート", link: "/delegate" },
    {
      label: "Alumni",
      jp: "卒業生",
      dropdown: [{ label: "Alumni Registration", link: "/alumni" }],
    },
    { label: "Contact", jp: "連絡先", link: "/contact" },
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useGSAP(() => {
    if (isMobile) return;
    gsap.utils.toArray(".nav-link").forEach((link) => {
      link.addEventListener("mouseenter", () => {
        gsap.to(link.querySelector(".en-label"), { y: -5, scale: 0.85 });
        gsap.to(link.querySelector(".jp-label"), { y: -5, opacity: 1 });
      });
      link.addEventListener("mouseleave", () => {
        gsap.to(link.querySelector(".en-label"), { y: 0, scale: 1 });
        gsap.to(link.querySelector(".jp-label"), { y: 0, opacity: 0 });
      });
    });
  }, [isMobile]);

  if (isMobile) {
    return (
      <StaggeredMenu
        position="right"
        isFixed
        items={menuItems}
        headerRight={
          !user ? (
            <Link to="/login" className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white">
              Register
            </Link>
          ) : (
            <Link to="/profile" className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-white">
              <span className="h-8 w-8 grid place-items-center rounded-full border border-white/20">{avatarLetter}</span>
              Hi, {firstName}
            </Link>
          )
        }
      />
    );
  }

  return (
  <nav
    ref={navRef}
    className="fixed top-3 left-1/2 -translate-x-1/2 z-50"
  >
    <div
    className="
      flex items-center justify-between
      gap-12
      px-16 py-2
      min-w-[1080px]          /* ✅ enough width */
      rounded-full
      bg-gradient-to-b from-[#1a1a1a]/80 to-[#0b0b0b]/80
      border border-white/10
      shadow-[0_18px_55px_rgba(0,0,0,0.9)]
      backdrop-blur-lg
      text-white/80           /* ✅ readable */
      text-[0.95rem]          /* ✅ proper size */
      font-medium
      ks-font
    "
  >
      {/* Left Nav Items */}
      <div className="flex items-center gap-8 whitespace-nowrap">
        {desktopNavItems.map((item) => (
          <DropdownNavItem
            key={item.label}
            item={item}
            onClick={handleNavClick}
          />
        ))}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {!user && (
          <Link
            to="/login"
            className="
              rounded-full
              border border-white/20
              bg-white/5
              px-4 py-1.5
              text-white/80
              hover:bg-white/10
              transition
            "
            onClick={handleNavClick}
          >
            Register
          </Link>
        )}

        {user && (
          <div
            className="relative"
            onMouseEnter={() => {
              if (userMenuCloseTimeout.current)
                clearTimeout(userMenuCloseTimeout.current);
              setUserMenuOpen(true);
            }}
            onMouseLeave={() => {
              userMenuCloseTimeout.current = setTimeout(
                () => setUserMenuOpen(false),
                120
              );
            }}
          >
            <button
              className="
                flex items-center gap-2
                rounded-full
                border border-white/20
                bg-white/5
                px-4 py-1.5
                text-white/80
                hover:bg-white/10
                transition
              "
            >
              <span>Hi, {firstName}</span>
              <span className="text-xs">▾</span>
            </button>

            <div
              className={`absolute right-0 mt-2 min-w-[160px]
                rounded-xl
                border border-white/10
                bg-black/70
                backdrop-blur-xl
                shadow-xl
                transition-all duration-150
                ${
                  userMenuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 pointer-events-none translate-y-2"
                }`}
            >
              <Link
                to="/profile"
                className="block px-4 py-3 text-sm hover:bg-white/10"
                onClick={() => {
                  handleNavClick();
                  setUserMenuOpen(false);
                }}
              >
                My Profile
              </Link>
              <button
                className="block w-full px-4 py-3 text-left text-sm hover:bg-white/10"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </nav>
);

}

function DropdownNavItem({ item, onClick }) {
  const hasDropdown = !!item.dropdown;
  const [open, setOpen] = useState(false);

  return (
    <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} className="relative">
      <Link
        to={item.link || item.dropdown?.[0].link}
        onClick={onClick}
        className="nav-link
        px-4 py-1.5          /* ⬅️ slimmer */
        rounded-full
        text-white/60
        transition-all duration-300
        hover:text-white
        hover:bg-white/5
        hover:shadow-[0_0_12px_rgba(120,240,255,0.35)]"
      >
        <span className="en-label">{item.label}{hasDropdown && " ▾"}</span>
        <span className="jp-label pointer-events-none absolute top-full mt-1 text-xs opacity-0">
          {item.jp}
        </span>
      </Link>

      {hasDropdown && open && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 rounded-xl bg-black/60 border border-white/10 backdrop-blur-xl">
          {item.dropdown.map((d) => (
            <Link key={d.label} to={d.link} onClick={onClick} className="block px-4 py-3">
              {d.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Nav;