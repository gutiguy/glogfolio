import React, { Component } from "react";
import { Button } from "@material-ui/core";
import PropTypes from "prop-types";

class ImageUploader extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  fileSelectHandler = event => {
    let reader = new FileReader();
    let file = event.target.files[0];
    let image = new Image();
    reader.onloadend = () => {
      image.src = reader.result;
      image.onload = () => {
        this.props.appendImage({
          file,
          height: image.height,
          width: image.width,
          src: image.src
        });
      };
    };

    reader.readAsDataURL(file);
  };

  render() {
    let buttonLabel = this.props.buttonLabel;
    return (
      <React.Fragment>
        <Button onClick={() => this.inputRef.current.click()}>
          {buttonLabel}
        </Button>
        <input
          type="file"
          onChange={this.fileSelectHandler}
          style={{ display: "none" }}
          ref={this.inputRef}
        />
      </React.Fragment>
    );
  }
}

ImageUploader.propTypes = {
  appendImage: PropTypes.func,
  buttonLabel: PropTypes.string
};

ImageUploader.defaultProps = {
  buttonLabel: "Pick Image"
};
export default ImageUploader;
