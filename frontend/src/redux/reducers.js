import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import user from './user/reducers';

const rootPersistConfig = {
  key: 'root',
  storage: storage,
  blacklist: []
};

const authPersistConfig = {
  key: 'auth',
  storage: storage,
  blacklist: []
};

const rootReducer = combineReducers({
  user: persistReducer(authPersistConfig, user)
});

export default persistReducer(rootPersistConfig, rootReducer);