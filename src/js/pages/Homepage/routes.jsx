import React from 'react';
import AuthenticatedRoute from '../../routes/AuthenticatedRoute';

const Homepage = React.lazy(() => import('.'));
const route = (
    <AuthenticatedRoute
        path="/"
        exact
        render={matchProps => (
            <Homepage {...matchProps} />
        )}
        key={Homepage}
    />
);

export default route;
