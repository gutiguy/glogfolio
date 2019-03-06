import React, { Component } from "react";
import { Tabs, Tab, Paper } from "@material-ui/core";
import { connect } from "react-redux";
import Gallery from "react-photo-gallery";
import CategoryDrawer from "../CategoryDrawer/CategoryDrawer";
import * as actions from "../../actions/categoryActions";
import Grid from "@material-ui/core/Grid";
import Lightbox from "react-images";
import { StyledLoader } from "../../hoc/withLoading";
import fetchImages from "../../utils/fetchImages";

class Portfolio extends Component {
  state = {
    images: [],
    currentImage: 0,
    currentCategory: null,
    tree: null,
    tab: -1
  };

  async componentDidMount() {
    await this.props.loadCategories();

    const images = await fetchImages();
    console.log(images);
    this.setState({
      images,
      tree: this.props.categoryTree
    });
  }

  openLightbox = (_, obj) => {
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

  setCurrentCategory = value => {
    const { tab, tree } = this.state;

    this.setState({
      currentCategory: value === null ? tree[tab].id : value
    });
  };

  setCurrentTab = (_, tab) => {
    this.setState({
      tab,
      currentCategory: tab === -1 ? null : this.state.tree[tab].id
    });
  };

  render() {
    const { currentCategory, images, tree, tab } = this.state;
    let currentImages = [];

    if (currentCategory !== null) {
      currentImages = images.filter(
        image => image.categories.indexOf(currentCategory) !== -1
      );
    } else {
      currentImages = images;
    }

    if (!tree) {
      return <StyledLoader />;
    }

    return (
      <div>
        <Paper>
          <Tabs value={tab} onChange={this.setCurrentTab}>
            <Tab label="All Work" value={-1} key={-1} />
            {tree.map((topNode, index) => (
              <Tab label={topNode.name} value={index} key={topNode.id} />
            ))}
          </Tabs>
          <Paper>
            <Grid container>
              <Grid item xs={currentCategory ? 9 : 12}>
                <Gallery photos={currentImages} onClick={this.openLightbox} />

                <Lightbox
                  images={currentImages}
                  onClose={this.closeLightbox}
                  onClickPrev={this.gotoPrevious}
                  onClickNext={this.gotoNext}
                  currentImage={this.state.currentImage}
                  isOpen={this.state.lightboxIsOpen}
                  showImageCount={false}
                />
              </Grid>
              {tab !== -1 && tree[tab].children ? (
                <Grid item xs>
                  <CategoryDrawer
                    onClick={this.setCurrentCategory}
                    tree={tree[tab].children}
                  />
                </Grid>
              ) : null}
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
