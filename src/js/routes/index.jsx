import React from 'react';
import { Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import HomepageRoute from '../pages/Homepage/routes';
import NotFoundRoute from '../pages/NotFound/routes';

const history = createBrowserHistory({ basename: "/ola"});

if (typeof window.config.GOOGLE_ANALYTICS === 'string' &&
    window.config.GOOGLE_ANALYTICS !== 'false' &&
    window.config.GOOGLE_ANALYTICS !== '') {
    history.listen((location) => {
        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname);
    });
}

const Routes = () => (
    <Router history={history}>
        <Switch>
            {HomepageRoute}
            {NotFoundRoute}
        </Switch>
    </Router>
);

export default Routes;
