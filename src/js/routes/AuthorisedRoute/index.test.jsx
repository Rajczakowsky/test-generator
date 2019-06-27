import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';
import AuthorisedRoute from '.';

const theme = {
    grid: {
        breakpoints: ['30rem', '60rem'],
    },
};

jest.mock('../../components/UpdatePasswordRequired', () => ({ children }) => children);
const mockStore = configureMockStore();
const MockComponent = () => null;
jest.mock('axios');

describe('AuthorisedRoute ', () => {
    describe('when Authorised', () => {
        let component;

        beforeEach(() => {
            const store = mockStore({
                userInfo: {
                    role: 'TEACHER',
                },
            });

            component = mount(
                <Router>
                    <Provider store={store}>
                        <ThemeProvider theme={theme}>
                            <AuthorisedRoute
                                component={MockComponent}
                                allowedRoles={['TEACHER']}
                                testProp="test"
                            />
                        </ThemeProvider>
                    </Provider>
                </Router>,
            );
        });

        test('renders a Route component', () => {
            expect(component.find('Route').get(0)).not.toBe(undefined);
        });

        test('renders an AuthorisedRoute component', () => {
            expect(component.find('AuthorisedRoute')).toHaveLength(1);
            expect(component.find('AuthorisedRoute').props().customError).toEqual(null);
        });

        test('renders an AuthenticatedRoute component with correct child', () => {
            expect(component.find('AuthenticatedRoute')).toHaveLength(1);
            expect(component.find('AuthenticatedRoute').find('MockComponent')).toHaveLength(1);
            expect(component.find('AuthenticatedRoute').find('MockComponent').props().match).toBeDefined();
        });

        test('renders Layout Wrapper with withLayout set to true', () => {
            expect(component.find('Layout').props().withLayout).toBeTruthy();
        });

        describe('when withLayout is false', () => {
            beforeEach(() => {
                const store = mockStore({
                    userInfo: {
                        role: 'TEACHER',
                    },
                });

                component = mount(
                    <Router>
                        <Provider store={store}>
                            <ThemeProvider theme={theme}>
                                <AuthorisedRoute
                                    component={MockComponent}
                                    allowedRoles={['TEACHER']}
                                    testProp="test"
                                    withLayout={false}
                                />
                            </ThemeProvider>
                        </Provider>
                    </Router>,
                );
            });

            test('renders Layout Wrapper with withLayout set to false', () => {
                expect(component.find('Layout').props().withLayout).toBeFalsy();
            });
        });
    });

    describe('when not Authorised', () => {
        let component;

        beforeEach(() => {
            const store = mockStore({
                userInfo: {
                    role: 'STUDENT',
                },
            });

            component = mount(
                <Router>
                    <Provider store={store}>
                        <ThemeProvider theme={theme}>
                            <AuthorisedRoute component={MockComponent} allowedRoles={['TEACHER']} testProp="test" />
                        </ThemeProvider>
                    </Provider>
                </Router>,
            );
        });

        test('renders a Route component', () => {
            expect(component.find('Route').get(0)).not.toBe(undefined);
        });

        test('renders an AuthorisedRoute component', () => {
            expect(component.find('AuthorisedRoute')).toHaveLength(1);
            expect(component.find('AuthorisedRoute').props().customError).toEqual(null);
        });

        test('does not render the passed component', () => {
            expect(component.find('MockComponent')).toHaveLength(0);
        });

        test('renders error component with 403 code', () => {
            expect(component.find('ErrorWithCode')).toHaveLength(1);
            expect(component.find('ErrorWithCode').props().code).toEqual(403);
        });
    });

    describe('when customError specified', () => {
        let component;

        const customError = (<div className="custom-error" />);

        beforeEach(() => {
            const store = mockStore({
                userInfo: {
                    role: 'TEACHER',
                },
            });

            component = mount(
                <Router>
                    <Provider store={store}>
                        <ThemeProvider theme={theme}>
                            <AuthorisedRoute
                                component={MockComponent}
                                allowedRoles={['TEACHER']}
                                customError={customError}
                            />
                        </ThemeProvider>
                    </Provider>
                </Router>,
            );
        });

        test('renders an AuthorisedRoute component with the custom error', () => {
            expect(component.find('AuthorisedRoute')).toHaveLength(1);
            expect(component.find('AuthorisedRoute').props().customError).toEqual(customError);
        });
    });
});
