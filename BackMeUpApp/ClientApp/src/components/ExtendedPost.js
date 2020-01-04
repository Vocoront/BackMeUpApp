import React, { Component } from "react";
import { AwesomeButton } from "react-awesome-button";
import { connect } from "react-redux";
import Form from "react-bootstrap/Form";
import Comment from "./Comment";
import Post from "./Post";
import { getPostById, getCommentsForPost } from "../services/postObtaining";

class ExtendedPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    getPostById(this.props.match.params.id);
  }
  GetAllComments() {
    getCommentsForPost(this.props.match.params.id);
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
        this.GetAllComments();
      })
      .catch(er => console.log(er));
  }

  render() {
    return (
      <div>
        {this.props.extendedPost.loading === true ? (
          <div className="loader">Loading...</div>
        ) : (
          this.props.extendedPost.post !== {} && (
            <Post
              extended={true}
              title={this.props.extendedPost.post.title}
              creator={this.props.extendedPost.post.creator}
              content={this.props.extendedPost.post.text}
              postId={this.props.extendedPost.post.id}
              tags={this.props.extendedPost.post.tags}
              createdAt={this.props.extendedPost.post.createdAt}
              choice={this.props.extendedPost.post.choice}
              imageUrls={this.props.extendedPost.post.imageUrls}
              commentNo={this.props.extendedPost.post.commentNo}
              agreeNo={this.props.extendedPost.post.agreeNo}
              disagreeNo={this.props.extendedPost.post.disagreeNo}
              follow={this.props.extendedPost.post.follow}
            />
          )
        )}

        {this.props.extendedPost.commentsLoading ? (
          <div className="loader">Loading...</div>
        ) : (
          <div className="post extPost">
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

              <div className="PostComments">
                {this.props.extendedPost.comments.map((comment, index) => {
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
            </div>
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  user: state.user,
  extendedPost: state.extendedPost
});

export default connect(mapStateToProps)(ExtendedPost);
