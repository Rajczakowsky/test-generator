export default function (
    id = null,
    role = 'ANONYMOUS',
    isStaff = false,
    testUser = false,
    schoolId = null,
) {
    return {
        key: id === null || undefined ? 'defaultAnonymousUser' : id,
        anonymous: role && role === 'ANONYMOUS',
        custom: {
            isStaff,
            testUser,
            schoolId,
        },
    };
}
