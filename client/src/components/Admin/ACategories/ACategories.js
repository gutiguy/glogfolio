import React, { Component } from "react";
import axios from "axios";
import { Button, Checkbox } from "@material-ui/core";

import * as actions from "../../../actions/categoryActions";
import { connect } from "react-redux";

import SortableTree, { changeNodeAtPath } from "react-sortable-tree";
import "react-sortable-tree/style.css";

import AToolbar from "../AToolbar";
import ACategoriesForm from "./ACategoriesForm";
import Edit from "@material-ui/icons/Edit";
import Add from "@material-ui/icons/Add";

const { REACT_APP_BACKEND_URL } = process.env;

class ACategories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedNodes: [],
      addForm: false,
      editForm: false,
      currentlyEditing: null,
      underParent: { id: 1, name: undefined },
      tree: null
    };
  }

  async componentDidMount() {
    await this.props.loadCategories();
    this.setState({ tree: this.props.initialTree });
  }

  handleSelect = async (node, path) => {
    let { id } = node;
    let newSelected = [...this.state.selectedNodes];
    var index = newSelected.indexOf(id);
    if (index !== -1) newSelected.splice(index, 1);
    else {
      newSelected.push(id);
    }

    // We need to change the node state so the checked state persists on collapse
    let newTree = changeNodeAtPath({
      treeData: this.state.tree,
      path,
      newNode: { ...node, checked: index === -1 },
      getNodeKey: ({ node }) => node.id
    });
    this.setState({ tree: newTree, selectedNodes: newSelected });
  };

  handleAdd = async values => {
    const request = await axios.post(
      REACT_APP_BACKEND_URL + "/api/categories/add",
      {
        parent_id: this.state.underParent.id,
        ...values
      }
    );
    if (request.status === 200) {
      this.setState({
        addForm: false,
        underParent: { id: 1, name: undefined }
      });
      await this.props.loadCategories();
      this.setState({ tree: this.props.initialTree });
    } else {
      console.log("Problem adding category");
    }
  };

  submitEdit = async values => {
    const newCategory = {
      ...values
    };

    const editedCategory = await axios.patch(
      REACT_APP_BACKEND_URL + "/api/categories",
      newCategory
    );
    if (editedCategory.status === 200) {
      this.setState({ currentlyEditing: null });
      await this.props.loadCategories();
      this.setState({ tree: this.props.initialTree });
    } else {
      console.log("Problem editing category");
    }
  };

  handleDelete = async () => {
    await axios.post(REACT_APP_BACKEND_URL + "/api/categories/delete", {
      ids: this.state.selectedNodes
    });
    await this.props.loadCategories();
    this.setState({ tree: this.props.initialTree });
  };

  handleReorder = async data => {
    const { nextParentNode, node, treeData } = data;
    let levelIndex;
    let parent_id;
    let putAfter = null;
    if (nextParentNode) {
      parent_id = nextParentNode.id;
      levelIndex = nextParentNode.children.findIndex(
        element => element.id === node.id
      );
      if (levelIndex > 0) {
        putAfter = nextParentNode.children[levelIndex - 1].id;
      }
    } else {
      parent_id = 1;
      // Look for position at root level
      levelIndex = treeData.findIndex(element => element.id === node.id);
      if (levelIndex > 0) {
        putAfter = treeData[levelIndex - 1].id;
      }
    }
    await axios.post(REACT_APP_BACKEND_URL + "/api/categories/reorder", {
      currentId: node.id,
      parent_id: parent_id,
      putAfter: putAfter
    });
  };

  render() {
    let addCategoryTitle = "Add Category";
    if (this.state.underParent.name) {
      addCategoryTitle += " Under " + this.state.underParent.name;
    }
    return (
      <React.Fragment>
        <AToolbar
          numerator={this.state.selectedNodes.length}
          onDelete={this.handleDelete}
          onAdd={() =>
            this.setState({
              addForm: true,
              underParent: { id: 1, name: undefined }
            })
          }
          formData={this.state.formFields}
        />
        {this.state.addForm ? (
          <ACategoriesForm
            title={addCategoryTitle}
            submitLabel="Add Category"
            onSubmit={this.handleAdd}
            onClose={() => this.setState({ addForm: false })}
          />
        ) : (
          ""
        )}
        {this.state.currentlyEditing ? (
          <ACategoriesForm
            title="Edit Category"
            submitLabel="Edit Category"
            onSubmit={this.submitEdit}
            initialValues={this.state.currentlyEditing}
            onClose={() => this.setState({ currentlyEditing: null })}
          />
        ) : (
          ""
        )}
        <div style={{ height: "100%" }}>
          {this.state.tree ? (
            <SortableTree
              getNodeKey={({ node }) => node.id}
              treeData={this.state.tree}
              onChange={treeData => this.setState({ tree: treeData })}
              onMoveNode={this.handleReorder}
              generateNodeProps={({ node, path }) => ({
                title: node.name,
                subtitle: node.description,
                buttons: [
                  <Button
                    size="small"
                    onClick={() => this.setState({ currentlyEditing: node })}
                    style={{ marginTop: "10px" }}
                  >
                    <Edit fontSize="small">edit_icon</Edit>
                  </Button>,
                  <Button
                    style={{ marginTop: "10px" }}
                    size="small"
                    onClick={() =>
                      this.setState({
                        addForm: true,
                        underParent: { id: node.id, name: node.name }
                      })
                    }
                  >
                    <Add fontSize="small">add_icon</Add>
                  </Button>,
                  <Checkbox
                    checked={node.checked}
                    onClick={() => this.handleSelect(node, path)}
                  />
                ]
              })}
              isVirtualized={false}
            />
          ) : (
            ""
          )}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    initialTree: state.category.categoryTree
  };
};

export default connect(
  mapStateToProps,
  actions
)(ACategories);
