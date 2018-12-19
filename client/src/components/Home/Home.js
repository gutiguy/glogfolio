import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InformationCarousel from "./InformationCarousel/InformationCarousel";

const Home = props => {
  return (
    <Grid container spacing={24}>
      <Grid item xs={12}>
        <InformationCarousel />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="title" paragraph color="textSecondary">
          A Few Words of Introduction
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="title" color="textSecondary" paragraph>
          General Inquiry
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Feel free to contact me at MalgrimArt@gmail.com for inquiries about
          BLA BLA BLA BLA BLA
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Home;
