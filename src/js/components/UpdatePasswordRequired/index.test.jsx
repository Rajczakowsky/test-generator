import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { StaticRouter } from 'react-router-dom';
import UpdatePasswordRequired, { passwordResetRequiredQuery } from '.';
import fragmentTypes from '../../../../fragmentTypes.json';
import configuration from '../../../../configuration';

const updatePasswordUrl = configuration.FORCE_RESET_PASSWORD_URL;
const accountsUrl = configuration.ACCOUNTS_URL;

const Child = () => <div>Test</div>;

describe('UpdatePasswordRequired when passwordResetRequired is required', async () => {
    let component;
    const fragmentMatcher = new IntrospectionFragmentMatcher({
        introspectionQueryResultData: fragmentTypes.data,
    });
    const cache = new InMemoryCache({ fragmentMatcher });

    beforeAll(async () => {
        window.location.assign = jest.fn();
        const mockedData = {
            id: 'user-id',
            passwordResetRequired: true,
            __typename: 'TSTeacherUser',
        };
        component = mount(
            <StaticRouter context={{}}>
                <MockedProvider
                    cache={cache}
                    mocks={[{
                        request: {
                            query: passwordResetRequiredQuery,
                        },
                        result: {
                            data: {
                                currentUser: mockedData,
                            },
                        },
                    }]}
                >
                    <UpdatePasswordRequired path="/test">
                        <Child />
                    </UpdatePasswordRequired>
                </MockedProvider>
            </StaticRouter>,
        );
        await new Promise(resolve => setTimeout(resolve));
        await new Promise(resolve => setTimeout(resolve));
        component.update();
    });

    test('should redirect to update password page', () => {
        expect(window.location.assign).toHaveBeenCalledWith(`${accountsUrl}${updatePasswordUrl}?next=/ola/test`);
    });
});

describe('UpdatePasswordRequired when passwordResetRequired is not required', () => {
    let component;
    const fragmentMatcher = new IntrospectionFragmentMatcher({
        introspectionQueryResultData: fragmentTypes.data,
    });
    const cache = new InMemoryCache({ fragmentMatcher });

    beforeAll(async () => {
        const mockedData = {
            id: 'user-id',
            passwordResetRequired: false,
            __typename: 'TSTeacherUser',
        };

        component = mount(
            <StaticRouter>
                <MockedProvider
                    cache={cache}
                    mocks={[{
                        request: {
                            query: passwordResetRequiredQuery,
                        },
                        result: {
                            data: {
                                currentUser: mockedData,
                            },
                        },
                    }]}
                >
                    <UpdatePasswordRequired path="/test">
                        <Child />
                    </UpdatePasswordRequired>
                </MockedProvider>
            </StaticRouter>,
        );
        await new Promise(resolve => setTimeout(resolve));
        component.update();
    });

    test('renders Child component', () => {
        expect(component.find(Child)).toHaveLength(1);
    });
});
