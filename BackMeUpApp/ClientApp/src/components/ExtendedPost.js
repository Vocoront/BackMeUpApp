import React, { Component } from "react";
import { AwesomeButton } from "react-awesome-button";
import { connect } from "react-redux";
import Form from "react-bootstrap/Form";



class ExtendedPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: "",
      comment : ""

    };

      this.GetPost();
      this.GetPost = this.GetPost.bind(this);                // ovako se pravilno bind-uje
      this.CommentOnChageHandler = this.CommentOnChageHandler.bind(this);
      this.AddComment = this.AddComment.bind(this);
  }
  GetPost() {
    // nesto ne radi
    const formData = new FormData();

    let putanja = " /api/post/getPostById/" + this.props.match.params.id;         // ovde mora / pre api !!!
    fetch(putanja, { method: "GET" })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState((state, props) => ({ post: data }));
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
        formData.append("Comment_Text", this.state.comment);
        fetch("/api/post/make_comment", { method: "POST", body: formData })
            .then(res => res.json())
            .then(data => {
                
                this.setState((state, props) => ({ loading: false }));

                this.props.history.push("/");
            })
            .catch(er => console.log(er));
    }

    
  render() {
    return (
        <div className="extPost">
            <p> Title : {this.state.post.title} </p>
            <p> User : {this.state.post.username} </p>
            <p> Text : {this.state.post.text} </p>
            <Form>
            <Form.Group controlId="exampleForm.ControlTextarea1">
                
                    <Form.Control as="textarea" rows="3" name="comment" onChange={this.CommentOnChageHandler}/>
                </Form.Group>
            </Form>
            <AwesomeButton onPress={this.AddComment} > add comment </AwesomeButton>
      </div>
    );
  }
}
const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps)(ExtendedPost);
