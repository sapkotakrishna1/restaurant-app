import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const {
    user,
    isLoggedIn,
    logout
  } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">

      {/* Top Row */}
      <div className="navbar-top">

        {/* Logo */}
        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >
          Restaurant
        </Link>

        {/* Mobile Menu Button */}
        <button
          className={`navbar-menu-button ${
            menuOpen ? "active" : ""
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>


      {/* Navigation Links */}
      <div
        className={`navbar-links ${
          menuOpen ? "mobile-open" : ""
        }`}
      >

        <Link
          to="/"
          onClick={closeMenu}
        >
          Home
        </Link>


        <Link
          to="/menu"
          onClick={closeMenu}
        >
          Menu
        </Link>


        <Link
          to="/cart"
          onClick={closeMenu}
        >
          Cart
        </Link>


        {/* Customer Orders */}

        {isLoggedIn &&
          user?.role === "customer" && (
            <Link
              to="/myorders"
              onClick={closeMenu}
            >
              Orders
            </Link>
          )}


        {/* Admin */}

        {isLoggedIn &&
          user?.role === "admin" && (
            <Link
              to="/admin/foods"
              onClick={closeMenu}
            >
              Admin Foods
            </Link>
          )}


        {/* Login */}

        {!isLoggedIn && (
          <Link
            to="/login"
            onClick={closeMenu}
          >
            Login
          </Link>
        )}


        {/* User + Logout */}

        {isLoggedIn && (
          <>
            <span className="navbar-user">
              Hi, {user?.name}
            </span>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;