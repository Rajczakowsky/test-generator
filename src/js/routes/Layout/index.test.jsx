import React from 'react';
import { mount } from 'enzyme';
import { Constellation } from '@twigeducation/ts-fe-components';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';

import Layout from '.';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const theme = {
    grid: {
        breakpoints: ['30rem', '60rem'],
    },
};

const mockStore = configureMockStore();
const store = mockStore({
    userInfo: {
        role: 'TEACHER',
    },
});

const Child = () => <div>Child</div>;
const mountRender = props => mount(
    <MemoryRouter>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <Layout {...props}>
                    <Child />
                </Layout>
            </ThemeProvider>
        </Provider>
    </MemoryRouter>,
);

describe('<Layout>', () => {
    let component;
    beforeEach(() => {
        component = mountRender();
    });

    test('it should have a page wrapper component', () => {
        expect(component.find('PageWrapper').length).toEqual(1);
    });

    test('it should have a header component', () => {
        expect(component.find(Header).length).toEqual(1);
    });

    test('it should have a footer component', () => {
        expect(component.find(Footer).length).toEqual(1);
    });

    test('it should have a constellation component', () => {
        expect(component.find(Constellation).length).toEqual(1);
    });

    test('it should have a Flextellation component', () => {
        expect(component.find('Flextellation').length).toEqual(1);
    });

    test('it should render child component', () => {
        expect(component.find(Child).length).toEqual(1);
    });
});
