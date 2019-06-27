import React from 'react';
import { shallow } from 'enzyme';
import PageWrapper from '.';

const Child = () => null;

describe('PageWrapper', () => {
    let component;

    beforeEach(() => {
        component = shallow(<PageWrapper><Child /></PageWrapper>);
    });

    test('should render it\'s children', () => {
        expect(component.find(Child).length).toEqual(1);
    });

    test('should add a mx prop to the styled component', () => {
        expect(component.find('StyledComponent').props().mx).toEqual('auto');
    });
});
