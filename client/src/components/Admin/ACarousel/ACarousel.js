import React, { Component } from "react";
import axios from "axios";
import ATable, { injectButtons } from "../ATable";
import AToolbar from "../AToolbar";
import ACarouselForm from "./ACarouselForm";
import { backendUrl } from "../../../config";

class ACarousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nodes: [],
      addForm: false,
      currentlyEditing: null,
      selectedNodes: {}
    };
  }

  async componentDidMount() {
    const nodes = await axios.get(backendUrl + "/api/carousels");

    if (nodes.status !== 200) {
      console.log(
        "There was a problem fetching carousel nodes from the server!"
      );
    } else {
      this.setState({ nodes: nodes.data });
    }
  }

  submitAdd = async values => {
    let formData = new FormData();
    let { image, cropData, ...formEntries } = values;
    const { file, ...imageMeta } = image;
    formEntries = { ...formEntries, ...cropData, image: file, imageMeta };
    for (const [key, value] of Object.entries(formEntries)) {
      formData.append(key, value);
    }
    const response = await axios.post(
      backendUrl + "/api/carousels/add",
      formData
    );
    const newCarousel = {
      ...values,
      id: response.data.id,
      image_key: response.data.image_key
    };

    this.setState({
      nodes: [...this.state.nodes, newCarousel],
      addForm: false
    });
  };

  submitEdit = async node => {
    const { id, url, title, description } = node;
    const req = await axios.post(backendUrl + "/api/carousels/edit", {
      title,
      description,
      id,
      url
    });
    if (req.status === 200) {
      const { nodes } = this.state;
      let index = nodes.map(el => el.id).indexOf(node.id);
      console.log(req.data);
      const newNodes = [
        ...nodes.slice(0, index),
        req.data,
        ...nodes.slice(index + 1)
      ];
      this.setState({ nodes: newNodes });
    } else {
      console.log("There was a problem editing node!");
    }
    this.setState({ currentlyEditing: null });
  };

  handleEdit = node => {
    this.setState({ currentlyEditing: node });
  };

  onSortEnd = async ({ oldIndex, newIndex }) => {
    const { nodes } = this.state;
    let putAfter = undefined;
    let currentId = nodes[oldIndex].id;
    if (oldIndex === newIndex) {
      return false;
    }
    if (newIndex !== 0) {
      if (oldIndex > newIndex) {
        putAfter = nodes[newIndex - 1].id;
      } else {
        putAfter = nodes[newIndex].id;
      }
    }

    // If moved to
    const req = await axios.post(backendUrl + "/api/carousels/reorder", {
      putAfter,
      currentId
    });
    if (req.status === 200) {
      const movedNode = nodes[oldIndex];
      let reorderedNodes = [...nodes];
      reorderedNodes.splice(oldIndex, 1);
      reorderedNodes.splice(newIndex, 0, movedNode);
      this.setState({ nodes: reorderedNodes });
    } else {
      console.log("Error with API reorder request");
    }
  };

  handleSelection = node => {
    const { selectedNodes } = this.state;
    let newSelectedNodes = { ...selectedNodes };
    if (newSelectedNodes.hasOwnProperty(node.id)) {
      delete newSelectedNodes[node.id];
    } else {
      newSelectedNodes[node.id] = node.image_key;
    }
    this.setState({ selectedNodes: newSelectedNodes });
  };

  handleDelete = async ids => {
    const { selectedNodes, nodes } = this.state;
    const deleteCarousels = await axios.post(
      backendUrl + "/api/carousels/delete",
      {
        selectedNodes
      }
    );

    if (deleteCarousels !== typeof "undefined") {
      let newNodes = nodes.filter(
        node => !selectedNodes.hasOwnProperty(node.id)
      );
      this.setState({ selectedNodes: {}, nodes: newNodes });
    } else {
      console.log("something went terribly wrong");
    }
  };

  render() {
    let { nodes } = this.state;
    nodes = injectButtons({
      rows: nodes,
      handleEdit: this.handleEdit,
      handleSelection: this.handleSelection
    });
    return (
      <div>
        <AToolbar
          numerator={Object.keys(this.state.selectedNodes).length}
          onAdd={() => this.setState({ addForm: true })}
          onDelete={() => this.handleDelete(this.props.selected)}
        />
        {
          <ATable
            rows={nodes}
            tableFields={["drag", "select", "title", "edit"]}
            onSelectRow={this.handleSelection}
            onEditRow={this.openEditForm}
            order={true}
            onSortEnd={this.onSortEnd}
          />
        }

        {this.state.addForm === true ? (
          <ACarouselForm
            title="Add Carousel Item"
            onSubmit={this.submitAdd}
            onClose={() => this.setState({ addForm: false })}
          />
        ) : (
          ""
        )}

        {this.state.currentlyEditing ? (
          <ACarouselForm
            title="Edit Carousel"
            onSubmit={this.submitEdit}
            onClose={() => this.setState({ currentlyEditing: null })}
            initialValues={this.state.currentlyEditing}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default ACarousel;
