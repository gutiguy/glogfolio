import React from "react";
import Button from "@material-ui/core/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";

export default function(props) {
  const { title, text, status, onDismiss } = props;
  return (
    <Dialog open={status !== null}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDismiss} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
