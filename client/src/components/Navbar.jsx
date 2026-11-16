import { useContext } from 'react';

import { ThemeContext } from '../context/ThemeContext';
import { useSelector } from 'react-redux';

export default function Navbar() {

  const { theme, toggleTheme } = useContext(ThemeContext);

  const totalCount = useSelector(
    (state) => state.cart.totalCount
  );

  return (
    <nav className="navbar">

      <div className="nav-brand">
        <h2>
          TechStore
          <span className="badge-mern"> MERN S6 </span>
        </h2>
      </div>

      <div className="nav-actions">

        <button
          className="btn-theme-toggle"
          onClick={toggleTheme}
        >
          {theme === 'light' ? 'Mode Sombre' : 'Mode Clair'}
        </button>

        <div className="cart-badge">
          <span>Panier</span>
          <span className="badge-count">{totalCount}</span>
        </div>

      </div>
    </nav>
  );
}