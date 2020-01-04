import { createStore, combineReducers, compose } from "redux";
import alertReducer from "../reducers/alert";
import filterReducer from "../reducers/filter";
import extendedPostReducer from "../reducers/extendedPost";
import notificationReducer from "../reducers/notification";
import postsReducer from "../reducers/posts";
import userReducer from "../reducers/user";

const enhancers = compose(
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
const store = createStore(
  combineReducers({
    user: userReducer,
    posts: postsReducer,
    notification: notificationReducer,
    alert: alertReducer,
    filter: filterReducer,
    extendedPost: extendedPostReducer
  }),
  enhancers
);
export default store;
