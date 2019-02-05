import React from "react";
import { Grid, Typography } from "@material-ui/core";
import InformationCarousel from "./InformationCarousel/InformationCarousel";
import config from "../../config.js";
import PaddedPaper from "../PaddedPaper/PaddedPaper";
const { homepageParagraphs } = config;

function Home() {
  return (
    <Grid container spacing={24}>
      <Grid item xs={12}>
        <InformationCarousel />
      </Grid>
      {homepageParagraphs.map((paragraph, index) => (
        <Grid item xs={12} sm={12 / homepageParagraphs.length} key={index}>
          <PaddedPaper elevation={2}>
            <Typography variant="h4" paragraph color="textSecondary">
              {paragraph.title}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {paragraph.content}
            </Typography>
          </PaddedPaper>
        </Grid>
      ))}
    </Grid>
  );
}

export default Home;
