import React, { Component } from "react";
import { AwesomeButton } from "react-awesome-button";
import { connect } from "react-redux";
import Form from "react-bootstrap/Form";
import Comment from "./Comment";
import { convertUtcToLocal } from "../helpers/convertUtcToLocal";
class ExtendedPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      post: "",
      allComments: "",
      comment: ""
    };

    this.GetAllComments = this.GetAllComments.bind(this);
    this.GetPost = this.GetPost.bind(this);
    this.CommentOnChageHandler = this.CommentOnChageHandler.bind(this);
    this.AddComment = this.AddComment.bind(this);

    this.GetPost();
    this.GetAllComments();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.GetPost();
      this.GetAllComments();
    }
  }
  GetPost() {
    let putanja = " /api/post/getPostById/" + this.props.match.params.id; // ovde mora / pre api !!!
    fetch(putanja, { method: "GET" })
      .then(res => res.json())
      .then(data => {
        this.setState((state, props) => ({ post: data }));
      })
      .catch(er => console.log(er));
  }
  GetAllComments() {
    let putanja = " /api/post/GetCommentsForPost/" + this.props.match.params.id; // ovde mora / pre api !!!
    fetch(putanja, { method: "GET" })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState((state, props) => ({ allComments: data }));
        this.setState((state, props) => ({ loading: false }));
      })
      .catch(er => console.log(er));
  }

  CommentOnChageHandler(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  AddComment() {
    const formData = new FormData();
    formData.append("IdPosta", this.props.match.params.id);
    formData.append("Username", this.props.user.username);
    formData.append("CommentText", this.state.comment);
    fetch("/api/post/make_comment", { method: "POST", body: formData })
      .then(res => res.json())
      .then(data => {
        this.props.history.push("/");
      })
      .catch(er => console.log(er));
  }

  render() {
    return (
      <div className="post extPost">
        <div className="post__header">
          <div className="post__title">{this.state.post.title}</div>
          <div>
            <div>{convertUtcToLocal(this.state.post.createdAt)}</div>
            {this.state.post.username}
          </div>
        </div>
        <Form className="newComment">
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Control
              as="textarea"
              rows="4"
              name="comment"
              onChange={this.CommentOnChageHandler}
            />
          </Form.Group>
        </Form>
        <AwesomeButton size="large" type="link" onPress={this.AddComment}>
          {" "}
          Add Comment{" "}
        </AwesomeButton>

        <div className="commentSection">
          <h2>Comment section</h2>
          {this.state.loading ? (
            <div className="loader">Loading...</div>
          ) : (
            <div className="PostComments">
              {this.state.allComments.map((comment, index) => {
                return (
                  <Comment
                    key={index}
                    username={comment.username}
                    text={comment.text}
                    createdAt={comment.createdAt}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps)(ExtendedPost);
