import React, { Component } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import Tag from "./Tag.js";
import ImageCarousel from "./ImageCarousel";
import { setPostOpinion } from "../actions/posts";
import { clearFilter } from "../actions/filter";
import { convertUtcToLocal } from "../helpers/convertUtcToLocal";
import { follow, unfollow, addOpinion } from "../services/postModification";
import { setAlert } from "../actions/alert";

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadFollowing: false,
      loadChoice: false
    };
    this.AddOpinion = this.AddOpinion.bind(this);
    this.GetImageUrlsArray = this.GetImageUrlsArray.bind(this);
  }

  GetImageUrlsArray = imageUrls => {
    if (!imageUrls) return null;
    let array = imageUrls.split("#");
    array.pop();
    return array;
  };

  async AddOpinion(opinion, boolOpinion) {
    if (!this.props.user.username) {
      this.props.dispatch(
        setAlert("You are not logged in.", "Plese log in to add your opinion")
      );
      return;
    }
    if (opinion === this.props.choice) return;
    await addOpinion(this.props.postId, boolOpinion);
  }

  render() {
    let ulrArray = this.GetImageUrlsArray(this.props.imageUrls);

    return (
      <Route
        render={({ history }) => (
          <div
            className="post post__container"
            onClick={() => {
              if (this.props.extended) return;
              history.push("/post/id/" + this.props.postId);
            }}
          >
            <div className="post__header">
              <div className="post__title">
                <div className="post__title--title">{this.props.title}</div>
                {this.props.user.username &&
                  (this.state.loadFollowing ? (
                    <div
                      onClick={event => {
                        event.stopPropagation();
                        window.event.cancelBubble = true;
                      }}
                      className="post__follow-button"
                    >
                      Sync...
                    </div>
                  ) : (
                    <div
                      className="post__follow-button"
                      onClick={async event => {
                        event.stopPropagation();
                        window.event.cancelBubble = true;
                        this.setState({ loadFollowing: true });

                        if (!this.props.follow) await follow(this.props.postId);
                        else await unfollow(this.props.postId);
                        this.setState({ loadFollowing: false });
                      }}
                    >
                      {!this.props.follow ? "follow" : "unfollow"}
                    </div>
                  ))}
              </div>
              <div>
                <div>{convertUtcToLocal(this.props.createdAt)}</div>
                <div
                  className="post__creator"
                  onClick={event => {
                    event.stopPropagation();
                    window.event.cancelBubble = true;
                    this.props.dispatch(clearFilter());
                    history.push("/post/creator/" + this.props.creator);
                  }}
                >
                  {this.props.creator}
                </div>
              </div>
            </div>
            <div
              onClick={event => {
                event.stopPropagation();
                window.event.cancelBubble = true;
              }}
              className="post__content"
            >
              {this.props.extended ? (
                ulrArray[0] !== "" ? (
                  <div className="post__text-content">
                    <ImageCarousel imageUrls={ulrArray} />
                    {this.props.content}
                  </div>
                ) : (
                  <div className="post__text-content">{this.props.content}</div>
                )
              ) : ulrArray[0] !== "" ? (
                <ImageCarousel imageUrls={ulrArray} />
              ) : (
                <div className="post__text-content">{this.props.content}</div>
              )}
            </div>
            <div>
              Comments {this.props.commentNo} <i className="far fa-comment"></i>
            </div>

            {this.state.loadChoice ? (
              <div className="post__follow-button">Sync...</div>
            ) : (
              <div
                onClick={event => {
                  event.stopPropagation();
                  window.event.cancelBubble = true;
                }}
                className="post__vote"
              >
                <div
                  onClick={async () => {
                    this.setState({ loadChoice: true });
                    await this.AddOpinion("agree", true);
                    this.setState({ loadChoice: false });
                  }}
                  className="post__vote__option"
                >
                  <div>{this.props.agreeNo}</div>
                  <div>
                    {this.props.choice === "agree" ? (
                      <i className="far fa-thumbs-up fa-2x"></i>
                    ) : (
                      <i className="far fa-grin"></i>
                    )}
                  </div>
                </div>

                <div
                  onClick={async e => {
                    this.setState({ loadChoice: true });
                    await this.AddOpinion("disagree", false);
                    this.setState({ loadChoice: false });
                  }}
                  className="post__vote__option"
                >
                  <div>{this.props.disagreeNo}</div>
                  <div>
                    {this.props.choice === "disagree" ? (
                      <i className="far fa-thumbs-up fa-2x"></i>
                    ) : (
                      <i className="far fa-angry"></i>
                    )}
                  </div>
                </div>
              </div>
            )}
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
