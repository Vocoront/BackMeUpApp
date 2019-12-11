import React, { Component } from "react";
import { AwesomeButton } from "react-awesome-button";
import Tag from "./Tag.js";
//import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";
import { connect } from "react-redux";
import { Route } from "react-router-dom";

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.glasaj.bind(this);
  }

  glasaj(levo) {
    var vote;
    if (levo == "left") vote = true;
    else vote = false;
    const formData = new FormData();
    formData.append("IdPosta", this.props.postId);
    formData.append("Username", this.props.user.username);
    formData.append("isLeft", vote);
    fetch("api/post/vote", { method: "POST", body: formData })
      .then(res => res.json())
      .then(data => {
        this.props.history.push("/");
      })
      .catch(er => console.log(er));
  }

  returnTags() {
    console.log(this.props.tags);
    this.props.tags.map(tag => {
      return <Tag Title={"aaa"} />;
    });
  }

  render() {
    return (
      <Route
        render={({ history }) => (
          <div
            className="post post__container"
            onClick={() => history.push("/extendedPost/" + this.props.postId)}
          >
            <div className="post__title">{this.props.title}</div>
            <div>{this.props.creator}</div>
            <div className="post__content">{this.props.content}</div>
            <div className="post__vote">
              {this.returnTags()}
              <AwesomeButton
                className="aws-btn"
                size="large"
                type="primary"
                //border-radius="2rem"
                onPress={() => this.glasaj("left")}
              >
                Y
              </AwesomeButton>
              <AwesomeButton
                size="large"
                type="link"
                onPress={() => this.glasaj("right")}
              >
                <i className="far fa-hand-point-right"></i>
              </AwesomeButton>
            </div>
          </div>
        )}
      />
    );
  }
}
const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps)(Post);
