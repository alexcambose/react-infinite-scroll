import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/index.scss';
import RoutesContainer from './routes/RoutesContainer';
import 'babel-polyfill';

const div = document.createElement('div');
div.id = 'app';
document.body.appendChild(div);

ReactDOM.render(
    <div className="container">
        <RoutesContainer />
    </div>,
    document.getElementById('app'),
);
