import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { Hidden, Backdrop } from "@material-ui/core";
import VerticalMenu from "../VerticalMenu/VerticalMenu";
import HorizontalNavigation from "../HorizontalNavigation/HorizontalNavigation";
import { Transition } from "react-transition-group";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { FETCH_NAVIGATIONS_FOR_INTERFACE } from "../../graphql/navigation";
import { graphql } from "react-apollo";
import * as actions from "../../actions/adminActions";
import config, { backendUrl } from "../../config.js";

const styles = theme => ({
  root: {
    padding: "0.5rem",
    width: theme.desktopWidth,
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      width: theme.smallDeviceWidth
    }
  },
  flex: {
    flex: 1
  },
  backdropTop: {
    zIndex: 1
  },
  centerDocument: {
    margin: 0,
    position: "fixed",
    top: "50%",
    left: "50%",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
});

class Header extends React.Component {
  state = {
    menuOpen: false,
    navigationOptions: [
      {
        order: 1,
        title: "HOME",
        link: ""
      },
      {
        order: 2,
        title: "PORTFOLIO",
        link: "portfolio"
      },
      {
        order: 3,
        title: "BLOG",
        link: "blog"
      }
    ]
  };

  handleClickAway = () => {
    this.setState({ menuOpen: false });
  };

  handleLogOut = async () => {
    const res = await axios.post(backendUrl + "/api/logout");
    if (res) {
      this.props.verifyAdmin();
    } else {
      console.log("Something went terribly wrong!");
    }
  };

  render() {
    let verticalMenu;
    let dynamicNavigations = this.props.navigations.map(navigation => {
      let link;
      if (navigation.page) {
        link = navigation.page.perma;
      } else {
        link = navigation.link;
      }
      return { title: navigation.name, link };
    });
    let newNavigationOptions = [
      ...this.state.navigationOptions,
      ...dynamicNavigations
    ];
    if (this.props.isVerified) {
      newNavigationOptions.push({
        title: "DASHBOARD",
        link: "admin"
      });
      newNavigationOptions.push({
        title: "LOGOUT",
        link: "",
        onClick: this.handleLogOut
      });
    }
    this.state.menuOpen === true
      ? (verticalMenu = (
          <VerticalMenu
            handleClickAway={() => this.handleClickAway}
            className={this.props.classes.centerDocument}
            navigationOptions={newNavigationOptions}
          />
        ))
      : (verticalMenu = "");
    return (
      <AppBar position="static">
        <Toolbar className={this.props.classes.root}>
          <Hidden mdUp>
            <IconButton
              color="inherit"
              aria-label="Menu"
              onClick={() => this.setState({ menuOpen: true })}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Typography
            variant="h2"
            color="inherit"
            className={this.props.classes.flex}
          >
            {config.siteTitle || "Site Title Goes Here"}
          </Typography>
          <Hidden smDown>
            <HorizontalNavigation options={newNavigationOptions} />
          </Hidden>
          <Transition timeout={300} in={this.state.menuOpen}>
            {state => {
              if (state === "entering" || state === "entered")
                return (
                  <div>
                    <Backdrop
                      open={this.state.menuOpen}
                      className={
                        this.state.menuOpen === true
                          ? this.props.classes.backdropTop
                          : ""
                      }
                    />
                    {verticalMenu}
                  </div>
                );
              else return null;
            }}
          </Transition>
        </Toolbar>
      </AppBar>
    );
  }
}

Header.defaultProps = {
  navigations: []
};

const mapStateToProps = state => {
  return {
    isVerified: state.admin.username != null
  };
};

export default withRouter(
  compose(
    withStyles(styles),
    connect(
      mapStateToProps,
      actions
    ),
    graphql(FETCH_NAVIGATIONS_FOR_INTERFACE, {
      props: ({ data: { loading, navigations } }) => ({
        isLoading: loading,
        navigations
      })
    })
  )(Header)
);
