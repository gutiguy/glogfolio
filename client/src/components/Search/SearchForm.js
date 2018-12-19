import React from "react";
import { ClickAwayListener } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import { TextField, Button, Grid } from "@material-ui/core";
import CenterToViewport from "../UI/CenterToViewport/CenterToViewport";

const CustomOption = styled.option`
  background-color: #7f7f7f;
`;

const styles = theme => ({
  flex: {
    flex: 1
  },
  root: {
    zIndex: 1, // Make sure it covers everything including the appBar
    width: "45vw",
    [theme.breakpoints.down("md")]: {
      width: "80vw"
    },
    height: "25vh",
    fontSize: "3rem"
  },

  cssInput: {
    color: "#fff",
    fontSize: "1.5rem",
    borderBottomColor: "#cecece !important"
  },
  cssSelectInput: {
    color: "#fff",
    fontSize: "1.2rem",
    borderBottomColor: "#cecece !important",
    backgroundColor: "transparent !important"
  },
  cssLabel: {
    color: "#cecece !important",
    fontSize: "1.3rem"
  },
  cssFocused: {},
  cssUnderline: {
    borderBottomColor: "#cecece!",
    color: "#fff",
    "&:after": {
      borderBottomColor: "#fff"
    }
  },
  cssSelectMenu: {
    backgroundColor: "#000",
    option: {
      backgroundColor: "#000"
    }
  },
  menu: {
    color: "#000",
    backgroundColor: "#fff",
    option: {
      backgroundColor: "#000"
    }
  }
});

class SearchForm extends React.Component {
  state = {
    category: "Everywhere"
  };

  render() {
    let props = this.props;
    let classes = props.classes;
    return (
      <ClickAwayListener onClickAway={props.handleClickAway()}>
        <CenterToViewport className={props.classes.root}>
          <TextField
            autoFocus
            InputProps={{
              classes: {
                root: classes.cssInput,
                underline: classes.cssUnderline
              }
            }}
            InputLabelProps={{
              classes: {
                root: classes.cssLabel,
                shrink: classes.cssLabel,
                animated: classes.cssLabel,
                formControl: classes.cssLabel,
                marginDense: classes.cssLabel
              },
              FormControlClasses: {
                shrinked: classes.cssLabel
              }
            }}
            label="Input Keywords To Search"
            id="custom-css-input"
            fullWidth
          />
          <Grid container alignItems="flex-end">
            <Grid item className={classes.flex}>
              <TextField
                id="select-category"
                select
                label="Search in:"
                InputProps={{
                  name: "category",
                  classes: {
                    root: classes.cssSelectInput
                  }
                }}
                InputLabelProps={{
                  classes: {
                    root: classes.cssLabel,
                    shrink: classes.cssLabel,
                    animated: classes.cssLabel,
                    formControl: classes.cssLabel,
                    marginDense: classes.cssLabel
                  }
                }}
                SelectProps={{
                  native: true,
                  MenuProps: {
                    className: classes.menu
                  }
                }}
                margin="normal"
              >
                <CustomOption>Everywhere</CustomOption>
                <CustomOption>Blog</CustomOption>
                <CustomOption>Portfolio</CustomOption>
              </TextField>
            </Grid>
            <Grid item>
              <Button color="inherit" size="large" type="submit">
                Search
              </Button>
            </Grid>
          </Grid>
        </CenterToViewport>
      </ClickAwayListener>
    );
  }
}

export default withStyles(styles)(SearchForm);
