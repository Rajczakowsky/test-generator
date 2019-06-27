import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import Layout from '../Layout';

const UnauthenticatedRoute = ({ component: Component, withLayout, ...otherProps }) => (
    <Route
        {...otherProps}
        render={matchProps => (
            <Layout withLayout={withLayout}>
                <Component {...matchProps} />
            </Layout>
        )}
    />
);

UnauthenticatedRoute.defaultProps = {
    withLayout: true,
};

UnauthenticatedRoute.propTypes = {
    withLayout: PropTypes.bool,
    component: PropTypes.func.isRequired,
};

export default UnauthenticatedRoute;
