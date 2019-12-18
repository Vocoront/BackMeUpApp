import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import CreatePostForm from "./CreatePostForm";
import ErrorContainer from "../error-page/ErrorContainer";
class CreatePostPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: {
        visible: false,
        title: "title",
        message: "message"
      }
    };
    this.AddNewPost = this.AddNewPost.bind(this);
    this.ValidateNewPost = this.ValidateNewPost.bind(this);
    this.clearError = this.clearError.bind(this);
  }
  clearError = () => {
    this.setState((state, props) => ({
      error: {
        visible: false,
        title: "title",
        message: "message"
      }
    }));
  };
  ValidateNewPost = (title, text) => {
    if (title === "") {
      this.setState((state, props) => ({
        error: {
          visible: true,
          title: "Post doesn't have title",
          message: "Post couldn't be created, becouse there is no title!"
        }
      }));
      return false;
    }
    if (text === "") {
      this.setState((state, props) => ({
        error: {
          visible: true,
          title: "Post doesn't have text",
          message: "Post couldn't be created, becouse there is no text!"
        }
      }));
      return false;
    }
    return true;
  };
  AddNewPost = (title, text, tags) => {
    if (!this.ValidateNewPost(title, text)) return;
    tags = tags.replace(/\s/g, "");
    tags = tags.toLowerCase();
    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Text", text);
    formData.append("Tags", tags);
    formData.append("Username", this.props.user.username);

    this.setState({ loading: true });
    this.clearError();
    fetch("api/post/create", { method: "POST", body: formData })
      .then(res => {
        if (res.status === 200) res.json();
        this.setState((state, props) => ({
          error: {
            visible: true,
            title: "Post creation failed",
            message: "Post couldn't be created! Try again later"
          }
        }));

        this.setState((state, props) => ({ loading: false }));
      })
      .then(data => {
        console.log(data);
        this.setState((state, props) => ({ loading: false }));
        this.props.history.push("/");
      })
      .catch(er => console.log(er));
  };

  render() {
    return (
      <div>
        {this.state.loading ? (
          <div className="loader">Loading...</div>
        ) : (
          <div>
            {this.state.error.visible && (
              <ErrorContainer
                errorTitle={this.state.error.title}
                errorMessage={this.state.error.message}
                onOk={this.clearError}
              />
            )}
            <CreatePostForm onAddNewPost={this.AddNewPost} />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({ user: state.user });
export default withRouter(connect(mapStateToProps)(CreatePostPage));
