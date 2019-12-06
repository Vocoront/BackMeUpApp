import React, { Component } from 'react';

class CreatePostPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          title: "",
          text: ""
        };
    
        this.AddNewPost.bind(this);
      }
      AddNewPost = () => {
        const formData = new FormData();
        formData.append("Title", this.state.title);
        formData.append("Text", this.state.text);
        fetch("api/post/create", { method: "POST", body: formData })
          .then(res => console.log(res.json()))
          .catch(er => console.log(er));
      };
      render() {
        return (
          <div className="post new-post-form">
              <input
                type="text"
                onChange={e => {
                  this.setState({ title: e.target.value });
                }}
                placeholder="Insert title"
              />
              <input
                type="textarea"
                onChange={e => {
                  this.setState({ text: e.target.value });
                }}
                placeholder="Insert dilema"
              />
              <div className="bkm__btn login--btn" onClick={this.AddNewPost}>Add</div>
          </div>
        );
      }
}
 
export default CreatePostPage;