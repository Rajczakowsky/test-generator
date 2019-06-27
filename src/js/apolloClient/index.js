import { ApolloClient } from 'apollo-client';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { ApolloLink, from as compileLink } from 'apollo-link';
import { refreshAccessTokenMiddleware } from '@twigeducation/ts-auth';
import fetch from 'unfetch';
import setRequestID from './middleware/setRequestID';
import fragmentTypes from '../../../fragmentTypes.json';
import store from '../store/store'

const graphqlUrl = window.config.CREATE_GRAPHQL_URL_FROM_HOSTNAME ?
    `${window.location.protocol}//${window.location.host}/svc/graph/graphql` :
    window.config.PUBLIC_GRAPHQL_URL;

const httpLink = new BatchHttpLink({
    uri: graphqlUrl,
    credentials: 'omit',
    fetch,
});

const prepareHeadersLink = new ApolloLink((operation, forward) => {
    operation.setContext({
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
    return forward(operation);
});

const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: fragmentTypes.data,
});

const link = compileLink([
    setContext(() => refreshAccessTokenMiddleware(store, '/accounts')),
    prepareHeadersLink,
    new ApolloLink(setRequestID),
    httpLink,
]);

const client = new ApolloClient({
    link,
    cache: new InMemoryCache({ fragmentMatcher }),
});

export default client;
