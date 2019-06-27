import React from 'react';
import PropTypes from 'prop-types';
import AuthenticatedRoute from '../AuthenticatedRoute';
import AuthorisationWrapper from './Authorisation';

const AuthorisedRoute = ({
    component: Component, allowedRoles, customError, ...otherProps
}) => {
    const ComponentBehindAuth = props => (
        <AuthorisationWrapper allowedRoles={allowedRoles} customError={customError}>
            <Component {...props} />
        </AuthorisationWrapper>
    );

    return (
        <AuthenticatedRoute
            {...otherProps}
            render={matchProps => ComponentBehindAuth({ ...matchProps })}
        />
    );
};

AuthorisedRoute.defaultProps = {
    allowedRoles: [],
    customError: null,
};

AuthorisedRoute.propTypes = {
    component: PropTypes.func.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string),
    customError: PropTypes.element,
};

export default AuthorisedRoute;
