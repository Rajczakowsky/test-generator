import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import React from 'react';
import LaunchDarkly from 'react-launch-darkly/build/components/LaunchDarkly';
import LaunchDarklyWrapper from '.';
import identify from './identify';

const Component = () => <div id="component" />;
const mockStore = configureMockStore([]);

jest.mock('react-launch-darkly/build/components/LaunchDarkly');
jest.mock('./identify');
LaunchDarkly.mockImplementation(() => <Component />);

let state = {
    userInfo: {
        id: 'testId',
        role: 'testRole',
        schoolId: '066d1925-cb93-4e7a-af6a-d12815980738',
        testUser: true,
        isStaff: true,
    },
};

describe('LaunchDarkly HOC', () => {
    const storeInstance = mockStore(() => state);
    beforeAll(() => {
        window.config.LAUNCH_DARKLY_CLIENT_ID = 'foobar';
        mount(
            <Provider store={storeInstance}>
                <LaunchDarklyWrapper>
                    <Component />
                </LaunchDarklyWrapper>
            </Provider>,
        );
    });

    test('it calls LaunchDarkly correctly', () => {
        expect(LaunchDarkly).toHaveBeenCalledWith(
            {
                children: <Component />,
                clientId: 'foobar',
                user: {
                    anonymous: false,
                    key: 'testId',
                    custom: {
                        schoolId: '066d1925-cb93-4e7a-af6a-d12815980738',
                        isStaff: true,
                        testUser: true,
                    },
                },
            },
            {},
        );
    });

    test('it should call identify', () => {
        expect(identify).toHaveBeenCalledTimes(1);
    });

    test('it should call identify again newTestId is called', async () => {
        state = {
            userInfo: {
                id: 'newTestId',
                role: 'testRole',
                school_id: '066d1925-cb93-4e7a-af6a-d12815980738',
            },
        };
        // type does not need to be specific to update store
        storeInstance.dispatch({ type: '' });
        await new Promise(resolve => setTimeout(resolve));
        expect(identify).toHaveBeenCalledTimes(2);
    });
});
