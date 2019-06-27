/* eslint-disable react/jsx-key */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Footer as FooterComponent } from '@twigeducation/ts-fe-components';

export const loggedOutNavItems = [
    {
        text: 'About',
        links: [
            <a data-at="footer-nav-item" href="/about">About</a>,
            <a data-at="footer-nav-item" href="/resources">Resources</a>,
            <a data-at="footer-nav-item" href="/program-overview">Program Overview</a>,
            <a data-at="footer-nav-item" href="/evaluation-rubrics">Evaluation Rubrics</a>,
        ],
    },
];

export const teacherNavItems = [
    {
        text: 'Teach',
        links: [
            <a data-at="footer-nav-item" href="/teacher-dashboard">Dashboard</a>,
            <a data-at="footer-nav-item" href="/lesson-explorer">Lesson Explorer</a>,
            <a
                data-at="footer-nav-item"
                href="https://www.go.twigscience.com/student-view?gc=1"
            >
                    Student View
            </a>,
            <a data-at="footer-nav-item" href="/assessments-explorer">Assessments</a>,
        ],
    }, {
        text: 'Program',
        links: [
            <a data-at="footer-nav-item" href="/about">About</a>,
            <a data-at="footer-nav-item" href="/resources">Resources</a>,
            <a data-at="footer-nav-item" href="/program-overview">Program Overview</a>,
            <a data-at="footer-nav-item" href="/evaluation-rubrics">Evaluation Rubrics</a>,
        ],
    }, {
        text: 'Manage',
        links: [
            <NavLink data-at="footer-nav-item" to="/classes">Classes</NavLink>,
        ],
    },
];

const mapStateToProps = state => ({
    isTeacher: 'role' in state.userInfo && state.userInfo.role === 'TEACHER',
    isStudent: 'role' in state.userInfo && state.userInfo.role === 'STUDENT',
});

const Footer = ({ isTeacher, isStudent }) => {
    if (isTeacher) {
        return <FooterComponent navItems={teacherNavItems} />;
    } if (isStudent) {
        return <FooterComponent navItems={[]} />;
    }
    return <FooterComponent navItems={loggedOutNavItems} />;
};

Footer.propTypes = {
    isTeacher: PropTypes.bool.isRequired,
    isStudent: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(Footer);
