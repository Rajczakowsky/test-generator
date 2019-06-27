import uuid from 'uuid';

export const setHeader = ({
    headers = {},
}) => ({
    headers: {
        ...headers,
        'x-request-id': `${window.config.PRODUCT_NAME || '-'}/${uuid()}`,
    },
});

export default (operation, forward) => {
    operation.setContext(setHeader);
    return forward(operation);
};
