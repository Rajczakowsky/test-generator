import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import Authorisation from './Authorisation';

jest.mock('../../components/UpdatePasswordRequired', () => ({ children }) => children);
const mockStore = configureMockStore();
const MockComponent = () => null;

describe('Authorisation ', () => {
    describe('when Authorised', () => {
        let component;

        beforeEach(() => {
            const store = mockStore({
                userInfo: {
                    role: 'TEACHER',
                },
            });

            component = mount(
                <Provider store={store}>
                    <Authorisation allowedRoles={['TEACHER']}>
                        <MockComponent />
                    </Authorisation>
                </Provider>,
            );
        });

        test('renders the MockComponent', () => {
            expect(component.find('MockComponent')).toHaveLength(1);
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
                <Provider store={store}>
                    <Authorisation allowedRoles={['TEACHER']}>
                        <MockComponent />
                    </Authorisation>
                </Provider>,
            );
        });

        test('renders the MockComponent', () => {
            expect(component.find('MockComponent')).toHaveLength(0);
        });

        test('renders an error component with 403 code', () => {
            expect(component.find('ErrorWithCode')).toHaveLength(1);
            expect(component.find('ErrorWithCode').props().code).toEqual(403);
        });
    });

    describe('when not Authorised and custom error specified', () => {
        let component;

        const customError = (<div className="custom-error" />);

        beforeEach(() => {
            const store = mockStore({
                userInfo: {
                    role: 'STUDENT',
                },
            });

            component = mount(
                <Provider store={store}>
                    <Authorisation allowedRoles={['TEACHER']} customError={customError}>
                        <MockComponent />
                    </Authorisation>
                </Provider>,
            );
        });

        test('renders the custom error', () => {
            expect(component.find('ErrorWithCode')).toHaveLength(0);
            expect(component.find('.custom-error')).toHaveLength(1);
        });
    });
});
