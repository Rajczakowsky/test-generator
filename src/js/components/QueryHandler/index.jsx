import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import GraphQLErrors from '@twigeducation/react-graphql-errors';
import { Loading } from '@twigeducation/ts-fe-components';

const QueryHandler = ({
    children,
    ErrorComponent,
    LoadingComponent,
    NotFoundMessage,
    BadRequestMessage,
    query,
    variables,
}) => (
    <Query query={query} variables={{ ...variables }}>
        {({ data, loading, error }) => {
            if (loading) {
                return <LoadingComponent />;
            }
            if (error) {
                let errors;
                // This probably isn't scalable - eventually want to switch to a strategy of passing in an object/array
                // and using that i.e. [{ code: 400, message: 'custom 400 message' }] or similar
                if (error.message.includes('400:')) {
                    errors = [BadRequestMessage];
                }
                if (error.message.includes('404:')) {
                    errors = [NotFoundMessage];
                }
                if (error.message.includes('403:')) {
                    errors = ['Sorry, you do not have permission to view this content'];
                }
                return <ErrorComponent errors={errors || [error]} />;
            }
            return children(data);
        }}
    </Query>
);

QueryHandler.defaultProps = {
    ErrorComponent: GraphQLErrors,
    LoadingComponent: Loading,
    NotFoundMessage: '404: Not Found',
    BadRequestMessage: '400: Bad Request',
    variables: {},
};

QueryHandler.propTypes = {
    children: PropTypes.func.isRequired,
    ErrorComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    LoadingComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    NotFoundMessage: PropTypes.string,
    BadRequestMessage: PropTypes.string,
    query: PropTypes.shape({}).isRequired,
    variables: PropTypes.shape({}),
};
export default QueryHandler;
