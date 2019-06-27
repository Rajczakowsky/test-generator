import React from 'react';
import PropTypes from 'prop-types';

const ErrorWithCode = (props) => {
    const { code } = props;

    const generateError = () => {
        let error;
        switch (code) {
        case 401:
        case 403:
            error = (
                <div>
                    <h1 data-at="error-page__heading">Uh oh! Something went wrong</h1>
                    <h2 data-at="error-page__subheading">You don&#39;t have permission to view this page</h2>
                    <span data-at="error-page__description">
                        Sorry, the page you are trying to access isn&#39;t available to people with your user type.
                    </span>
                    {' '}
                    <a data-at="error-page__home-link" href="/">Back To Home Page</a>
                </div>
            );
            break;
        default:
            error = (
                <div>
                    <h1 data-at="error-page__heading">
                        Error:
                        {' '}
                        {code || null}
                    </h1>
                    <span data-at="error-page__description">
                        There has been an error completing your request. Please clear your cookies and
                        {' '}
                        cache and then try again. If this error persists, please contact your administrator.
                    </span>
                </div>
            );
        }
        return error;
    };

    return generateError();
};

ErrorWithCode.defaultProps = {
    code: 0,
};

ErrorWithCode.propTypes = {
    code: PropTypes.number,
};

export default ErrorWithCode;
