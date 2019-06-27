import React from 'react';
import { Button } from '@twigeducation/ts-fe-components';

const NotFound = () => (
    <div>
        <h1 id="not-found__title">Sorry, the page you requested could not be found</h1>
        <Button
            onClick={() => { window.history.back(); }}
            type="button"
            primary
        >
            Go back
        </Button>
    </div>
);

export default NotFound;
