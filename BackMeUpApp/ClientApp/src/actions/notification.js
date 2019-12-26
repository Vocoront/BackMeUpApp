import * as signalR from "@aspnet/signalr";
import store from "../store/configureStore";
import { getFollows } from "../services/notification";
const Connect = () => {
  let connection = new signalR.HubConnectionBuilder()
    .withUrl("/messagehub")
    .build();
  connection.on("ReceiveMessage", message => {
    connection.invoke(
      "MessageRecived",
      message.key,
      sessionStorage.getItem("username")
    );
    console.log(message);
  });
  connection.start().then(() => {
    console.log("{signalR:connected}");
    connection.invoke("GetConnectionId").then(data => {
      store.dispatch({ type: "SET_CONNECTION_ID", connectionId: data });
      getFollows();
    });
  });
  return { type: "SET_CONNECTION", connection };
};

const SetFollows = follows => ({
  type: "SET_FOLLOWS",
  follows
});

export { Connect, SetFollows };
