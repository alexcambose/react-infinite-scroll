import React, { Fragment } from 'react';
import normalize from 'normalize-path';
import {
  Route, HashRouter, Redirect, Switch,
} from 'react-router-dom';
import allRoutes from './index';
import Navbar from '../Navbar';

const renderRoutes = (routes, previousPath = '/') => routes.map((route, i) => (
    <Route
        key={i}
        exact={route.exact}
        strict={route.strict}
        sensitive={route.sensitive}
        path={normalize(`${previousPath}/${route.path}`) || '/'}
        render={props => (
            <route.component {...props}>
                {route.routes && (
                <Fragment>
                    {renderRoutes(route.routes, normalize(`${previousPath}/${route.path}`) || '/')}
                </Fragment>
          )}
            </route.component>
      )}
    />
));

export default () => (
    <HashRouter>
        <Fragment>
            <Navbar />
            <Switch>
                <Redirect exact from="/demo" to="/demo/basic" />
                {renderRoutes(allRoutes)}
            </Switch>
        </Fragment>
    </HashRouter>
);
