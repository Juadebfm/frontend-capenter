import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const pathname = location.pathname === "/account";
  return (
    <nav
      className={`px-32 py-10 flex items-center justify-between bg-transparent fixed text-white z-40 w-full ${
        pathname ? "bg-black text-white static" : "bg-transparent text-white"
      }`}
    >
      <span>Simple Wood</span>

      <ul className="flex items-center justify-between gap-4">
        <Link to="/">Home</Link>
        <Link to="/catalogue">Catalogue</Link>
        <Link to="/account">Accounts</Link>
      </ul>
    </nav>
  );
};

export default Navbar;
