import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="px-32 py-10 flex items-center justify-between bg-transparent fixed text-white z-40 w-full">
      <span>Simple Wood</span>

      <ul className="flex items-center justify-between gap-4">
        <Link to="/">Home</Link>
        <Link to="/catalogue">Catalogue</Link>
      </ul>
    </nav>
  );
};

export default Navbar;
