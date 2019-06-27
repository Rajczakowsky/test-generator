import * as LD from 'react-launch-darkly';
import getUser from './getUser';
import identify from './identify';

const mockLaunchDarklyIdentify = jest.fn();
jest.spyOn(LD, 'identify', 'get').mockImplementation(() => mockLaunchDarklyIdentify);
jest.mock('./getUser');

describe('wrapped identify LaunchDarkly method', () => {
    beforeEach(() => {
        mockLaunchDarklyIdentify.mockClear();
    });

    test('calls getUser to construct the LaunchDarkly user object', () => {
        identify({
            id: 'user-id',
            role: 'TEACHER',
            isStaff: false,
            testUser: false,
            schoolId: 'ae00d6d3-6f51-486c-bb05-e211b9fe428c',
        });
        expect(mockLaunchDarklyIdentify).toHaveBeenCalled();
        expect(getUser).toHaveBeenCalled();
    });

    test('calls LaunchDarkly\'s identify with the client_id and the user object constructed', () => {
        window.config.LAUNCH_DARKLY_CLIENT_ID = 'foobar';
        identify({
            id: 'user-id',
            role: 'TEACHER',
            isStaff: false,
            testUser: false,
            schoolId: 'ae00d6d3-6f51-486c-bb05-e211b9fe428c',
        });
        expect(mockLaunchDarklyIdentify).toHaveBeenCalledWith('foobar', undefined);
        expect(getUser).toHaveBeenCalledWith(
            'user-id',
            'TEACHER',
            false,
            false,
            'ae00d6d3-6f51-486c-bb05-e211b9fe428c',
        );
    });

    describe('when using default params', () => {
        test('calls getUser with default parameters', () => {
            identify();
            expect(getUser).toHaveBeenCalledWith(null, 'ANONYMOUS', false, false, null);
        });
    });
});
