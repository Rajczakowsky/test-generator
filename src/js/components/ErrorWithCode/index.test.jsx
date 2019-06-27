import React from 'react';
import { shallow } from 'enzyme';

import ErrorCode from '.';

describe('ErrorCode page', () => {
    let component;

    describe('default error', () => {
        beforeEach(() => {
            component = shallow(
                <ErrorCode />,
            );
        });

        test('renders default error text', () => {
            expect(component.find('[data-at="error-page__heading"]')).toHaveLength(1);
            expect(component.find('[data-at="error-page__heading"]').text()).toEqual('Error: ');
            expect(component.find('[data-at="error-page__description"]')).toHaveLength(1);
            expect(component.find('[data-at="error-page__description"]').text()).toEqual(
                'There has been an error completing your request. ' +
                'Please clear your cookies and cache and then try again. ' +
                'If this error persists, please contact your administrator.',
            );
        });
    });

    describe('401 error', () => {
        beforeEach(() => {
            component = shallow(
                <ErrorCode code={401} />,
            );
        });

        test('renders default error heading', () => {
            expect(component.find('[data-at="error-page__heading"]')).toHaveLength(1);
            expect(component.find('[data-at="error-page__heading"]').text()).toEqual('Uh oh! Something went wrong');
        });

        test('renders default error subheading', () => {
            expect(component.find('[data-at="error-page__subheading"]')).toHaveLength(1);
            expect(component.find('[data-at="error-page__subheading"]').text())
                .toEqual('You don\'t have permission to view this page');
        });

        test('renders default error content', () => {
            expect(component.find('[data-at="error-page__description"]')).toHaveLength(1);
            expect(component.find('[data-at="error-page__description"]').text()).toEqual(
                'Sorry, the page you are trying to access isn\'t available to people with your user type.',
            );
        });
    });
});
