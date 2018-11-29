import React from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-dom';

const DemoNavbar = () => (
    <ul className="nav">
        <li>
            <NavLink exact to="/demo/basic">
        Basic
            </NavLink>
        </li>
        <li>
            <NavLink exact to="/demo/fetching">
        Fetching
            </NavLink>
        </li>
        <li>
            <NavLink exact to="/demo/auto">
        Auto mode
            </NavLink>
        </li>
        <li>
            <NavLink exact to="/demo/container">
        Container
            </NavLink>
        </li>
    </ul>
);

export default DemoNavbar;
