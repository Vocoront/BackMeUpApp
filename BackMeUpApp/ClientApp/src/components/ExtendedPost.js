import React, { Component } from "react";
import { AwesomeButton } from "react-awesome-button";
import { connect } from "react-redux";
import Form from "react-bootstrap/Form";
import Comment from "./Comment";
import Post from "./Post";
import { setBackHistory } from "../actions/posts";
import { getPostById, getCommentsForPost } from "../services/postObtaining";
import { addNewComment } from "../services/postModification";
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
    addNewComment(this.state.comment, this.props.match.params.id);
  }

  render() {
    return (
      <div>
        <div
          className="ext-post__go-back-btn"
          onMouseEnter={e => {
            e.target.innerHTML = '<i class="fas fa-angle-double-left"></i>';
          }}
          onMouseLeave={e => {
            e.target.innerHTML = "Go Back";
          }}
          onClick={() => {
            this.props.dispatch(setBackHistory(true));
            this.props.history.goBack();
          }}
        >
          Go Back
        </div>
        {this.props.extendedPost.loading === true ? (
          <div className="loader">Loading...</div>
        ) : (
          this.props.extendedPost.post !== {} && (
            <div>
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
              {this.props.extendedPost.commentsLoading ? (
                <div className="loader">Loading...</div>
              ) : (
                <div className="post extPost">
                  {this.props.user.username && (
                    <div>
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
                      <AwesomeButton
                        size="large"
                        type="link"
                        onPress={this.AddComment}
                      >
                        {" "}
                        Add Comment{" "}
                      </AwesomeButton>
                    </div>
                  )}

                  <div className="commentSection">
                    <h2>Comment section</h2>

                    <div className="PostComments">
                      {this.props.extendedPost.comments.map(
                        (comment, index) => {
                          return (
                            <Comment
                              key={index}
                              username={comment.username}
                              text={comment.text}
                              createdAt={comment.createdAt}
                            />
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
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
