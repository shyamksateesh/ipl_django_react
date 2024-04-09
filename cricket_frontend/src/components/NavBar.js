import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/match-win-lose">Match Win/Lose</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/top-bowlers">Top Bowlers</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
