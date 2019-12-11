import React, { Component } from "react";
import * as signalR from "@aspnet/signalr";

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connection: undefined,
      returnedMessage: "",
      message: ""
    };

    this.createConnection.bind(this);
  }

  createConnection() {
    let connection = new signalR.HubConnectionBuilder()
      .withUrl("/messagehub")
      .build();

    connection.on("ReceiveMessage", (username,message) => {
      console.log(username,message);
    });

    connection.start().then(()=>console.log("{signalR:connected}"));
    this.setState({ connection });
  }

  componentDidMount() {
    this.createConnection();
  }

  render() {
    return (
      <div>
        <h1>{this.state.returnedMessage}</h1>
        <input
          type="text"
          onChange={e => this.setState({ message: e.target.value })}
        />
        <h2>{this.state.message}</h2>
        <button onClick={() => {
            this.state.connection.invoke("SendMessage","username",this.state.message);
        }}>posalji</button>
      </div>
    );
  }
}

export default Message;
