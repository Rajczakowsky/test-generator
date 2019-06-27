import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@twigeducation/ts-fe-components';
import NotFound from '.';

describe('NotFound page', () => {
    let component;

    beforeEach(async () => {
        component = shallow(
            <NotFound />,
        );
    });

    test('has a Not Found message', () => {
        expect(component.find('h1#not-found__title')).toHaveLength(1);
        expect(component.find('h1#not-found__title').text()).toEqual(
            'Sorry, the page you requested could not be found',
        );
    });

    describe('has "Go back" button', () => {
        beforeAll(() => {
            window.history.back = jest.fn();
        });

        afterEach(() => {
            window.history.back.mockClear();
        });

        afterAll(() => {
            window.history.back.mockRestore();
        });

        test('renders a button', () => {
            expect(component.find(Button)).toHaveLength(1);
            expect(component.find(Button).dive().text()).toContain(
                'Go back',
            );
        });

        test('redirects to previous page', () => {
            component.find(Button).simulate('click');
            expect(window.history.back).toHaveBeenCalledTimes(1);
        });
    });
});
