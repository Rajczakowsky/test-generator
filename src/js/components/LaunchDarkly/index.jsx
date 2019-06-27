import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { LaunchDarkly } from 'react-launch-darkly';
import { connect } from 'react-redux';
import getUser from './getUser';
import identify from './identify';

const LaunchDarklyWrapper = ({
    id,
    role,
    isStaff,
    testUser,
    schoolId,
    children,
}) => {
    useEffect(() => {
        identify({
            id,
            role,
            isStaff,
            testUser,
            schoolId,
        });
    }, [id]);

    return (
        <LaunchDarkly
            clientId={window.config.LAUNCH_DARKLY_CLIENT_ID}
            user={getUser(
                id,
                role,
                isStaff,
                testUser,
                schoolId,
            )}
        >
            {children}
        </LaunchDarkly>
    );
};

LaunchDarklyWrapper.defaultProps = {
    id: 'genericAnonymousUser',
    role: 'ANONYMOUS',
    isStaff: false,
    testUser: false,
    schoolId: null,
};

LaunchDarklyWrapper.propTypes = {
    id: PropTypes.string,
    role: PropTypes.string,
    isStaff: PropTypes.bool,
    testUser: PropTypes.bool,
    schoolId: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.node,
        ),
        PropTypes.node,
        PropTypes.string,
    ]).isRequired,
};

const mapStateToProps = state => ({
    id: state.userInfo.id,
    role: state.userInfo.role,
    schoolId: state.userInfo.schoolId,
    isStaff: state.userInfo.isStaff,
    testUser: state.userInfo.testUser,
});

export default connect(mapStateToProps)(LaunchDarklyWrapper);
