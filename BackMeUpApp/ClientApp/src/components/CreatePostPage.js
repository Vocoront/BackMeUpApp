import React, { Component } from "react";
import { connect } from "react-redux";

import CreatePost from "./CreatePost";

class CreatePostPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };

    this.AddNewPost.bind(this);
  }
  AddNewPost = (title,text) => {
    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Text", text);
    formData.append("Username",this.props.user.username);
    fetch("api/post/create", { method: "POST", body: formData })
      .then(res => res.json())
      .then(data=>console.log(data))
      .catch(er => console.log(er));
  };
  render() {
    return <CreatePost onAddNewPost={this.AddNewPost}/>;
  }
}

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps)(CreatePostPage);
