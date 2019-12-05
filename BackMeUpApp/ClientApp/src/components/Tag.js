import React, { Component } from "react";
import { AwesomeButton } from "react-awesome-button";
//import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";

class Tag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "taag"
    };
  }

  render() {
    return <div className="tag">{this.state.text}</div>;
  }
}

export default Tag;
