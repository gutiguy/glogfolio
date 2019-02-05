import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import "react-image-gallery/styles/css/image-gallery.css";
import axios from "axios";
import ImageGallery from "react-image-gallery";

const { REACT_APP_AWS_BUCKET_URI } = process.env;

const CardLink = styled.a`
  color: #fff;
  text-decoration: none;
  font-weight: bold;
`;
const styles = theme => ({
  root: {
    position: "relative",
    padding: 0
  },

  galleryCard: {
    boxSizing: "border-box",
    borderRadius: "10px 10px 10px 10px",
    padding: "0.5rem",
    color: "#fff",
    backgroundColor: "rgba(0,0,0, 0.4)",
    width: "95%",
    position: "absolute",
    bottom: "2%",
    left: "50%",
    transform: "translate(-50%)",
    margin: "0 auto",
    [theme.breakpoints.down("md")]: {
      position: "relative",
      width: "100%",
      borderRadius: "0 0 10px 10px"
    },
    wordWrap: "break-word"
  }
});

class InformationCarousel extends Component {
  state = {
    currentIndex: 0,
    slides: []
  };

  async componentDidMount() {
    const reqNodes = await axios.get("/api/carousels");
    if (reqNodes.status === 200) {
      const nodes = await reqNodes;
      const slides = nodes.data.map(node => {
        return {
          title: node.title,
          textualDescription: node.description,
          original: REACT_APP_AWS_BUCKET_URI + "/carousel/" + node.image_key,
          link: node.url
        };
      });
      this.setState({ slides });
    } else {
      console.log(
        "Problem fetching carousel slides, please check your connection!"
      );
    }
  }

  handleSlide = index => {
    this.setState({ currentIndex: index });
  };

  imageGalleryRef = React.createRef();

  handleGalleryOnMouseOver = () => {
    this.imageGalleryRef.current.pause();
  };

  handleGalleryOnMouseLeave = () => {
    this.imageGalleryRef.current.play();
  };

  render() {
    const { slides } = this.state;
    if (!slides.length) {
      return <div>Loading!</div>;
    } else {
      return (
        <div className={this.props.classes.root}>
          <div className={this.props.classes.img}>
            <ImageGallery
              items={slides}
              showBullets={false}
              showFullscreenButton={false}
              showPlayButton={false}
              slideInterval={6000}
              showThumbnails={false}
              autoPlay
              onSlide={this.handleSlide}
              additionalClass={this.props.classes.img}
              ref={this.imageGalleryRef}
              onMouseLeave={this.handleGalleryOnMouseLeave}
              onMouseOver={this.handleGalleryOnMouseOver}
            />
          </div>
          <div className={this.props.classes.galleryCard}>
            <Typography variant="h6" paragraph color="inherit">
              {slides[this.state.currentIndex].title}
            </Typography>
            <Typography variant="body1" color="inherit">
              {slides[this.state.currentIndex].textualDescription}
              {slides[this.state.currentIndex].link ? (
                <CardLink href={slides[this.state.currentIndex].link}>
                  Click to read more
                </CardLink>
              ) : (
                ""
              )}
            </Typography>
          </div>
        </div>
      );
    }
  }
}

InformationCarousel.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(InformationCarousel);
