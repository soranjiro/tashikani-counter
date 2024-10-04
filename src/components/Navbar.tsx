import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faHistory, faBomb, faUserPlus, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { TeamContext } from '../context/TeamContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { teamName } = useContext(TeamContext);
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">
            <FontAwesomeIcon icon={faHome} className="fa-icon" /> Home
          </Link>
        </li>
        <li>
          <Link to="/received-attacks">
            <FontAwesomeIcon icon={faHistory} className="fa-icon" /> History
          </Link>
        </li>
        <li>
          <Link to="/register-attack">
            <FontAwesomeIcon icon={faBomb} className="fa-icon" /> Attack
          </Link>
        </li>
        <li>
          <Link to="/register-user">
            <FontAwesomeIcon icon={faUserPlus} className="fa-icon" /> User
          </Link>
        </li>
        <li>
          <Link to="/attack-graph">
            <FontAwesomeIcon icon={faChartLine} className="fa-icon" /> Graph
          </Link>
        </li>
      </ul>
      {teamName && <div className="team-name">チーム: {teamName}</div>}
    </nav>
  );
};

export default Navbar;
