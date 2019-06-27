import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { ThemeProvider } from 'styled-components';
import ReactGA from 'react-ga';
import { initRaven } from '@twigeducation/raven-logger';
import { theme, GlobalStyle } from '@twigeducation/ts-fe-components';

import Routes from './routes';
import store from './store/store';
import client from './apolloClient';
import CustomLaunchDarkly from './components/LaunchDarkly';
import './font';
import '../font/font.css';

if (typeof window.config.FFF_SENTRY_PUBLIC_DSN === 'string' && window.config.FFF_SENTRY_PUBLIC_DSN !== '') {
    initRaven(window.config.FFF_SENTRY_PUBLIC_DSN);
}

if (typeof window.config.GOOGLE_ANALYTICS === 'string' &&
    window.config.GOOGLE_ANALYTICS !== 'false' &&
    window.config.GOOGLE_ANALYTICS !== '') {
    ReactGA.initialize(window.config.GOOGLE_ANALYTICS);
} else {
    const fakeGoogleAnalyticsAccount = 'UA-00000000-00';
    ReactGA.initialize(fakeGoogleAnalyticsAccount);
}

ReactDOM.render(
    <Suspense fallback={<div>Loading...</div>}>
        <ApolloProvider client={client}>
            <Provider store={store}>
                <CustomLaunchDarkly>
                    <ThemeProvider theme={theme}>
                        <React.Fragment>
                            <GlobalStyle />
                            <Routes />
                        </React.Fragment>
                    </ThemeProvider>
                </CustomLaunchDarkly>
            </Provider>
        </ApolloProvider>
    </Suspense>,
    document.getElementById('app'),
);
