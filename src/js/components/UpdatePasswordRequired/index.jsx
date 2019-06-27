import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import QueryHandler from '../QueryHandler';
import configuration from '../../../../configuration';

const updatePasswordUrl = configuration.FORCE_RESET_PASSWORD_URL;
const accountsUrl = configuration.ACCOUNTS_URL;

export const passwordResetRequiredQuery = gql`
    query currentUser {
        currentUser {
            ... on TSTeacherUser {
                id
                passwordResetRequired
                __typename
            }
            ... on TSStudentUser {
                id
                passwordResetRequired
                __typename
            }
            __typename
        }
    }
`;

const redirectToPasswordUpdate = (path) => {
    window.location.assign(`${accountsUrl}${updatePasswordUrl}?next=/ola${path}`);
    return null;
};

const UpdatePasswordRequired = ({
    children, path,
}) => (
    <QueryHandler query={passwordResetRequiredQuery}>
        {({
            currentUser: {
                passwordResetRequired,
            },
        }) => (passwordResetRequired && path !== updatePasswordUrl ?
            redirectToPasswordUpdate(path) : children)}
    </QueryHandler>
);

UpdatePasswordRequired.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
    path: PropTypes.string.isRequired,
};

export default UpdatePasswordRequired;
