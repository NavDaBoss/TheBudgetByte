import { useProfileRedirect, useLogout } from "../../hooks/clientUtils";

import "../../styles/Navbar.css";

const Navbar = () => {
  const profile = useProfileRedirect();
  const logout = useLogout();

  return (
    <div className="header-nav-container">
      <h1 className="header-logo">BudgetByte</h1>
      <nav className="header-nav">
        <ul className="header-nav-list">
          <li className="header-nav-item">
            <button className="header-nav-item-link" onClick={profile}>
              Profile
            </button>
          </li>
          <li className="header-nav-item">
            <button className="header-nav-item-link" onClick={logout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
