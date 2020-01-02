import { createStore, combineReducers, compose } from "redux";
import userReducer from "../reducers/user";
import postsReducer from "../reducers/posts";
import notificationReducer from "../reducers/notification";
import alertReducer from "../reducers/alert";
import filterReducer from "../reducers/filter";
const enhancers = compose(
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
const store = createStore(
  combineReducers({
    user: userReducer,
    posts: postsReducer,
    notification: notificationReducer,
    alert: alertReducer,
    filter: filterReducer
  }),
  enhancers
);
export default store;
