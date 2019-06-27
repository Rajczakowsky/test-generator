import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import Footer, { loggedOutNavItems, teacherNavItems } from '.';

describe('Footer page', () => {
    let component;
    const mockStore = configureMockStore();

    describe('Logged in as teacher', () => {
        const store = mockStore({
            userInfo: { id: '123', role: 'TEACHER' },
        });

        beforeEach(() => {
            component = shallow(
                <Footer store={store} />,
            ).dive();
        });

        test('should render the component with teacher nav items', () => {
            expect(component.props().navItems).toEqual(teacherNavItems);
        });
    });

    describe('Logged in as student', () => {
        const store = mockStore({
            userInfo: { id: '123', role: 'STUDENT' },
        });

        beforeEach(() => {
            component = shallow(
                <Footer store={store} />,
            ).dive();
        });

        test('should render the component with student nav items', () => {
            expect(component.props().navItems).toEqual([]);
        });
    });

    describe('Not logged in', () => {
        const store = mockStore({
            userInfo: { },
        });

        beforeEach(() => {
            component = shallow(
                <Footer store={store} />,
            ).dive();
        });

        test('should render the component with logged out nav items', () => {
            expect(component.props().navItems).toEqual(loggedOutNavItems);
        });
    });
});
