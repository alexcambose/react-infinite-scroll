import React from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-dom';

const Navbar = () => (
    <ul className="nav">
        <li>
            <NavLink exact to="/">
        Documentation
            </NavLink>
        </li>
        <li>
            <NavLink to="/demo">Demo</NavLink>
        </li>
        <li className="align-end">
            <a
                className="github-button"
                href="https://github.com/alexcambose/react-infinite-scroll"
                data-icon="octicon-star"
                data-size="large"
                data-show-count="true"
                aria-label="Star alexcambose/react-infinite-scroll on GitHub"
            >
        Star
            </a>
        </li>
    </ul>
);

export default Navbar;
