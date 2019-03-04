import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Grid, Divider, IconButton } from "@material-ui/core";
import { Facebook, Email, Instagram, Twitter, Youtube } from "mdi-material-ui";
import FooterList from "./FooterList";

// API
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";

import config from "../../config.js";

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

function LinkIconPair(Icon, link) {
  if (link) {
    return (
      <IconButton color="inherit" href={link}>
        <Icon />
      </IconButton>
    );
  }
  return null;
}

class Footer extends Component {
  render() {
    const { classes, listTypes } = this.props;

    const lists = listTypes.map(type => (
      <Grid item xs={12} sm={4} key={type.id}>
        <FooterList type={type} />
      </Grid>
    ));

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
                {config.email !== "" ? (
                  <Grid item xs={12}>
                    <Typography variant="h5" color="inherit" paragraph>
                      Contact me:
                    </Typography>
                    <Typography variant="subtitle1" color="inherit" paragraph>
                      <span style={{ verticalAlign: "center" }}>
                        <IconButton color="inherit">
                          <Email />
                        </IconButton>{" "}
                        {config.email}
                      </span>
                    </Typography>
                  </Grid>
                ) : null}
                <Divider light />
                <Grid item xs={12}>
                  <Typography variant="h5" color="inherit" paragraph>
                    Follow me:
                  </Typography>
                  <Typography variant="subtitle1" color="inherit" paragraph>
                    {LinkIconPair(Facebook, config.socialMediaLinks.facebook)}
                    {LinkIconPair(Youtube, config.socialMediaLinks.youtube)}
                    {LinkIconPair(Instagram, config.socialMediaLinks.instagram)}
                    {LinkIconPair(Twitter, config.socialMediaLinks.twitter)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} />
          </Grid>
          <Typography color="inherit" className={classes.copyright}>
            Powered by Glogfolio
          </Typography>
        </div>
      </div>
    );
  }
}

Footer.defaultProps = {
  listTypes: []
};

export default compose(
  graphql(FETCH_LISTS, {
    props: ({ data: { listTypes, loading } }) => ({
      listTypes,
      isLoading: loading
    })
  }),
  withStyles(styles)
)(Footer);
