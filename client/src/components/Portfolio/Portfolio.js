import React, { Component } from "react";
import { Tabs, Tab, Paper } from "@material-ui/core";
import { connect } from "react-redux";
import axios from "axios";
import Gallery from "react-photo-gallery";
import CategoryDrawer from "../CategoryDrawer/CategoryDrawer";
import * as actions from "../../actions/categoryActions";
import Grid from "@material-ui/core/Grid";
import Lightbox from "react-images";

const { REACT_APP_AWS_BUCKET_URI } = process.env;

class Portfolio extends Component {
  state = {
    images: [],
    currentImages: [],
    categoryTree: null,
    tree: null,
    currentImage: 0,
    tab: -1
  };

  async componentDidMount() {
    await this.props.loadCategories();
    const requestImages = await axios.get("/api/artworks");
    const images = requestImages.data.map((image, index) => {
      let { image_key, description, name, ...otherProps } = image;
      let getDimensinos = image_key.match(/(\d+)x(\d+)\.jpe?g$/i);
      let [, width, height] = getDimensinos;
      return {
        image_key: "portfolio/" + image_key,
        src: REACT_APP_AWS_BUCKET_URI + "/portfolio/" + image.image_key,
        ...otherProps,
        width: parseInt(width, 10),
        height: parseInt(height, 10),
        key: image.id,
        index,
        caption: name + ": " + description
      };
    });
    this.setState({
      images,
      currentImages: [...images],
      tree: this.props.categoryTree,
      categoryTree: null
    });
  }

  setCurrentCategory = clickedCategory => {
    let currentImages = [];
    let images = this.state.images;
    if (clickedCategory) {
      images.forEach(image => {
        if (image.categories.indexOf(clickedCategory) !== -1) {
          currentImages.push({ ...image });
        }
      });
    } else {
      currentImages = images;
    }

    this.setState({
      currentImages
    });
  };

  openLightbox = (event, obj) => {
    this.setState({
      currentImage: obj.index,
      lightboxIsOpen: true
    });
  };
  closeLightbox = () => {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false
    });
  };
  gotoPrevious = () => {
    this.setState({
      currentImage: this.state.currentImage - 1
    });
  };
  gotoNext = () => {
    this.setState({
      currentImage: this.state.currentImage + 1
    });
  };

  handleCategoryChange = (event, value) => {
    if (value === -1) {
      this.setCurrentCategory(null);
      this.setState({ categoryTree: null, tab: value });
    } else {
      this.setCurrentCategory(this.state.tree[value].id);
      this.setState({
        categoryTree: this.state.tree[value].children,
        tab: value
      });
    }
  };

  render() {
    return (
      <div>
        <Paper>
          <Tabs value={this.state.tab} onChange={this.handleCategoryChange}>
            <Tab label="All Work" value={-1} key={-1} />
            {this.state.tree
              ? this.state.tree.map((tree, index) => {
                  return <Tab label={tree.name} value={index} key={index} />;
                })
              : "loading"}
          </Tabs>
          <Paper>
            <Grid container>
              <Grid item xs={9}>
                <Gallery
                  photos={this.state.currentImages}
                  onClick={this.openLightbox}
                />
                <Lightbox
                  images={this.state.currentImages}
                  onClose={this.closeLightbox}
                  onClickPrev={this.gotoPrevious}
                  onClickNext={this.gotoNext}
                  currentImage={this.state.currentImage}
                  isOpen={this.state.lightboxIsOpen}
                  showImageCount={false}
                />
              </Grid>
              <Grid item xs>
                {this.state.categoryTree ? (
                  <CategoryDrawer
                    onClick={this.setCurrentCategory}
                    tree={this.state.categoryTree}
                  />
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          </Paper>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    categoryTree: state.category.categoryTree
  };
};

export default connect(
  mapStateToProps,
  actions
)(Portfolio);
