import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import CreatePostForm from "./CreatePostForm";
import { addNewPost } from "../../services/postCreation";

class CreatePostPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.AddNewPost = this.AddNewPost.bind(this);
  }

  AddNewPost = async (title, text, tags, files) => {
    this.setState((state, props) => ({ loading: true }));
    let success = await addNewPost(
      this.props.user.username,
      title,
      text,
      tags,
      files
    );
    this.setState((state, props) => ({ loading: false }));
    if (success) this.props.history.push("/");
  };

  render() {
    return (
      <div>
        {this.state.loading ? (
          <div className="loader">Loading...</div>
        ) : (
          <div>
            <CreatePostForm onAddNewPost={this.AddNewPost} />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({ user: state.user });
export default withRouter(connect(mapStateToProps)(CreatePostPage));
