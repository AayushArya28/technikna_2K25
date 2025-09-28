import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav className="mt-10 fixed top-0 left-0 w-full 
                text-black font-bold text-3xl flex justify-center 
                items-center px-12 py-6 z-50">
  {/* Centered Links */}
  <div className="flex gap-12 text-shadow-lg/23">
    <NavLink to="/" label="About Us" jp="私たちに関しては" />
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
    <Link to={to} className="relative group transition-colors">
      {label}
      <span className="jp-label">{jp}</span>
    </Link>
  );
}

export default Nav;
