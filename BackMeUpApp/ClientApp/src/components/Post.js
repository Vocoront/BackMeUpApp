import React, { Component } from 'react';
import { AwesomeButton } from "react-awesome-button";
import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";


class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (<div className="container post__container">

            <div className="post__title">Title</div>
            <div className="post__content">Picture</div>
            <div className="post__vote">
                
                <AwesomeButton
                    className="aws-btn"
                    size="large"
                    type="primary"
                    border-radius="2rem"
                >
                     YAAAS

                </AwesomeButton>
                <AwesomeButton
                    size="large"
                    type="secondary"
                >
                    NOOO
                </AwesomeButton>
            </div>
        </div> );  
    }
}
 
export default Post;