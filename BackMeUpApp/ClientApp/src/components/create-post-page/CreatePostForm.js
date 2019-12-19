import React, { Component } from "react";
import { AwesomeButton } from "react-awesome-button";
import styles from "react-awesome-button/src/styles/themes/theme-bojack";
class CreatePostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      text: "",
      tags: "",
      selectedFiles: []
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  onChangeHandler = event => {
    var files = event.target.files;
    this.setState((state, props) => ({ selectedFiles: files }));
  };

  render() {
    return (
      <div className="post new-post-container">
        <input
          className="new-post-container__input"
          type="text"
          placeholder="Input post title"
          onChange={e => this.setState({ title: e.target.value })}
        />
        <textarea
          className="new-post-container__input"
          rows="5"
          cols="30"
          placeholder="Insert post text"
          onChange={e => this.setState({ text: e.target.value })}
        />
        <input
          className="new-post-container__input"
          type="text"
          placeholder="Insert tags, example:#tag1 #tag"
          onChange={e => this.setState({ tags: e.target.value })}
        />

        <div className="form-group files">
          <label>Upload Your Files </label>
          <input
            type="file"
            className="form-control"
            onChange={this.onChangeHandler}
            multiple
          />
        </div>
        <output id="list"></output>

        <div></div>

        <div className="new-post-container__button">
          <AwesomeButton
            style={styles}
            size="large"
            type="primary"
            border-radius="2rem"
            onPress={() =>
              this.props.onAddNewPost(
                this.state.title,
                this.state.text,
                this.state.tags,
                this.state.selectedFiles
              )
            }
          >
            Dodaj
          </AwesomeButton>
        </div>
      </div>
    );
  }
}

export default CreatePostForm;
