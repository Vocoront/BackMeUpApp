import React, { Component } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import { AwesomeButton } from "react-awesome-button";
import Tag from "./Tag.js";
import { setPostOpinion } from "../actions/posts";
import ImageCarousel from "./ImageCarousel";

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.AddOpinion = this.AddOpinion.bind(this);
    this.GetImageUrlsArray = this.GetImageUrlsArray.bind(this);
  }

  GetImageUrlsArray = imageUrls => {
    if (!imageUrls) return null;
    let array = imageUrls.split("#");
    array.pop();
    return array;
  };

  AddOpinion(opinion, boolOpinion) {
    if (opinion === this.props.choice) return;
    const formData = new FormData();
    formData.append("idPosta", this.props.postId);
    formData.append("username", this.props.user.username);
    formData.append("opinion", boolOpinion);
    fetch("api/post/vote", { method: "POST", body: formData })
      .then(res => res.json())
      .then(data => {
        this.props.dispatch(setPostOpinion(this.props.postId, data.opinion));
      })
      .catch(er => console.log(er));
  }

  render() {
    let ulrArray = this.GetImageUrlsArray(this.props.imageUrls);

    return (
      <Route
        render={({ history }) => (
          <div
            className="post post__container"
            onClick={() => history.push("/extendedPost/" + this.props.postId)}
          >
            <div className="post__header">
              <div className="post__title">{this.props.title}</div>
              <div>
                <div>
                  {moment
                    .utc(this.props.createdAt)
                    .local()
                    .format("YYYY-MMM-DD h:mm A")}
                  {/* <i
                  onClick={() =>
                    history.push("/extendedPost/" + this.props.postId)
                  }
                  className="fas fa-search-plus"
                ></i> */}
                </div>
                {this.props.creator}
              </div>
            </div>
            <div
              onClick={event => {
                event.stopPropagation();
                window.event.cancelBubble = true;
              }}
              className="post__content"
            >
              {ulrArray[0] !== "" ? (
                <ImageCarousel imageUrls={ulrArray} />
              ) : (
                <div className="post__text-content">{this.props.content}</div>
              )}
            </div>
            <div>
              Comments {this.props.commentNo} <i class="far fa-comment"></i>
            </div>

            <div
              onClick={event => {
                event.stopPropagation();
                window.event.cancelBubble = true;
              }}
              className="post__vote"
            >
              <AwesomeButton
                className="aws-btn"
                size="large"
                type="primary"
                ripple={true}
                onPress={() => this.AddOpinion("agree", true)}
              >
                {this.props.agreeNo + "    "}
                {this.props.choice === "agree" ? (
                  <i className="far fa-thumbs-up fa-2x"></i>
                ) : (
                  <i className="far fa-grin"></i>
                )}
              </AwesomeButton>

              <AwesomeButton
                size="large"
                type="link"
                ripple={true}
                onPress={() => this.AddOpinion("disagree", false)}
              >
                {this.props.choice === "disagree" ? (
                  <i className="far fa-thumbs-up fa-2x"></i>
                ) : (
                  <i className="far fa-angry"></i>
                )}

                {"    " + this.props.disagreeNo}
              </AwesomeButton>
            </div>
            <div
              onClick={event => {
                event.stopPropagation();
                window.event.cancelBubble = true;
              }}
              className="tagBar"
            >
              {this.props.tags.map((tag, index) => (
                <Tag key={index} Title={tag.title} />
              ))}
            </div>
          </div>
        )}
      />
    );
  }
}
const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps)(Post);
