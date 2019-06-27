import styled from 'styled-components';
import { Box } from '@rebass/grid';

const PageWrapper = styled(Box)`
    max-width: ${props => props.theme.grid.breakpoints[1]};
    padding: 0.5rem;
    flex-grow: 1;
    width: 100%;
`;

PageWrapper.defaultProps = {
    mx: 'auto',
};

export default PageWrapper;
