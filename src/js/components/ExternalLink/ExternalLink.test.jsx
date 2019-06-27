import React from 'react';
import { shallow } from 'enzyme';
import ExternalLink from './ExternalLink';

describe('ExternalLink', () => {
    test('should render', () => {
        global.location.assign = jest.fn();
        const component = shallow(<ExternalLink to="/test">link</ExternalLink>);
        expect(component.find('a')).toHaveLength(1);
        expect(component.find('a').props().href).toEqual('/test');
        expect(component.find('a').props().children).toEqual('link');
    });

    test('should call window location with passed prop', () => {
        global.location.assign = jest.fn();
        const component = shallow(<ExternalLink to="/test">link</ExternalLink>);
        component.simulate('click');
        expect(global.location.assign).toBeCalledWith('/test');
    });
});
