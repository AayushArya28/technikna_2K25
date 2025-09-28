import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav className="nav text-3xl font-bold p-10 bg-amber-400">
      <Link to="/">Home</Link> |{" "}
      <Link to="/about">About</Link> |{" "}
      <Link to="/contact">Contact</Link>
    </nav>
  );
}

export default Nav;
