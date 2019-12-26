import store from "../store/configureStore";
import authHeader from "../helpers/authHeader";
import { SetFollows } from "../actions/notification";


const getFollows = () => {
    const state=store.getState();
    const token = authHeader();
  fetch("api/user/follows/" + state.notification.connectionId, {
    method: "GET",
    headers: {
      ...token
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      store.dispatch(SetFollows(data));
      setTimeout(() => {
        state.notification.connection.invoke("AddGroups", data);
      }, 2000);
    })
    .catch(er => console.log(er));
};

export { getFollows };
