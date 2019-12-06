import { createStore, combineReducers ,compose} from "redux";
import userReducer from "../reducers/user";
const enhancers = compose(
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default () => {
  const store = createStore(
    combineReducers({
        user: userReducer,
        
    }),
      enhancers
  );
  return store;
};
