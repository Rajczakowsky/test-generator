import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ErrorWithCode from '../../components/ErrorWithCode';

export const isAuthorised = (role, allowedRoles) => {
    if (allowedRoles &&
        allowedRoles.length &&
        allowedRoles.includes(role)
    ) {
        return true;
    }
    return false;
};

const Authorisation = (props) => {
    const {
        userInfo: { role },
        allowedRoles,
        children,
        customError,
    } = props;

    const errorToShow = customError || <ErrorWithCode code={403} />;

    return isAuthorised(role, allowedRoles) ? children : errorToShow;
};

Authorisation.defaultProps = {
    allowedRoles: [],
    customError: null,
    userInfo: {
        role: 'ANONYMOUS',
    },
};

Authorisation.propTypes = {
    allowedRoles: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.node,
        ),
        PropTypes.node,
        PropTypes.string,
    ]).isRequired,
    customError: PropTypes.element,
    userInfo: PropTypes.shape({
        role: PropTypes.string,
    }),
};

const AuthorisationContainer = compose(
    connect(
        state => ({ userInfo: state.userInfo }),
    ),
);
export default AuthorisationContainer(Authorisation);
