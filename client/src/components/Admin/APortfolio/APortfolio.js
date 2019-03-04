import React, { Component } from "react";
import axios from "axios";
import CustomDialog from "../CustomDialog";
import AToolbar from "../AToolbar";
import APortfolioForm from "./APortfolioForm";
import Gallery from "react-photo-gallery";
import CategoryDrawer from "../../CategoryDrawer/CategoryDrawer";
import { connect } from "react-redux";
import * as actions from "../../../actions/categoryActions";
import Grid from "@material-ui/core/Grid";
import SelectedImage from "../SelectedImage";

const { REACT_APP_AWS_BUCKET_URI } = process.env;

class APortfolio extends Component {
  state = {
    addForm: false,
    loadingData: false,
    editedArtwork: null,
    images: [],
    currentCategory: null,
    currentImages: [],
    currentlyEditing: null,
    selectedImages: {},
    tree: null,
    requestStatus: null
  };

  async componentDidMount() {
    await this.props.loadCategories();
    const requestImages = await axios.get("/api/artworks");
    const images = requestImages.data.map((image, index) => {
      let { image_key, ...otherProps } = image;
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
        openEdit: () => this.openEdit(image)
      };
    });

    this.setState({
      images,
      currentImages: [...images],
      tree: this.props.categoryTree
    });
  }

  openEdit = image => {
    this.setState({ currentlyEditing: image });
  };

  selectImage = (_, obj) => {
    let selectedImages = { ...this.state.selectedImages };
    let currentImages = [...this.state.currentImages];
    currentImages[obj.index].selected = !currentImages[obj.index].selected;
    if (currentImages[obj.index].selected) {
      selectedImages[obj.photo.id] = obj.photo.image_key;
    } else {
      delete selectedImages[obj.photo.id];
    }
    this.setState({ currentImages, selectedImages });
  };

  handleDelete = async () => {
    const request = await axios.post("/api/artworks/delete", {
      selectedImages: this.state.selectedImages
    });
    let newImages = [...this.state.images];
    let newImagesIndexes = newImages.map(image => image.id);
    let currentImages = [...this.state.currentImages];
    let currentImagesIndexes = currentImages.map(image => image.id);
    Object.keys(this.state.selectedImages).forEach(id => {
      newImages.splice(newImagesIndexes.indexOf(parseInt(id, 10)), 1);
      currentImages.splice(currentImagesIndexes.indexOf(parseInt(id, 10)), 1);
    });
    this.setState({
      images: newImages,
      currentImages,
      selectedImages: {},
      requestStatus: request.status
    });
  };

  handleSelect = async node => {
    let { id } = node;
    let newSelected = [...this.state.selectedNodes];
    var index = newSelected.indexOf(id);
    if (index !== -1) newSelected.splice(index, 1);
    else {
      newSelected.push(id);
    }

    this.setState({ selectedNodes: newSelected });
  };

  handleAdd = async (values, image, _) => {
    const request = await axios.post("/api/artworks/add", {
      ...values,
      width: image.width,
      height: image.height
    });

    const uploadConfig = await axios.get(
      "/api/upload?folder=portfolio&key=" + request.data.key
    );
    await axios.put(uploadConfig.data.url, image.file, {
      headers: { "Content-Type": image.type }
    });

    this.setState({ addForm: false, requestStatus: request.status });
  };

  handleEdit = async ({ id, name, description, selectedCategories }) => {
    const request = await axios.post("/api/artworks/edit", {
      id,
      name,
      description,
      selectedCategories
    });
    if (request.status === 200) {
      console.log("Edited successfully");
    } else {
      console.log("problem");
    }
    this.setState({ currentlyEditing: null, requestStatus: request.status });
  };

  setCurrentCategory = clickedCategory => {
    let currentImages = [];
    let images = [...this.state.images];

    images.forEach(image => (image.selected = false));
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
      currentCategory: clickedCategory,
      currentImages,
      images
    });
  };

  render() {
    let displayDialog = null;
    const { requestStatus } = this.state;

    if (requestStatus != null) {
      if (requestStatus === 200)
        displayDialog = (
          <CustomDialog
            title="Success!"
            text="Operation finished successfully."
            onDismiss={() => {
              this.setState({ requestStatus: null });
            }}
            status={requestStatus}
          />
        );
      else {
        displayDialog = (
          <CustomDialog
            title="Oops!"
            text="There was an issue finishing this operation. If the problem persists please contact your system administrator."
            onDismiss={() => {
              this.setState({ requestStatus: null });
            }}
            status={requestStatus}
          />
        );
      }
    }
    return (
      <React.Fragment>
        {displayDialog}
        <AToolbar
          onAdd={() => this.setState({ addForm: true })}
          onDelete={this.handleDelete}
        />
        {this.state.addForm ? (
          <APortfolioForm
            title="Add New Image"
            submitLabel="Add Image"
            onSubmit={this.handleAdd}
            onClose={() => this.setState({ addForm: false })}
          />
        ) : (
          ""
        )}
        {this.state.currentlyEditing ? (
          <APortfolioForm
            title={"Edit " + this.state.currentlyEditing.name}
            onClose={() => this.setState({ currentlyEditing: null })}
            submitLabel="Submit Changes"
            onSubmit={this.handleEdit}
            initialValues={this.state.currentlyEditing}
          />
        ) : (
          ""
        )}
        <Grid container>
          <Grid item xs>
            <CategoryDrawer
              onClick={this.setCurrentCategory}
              tree={this.state.tree}
            />
          </Grid>
          <Grid item xs={9}>
            <Gallery
              photos={this.state.currentImages}
              ImageComponent={SelectedImage}
              onClick={this.selectImage}
            />
          </Grid>
        </Grid>
      </React.Fragment>
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
)(APortfolio);
