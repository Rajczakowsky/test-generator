/* eslint-disable react/jsx-key */
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { LogoutButton } from '@twigeducation/ts-auth';
import {
    Header as HeaderComponent, ButtonTextIcon, Icon, PrimaryNavLink,
} from '@twigeducation/ts-fe-components';
import ExternalLink from '../ExternalLink';

export const teacherNavItems = [
    {
        text: 'Teach',
        nav: 'primaryNav',
        type: 'primaryNavButton',
        links: [
            <a data-at="header-secondary-nav-item" href="/teacher-dashboard">Dashboard</a>,
            <a data-at="header-secondary-nav-item" href="/lesson-explorer">Lesson Explorer</a>,
            <a
                data-at="header-secondary-nav-item"
                href="https://www.go.twigscience.com/student-view?gc=1"
                target="__blank"
            >
                Student View
            </a>,
            <a data-at="header-secondary-nav-item" href="/assessments-explorer">Assessments</a>,
        ],
    },
    {
        text: 'Program',
        nav: 'primaryNav',
        type: 'primaryNavButton',
        links: [
            <a data-at="header-secondary-nav-item" href="/about">About</a>,
            <a data-at="header-secondary-nav-item" href="/resources">Resources</a>,
            <a data-at="header-secondary-nav-item" href="/program-overview">Program Overview</a>,
            <a data-at="header-secondary-nav-item" href="/evaluation-rubrics">Evaluation Rubrics</a>,
        ],
    },
    {
        text: 'Manage',
        nav: 'primaryNav',
        type: 'primaryNavButton',
        links: [
            <NavLink data-at="header-secondary-nav-item" to="/classes">Class</NavLink>,
        ],
    },
    {
        text: 'Account',
        nav: 'userNav',
        type: 'accountButton',
        links: [
            <ExternalLink data-at="header-secondary-nav-item" to={`${window.config.ACCOUNTS_URL}/profile`}>
                My Profile
            </ExternalLink>,
            <a
                data-at="header-secondary-nav-item"
                href="https://resource.twigscience.com/userguide.html?cid=tsplatform"
                target="__blank"
            >
                Get Started Guide
            </a>,
            <LogoutButton
                data-at="header-secondary-nav-item"
                authUrl={window.config.AUTHENTICATION_URL}
            >
            Log Out
            </LogoutButton>,
        ],
    },
];

export const studentNavItems = [
    {
        text: 'Dashboard',
        nav: 'primaryNav',
        type: 'link',
        links: [
            <PrimaryNavLink data-at="header-secondary-nav-item" href="/student-dashboard">Dashboard</PrimaryNavLink>,
        ],
    },
    {
        text: 'Account',
        nav: 'userNav',
        type: 'accountButton',
        links: [
            <LogoutButton
                data-at="header-secondary-nav-item"
                authUrl={window.config.AUTHENTICATION_URL}
            >
                Log Out
            </LogoutButton>,
        ],
    },
];

export const loggedOutNavItems = [
    {
        text: 'Home',
        nav: 'primaryNav',
        type: 'link',
        links: [
            <PrimaryNavLink data-at="header-secondary-nav-item" href="/">Home</PrimaryNavLink>,
        ],
    },
    {
        text: 'About',
        nav: 'primaryNav',
        type: 'primaryNavButton',
        links: [
            <a data-at="header-secondary-nav-item" href="/about">About</a>,
            <a data-at="header-secondary-nav-item" href="/resources">Resources</a>,
            <a data-at="header-secondary-nav-item" href="/program-overview">Program Overview</a>,
            <a data-at="header-secondary-nav-item" href="/evaluation-rubrics">Evaluation Rubrics</a>,
        ],
    },
    {
        text: 'Account',
        nav: 'userNav',
        type: 'button',
        links: [
            <ButtonTextIcon
                primary
                iconRight
                data-at="header-secondary-nav-item"
                href={window.config.LOGIN_URL}
            >
                Log in
                <Icon.RightThin size={15} />
            </ButtonTextIcon>,
        ],
    },
];

const mapStateToProps = state => ({
    isTeacher: 'role' in state.userInfo && state.userInfo.role === 'TEACHER',
    isStudent: 'role' in state.userInfo && state.userInfo.role === 'STUDENT',
});

const Header = ({ isTeacher, isStudent }) => {
    if (isTeacher) {
        return <HeaderComponent navItems={teacherNavItems} />;
    } if (isStudent) {
        return <HeaderComponent navItems={studentNavItems} />;
    }
    return <HeaderComponent navItems={loggedOutNavItems} />;
};

Header.propTypes = {
    isTeacher: PropTypes.bool.isRequired,
    isStudent: PropTypes.bool.isRequired,
};


export default connect(mapStateToProps)(Header);
