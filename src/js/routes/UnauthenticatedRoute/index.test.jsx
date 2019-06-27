import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';
import UnauthenticatedRoute from '.';

jest.mock('../../components/UpdatePasswordRequired', () => ({ children }) => children);

const theme = {
    grid: {
        breakpoints: ['30rem', '60rem'],
    },
};

const mockStore = configureMockStore();
const MockComponent = jest.fn(() => <div id="test-component" />);
jest.mock('axios');

describe('UnauthenticatedRoute ', () => {
    const location = { url: 'testlocation', pathname: '' };
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
                    <ThemeProvider theme={theme}>
                        <UnauthenticatedRoute
                            component={MockComponent}
                            testProp="test"
                            location={location}
                        />
                    </ThemeProvider>
                </Provider>
            </Router>,
        );
    });

    afterEach(() => {
        window.location.assign.mockClear();
    });

    test('renders a Route component', () => {
        expect(component.find('Route').length).toEqual(1);
    });

    test('applies all props to the Route component apart from the component to be wrapped', () => {
        expect(component.find('Route').first().props().location).toEqual(location);
        expect(component.find('Route').first().props().testProp).toEqual('test');
    });

    test('should render the MockComponent', () => {
        expect(component.find('#test-component')).toHaveLength(1);
    });

    test('renders Layout Wrapper with withLayout set to true', () => {
        expect(component.find('Layout').props().withLayout).toBeTruthy();
    });

    describe('when withLayout is false', () => {
        beforeEach(() => {
            MockComponent.mockClear();
            component = mount(
                <Router>
                    <Provider store={mockStore({ userInfo: {} })}>
                        <ThemeProvider theme={theme}>
                            <UnauthenticatedRoute
                                component={MockComponent}
                                testProp="test"
                                withLayout={false}
                                location={location}
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
