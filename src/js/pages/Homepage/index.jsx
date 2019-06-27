import React from 'react';
import styled from 'styled-components';

const Title = styled.h1`
    margin-bottom: 4rem;
    background-color: #000;
    color: #ffff00;

    &:after {
        content: ' ';
        background-color: ${props => props.pillColor || '#343A72'};
        border-radius: 10px;
        display: block;
        height: 6px;
        position: relative;
        top: 2rem;
        width: 22px;
    }
`;


const Homepage = () => (
    <div>
        <Title>ola</Title>
        <p>Replace this page with required pages.</p>
    </div>
);

export default Homepage;
