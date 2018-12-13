import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import user from './user/reducers';
import calculator from './calculator/reducers';

const rootPersistConfig = {
  key: 'root',
  storage: storage,
  blacklist: []
};

const userPersistConfig = {
  key: 'user',
  storage: storage,
  blacklist: []
};

const calcPersistConfig = {
  key: 'calc',
  storage: storage,
  blacklist: []
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, user),
  calculator: persistReducer(calcPersistConfig, calculator)
});

export default persistReducer(rootPersistConfig, rootReducer);