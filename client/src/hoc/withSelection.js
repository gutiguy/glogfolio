import React, { Component } from "react";

export default function withSelection(selectName = "selected") {
  return function(WrappedComponent) {
    return class WithSelection extends Component {
      constructor(props) {
        super(props);
        this.state = {
          [selectName]: []
        };
      }

      handleSelect = ({ id }) => {
        let newSelected = [...this.state[selectName]];
        var index = newSelected.indexOf(id);
        if (index !== -1) newSelected.splice(index, 1);
        else {
          newSelected.push(id);
        }
        this.setState({ [selectName]: newSelected });
      };

      flushSelected = () => {
        this.setState({ [selectName]: [] });
      };

      render() {
        return (
          <WrappedComponent
            {...{
              [selectName]: this.state[selectName],
              handleSelection: this.handleSelect,
              flushSelected: this.flushSelected,
              ...this.props
            }}
          />
        );
      }
    };
  };
}
