import React, { Component } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

class SelectTree extends Component {
  state = {
    selects: [],
    name: "",
    parent: ""
  };

  // _getBranchPath(index) {
  //   const { tree } = this.props;
  //   tree[index].children.forEach;
  // }
  _addSelectBranch(index) {}

  _generateSelects(id) {}

  handleChange = index => event => {
    const { tree } = this.props;
    let newSelects = this.state.selects;

    if (
      typeof tree[event.target.value].children === "object" &&
      !(event.target.value in this.state.selects)
    ) {
      console.log(tree[event.target.value]);
      newSelects[event.target.value] = "none";
    }
    this.setState({
      [event.target.name]: event.target.value,
      selects: newSelects
    });
  };

  render() {
    const { tree, treeBase } = this.props;
    const { selects } = this.state;
    let baseSelect = treeBase.map(optionId => {
      return (
        <MenuItem value={optionId} key={optionId}>
          {tree[optionId].name}
        </MenuItem>
      );
    });
    const selectsArray = selects.map((select, index) => {
      // Variable to collect groupless children
      let groupLessChildren = [];

      // Generate Selects from Children:

      let selectChildren = tree[index].children.reduce((result, optionId) => {
        if (tree[optionId].group_name !== "") {
          result.push(
            <MenuItem value={optionId} key={optionId}>
              {tree[optionId].name}
            </MenuItem>
          );
        } else {
          groupLessChildren.push(optionId);
        }
        return result;
      }, []);

      return (
        <React.Fragment>
          {selectChildren}
          <FormControl key={index}>
            <InputLabel htmlFor="parent-id">Deeper:</InputLabel>
            <Select
              value="blat"
              onChange={this.handleChange}
              inputProps={{
                name: "parent" + index,
                id: "parent-" + index
              }}
            >
              {groupLessChildren.map(child => {
                return <MenuItem value={child}>{tree[child].name}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </React.Fragment>
      );
    });
    return (
      <React.Fragment>
        <FormControl>
          <InputLabel htmlFor="parent-id">Parent</InputLabel>
          <Select
            value={this.state.parent}
            onChange={this.handleChange}
            inputProps={{
              name: "parent",
              id: "parent-id"
            }}
          >
            <MenuItem value="">None</MenuItem>
            {baseSelect}
          </Select>
        </FormControl>
        {selectsArray}
      </React.Fragment>
    );
  }
}
export default SelectTree;
