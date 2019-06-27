import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import AuthenticationWrapper from '../../authentication';
import Layout from '../Layout';

const AuthenticatedRoute = ({ render, withLayout, ...otherProps }) => (
    <Route
        {...otherProps}
        render={matchProps => (
            <AuthenticationWrapper>
                <Layout withLayout={withLayout}>
                    {render({ ...matchProps })}
                </Layout>
            </AuthenticationWrapper>
        )}
    />
);

AuthenticatedRoute.defaultProps = {
    withLayout: true,
};

AuthenticatedRoute.propTypes = {
    render: PropTypes.func.isRequired,
    withLayout: PropTypes.bool,
};

export default AuthenticatedRoute;
