import React, { Component } from "react";
import { Paper, TextField, Typography, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  flexCenter: {
    display: "flex",
    flexDirection: "column",
    width: "80%",
    padding: "50px",
    margin: "0 auto",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      padding: "15px"
    }
  },

  item: {
    marginBottom: "15px"
  },

  button: {
    width: "30%",
    alignSelf: "flex-end",
    [theme.breakpoints.down("md")]: {
      width: "100%"
    }
  }
});

class Login extends Component {
  state = {
    username: "",
    password: ""
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.flexCenter}>
        <Typography variant="h5" className={classes.item} color="textSecondary">
          Admin Login Form
        </Typography>
        <TextField
          id="username"
          name="username"
          label="Username:"
          className={classes.item}
          defaultValue={this.state.username}
          onChange={this.handleChange("username")}
        />
        <TextField
          id="password"
          name="password"
          label="Password:"
          type="password"
          className={classes.item}
          onChange={this.handleChange("password")}
          defaultValue={this.state.password}
        />
        <Button
          className={classes.button}
          onClick={() =>
            this.props.handleLogin(this.state.username, this.state.password)
          }
        >
          Log In
        </Button>
      </Paper>
    );
  }
}

export default withStyles(styles)(Login);
