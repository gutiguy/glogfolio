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
import withLoading from "../../hoc/withLoading";

const styles = theme => ({
  root: {
    width: theme.desktopWidth,
    margin: "0 auto",
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
        link: "/"
      },
      {
        order: 2,
        title: "PORTFOLIO",
        link: "/portfolio"
      },
      {
        order: 3,
        title: "BLOG",
        link: "/blog"
      }
    ]
  };

  componentDidMount() {
    this.props.verifyAdmin();
  }

  handleClickAway = () => {
    this.setState({ menuOpen: false });
  };

  handleLogOut = async () => {
    const res = await axios.post("/api/logout");
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
        link: "/admin"
      });
      newNavigationOptions.push({
        title: "LOGOUT",
        link: "/",
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
            variant="headline"
            color="inherit"
            className={this.props.classes.flex}
          >
            Guthred's Art Blog
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
    isVerified: state.admin.isVerified
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
    }),
    withLoading
  )(Header)
);
