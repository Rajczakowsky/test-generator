import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';
import AuthenticatedRoute from '.';

jest.mock('../../components/UpdatePasswordRequired', () => ({ children }) => children);

const mockStore = configureMockStore();
const MockComponent = jest.fn(() => <div id="test-component" />);
jest.mock('axios');
const theme = {
    grid: {
        breakpoints: ['30rem', '60rem'],
    },
};

describe('AuthenticatedRoute ', () => {
    const location = { url: 'testlocation', pathname: '' };
    describe('when authenticated', () => {
        let component;

        beforeEach(() => {
            MockComponent.mockClear();
            const store = mockStore({
                userInfo: {
                    role: 'TEACHER',
                },
            });

            component = mount(
                <Router>
                    <Provider store={store}>
                        <ThemeProvider theme={theme}>
                            <AuthenticatedRoute render={MockComponent} testProp="test" location={location} />
                        </ThemeProvider>
                    </Provider>
                </Router>,
            );
        });

        test('renders a Route component', () => {
            expect(component.find('Route').get(0)).not.toBe(undefined);
        });

        test('applies all props to the Route component apart from the component to be wrapped', () => {
            expect(component.find('Route').first().props().location).toEqual(location);
            expect(component.find('Route').first().props().testProp).toEqual('test');
        });

        describe('within the Route components render function', () => {
            test('should render Authentication wrapper', () => {
                expect(component.find('Authentication').length).toEqual(1);
            });

            test('calls render function correctly', () => {
                expect(MockComponent).toHaveBeenCalledTimes(1);
                expect(MockComponent).toHaveBeenCalledTimes(1);
            });
        });

        test('should render the main content component', () => {
            expect(component.find('#test-component').length).toEqual(1);
        });

        test('renders Layout Wrapper with withLayout set to true', () => {
            expect(component.find('Layout').props().withLayout).toBeTruthy();
        });

        describe('and withLayout is false', () => {
            beforeEach(() => {
                MockComponent.mockClear();
                const store = mockStore({
                    userInfo: {
                        role: 'TEACHER',
                    },
                });

                component = mount(
                    <Router>
                        <Provider store={store}>
                            <ThemeProvider theme={theme}>
                                <AuthenticatedRoute
                                    render={MockComponent}
                                    testProp="test"
                                    location={location}
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

    describe('when not authenticated', () => {
        let component;
        beforeAll(() => {
            window.location.assign = jest.fn();
        });

        afterAll(() => {
            window.location.assign.mockRestore();
        });

        beforeEach(() => {
            MockComponent.mockClear();
            component = mount(
                <Router>
                    <Provider store={mockStore({ userInfo: {} })}>
                        <AuthenticatedRoute render={MockComponent} testProp="test" location={location} />
                    </Provider>
                </Router>,
            );
        });

        afterEach(() => {
            window.location.assign.mockClear();
        });

        test('renders a Route component', () => {
            expect(component.find('Route').get(0)).not.toBe(undefined);
        });

        test('applies all props to the Route component apart from the component to be wrapped', () => {
            expect(component.find('Route').first().props().location).toEqual(location);
            expect(component.find('Route').first().props().testProp).toEqual('test');
        });

        test('should not render the MockComponent', () => {
            expect(component.find('#test-component')).toHaveLength(0);
        });
    });
});
