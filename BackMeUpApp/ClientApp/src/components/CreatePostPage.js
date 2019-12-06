import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import CreatePost from "./CreatePost";

class CreatePostPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };

    this.AddNewPost.bind(this);
  }
  AddNewPost = (title, text, tags) => {
    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Text", text);
    formData.append("Tags", tags);
    formData.append("Username", this.props.user.username);
    fetch("api/post/create", { method: "POST", body: formData })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState((state,props)=>({loading:false}));

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
          <CreatePost onAddNewPost={this.AddNewPost} />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({ user: state.user });

export default withRouter(connect(mapStateToProps)(CreatePostPage));
