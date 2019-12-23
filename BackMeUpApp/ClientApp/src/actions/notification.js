import * as signalR from "@aspnet/signalr";

export {Connect};

const Connect = () => {
  let connection = new signalR.HubConnectionBuilder()
    .withUrl("/messagehub")
    .build();
  connection.on("ReceiveMessage", (username, message) => {
    console.log(username, message);
  });
  connection.start().then(() => console.log("{signalR:connected}"));
  return { type: "SET_CONNECTION", connection };
};
