import React, { Component } from 'react';

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( <div className="container post__container">
            <div className="post__title">Title</div>
            <div className="post__content">Picture</div>
            <div className="post__vote">
                <div className="post__vote__option">You the man</div>
                <div className="post__vote__option">You fool</div>
            </div>
        </div> );
    }
}
 
export default Post;