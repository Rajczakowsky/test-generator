import React from 'react';
import { mount } from 'enzyme';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import * as tsAuth from '@twigeducation/ts-auth';
import Authentication from './Authentication';

const mockStore = configureMockStore();
jest.mock('../components/UpdatePasswordRequired', () => ({ children }) => children);
jest.mock('@twigeducation/ts-auth', () => ({
    getAccessToken: jest.fn(),
    requestAccessTokenWithRefreshToken: jest.fn(),
    accessTokenIsValid: jest.fn(),
    getRefreshToken: jest.fn(),
    refreshTokenIsValid: jest.fn(),
    updateUserInfo: jest.fn(() => ({
        type: 'UPDATE_USER_INFO',
    })),
}));

describe('Authentication', () => {
    let component;
    let setUserInfoSpy;

    const ComponentBehindAuth = () => (<h1 className="authHeader">I am authenticated!</h1>);

    beforeAll(() => {
        window.location.assign = jest.fn();
    });

    afterAll(() => {
        window.location.assign.mockRestore();
    });

    describe('when user exists', () => {
        beforeEach(async () => {
            const store = mockStore({
                userInfo: {
                    role: 'TEACHER',
                },
            });

            component = mount(
                <StaticRouter
                    location={{
                        pathname: '/test',
                    }}
                >
                    <Provider store={store}>
                        <Authentication>
                            <ComponentBehindAuth />
                        </Authentication>
                    </Provider>
                </StaticRouter>,
            );
        });

        test('should render the component without extra steps', async () => {
            expect(component.find('.authHeader')).toBeDefined();
            expect(component.find('.authHeader').text()).toEqual('I am authenticated!');
        });
    });

    describe('when user doesn\'t exist and access token exists and is valid', () => {
        beforeAll(() => {
            tsAuth.getAccessToken.mockImplementation(() => `x.${btoa(JSON.stringify({
                app_metadata: {
                    email_verified: true,
                    user_id: '869a3581-d190-4d52-80ad-28a23fe5aea5',
                    is_active: true,
                    is_staff: false,
                    is_superuser: false,
                    is_test_user: false,
                    role: 'TEACHER',
                },
            }))}.x`);
            tsAuth.accessTokenIsValid.mockImplementation(() => true);
        });

        beforeEach(async () => {
            const store = mockStore({
                userInfo: {},
            });
            setUserInfoSpy = jest.spyOn(store, 'dispatch');
            tsAuth.getAccessToken.mockClear();
            tsAuth.accessTokenIsValid.mockClear();

            component = mount(
                <StaticRouter
                    location={{
                        pathname: '/test',
                    }}
                >
                    <Provider store={store}>
                        <Authentication>
                            <ComponentBehindAuth />
                        </Authentication>
                    </Provider>
                </StaticRouter>,
            );
        });

        test('should render the component using access token', async () => {
            expect(component.find('.authHeader')).toBeDefined();
            expect(component.find('.authHeader').text()).toEqual('I am authenticated!');
        });

        test('should check the accessToken can be retrieved', async () => {
            expect(tsAuth.getAccessToken).toHaveBeenCalledTimes(1);
        });

        test('should check the accessToken is valid', async () => {
            expect(tsAuth.accessTokenIsValid).toHaveBeenCalledTimes(1);
        });

        test('should populate the user in the store', () => {
            expect(setUserInfoSpy).toHaveBeenCalledWith({
                type: 'UPDATE_USER_INFO',
            });
        });
    });

    describe('when user doesn\'t exist and access token doesn\'t exist', () => {
        beforeAll(() => {
            tsAuth.getAccessToken.mockImplementation(() => false);
            tsAuth.accessTokenIsValid.mockImplementation(() => false);
        });

        beforeEach(async () => {
            window.location.assign.mockClear();
            tsAuth.getAccessToken.mockClear();
            const store = mockStore({
                userInfo: {},
            });

            component = mount(
                <StaticRouter
                    location={{
                        pathname: '/test',
                    }}
                >
                    <Provider store={store}>
                        <Authentication>
                            <ComponentBehindAuth />
                        </Authentication>
                    </Provider>
                </StaticRouter>,
            );
        });

        test('should redirect to login', async () => {
            expect(window.location.assign.mock.calls.length).toEqual(1);
            expect(window.location.assign.mock.calls[0][0]).toEqual('/login?next=/ola/test');
        });

        test('should check the accessToken cannot be retrieved', async () => {
            expect(tsAuth.getAccessToken).toHaveBeenCalledTimes(2);
        });
    });

    describe('when user doesn\'t exist and access token is expired and refresh token exists and is valid', () => {
        beforeAll(() => {
            const mockAuthenticateResponseData = {
                data: {
                    access_token: `mocknewAccessToken.${btoa(JSON.stringify({ exp: (Date.now() / 1000) + 1061 }))}`,
                    refresh_token: {
                        token: 'mockNewRefreshToken',
                        expires: (Date.now() / 1000) + 1061,
                    },
                },
            };

            tsAuth.getAccessToken.mockImplementation(() => `x.${btoa(JSON.stringify({
                app_metadata: {
                    email_verified: true,
                    user_id: '869a3581-d190-4d52-80ad-28a23fe5aea5',
                    is_active: true,
                    is_staff: false,
                    is_superuser: false,
                    is_test_user: false,
                    role: 'TEACHER',
                },
            }))}.x`);
            tsAuth.accessTokenIsValid.mockImplementation(() => false);
            tsAuth.getRefreshToken.mockImplementation(() => 'mockRefreshToken');
            tsAuth.refreshTokenIsValid.mockImplementation(() => true);
            tsAuth.requestAccessTokenWithRefreshToken.mockImplementation(async () => mockAuthenticateResponseData);
        });

        beforeEach(async () => {
            tsAuth.getAccessToken.mockClear();
            tsAuth.accessTokenIsValid.mockClear();
            tsAuth.getRefreshToken.mockClear();
            tsAuth.refreshTokenIsValid.mockClear();
            tsAuth.requestAccessTokenWithRefreshToken.mockClear();
            window.location.assign.mockClear();

            const store = mockStore({
                userInfo: {},
            });
            setUserInfoSpy = jest.spyOn(store, 'dispatch');

            component = mount(
                <StaticRouter
                    location={{
                        pathname: '/test',
                    }}
                >
                    <Provider store={store}>
                        <Authentication>
                            <ComponentBehindAuth />
                        </Authentication>
                    </Provider>
                </StaticRouter>,
            );
        });

        test('should render the component using refresh token', async () => {
            component.update();
            expect(component.find('.authHeader')).toBeDefined();
            expect(component.find('.authHeader').text()).toEqual('I am authenticated!');
        });

        test('should check the accessToken can be retrieved', async () => {
            expect(tsAuth.getAccessToken).toHaveBeenCalledTimes(2);
        });

        test('should check the accessToken is invalid', async () => {
            expect(tsAuth.accessTokenIsValid).toHaveBeenCalledTimes(1);
        });

        test('should check the refreshToken can be retrieved', async () => {
            expect(tsAuth.getRefreshToken).toHaveBeenCalledTimes(1);
        });

        test('should check the refreshToken is valid', async () => {
            expect(tsAuth.refreshTokenIsValid).toHaveBeenCalledTimes(1);
        });

        test('should request a new refreshToken', async () => {
            expect(tsAuth.requestAccessTokenWithRefreshToken).toHaveBeenCalledTimes(1);
            expect(tsAuth.requestAccessTokenWithRefreshToken.mock.calls[0][0]).toEqual('http://localhost:5001');
            expect(typeof tsAuth.requestAccessTokenWithRefreshToken.mock.calls[0][1]).toEqual('function');
        });
    });

    describe('when user doesn\'t exist and access token is expired and refresh token exists and is ' +
        'valid but axios returns error', () => {
        beforeAll(() => {
            tsAuth.getAccessToken.mockImplementation(() => `x.${btoa(JSON.stringify({
                app_metadata: {
                    email_verified: true,
                    user_id: '869a3581-d190-4d52-80ad-28a23fe5aea5',
                    is_active: true,
                    is_staff: false,
                    is_superuser: false,
                    is_test_user: false,
                    role: 'TEACHER',
                },
            }))}.x`);
            tsAuth.accessTokenIsValid.mockImplementation(() => false);
            tsAuth.getRefreshToken.mockImplementation(() => 'mockRefreshToken');
            tsAuth.refreshTokenIsValid.mockImplementation(() => true);
            tsAuth.requestAccessTokenWithRefreshToken.mockImplementation(async () => { throw new Error('error'); });
        });

        beforeEach(async () => {
            tsAuth.getAccessToken.mockClear();
            tsAuth.accessTokenIsValid.mockClear();
            tsAuth.getRefreshToken.mockClear();
            tsAuth.refreshTokenIsValid.mockClear();
            tsAuth.requestAccessTokenWithRefreshToken.mockClear();
            window.location.assign.mockClear();

            window.location.assign.mockClear();
            const store = mockStore({
                userInfo: {},
            });

            component = mount(
                <StaticRouter
                    location={{
                        pathname: '/test',
                    }}
                >
                    <Provider store={store}>
                        <Authentication>
                            <ComponentBehindAuth />
                        </Authentication>
                    </Provider>
                </StaticRouter>,
            );
        });

        test('should render the error component', async () => {
            component.update();
            expect(component.find('ErrorWithCode')).toHaveLength(1);
            expect(component.find('ErrorWithCode').props().code).toEqual(null);
        });

        test('should check the accessToken can be retrieved', async () => {
            expect(tsAuth.getAccessToken).toHaveBeenCalledTimes(2);
        });

        test('should check the accessToken is invalid', async () => {
            expect(tsAuth.accessTokenIsValid).toHaveBeenCalledTimes(1);
        });

        test('should check the refreshToken can be retrieved', async () => {
            expect(tsAuth.getRefreshToken).toHaveBeenCalledTimes(1);
        });

        test('should check the refreshToken is valid', async () => {
            expect(tsAuth.refreshTokenIsValid).toHaveBeenCalledTimes(1);
        });

        test('should request a new refreshToken', async () => {
            expect(tsAuth.requestAccessTokenWithRefreshToken).toHaveBeenCalledTimes(1);
            expect(tsAuth.requestAccessTokenWithRefreshToken.mock.calls[0][0]).toEqual('http://localhost:5001');
            expect(typeof tsAuth.requestAccessTokenWithRefreshToken.mock.calls[0][1]).toEqual('function');
        });
    });

    describe('when user doesn\'t exist and access token is expired and refresh doesn\'t exist', () => {
        beforeAll(() => {
            window.location.assign = jest.fn();

            tsAuth.getAccessToken.mockImplementation(() => false);
            tsAuth.accessTokenIsValid.mockImplementation(() => false);
            tsAuth.getRefreshToken.mockImplementation(() => false);
            tsAuth.refreshTokenIsValid.mockImplementation(() => false);
        });

        beforeEach(async () => {
            tsAuth.getAccessToken.mockClear();
            tsAuth.accessTokenIsValid.mockClear();
            tsAuth.getRefreshToken.mockClear();
            tsAuth.refreshTokenIsValid.mockClear();
            window.location.assign.mockClear();
            const store = mockStore({
                userInfo: {},
            });

            component = mount(
                <StaticRouter
                    location={{
                        pathname: '/test',
                    }}
                >
                    <Provider store={store}>
                        <Authentication>
                            <ComponentBehindAuth />
                        </Authentication>
                    </Provider>
                </StaticRouter>,
            );
        });

        test('should check the accessToken can be retrieved', async () => {
            expect(tsAuth.getAccessToken).toHaveBeenCalledTimes(2);
        });

        test('should redirect to login', async () => {
            expect(window.location.assign.mock.calls.length).toEqual(1);
            expect(window.location.assign.mock.calls[0][0]).toEqual('/login?next=/ola/test');
        });
    });

    describe('when user doesn\'t exist and access token is expired and refresh is expired', () => {
        beforeAll(() => {
            window.location.assign = jest.fn();
            tsAuth.getAccessToken.mockImplementation(() => `x.${btoa(JSON.stringify({
                app_metadata: {
                    email_verified: true,
                    user_id: '869a3581-d190-4d52-80ad-28a23fe5aea5',
                    is_active: true,
                    is_staff: false,
                    is_superuser: false,
                    is_test_user: false,
                    role: 'TEACHER',
                },
            }))}.x`);
            tsAuth.accessTokenIsValid.mockImplementation(() => false);
            tsAuth.getRefreshToken.mockImplementation(() => 'mockRefreshToken');
            tsAuth.refreshTokenIsValid.mockImplementation(() => false);
        });

        beforeEach(async () => {
            tsAuth.getAccessToken.mockClear();
            tsAuth.accessTokenIsValid.mockClear();
            tsAuth.getRefreshToken.mockClear();
            tsAuth.refreshTokenIsValid.mockClear();
            window.location.assign.mockClear();
            const store = mockStore({
                userInfo: {},
            });

            component = mount(
                <StaticRouter
                    location={{
                        pathname: '/test',
                    }}
                >
                    <Provider store={store}>
                        <Authentication>
                            <ComponentBehindAuth />
                        </Authentication>
                    </Provider>
                </StaticRouter>,
            );
        });

        test('should check the accessToken can be retrieved', async () => {
            expect(tsAuth.getAccessToken).toHaveBeenCalledTimes(2);
        });

        test('should check the accessToken is invalid', async () => {
            expect(tsAuth.accessTokenIsValid).toHaveBeenCalledTimes(1);
        });

        test('should check the refreshToken can be retrieved', async () => {
            expect(tsAuth.getRefreshToken).toHaveBeenCalledTimes(1);
        });

        test('should check the refreshToken is valid', async () => {
            expect(tsAuth.refreshTokenIsValid).toHaveBeenCalledTimes(1);
        });

        test('should redirect to login', async () => {
            expect(window.location.assign.mock.calls.length).toEqual(1);
            expect(window.location.assign.mock.calls[0][0]).toEqual('/login?next=/ola/test');
        });
    });
});
