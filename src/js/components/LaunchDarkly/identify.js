import { identify } from 'react-launch-darkly';
import getUser from './getUser';

export default function (updatedUser = {
    id: null,
    role: 'ANONYMOUS',
    isStaff: false,
    testUser: false,
    schoolId: null,
}) {
    identify(
        window.config.LAUNCH_DARKLY_CLIENT_ID,
        getUser(
            updatedUser.id,
            updatedUser.role,
            updatedUser.isStaff,
            updatedUser.testUser,
            updatedUser.schoolId,
        ),
    );
}
