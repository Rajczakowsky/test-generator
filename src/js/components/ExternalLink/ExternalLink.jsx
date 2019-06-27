import React from 'react';
import PropTypes from 'prop-types';

const ExternalLink = ({ to, children, ...props }) => {
    const redirectToExternalUrl = () => window.location.assign(to);
    return (
        <a onClick={redirectToExternalUrl} href={to} {...props}>
            {children}
        </a>
    );
};

ExternalLink.propTypes = {
    children: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
};

export default ExternalLink;
