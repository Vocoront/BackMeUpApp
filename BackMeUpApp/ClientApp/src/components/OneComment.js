import React, { Component } from "react";
import { AwesomeButton } from "react-awesome-button";
import { connect } from "react-redux";
import { Route } from "react-router-dom";

class OneComment extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="OneComment">
        <p>{this.props.username}</p>
        <p>{this.props.text}</p>
      </div>
    );
  }
}
export default OneComment;
