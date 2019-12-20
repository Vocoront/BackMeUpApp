import React, { Component } from "react";
import Carousel from "react-bootstrap/Carousel";

class ImageCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <Carousel interval={null}>
          {this.props.imageUrls.map((url, index) => (
            <Carousel.Item key={index}>
              <img
                className="w-100 post--img"
                src={"images/" + url }
                alt={"images/" + url }
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    );
  }
}

export default ImageCarousel;
