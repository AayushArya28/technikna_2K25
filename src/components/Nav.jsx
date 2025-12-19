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
  const uid = user?.uid;

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

  useEffect(() => {
    let cancelled = false;

    const loadProfileName = async () => {
      if (!uid) {
        setProfileName("");
        return;
      }

      try {
        const docRef = doc(db, "auth", uid);
        const docSnap = await getDoc(docRef);
        if (cancelled) return;

        if (docSnap.exists()) {
          const data = docSnap.data();
          const name = typeof data?.name === "string" ? data.name.trim() : "";
          if (name) {
            setProfileName(name);
            return;
          }
        } else {
          setProfileName("");
        }
      } catch (err) {
        console.error("Error fetching user name from DB:", err);
        if (cancelled) return;
      }

      // Fallback: mimic Profile page behavior by trying delegate/alumni status
      // (many users have their name stored server-side, not in Firestore).
      try {
        const currentUser = auth.currentUser;
        if (!currentUser || currentUser.uid !== uid) {
          if (!cancelled) setProfileName("");
          return;
        }

        const token = await currentUser.getIdToken();
        const headers = { Authorization: `Bearer ${token}` };

        const [delegateRes, alumniRes] = await Promise.all([
          fetch(`${BASE_API_URL}/delegate/status/user`, { headers }),
          fetch(`${BASE_API_URL}/alumni/status`, { headers }),
        ]);

        const delegateData = delegateRes.ok ? await delegateRes.json() : null;
        const alumniData = alumniRes.ok ? await alumniRes.json() : null;

        const candidateName =
          (typeof delegateData?.name === "string" && delegateData.name.trim()) ||
          (typeof alumniData?.name === "string" && alumniData.name.trim()) ||
          "";

        if (!cancelled) setProfileName(candidateName);
      } catch (err) {
        console.error("Error fetching user name from API:", err);
        if (!cancelled) setProfileName("");
      }
    };

    loadProfileName();

    return () => {
      cancelled = true;
    };
  }, [uid]);

  const displayName =
    profileName ||
    user?.displayName ||
    (user?.email ? user.email.split("@")[0] : "User");

  const firstName = (displayName || "User").trim().split(/\s+/)[0] || "User";
  const avatarLetter = (firstName[0] || "U").toUpperCase();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUserMenuOpen(false);
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  // Menu items for mobile - matching PC nav exactly
  const menuItems = [
    { label: "Home", ariaLabel: "Go to home page", link: "/", onClick: handleNavClick },
    { label: "Profile", ariaLabel: "Open profile page", link: "/profile", onClick: handleNavClick },
    { label: "Delegates", ariaLabel: "Delegate page", link: "/delegate", onClick: handleNavClick },
    { label: "Events", ariaLabel: "View events", link: "/events", onClick: handleNavClick },
    { label: "Merchandise", ariaLabel: "Browse merchandise", link: "/merchandise", onClick: handleNavClick },
    { label: "Core Team", ariaLabel: "Meet the core team", link: "/core", onClick: handleNavClick },
    // { label: "WorkShop", ariaLabel: "Explore workshops", link: "/workshop", onClick: handleNavClick },
    { label: "Alumni", ariaLabel: "Our Alumni", link: "/alumni", onClick: handleNavClick },
    { label: "Accommodation", ariaLabel: "Stay assistance", link: "/accommodation", onClick: handleNavClick },
    { label: 'Developers', ariaLabel: 'Learn about Devs', link: '/devs', onClick: handleNavClick },
    { label: "Contact Us", ariaLabel: "Get in touch", link: "/contact", onClick: handleNavClick },
  ];

  const desktopNavItems = [
    {
      label: "Home",
      jp: "ホーム",
      link: "/",
      dropdown: [
        { label: "Home", link: "/" },
        { label: "Profile", link: "/profile" },
      ],
    },
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
      dropdown: [
        { label: "Alumni Registration", link: "/alumni" },
      ],
    },
    { label: "Contact", jp: "連絡先", link: "/contact" },
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

  // Ensure nav starts slightly translucent on mount
  useEffect(() => {
    if (!navRef.current) return;
    gsap.set(navRef.current, {
      backgroundColor: "rgba(0, 0, 0, 0.15)",
    });
  }, []);

  // Scroll effect for desktop nav
  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      if (scrollPosition > 50) {
        gsap.to(navRef.current, {
          backgroundColor: "rgba(0, 0, 0, 0.35)",
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(navRef.current, {
          backgroundColor: "rgba(0, 0, 0, 0.15)",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Run once to apply correct initial state on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile]);

  // Reset nav to slight translucence on route change
  useEffect(() => {
    if (!navRef.current) return;
    gsap.set(navRef.current, { backgroundColor: "rgba(0,0,0,0.15)" });
  }, [location.pathname]);

  // Mobile view
  if (isMobile) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: isMenuOpen ? "100vh" : "auto",
          zIndex: isMenuOpen ? 9998 : 50,
          pointerEvents: "auto",
          backgroundColor: "transparent",
        }}
      >
        <StaggeredMenu
          position="right"
          isFixed={true}
          items={menuItems}
          socialItems={socialItems}
          displaySocials={true}
          displayItemNumbering={true}
          menuButtonColor="#fff"
          openMenuButtonColor="#fff"
          changeMenuColorOnOpen={false}
          colors={["#B19EEF", "#5227FF"]}
          logoUrl="/images/favicon.png"
          accentColor="#ff6b6b"
          fontSize="1.0rem"
          headerRight={
            !user ? (
              <Link
                to="/login"
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/20 hover:text-white transition"
                onClick={handleNavClick}
              >
                Register
              </Link>
            ) : (
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-white hover:bg-white/20 transition"
                onClick={handleNavClick}
                aria-label="Open profile"
              >
                <span
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-white/10 text-white text-sm font-semibold"
                  aria-hidden="true"
                >
                  {avatarLetter}
                </span>
                <span className="max-w-[10rem] truncate">Hi, {firstName}</span>
              </Link>
            )
          }
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
      className="fixed top-0 left-0 right-0 w-full font-bold text-3xl px-6 md:px-10 py-3 z-50 backdrop-blur-md"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 text-white/80 text-[clamp(0.9rem,1.8vw,1.1rem)] ks-font select-none font-bold">
        <div className="flex items-center gap-8 max-xl:gap-6 max-lg:gap-5">
          {desktopNavItems.map((item) => (
            <DropdownNavItem key={item.label} item={item} onClick={handleNavClick} />
          ))}
        </div>

        <div className="flex items-center gap-3 text-[clamp(0.85rem,1.6vw,1rem)]">
          {!user && (
            <Link
              to="/login"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/20 hover:text-white transition"
              onClick={handleNavClick}
            >
              Register
            </Link>
          )}

          {user && (
            <div
              className="relative"
              onMouseEnter={() => {
                if (userMenuCloseTimeout.current) clearTimeout(userMenuCloseTimeout.current);
                setUserMenuOpen(true);
              }}
              onMouseLeave={() => {
                userMenuCloseTimeout.current = setTimeout(() => setUserMenuOpen(false), 140);
              }}
            >
              <button
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition"
              >
                <span>Hi, {firstName}</span>
                <span className="text-base">▾</span>
              </button>

              <div
                onMouseEnter={() => {
                  if (userMenuCloseTimeout.current) clearTimeout(userMenuCloseTimeout.current);
                  setUserMenuOpen(true);
                }}
                onMouseLeave={() => {
                  userMenuCloseTimeout.current = setTimeout(() => setUserMenuOpen(false), 140);
                }}
                className={`absolute right-0 mt-3 min-w-[160px] rounded-xl border border-[#7cf0ff]/80 bg-black/55 text-white shadow-xl backdrop-blur-xl transition-all duration-150 ${userMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-2"
                  }`}
              >
                <Link
                  to="/profile"
                  className="block w-full px-4 py-3 text-left text-[0.95rem] hover:bg-white/10"
                  onClick={() => {
                    handleNavClick();
                    setUserMenuOpen(false);
                  }}
                >
                  My Profile
                </Link>
                <button
                  className="block w-full px-4 py-3 text-left text-[0.95rem] hover:bg-white/10"
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

/* Reusable NavLink with optional dropdown */
function DropdownNavItem({ item, onClick }) {
  const hasDropdown = Array.isArray(item.dropdown) && item.dropdown.length > 0;
  const targetLink = item.link || (hasDropdown ? item.dropdown[0].link : "#");
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef(null);

  const openMenu = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setOpen(true);
  };

  const scheduleClose = () => {
    closeTimeout.current = setTimeout(() => setOpen(false), 140);
  };

  return (
    <div
      className="relative group"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <Link
        to={targetLink}
        className="nav-link relative flex flex-col items-center text-center hover:[text-shadow:0_0_10px_rgba(255,255,255,0.7),0_0_20px_rgba(255,255,255,0.7)]"
        onClick={onClick}
      >
        <span className="en-label block">{item.label}{hasDropdown && <span className="ml-1 text-sm align-middle">▾</span>}</span>
        <span className="jp-label inline-block text-sm text-white whitespace-nowrap opacity-0">
          {item.jp}
        </span>
      </Link>

      {hasDropdown && (
        <div
          onMouseEnter={openMenu}
          onMouseLeave={scheduleClose}
          className={`absolute left-1/2 top-full z-50 mt-2 w-max min-w-[190px] -translate-x-1/2 rounded-xl border border-[#7cf0ff]/80 bg-black/55 text-white shadow-xl backdrop-blur-xl transition-all duration-200 ${open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-1 pointer-events-none"
            }`}
        >
          {item.dropdown.map((child) => (
            <Link
              key={child.label}
              to={child.link}
              className="block px-4 py-3 text-left text-[0.95rem] hover:bg-white/10"
              onClick={onClick}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Nav;
