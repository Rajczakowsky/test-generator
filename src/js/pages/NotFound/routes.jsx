import React from 'react';
import { Route } from 'react-router-dom';
import Layout from '../../routes/Layout';

const NotFoundComponent = React.lazy(() => import('.'));

const LoadableNotFound = () => <NotFoundComponent />;

const route = (
    <Route
        render={matchProps => (
            <Layout>
                <LoadableNotFound {...matchProps} />
            </Layout>
        )}
        key={LoadableNotFound}
    />
);

export default route;
