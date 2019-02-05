import React from "react";
import { withStyles, Typography } from "@material-ui/core";
import OutlineHoverButton from "./OutlineHoverButton";

const styles = {
  root: {
    margin: "0.4rem"
  }
};

const ThemeHoverButton = props => {
  return (
    <div className={props.classes.root}>
      <Typography variant="h6" color="inherit">
        <OutlineHoverButton {...props} />
      </Typography>
    </div>
  );
};

export default withStyles(styles)(ThemeHoverButton);
