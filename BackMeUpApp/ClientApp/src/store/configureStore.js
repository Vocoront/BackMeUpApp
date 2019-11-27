import { createStore, combineReducers } from "redux";
import userReducer from "../reducers/user";
import tokenReducer from '../reducers/token';

export default () => {
  const store = createStore(
    combineReducers({
      user: userReducer,
      token: tokenReducer
    })
  );
  return store;
};
