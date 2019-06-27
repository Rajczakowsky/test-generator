
import { createStore, combineReducers } from 'redux';
import { userInfoReducer } from '@twigeducation/ts-auth';

const reducers = combineReducers({
    userInfo: userInfoReducer,
});

const initialState = {
    userInfo: {},
};

export default window.config.ENABLE_REDUX_DEV_TOOLS ? createStore(
    reducers,
    initialState,
    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true }),
) : createStore(reducers, initialState);
