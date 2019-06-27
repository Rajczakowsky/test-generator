import React from 'react';
import PropTypes from 'prop-types';
import { Constellation, SwoooshPanel } from '@twigeducation/ts-fe-components';
import styled from 'styled-components';
import PageWrapper from './PageWrapper';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Flextellation = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

Flextellation.displayName = 'Flextellation';

const Layout = ({ children }) => (
    <SwoooshPanel>
        <Constellation>
            <Flextellation>
                <React.Fragment>
                    <Header />
                    <PageWrapper>
                        {children}
                    </PageWrapper>
                    <Footer />
                </React.Fragment>
            </Flextellation>
        </Constellation>
    </SwoooshPanel>
);

Layout.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
};

export default Layout;
