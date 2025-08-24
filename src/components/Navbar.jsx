import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <span>Simple Wood</span>

      <ul>
        <Link to="/">Home</Link>
        <Link to="/catalogue">Catalogue</Link>
      </ul>
    </nav>
  );
};

export default Navbar;
