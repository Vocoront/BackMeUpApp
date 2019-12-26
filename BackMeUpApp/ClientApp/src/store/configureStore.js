import { createStore, combineReducers, compose } from "redux";
import userReducer from "../reducers/user";
import tagReducer from "../reducers/tag";
import postsReducer from "../reducers/posts";
import notificationReducer from "../reducers/notification";

const enhancers = compose(
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
const store = createStore(
  combineReducers({
    user: userReducer,
    tag: tagReducer,
    posts: postsReducer,
    notification: notificationReducer
  }),
  enhancers
);
export default store;
