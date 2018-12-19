import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Grid, Divider, IconButton } from "@material-ui/core";
import { Facebook, Email, Instagram, Twitter, Youtube } from "mdi-material-ui";
import FooterList from "./FooterList";

// API
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";

import withLoading from "../../hoc/withLoading";

const FETCH_LISTS = gql`
  {
    listTypes {
      name
      id
      lists {
        id
        name
        link
      }
    }
  }
`;

const styles = theme => ({
  footerContainer: {
    backgroundColor: theme.palette.primary.dark,
    color: "#fff",
    textAlign: "center",
    padding: "25px"
  },
  copyright: {
    paddingTop: "25px",
    paddingBottom: "0",
    borderTop: "1px solid " + theme.palette.primary.main
  },
  footerContent: {
    width: theme.desktopWidth,
    margin: "0 auto"
  },
  DividerBorder: {
    borderLeft: "1px solid " + theme.palette.primary.main,
    [theme.breakpoints.down("md")]: {
      borderLeft: "none",
      borderTop: "1px solid " + theme.palette.primary.main
    }
  },
  rightSection: {
    paddingLeft: "15px",
    textAlign: "left",
    [theme.breakpoints.down("md")]: {
      paddingLeft: "none",
      textAlign: "center"
    }
  }
});

class Footer extends Component {
  render() {
    const { classes, listTypes } = this.props;
    const lists = listTypes.map(type => {
      return type ? (
        <Grid item xs={12} sm={4} key={type.id}>
          <FooterList type={type} />
        </Grid>
      ) : (
        "Loading"
      );
    });

    return (
      <div className={classes.footerContainer}>
        <div className={classes.footerContent}>
          <Grid
            container
            justify="space-around"
            spacing={24}
            style={{ textAlign: "center" }}
          >
            {lists}
            <Grid item xs={12} sm={4} className={classes.DividerBorder}>
              <Grid
                container
                alignItems="flex-start"
                className={classes.rightSection}
              >
                <Grid item xs={12}>
                  <Typography variant="headline" color="inherit" paragraph>
                    Contact me:
                  </Typography>
                  <Typography variant="subheading" color="inherit" paragraph>
                    <span style={{ verticalAlign: "center" }}>
                      <IconButton color="inherit">
                        <Email />
                      </IconButton>{" "}
                      MalgrimArt@gmail.com
                    </span>
                  </Typography>
                </Grid>
                <Divider light />
                <Grid item xs={12}>
                  <Typography variant="headline" color="inherit" paragraph>
                    Follow me:
                  </Typography>
                  <Typography variant="subheading" color="inherit" paragraph>
                    <IconButton color="inherit">
                      <Facebook />
                    </IconButton>
                    <IconButton color="inherit">
                      <Instagram />
                    </IconButton>
                    <IconButton color="inherit">
                      <Twitter />
                    </IconButton>
                    <IconButton color="inherit">
                      <Youtube />
                    </IconButton>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} />
          </Grid>
          <Typography color="inherit" className={classes.copyright}>
            Copyright ©My Art Website Template 2018 All Rights Reserved{" "}
          </Typography>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(FETCH_LISTS, {
    props: ({ data: { listTypes, loading } }) => ({
      listTypes,
      isLoading: loading
    })
  }),
  withLoading,
  withStyles(styles)
)(Footer);
