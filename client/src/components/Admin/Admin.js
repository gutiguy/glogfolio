import React, { Component } from "react";
import { connect } from "react-redux";
import Login from "./Login";
import Dashboard from "./Dashboard";
import * as actions from "../../actions/adminActions";
import axios from "axios";

class Admin extends Component {
  componentDidMount() {
    this.props.verifyAdmin();
  }

  handleLogin = async (username, password) => {
    await axios.post("/api/login", {
      username: username,
      password: password
    });
    this.props.verifyAdmin();
  };

  render() {
    let whatToRender =
      this.props.isVerified === true ? (
        <Dashboard />
      ) : (
        <Login handleLogin={this.handleLogin} />
      );
    return <div>{whatToRender}</div>;
  }
}

const mapStateToProps = state => {
  return {
    isVerified: state.admin.isVerified
  };
};

export default connect(
  mapStateToProps,
  actions
)(Admin);
