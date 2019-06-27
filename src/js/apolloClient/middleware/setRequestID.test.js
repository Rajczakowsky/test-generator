import setRequestID, { setHeader } from './setRequestID';

jest.mock('uuid', () => () => '48458f2a-2f4e-4723-914a-df6b83301f42');

describe('setRequestID', () => {
    let forward;
    let operation;

    beforeEach(() => {
        forward = jest.fn();
        operation = {
            setContext: jest.fn(),
        };
        setRequestID(operation, forward);
    });

    test('it sets the context with the setHeader function', () => {
        expect(operation.setContext).toHaveBeenCalledWith(setHeader);
    });

    test('it calls forward', () => {
        expect(forward).toHaveBeenCalledWith(operation);
    });
});

describe('setHeader', () => {
    describe('when the PRODUCT_NAME is set', () => {
        beforeEach(() => {
            global.config.PRODUCT_NAME = 'prod';
        });

        describe('when headers are not set', () => {
            test('creates a header', () => {
                const context = setHeader({});
                expect(context).toEqual({
                    headers: {
                        'x-request-id': 'prod/48458f2a-2f4e-4723-914a-df6b83301f42',
                    },
                });
            });
        });

        describe('when the headers are set and empty', () => {
            test('updates the header', () => {
                const context = setHeader({ headers: {} });
                expect(context).toEqual({
                    headers: {
                        'x-request-id': 'prod/48458f2a-2f4e-4723-914a-df6b83301f42',
                    },
                });
            });
        });

        describe('when the headers are set and not empty', () => {
            test('updates the header', () => {
                const context = setHeader({ headers: { authorization: 'some-token' } });
                expect(context).toEqual({
                    headers: {
                        authorization: 'some-token',
                        'x-request-id': 'prod/48458f2a-2f4e-4723-914a-df6b83301f42',
                    },
                });
            });
        });
    });

    describe('when the PRODUCT_NAME is not set', () => {
        beforeEach(() => {
            global.config.PRODUCT_NAME = null;
        });

        test('creates a header', () => {
            const context = setHeader({});
            expect(context).toEqual({
                headers: {
                    'x-request-id': '-/48458f2a-2f4e-4723-914a-df6b83301f42',
                },
            });
        });
    });
});
