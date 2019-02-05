import styled from "styled-components";
import { withTheme } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React from "react";
import { Button, Typography } from "@material-ui/core";

import Delete from "@material-ui/icons/Delete";
import Add from "@material-ui/icons/Add";

const BarContainer = styled.div`
  background-color: ${props => props.theme.palette.primary.light};
  height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
  justify-content: space-between;
`;

function AToolbar(props) {
  let barElements = [];
  if (props.numerator) {
    let label = "SELECTED";
    let number = 0;
    if (typeof props.numerator === "object") {
      label = props.numerator.label;
      number = props.numerator.number;
    } else {
      number = props.numerator;
    }
    barElements.push(
      <Typography variant="h6" key="adminToolbarSelected">
        {label + ": " + number}
      </Typography>
    );
  }
  if (props.onDelete) {
    barElements.push(
      <Button onClick={props.onDelete} key="adminToolbarDelete">
        <Delete />
      </Button>
    );
  }
  if (props.onAdd) {
    barElements.push(
      <Button onClick={props.onAdd} key="adminToolbarAdd">
        <Add />
      </Button>
    );
  }
  return (
    <BarContainer {...props}>
      {barElements}
      {props.children}
    </BarContainer>
  );
}

AToolbar.propTypes = {
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  numerator: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
};

export default withTheme()(AToolbar);
