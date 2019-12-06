import React, { Component } from "react";
import { AwesomeButton } from "react-awesome-button";
import styles from "react-awesome-button/src/styles/themes/theme-bojack";

import { Form } from "react-bootstrap";
import Tag from "./Tag.js";

class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      text: ""
    };
  }

  render() {
    return (
      <div className="post post__newPost">
        <div className="newPostBody">
          <div className="newPostBody row1">
            <Form.Control
              type="text"
              placeholder="Title"
              onChange={e => {
                this.setState({ title: e.target.value });
              }}
            />
            <AwesomeButton style={styles} size="extrasmall" type="secondary">
              <i className="	fa fa-file-picture-o"></i>
            </AwesomeButton>
          </div>
          <div>
            <Form.Control
              as="textarea"
              rows="4"
              onChange={e => {
                this.setState({ text: e.target.value });
              }}
              placeholder="Text"
            />
          </div>

          <div className="tagBar">
            <Tag />
            <Tag />
            <Tag />
            <Tag />
            <Tag />
            <Tag />
            <Tag />
            <Tag />
            <Tag />
            <Tag />
            <Tag />
          </div>
        </div>
        <AwesomeButton
          style={styles}
          size="large"
          type="primary"
          border-radius="2rem"
          onPress={() =>
            this.props.onAddNewPost(this.state.title, this.state.text)
          }
        >
          Dodaj
        </AwesomeButton>
      </div>
    );
  }
}

export default CreatePost;
