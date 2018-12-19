import React, { Component } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { connect } from "react-redux";
import * as actions from "../../actions/categoryActions";

import SortableTree, { changeNodeAtPath } from "react-sortable-tree";
import "react-sortable-tree/style.css";

class CheckboxTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tree: this.props.initialTree,
      initialCategories: this.props.initialCategories
    };
  }

  onSelect = (node, path) => {
    let newTree = changeNodeAtPath({
      treeData: this.state.tree,
      path,
      newNode: { ...node, checked: !node.checked },
      getNodeKey: ({ node }) => node.id
    });
    this.setState({ tree: newTree });
    this.props.onSelect(node.id);
  };

  render() {
    return (
      <SortableTree
        getNodeKey={({ node }) => node.id}
        treeData={this.state.tree}
        onChange={treeData => this.setState({ tree: treeData })}
        generateNodeProps={({ node, path }) => {
          return {
            title: node.name,
            subtitle: node.description,
            buttons: [
              <Checkbox
                checked={
                  !node.checked !==
                  !(
                    this.state.initialCategories &&
                    this.state.initialCategories.indexOf(node.id) !== -1
                  )
                }
                onClick={() => this.onSelect(node, path)}
              />
            ]
          };
        }}
        isVirtualized={false}
        canDrag={false}
      />
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
)(CheckboxTree);
