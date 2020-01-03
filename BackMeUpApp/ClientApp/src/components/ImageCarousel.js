import React from "react";
import Carousel from "react-bootstrap/Carousel";

const ImageCarousel = props => (
  <div>
    <Carousel interval={null}>
      {props.imageUrls.map((url, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-bloack w-100 post--img"
            src={process.env.REACT_APP_SERVER_DOMAIN + "images/" + url}
            alt={process.env.REACT_APP_SERVER_DOMAIN + "images/" + url}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  </div>
);

export default ImageCarousel;
