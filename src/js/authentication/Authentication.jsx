import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    getAccessToken,
    requestAccessTokenWithRefreshToken,
    accessTokenIsValid,
    getRefreshToken,
    refreshTokenIsValid,
    updateUserInfo as setUserInfoAction,
} from '@twigeducation/ts-auth';
import ErrorWithCode from '../components/ErrorWithCode';
import UpdatePasswordRequired from '../components/UpdatePasswordRequired';

export const redirectToLogin = (pathname = '') => {
    window.location.assign(`${window.config.LOGIN_URL}?next=/ola${pathname}`);
};

class Authentication extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            authenticated: false,
            error: false,
        };
    }

    componentDidMount() {
        this.verifyAuthentication();
    }

    async requestNewAccessTokenWithRefreshToken() {
        const { setUserInfo } = this.props;
        try {
            await requestAccessTokenWithRefreshToken(
                window.config.AUTHENTICATION_URL,
                setUserInfo,
            );
            this.setState({ authenticated: true, error: false });
        } catch (error) {
            this.setState({
                error: error.code ? { code: error.code } : { code: 0 },
            });
        }
    }

    verifyAuthentication() {
        const {
            loggedIn,
            setUserInfo,
            location: { pathname },
        } = this.props;

        if (loggedIn) {
            this.setState({ authenticated: true });
        } else if (getAccessToken() && accessTokenIsValid()) {
            setUserInfo();
            this.setState({ authenticated: true });
        } else if (getAccessToken() && getRefreshToken() && refreshTokenIsValid()) {
            this.requestNewAccessTokenWithRefreshToken();
        } else {
            redirectToLogin(pathname);
        }
    }

    render() {
        const {
            children,
            location: {
                pathname,
            },
        } = this.props;

        const {
            authenticated,
            error,
        } = this.state;

        if (authenticated) {
            return (
                <UpdatePasswordRequired path={pathname}>
                    {children}
                </UpdatePasswordRequired>
            );
        }
        if (error) {
            return <ErrorWithCode code={error.code ? error.code : null} />;
        }
        return null;
    }
}

Authentication.propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    loggedIn: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.node,
        ),
        PropTypes.node,
        PropTypes.string,
    ]).isRequired,
    setUserInfo: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    loggedIn: 'role' in state.userInfo && state.userInfo.role !== 'ANONYMOUS',
});

const mapDispatchToProps = dispatch => ({
    setUserInfo: (userInfo) => {
        dispatch(setUserInfoAction(userInfo));
    },
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(Authentication));
