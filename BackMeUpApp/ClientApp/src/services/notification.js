import * as signalR from "@aspnet/signalr";
import store from "../store/configureStore";
import authHeader from "../helpers/authHeader";
import {
  SetFollows,
  SetConnection,
  AddNewFollow,
  RemoveFollow
} from "../actions/notification";

const connect = () => {
  let connection = new signalR.HubConnectionBuilder()
    .withUrl(process.env.REACT_APP_SERVER_DOMAIN + "/messagehub")
    .build();

  connection.on("ReceiveMessage", message => {
    connection.invoke(
      "MessageRecived",
      message.key,
      store.getState().user.username
    );
    store.dispatch({ type: "ADD_NOTIFICATON", message: message.msg });
    console.log(message);
  });

  connection.start().then(() => {
    store.dispatch(SetConnection(connection));
    console.log("{signalR:connected}");
    connection.invoke("GetConnectionId").then(data => {
      store.dispatch({ type: "SET_CONNECTION_ID", connectionId: data });
      getFollows(connection);
    });
  });
};

const addNewTopics = topics => {
  const state = store.getState();
  store.dispatch(AddNewFollow(topics));
  state.notification.connection.invoke("AddGroups", topics);
};

const removeTopic = topic => {
  const state = store.getState();
  store.dispatch(RemoveFollow(topic));

  state.notification.connection.invoke("RemoveFromGroup", topic);
};

const getFollows = () => {
  const state = store.getState();
  const token = authHeader();
  fetch(
    process.env.REACT_APP_SERVER_DOMAIN +
      "api/user/follows/" +
      state.notification.connectionId,
    {
      method: "GET",
      headers: {
        ...token
      }
    }
  )
    .then(res => res.json())
    .then(data => {
      store.dispatch(SetFollows(data));
      addNewTopics(data);
    })
    .catch(er => console.log(er));
};

export { getFollows, connect, addNewTopics, removeTopic };
