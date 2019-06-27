import getUser from './getUser';

describe('getUser function for LaunchDarkly', () => {
    test('returns the correct anonymous user object if no parameter provided', () => {
        const actual = getUser();
        expect(actual).toEqual({
            key: 'defaultAnonymousUser',
            anonymous: true,
            custom: { schoolId: null, testUser: false, isStaff: false },
        });
    });

    test('returns anonymous as true if given valid inputs', () => {
        const actual = getUser('anon-user-id', 'ANONYMOUS');
        expect(actual).toEqual({
            key: 'anon-user-id',
            anonymous: true,
            custom: { schoolId: null, testUser: false, isStaff: false },
        });
    });

    test('returns valid user role if input is correct', () => {
        const actual = getUser(
            'real-user-id',
            'TEACHER',
            false,
            true,
            '048c8e5f-c631-4dd6-8e28-df1585c2fd0b',
        );
        expect(actual).toEqual({
            key: 'real-user-id',
            anonymous: false,
            custom: {
                schoolId: '048c8e5f-c631-4dd6-8e28-df1585c2fd0b',
                testUser: true,
                isStaff: false,
            },
        });
    });

    test('returns valid staff user role if input is correct', () => {
        const actual = getUser(
            'real-user-id',
            'TEACHER',
            true,
            false,
            '048c8e5f-c631-4dd6-8e28-df1585c2fd0b',
        );
        expect(actual).toEqual({
            key: 'real-user-id',
            anonymous: false,
            custom: {
                schoolId: '048c8e5f-c631-4dd6-8e28-df1585c2fd0b',
                testUser: false,
                isStaff: true,
            },
        });
    });
});
