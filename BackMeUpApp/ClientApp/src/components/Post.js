import React, { Component } from "react";
import { AwesomeButton } from "react-awesome-button";
//import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="post post__container">
        <div className="post__title">{this.props.title}</div>
        <div className="post__content">{this.props.content}</div>
        <div className="post__vote">
          <AwesomeButton
            className="aws-btn"
            size="large"
            type="primary"
            //border-radius="2rem"
          >
            Y
          </AwesomeButton>
          <AwesomeButton size="large" type="link">
            <i className="far fa-hand-point-right"></i>
          </AwesomeButton>
        </div>
      </div>
    );
  }
}

export default Post;
