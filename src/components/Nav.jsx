import { Link, NavLink, useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import StaggeredMenu from "./StaggeredMenu";
import { useAuth } from "../context/useAuth.jsx";

gsap.registerPlugin(useGSAP);

function Nav() {
  const navRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const closeTimer = useRef(null);
  const { user } = useAuth();
  const location = useLocation();
  const [profileName, setProfileName] = useState("");

  useEffect(() => window.scrollTo(0, 0), [location.pathname]);

  /* ---------- Load profile ---------- */
  useEffect(() => {
    if (!user?.uid) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "auth", user.uid));
        if (snap.exists()) setProfileName(snap.data()?.name || "");
      } catch {}
    })();
  }, [user?.uid]);

  const displayName =
    profileName ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "User";

  const firstName = displayName.split(/\s+/)[0];
  const avatarLetter = firstName[0]?.toUpperCase();

  const handleSignOut = async () => {
    await signOut(auth);
    setUserMenuOpen(false);
  };

  /* ---------- DESKTOP NAV ITEMS (UNCHANGED) ---------- */
  const desktopNavItems = [
    { label: "Home", link: "/" },
    {
      label: "Registrations",
      dropdown: [
        { label: "Events", link: "/events" },
        { label: "Merchandise", link: "/merchandise" },
        { label: "Accommodation", link: "/accommodation" },
      ],
    },
    {
      label: "Members",
      dropdown: [
        { label: "Core Team", link: "/core" },
        { label: "Developers", link: "/devs" },
      ],
    },
    { label: "Concert Pass", link: "/delegate" },
    {
      label: "Alumni",
      dropdown: [{ label: "Alumni Registration", link: "/alumni" }],
    },
    { label: "Contact", link: "/contact" },
  ];

  /* ---------- MOBILE MENU (EXACT ORDER YOU ASKED) ---------- */
  const mobileMenuItems = [
    { label: "Home", link: "/" },
    { label: "Concert Pass", link: "/delegate" },
    { label: "Events", link: "/events" },
    { label: "Merchandise", link: "/merchandise" },
    { label: "Core Team", link: "/core" },
    { label: "Alumni", link: "/alumni" },
    { label: "Accommodation", link: "/accommodation" },
    { label: "Developers", link: "/devs" },
    { label: "Contact Us", link: "/contact" },
  ];

  /* ---------- Mobile detection ---------- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ---------- GSAP hover ---------- */
  useGSAP(() => {
    if (isMobile) return;
    gsap.utils.toArray(".nav-link").forEach((link) => {
      link.addEventListener("mouseenter", () => {
        gsap.to(link.querySelector(".en-label"), {
          y: -4,
          scale: 0.92,
          duration: 0.2,
        });
      });
      link.addEventListener("mouseleave", () => {
        gsap.to(link.querySelector(".en-label"), {
          y: 0,
          scale: 1,
          duration: 0.2,
        });
      });
    });
  }, [isMobile]);

  /* ================= MOBILE ================= */
  if (isMobile) {
    return (
      <StaggeredMenu
        position="right"
        isFixed
        logoUrl="/images/favicon.png"   /* ✅ logo only on phone */
        items={mobileMenuItems}         /* ✅ correct mobile menu */
        headerRight={
          user && (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="h-9 w-9 rounded-full border border-white/20
                           bg-white/10 grid place-items-center text-white"
              >
                {avatarLetter}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl
                                bg-black/80 border border-white/10 backdrop-blur-xl">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-sm text-white hover:bg-white/10"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full px-4 py-3 text-left
                               text-sm text-white hover:bg-white/10"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )
        }
      />
    );
  }

  /* ================= DESKTOP ================= */
  return (
    <nav ref={navRef} className="hidden md:block fixed top-3 left-1/2 -translate-x-1/2 z-50">
  <div
    className="
      flex items-center justify-between gap-6
      px-6 md:px-10 lg:px-16 py-2
      w-[95vw] max-w-[1200px]
      rounded-full
      bg-gradient-to-b from-[#1a1a1a]/80 to-[#0b0b0b]/80
      border border-white/10 backdrop-blur-lg
      text-white/90 text-[0.95rem]
      max-[1000px]:text-[0.87rem] 
      max-[940px]:text-[0.78rem]
    "
  >
        <div className="flex items-center gap-8 whitespace-nowrap max-[940px]:gap-6 max-[870px]:gap-4">
          {desktopNavItems.map((item) => (
            <DropdownNavItem key={item.label} item={item} />
          ))}
        </div>

        <div className="flex items-center gap-3">
          {!user && (
            <Link
              to="/login"
              className="rounded-full border border-white/20
                         bg-white/5 px-4 py-1.5
                         hover:bg-white/10 transition"
            >
              Register
            </Link>
          )}

          {user && (
            <div
              className="relative"
              onMouseEnter={() => {
                clearTimeout(closeTimer.current);
                setUserMenuOpen(true);
              }}
              onMouseLeave={() => {
                closeTimer.current = setTimeout(
                  () => setUserMenuOpen(false),
                  200
                );
              }}
            >
              <button
                className="flex items-center gap-2 rounded-full
                           border border-white/20 bg-white/5
                           px-4 py-1.5 hover:bg-white/10"
              >
                Hi, {firstName} <span className="text-xs">▾</span>
              </button>

              <div
                className={`absolute right-0 mt-2 min-w-[160px]
                            rounded-xl bg-black/70 border border-white/10
                            backdrop-blur-xl transition
                            ${
                              userMenuOpen
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 pointer-events-none translate-y-2"
                            }`}
              >
                <Link
                  to="/profile"
                  className="block px-4 py-3 text-sm hover:bg-white/10"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full px-4 py-3 text-left
                             text-sm hover:bg-white/10"
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

/* ---------- Dropdown Item ---------- */
function DropdownNavItem({ item }) {
  const hasDropdown = !!item.dropdown;
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        clearTimeout(closeTimer.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        closeTimer.current = setTimeout(() => setOpen(false), 220);
      }}
    >
      <NavLink
        to={item.link || item.dropdown?.[0]?.link}
        className="nav-link px-3 py-1.5 rounded-full
                   transition-all duration-300
                   bg-white/5
                   hover:bg-white/10
                   hover:shadow-[0_0_18px_rgba(255,0,64,0.55)]"
      >
        <span className="en-label">
          {item.label}
          {hasDropdown && " ▾"}
        </span>
      </NavLink>

      {hasDropdown && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 mt-2
                      rounded-xl bg-black/85 border border-white/10
                      backdrop-blur-xl transition
                      ${
                        open
                          ? "opacity-100 pointer-events-auto"
                          : "opacity-0 pointer-events-none"
                      }`}
        >
          {item.dropdown.map((d) => (
            <NavLink
              key={d.label}
              to={d.link}
              className="block px-4 py-3 hover:bg-white/10 rounded-xl"
            >
              {d.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default Nav;
