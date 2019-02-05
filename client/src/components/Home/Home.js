import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InformationCarousel from "./InformationCarousel/InformationCarousel";
import config from "../../config.js";
const { homepageParagraphs } = config;

function Home() {
  return (
    <Grid container spacing={24}>
      <Grid item xs={12}>
        <InformationCarousel />
      </Grid>
      {homepageParagraphs.map((paragraph, index) => (
        <Grid item xs={12} sm={12 / homepageParagraphs.length} key={index}>
          <Typography variant="h6" paragraph color="textSecondary">
            {paragraph.title}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {paragraph.content}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
}

export default Home;
