import React, { Component } from "react";
import { Paper, Tab, Tabs, Typography } from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import APortfolio from "./APortfolio";
import ALists from "./ALists";
import ACategories from "./ACategories";
import ACarousel from "./ACarousel";
import APages from "./APages";
import ANavigation from "./ANavigation";
import ABlog from "./ABlog";
import LoginDetailsForm from "./LoginDetailsForm/LoginDetailsForm";

function TabContainer({ children }) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

class Dashboard extends Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    return (
      <div>
        <Paper>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
          >
            <Tab label="Artworks" />
            <Tab label="Art Categories" />
            <Tab label="Blog" />
            <Tab label="Static Pages" />
            <Tab label="Lists" />
            <Tab label="Navigation" />
            <Tab label="Carousel" />
            <Tab label="Site Meta" />
          </Tabs>
          <SwipeableViews
            index={this.state.value}
            onChangeIndex={this.handleChangeIndex}
          >
            <TabContainer>
              <APortfolio />
            </TabContainer>
            <TabContainer>
              <ACategories />
            </TabContainer>
            <TabContainer>
              <ABlog />
            </TabContainer>
            <TabContainer>
              <APages />
            </TabContainer>
            <TabContainer>
              <ALists />
            </TabContainer>
            <TabContainer>
              <ANavigation />
            </TabContainer>
            <TabContainer>
              <ACarousel />
            </TabContainer>
            <TabContainer>
              <LoginDetailsForm />
            </TabContainer>
          </SwipeableViews>
        </Paper>
      </div>
    );
  }
}

export default Dashboard;
