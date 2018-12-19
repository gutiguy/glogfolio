import React from "react";
import { ButtonBase, withStyles, Typography } from "@material-ui/core";
import OutlineHoverButton from "./OutlineHoverButton";

const styles = {
  root: {
    margin: "0.5rem"
  }
};

const ThemeHoverButton = props => {
  return (
    <Typography color="inherit">
      <ButtonBase className={props.classes.root}>
        <OutlineHoverButton {...props} />
      </ButtonBase>
    </Typography>
  );
};

export default withStyles(styles)(ThemeHoverButton);
