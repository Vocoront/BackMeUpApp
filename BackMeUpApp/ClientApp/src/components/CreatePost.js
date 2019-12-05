import React, { Component } from "react";
import { AwesomeButton } from "react-awesome-button";
import styles from "react-awesome-button/src/styles/themes/theme-bojack";
import { Form, Container, Col, Row } from "react-bootstrap";

class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.createPost.bind(this);
  }

  createPost = () => {
    const formData = new FormData();
    formData.append("naslov", "username");

    fetch("api/post", { method: "GET" })
      .then(res => {
        if (res.status === 200) return res.json();
      })
      .then(data => {
        console.log(data);
      })
      .catch(er => console.log(er));
  };

  render() {
    return (
      <div className="post post__newPost">
        {console.log("aaa")}
        {this.createPost()}
        <div className="newPostBody">
          <div className="newPostBody row1">
            <Form.Control type="text" placeholder="Title" />
            <AwesomeButton style={styles} size="small" type="secondary">
              Slika
            </AwesomeButton>
          </div>
          <div>
            <Form.Control as="textarea" rows="4" placeholder="Text" />
          </div>
        </div>
        <AwesomeButton
          style={styles}
          size="large"
          type="primary"
          border-radius="2rem"
        >
          Dodaj
        </AwesomeButton>
      </div>
    );
  }
}

export default CreatePost;
