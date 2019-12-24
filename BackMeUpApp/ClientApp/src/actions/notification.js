import * as signalR from "@aspnet/signalr";

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


const GetSubscriptions = token => {
  return dispatch => {
    fetch("api/user/follows", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(data =>{
        dispatch(subscriptions(data))});
  };

  const subscriptions=(data)=>({type: "SET_SUBSCRIPTIONS", data})
};

export { Connect, GetSubscriptions };
