import React from "react";
import { ButtonBase, withStyles, Typography } from "@material-ui/core";
import OutlineHoverButton from "./OutlineHoverButton";

const styles = {
  root: {
    margin: "0.4rem"
  }
};

const ThemeHoverButton = props => {
  return (
    <ButtonBase className={props.classes.root}>
      <Typography variant="h6" color="inherit">
        <OutlineHoverButton {...props} />
      </Typography>
    </ButtonBase>
  );
};

export default withStyles(styles)(ThemeHoverButton);
