import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import gql from 'graphql-tag';

import { Loading } from '@twigeducation/ts-fe-components';
import GraphQLErrors from '@twigeducation/react-graphql-errors';
import QueryHandler from '.';

const mockVariables = {
    teacherId: 'test',
};
const MockChild = () => <div />;
const mockQuery = gql`
    query mockQuery($teacherId: String!) {
        classRostersForTeacher(teacherId: $teacherId) {
            __typename
        }
    }
`;

describe('Query component', async () => {
    let component;

    describe('with defaults', async () => {
        const mountComponent = (result, error = false) => mount(
            <MockedProvider mocks={[{
                request: {
                    query: mockQuery,
                    variables: mockVariables,
                },
                result,
                error,
            }]}
            >
                <QueryHandler variables={mockVariables} query={mockQuery}>
                    {data => <MockChild data={data} />}
                </QueryHandler>
            </MockedProvider>,
        );

        describe('with a successful query', async () => {
            const mockData = { data: { classRostersForTeacher: { __typename: 'ClassRoster' } } };
            beforeEach(async () => {
                component = mountComponent(mockData);
            });

            test('should render a Loading component before loaded', () => {
                expect(component.find(Loading).length).toEqual(1);
            });

            describe('once loaded', async () => {
                beforeEach(async () => {
                    await new Promise(resolve => setTimeout(resolve));
                    component.update();
                });

                test('should render the given child', () => {
                    expect(component.find('MockChild').length).toEqual(1);
                    expect(component.find('MockChild').props().data).toEqual(mockData.data);
                });
            });
        });

        describe('with an unsuccessful query', async () => {
            beforeAll(async () => {
                component = mountComponent({ data: null }, { message: '500 error' });
            });

            test('should render a Loading component before loaded', () => {
                expect(component.find(Loading).length).toEqual(1);
            });

            describe('when the query has loaded', async () => {
                beforeAll(async () => {
                    await new Promise(resolve => setTimeout(resolve));
                    component.update();
                });

                test('should render an error component', async () => {
                    await new Promise(resolve => setTimeout(resolve));
                    component.update();
                    expect(component.find(GraphQLErrors).length).toEqual(1);
                    expect(component.find(GraphQLErrors).props().errors).toEqual(
                        [new Error('Network error: 500 error')],
                    );
                });
            });
        });
    });

    describe('with custom error and loading', async () => {
        const MockError = () => <div />;
        const MockLoading = () => <div />;
        const mountComponent = (result, error = false) => mount(
            <MockedProvider mocks={[{
                request: {
                    query: mockQuery,
                    variables: mockVariables,
                },
                result,
                error,
            }]}
            >
                <QueryHandler
                    variables={mockVariables}
                    query={mockQuery}
                    ErrorComponent={MockError}
                    LoadingComponent={MockLoading}
                >
                    {() => <MockChild />}
                </QueryHandler>
            </MockedProvider>,
        );

        describe('with a successful query', async () => {
            beforeEach(async () => {
                component = mountComponent({ data: { classRostersForTeacher: { __typename: 'ClassRoster' } } });
            });

            test('should render the given child', () => {
                expect(component.find(MockLoading).length).toEqual(1);
            });

            describe('with a successful query', async () => {
                beforeEach(async () => {
                    await new Promise(resolve => setTimeout(resolve));
                    component.update();
                });

                test('should render the given child', () => {
                    expect(component.find('MockChild').length).toEqual(1);
                });
            });
        });

        describe('with an unsuccessful query', async () => {
            beforeAll(async () => {
                component = mountComponent({ data: null }, { message: '500 error' });
            });

            test('should render a MockLoading component before loaded', () => {
                expect(component.find(MockLoading).length).toEqual(1);
            });

            describe('when the query has loaded', async () => {
                beforeAll(async () => {
                    await new Promise(resolve => setTimeout(resolve));
                    component.update();
                });

                test('should render a MockError component', async () => {
                    await new Promise(resolve => setTimeout(resolve));
                    component.update();
                    expect(component.find(MockError).length).toEqual(1);
                });
            });
        });
    });


    describe('with custom error and loading', async () => {
        const MockLoading = () => <div />;
        const mountComponent = (result, error = false) => mount(
            <MockedProvider mocks={[{
                request: {
                    query: mockQuery,
                    variables: mockVariables,
                },
                result,
                error,
            }]}
            >
                <QueryHandler
                    variables={mockVariables}
                    query={mockQuery}
                    LoadingComponent={MockLoading}
                >
                    {() => <MockChild />}
                </QueryHandler>
            </MockedProvider>,
        );

        describe('with a 403 error', async () => {
            beforeAll(async () => {
                component = mountComponent({ data: null }, { message: '403: error' });
            });

            test('should render a MockLoading component before loaded', () => {
                expect(component.find(MockLoading).length).toEqual(1);
            });

            describe('when the query has loaded', async () => {
                beforeAll(async () => {
                    await new Promise(resolve => setTimeout(resolve));
                    component.update();
                });

                test('should render a GraphQLErrors component', async () => {
                    await new Promise(resolve => setTimeout(resolve));
                    component.update();
                    expect(component.find(GraphQLErrors).length).toEqual(1);
                    expect(component.find(GraphQLErrors).props().errors).toEqual(
                        ['Sorry, you do not have permission to view this content'],
                    );
                });
            });
        });

        describe('with a 404 error', async () => {
            beforeAll(async () => {
                component = mountComponent({ data: null }, { message: '404: error' });
            });

            test('should render a MockLoading component before loaded', () => {
                expect(component.find(MockLoading).length).toEqual(1);
            });

            describe('when the query has loaded', async () => {
                beforeAll(async () => {
                    await new Promise(resolve => setTimeout(resolve));
                    component.update();
                });

                test('should render a GraphQLErrors component', async () => {
                    await new Promise(resolve => setTimeout(resolve));
                    component.update();
                    expect(component.find(GraphQLErrors).length).toEqual(1);
                    expect(component.find(GraphQLErrors).props().errors).toEqual(
                        ['404: Not Found'],
                    );
                });
            });
        });
    });

    describe('with a custom 404 error', async () => {
        const mountComponent = (result, error = false) => mount(
            <MockedProvider mocks={[{
                request: {
                    query: mockQuery,
                    variables: mockVariables,
                },
                result,
                error,
            }]}
            >
                <QueryHandler
                    variables={mockVariables}
                    query={mockQuery}
                    NotFoundMessage="404: Dougies shirt not found"
                >
                    {() => <MockChild />}
                </QueryHandler>
            </MockedProvider>,
        );

        beforeEach(async () => {
            component = mountComponent({ data: null }, { message: '404: error' });
            await new Promise(resolve => setTimeout(resolve));
            await new Promise(resolve => setTimeout(resolve));
            component.update();
        });

        test('should render a GraphQLErrors component', async () => {
            expect(component.find(GraphQLErrors).length).toEqual(1);
            expect(component.find(GraphQLErrors).props().errors).toEqual(
                ['404: Dougies shirt not found'],
            );
        });
    });

    describe('with a custom 400 error', async () => {
        const mountComponent = (result, error = false) => mount(
            <MockedProvider mocks={[{
                request: {
                    query: mockQuery,
                    variables: mockVariables,
                },
                result,
                error,
            }]}
            >
                <QueryHandler
                    variables={mockVariables}
                    query={mockQuery}
                    BadRequestMessage="400: Adam does not like that request"
                >
                    {() => <MockChild />}
                </QueryHandler>
            </MockedProvider>,
        );

        beforeEach(async () => {
            component = mountComponent({ data: null }, { message: '400: error' });
            await new Promise(resolve => setTimeout(resolve));
            await new Promise(resolve => setTimeout(resolve));
            component.update();
        });

        test('should render a GraphQLErrors component', async () => {
            expect(component.find(GraphQLErrors).length).toEqual(1);
            expect(component.find(GraphQLErrors).props().errors).toEqual(
                ['400: Adam does not like that request'],
            );
        });
    });
});
