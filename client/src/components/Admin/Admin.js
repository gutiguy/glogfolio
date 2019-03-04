import React, { Component } from "react";
import { connect } from "react-redux";
import Login from "./Login";
import Dashboard from "./Dashboard";
import * as actions from "../../actions/adminActions";
import axios from "axios";
import CustomDialog from "./CustomDialog";

const { REACT_APP_BACKEND_URL } = process.env;

class Admin extends Component {
  state = {
    loginRequestStatus: null
  };

  handleLogin = async (username, password) => {
    try {
      await axios.post(REACT_APP_BACKEND_URL + "/api/login", {
        username: username,
        password: password
      });
      this.props.verifyAdmin();
    } catch (e) {
      this.setState({ loginRequestStatus: e.response.status });
    }
  };

  initState = () => {
    this.setState({ loginRequestStatus: null });
  };

  render() {
    const { loginRequestStatus } = this.state;

    if (this.props.isVerified === true) return <Dashboard />;
    else {
      let displayDialog = null;

      if (loginRequestStatus === 401) {
        displayDialog = (
          <CustomDialog
            status={loginRequestStatus}
            title="Failed to login"
            text="One or more of the supplied fields was wrong."
            onDismiss={this.initState}
          />
        );
      } else if (loginRequestStatus === 501) {
        displayDialog = (
          <CustomDialog
            status={loginRequestStatus}
            title="Server Unreachable"
            text="The request was unable to reach the server. If the problem persists please contact your system administrator."
            onDismiss={this.initState}
          />
        );
      }

      return (
        <React.Fragment>
          {displayDialog} <Login handleLogin={this.handleLogin} />
        </React.Fragment>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    isVerified: state.admin.username != null
  };
};

export default connect(
  mapStateToProps,
  actions
)(Admin);
