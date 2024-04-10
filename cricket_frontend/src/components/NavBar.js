import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top" style={{ backgroundColor: '#cb9d06' }}> 
      <div className="container"> 
        <Link className="navbar-brand" style={{ fontWeight: 'bold' }}>IPL Stats</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link" to="/">Home </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/match-win-lose">Win Stats</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/top-bowlers">Top Bowlers</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/net-runs">Net Runs</Link>
            </li>
          </ul>
          <span className="navbar-text" style={{ marginLeft: 'auto' }}> 
            {currentTime.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'Asia/Kolkata' })}
          </span>
        </div>
      </div>
      <style>
        {`
          .nav-link, .navbar-text {
            transition: font-weight 0.3s ease;
          }

          .nav-item:hover .nav-link, .navbar-text:hover {
            font-weight: bold;
          }

          .navbar-brand:hover {
            font-weight: bold;
          }
        `}
      </style>
    </nav>
  );
};

export default NavBar;
