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
      selectedFile: undefined
    };

    this.onChangeHandler=this.onChangeHandler.bind(this);
    this.prikaziSliku=this.prikaziSliku.bind(this);
  }

  prikaziSliku=(event)=>{
    var files = event.target.files;
        var f = files[0];
        var reader = new FileReader();
         
          reader.onload = (function(theFile) {
                return function(e) {
                  document.getElementById('list').innerHTML = ['<img src="', e.target.result,'" title="', theFile.name, '" width="100" />'].join('');
                };
          })(f);
           
          reader.readAsDataURL(f);


  }

  onChangeHandler=(event)=>{
    this.setState({selectedFile: event.target.files[0]});  
    this.prikaziSliku(event);
  }

  render() {
    return (
      <div className="post new-post-container">
        <input className="new-post-container__input" type='text' placeholder='Input post title' onChange={e=>this.setState({title:e.target.value})}/>
        <textarea className="new-post-container__input" rows="5" cols="30" placeholder='Insert post text' onChange={e=>this.setState({text:e.target.value})}/>
        <input className="new-post-container__input" type='text' placeholder='Insert tags, example:#tag1 #tag' onChange={e=>this.setState({tags:e.target.value})}/>
        <div className="new-post-container__button">
          <AwesomeButton style={styles} size="extrasmall" type="secondary">
            <i className="	fa fa-file-picture-o"></i>
          </AwesomeButton>
        </div>
        <input type="file" name="file" onChange={this.onChangeHandler}/>
        <output id="list"></output>

        <div>
          
        </div>
     
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
                this.state.selectedFile
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
