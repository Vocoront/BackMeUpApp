import { createStore, combineReducers, compose } from "redux";
import userReducer from "../reducers/user";
import tagReducer from "../reducers/tag";
import postsReducer from '../reducers/posts';
const enhancers = compose(
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default () => {
  const store = createStore(
    combineReducers({
      user: userReducer,
      tag: tagReducer,
      posts:postsReducer
    }),
    enhancers
  );
  return store;
};
