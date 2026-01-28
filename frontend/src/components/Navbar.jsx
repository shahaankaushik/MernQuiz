import { Award, GitBranchIcon, LogIn, LogOut, Menu, PanelsTopLeft, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { navbarStyles } from "../assets/dummyStyles";
import techQuizeLogo from "../assets/techQuize.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const u = localStorage.getItem("authToken");
      setLoggedIn(!!u);
    } catch (error) {
      console.error(error);
      setLoggedIn(false);
    }

    const handler = (ev) => {
      const detailUser = ev?.detail?.user ?? null;
      setLoggedIn(!!detailUser);
    };

    window.addEventListener("authChanged", handler);
    return () => window.removeEventListener("authChanged", handler);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
    } catch (error) {
      console.error(error);
      // ignore
    }

    window.dispatchEvent(
      new CustomEvent("authChanged", { detail: { user: null } })
    );
    setMenuOpen(false);

    try {
      navigate("/login");
    } catch (error) {
      console.error(error);
      window.location.href = "/login";
    }
  };

  return (
    <nav className={navbarStyles.nav}>
      <div
        style={{ backgroundImage: navbarStyles.decorativePatternBackground }}
        className={navbarStyles.decorativePattern}
      ></div>

      <div className={navbarStyles.bubble1}></div>
      <div className={navbarStyles.bubble2}></div>
      <div className={navbarStyles.bubble3}></div>

      <div className={navbarStyles.container}>
        <div className={navbarStyles.logoContainer}>
          <Link to="/" className={navbarStyles.logoButton}>
            {/* <div className={navbarStyles.logoInner}></div> */}
            <img
              src={techQuizeLogo}
              alt=""
              className={navbarStyles.logoImage}
            />
          </Link>
        </div>

        <div className={navbarStyles.titleContainer}>
          <div className={navbarStyles.titleBackground}>
            <h1 className={navbarStyles.titleText}>Mern Quiz App</h1>
          </div>
        </div>

        <div className={navbarStyles.desktopButtonsContainer}>
          <div className={navbarStyles.spacer}></div>
              <NavLink to="/contributor" className={navbarStyles.resultsButton}>
             <GitBranchIcon className={navbarStyles.buttonIcon}/>
             Contributor</NavLink>
          {loggedIn && (
            <>
            
              <NavLink to="/result" className={navbarStyles.resultsButton}>
                <Award className={navbarStyles.buttonIcon} />
                My Result
              </NavLink>

              <NavLink to="/profile" className={navbarStyles.resultsButton}>
                <PanelsTopLeft className={navbarStyles.buttonIcon} />
                Profile
              </NavLink>

            </>
          )}

          {loggedIn ? (
            <button
              onClick={handleLogout}
              className={navbarStyles.logoutButton}
            >
              <LogOut className={navbarStyles.buttonIcon} />
            </button>
          ) : (
            <NavLink to="/login" className={navbarStyles.loginButton}>
              <LogIn className={navbarStyles.buttonIcon} />
              Login
            </NavLink>
          )}
        </div>

        <div className={navbarStyles.mobileMenuContainer}>
          <button
            onClick={() => setMenuOpen((s) => !s)}
            className={navbarStyles.menuToggleButton}
          >
            {menuOpen ? (
              <X className={navbarStyles.menuIcon} />
            ) : (
              <Menu className={navbarStyles.menuIcon} />
            )}
          </button>
{menuOpen && (
  <div className={navbarStyles.mobileMenuPanel}>
    <ul className={navbarStyles.mobileMenuList}>
      
      {/* ALWAYS VISIBLE: Contributor */}
      <li>
        <NavLink
          to="/contributor"
          className={navbarStyles.mobileMenuItem}
          onClick={() => setMenuOpen(false)}
        >
          <GitBranchIcon className={navbarStyles.mobileMenuIcon} />
          Contributor
        </NavLink>
      </li>

      {/* ONLY VISIBLE IF LOGGED IN: Result & Profile */}
      {loggedIn && (
        <>
          <li>
            <NavLink
              to="/result"
              className={navbarStyles.mobileMenuItem}
              onClick={() => setMenuOpen(false)}
            >
              <Award className={navbarStyles.mobileMenuIcon} />
              My result
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={navbarStyles.mobileMenuItem}
              onClick={() => setMenuOpen(false)}
            >
              <PanelsTopLeft className={navbarStyles.mobileMenuIcon} />
              Profile
            </NavLink>
          </li>
        </>
      )}

      {/* TOGGLE VISIBILITY: Logout vs Login */}
      {loggedIn ? (
        <li>
          <button
            type="button"
            onClick={handleLogout}
            className={navbarStyles.mobileMenuItem}
          >
            <LogOut className={navbarStyles.mobileMenuIcon} />
            Logout
          </button>
        </li>
      ) : (
        <li>
          <NavLink
            to="/login"
            className={navbarStyles.mobileMenuItem}
            onClick={() => setMenuOpen(false)}
          >
            <LogIn className={navbarStyles.mobileMenuIcon} />
            Login
          </NavLink>
        </li>
      )}
    </ul>
  </div>
)}
        </div>
      </div>

      <style className={navbarStyles.animations}></style>
    </nav>
  );
};

export default Navbar;
