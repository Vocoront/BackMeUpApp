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
    this.ValidateFiles = this.ValidateFiles.bind(this);
  }

  ValidateFiles = files => {
    if(files.length===0)return true;
    if (files.length > 5) {
      this.setState((state, props) => ({
        error: {
          visible: true,
          title: "Maximum number of files for a post is 5",
          message:
            "Post couldn't be created, because there are more than 5 files selected!"
        }
      }));
      return false;
    }

    for (let i = 0; i < files.length; i++) {
      if (!files[0].name.match(/.(jpg|jpeg|png|gif)$/i)) {
        this.setState((state, props) => ({
          error: {
            visible: true,
            title: "Post can only be .jpg|.jpeg|.png|.gif",
            message:
              "Post couldn't be created. File format is not appropriate!"
          }
        }));
        return false;
      }
    }

    return true;
  };
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
          message: "Post couldn't be created, because there is no title!"
        }
      }));
      return false;
    }
    if (text === "") {
      this.setState((state, props) => ({
        error: {
          visible: true,
          title: "Post doesn't have text",
          message: "Post couldn't be created, because there is no text!"
        }
      }));
      return false;
    }
  
    return true;
  };
  AddNewPost = (title, text, tags, files) => {
    if (!this.ValidateNewPost(title, text)) return;
    if(!this.ValidateFiles(files)) return;
    tags = tags.replace(/\s/g, "");
    tags = tags.replace(/\,/g, "");
    tags = tags.toLowerCase();
    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Text", text);
    formData.append("Tags", tags);
    for (let i = 0; i < files.length; i++) formData.append("Files", files[i]);
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
            message: "Post couldn't be created!"
          }
        }));

        this.setState((state, props) => ({ loading: false }));
      })
      .then(data => {
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
