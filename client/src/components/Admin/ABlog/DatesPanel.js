import React, { Component } from "react";
import { FETCH_POSTS_DATES } from "../../../graphql/blog";
import { graphql } from "react-apollo";
import withLoading from "../../../hoc/withLoading";
import { ListItemText, List, ListItem } from "@material-ui/core";

class DatesPanel extends Component {
  months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  render() {
    const { data } = this.props;
    let dates = [];

    if (data.postDates) {
      dates = data.postDates;
    }

    const years = dates.reduce((accu, ele) => {
      if (accu[ele.year]) {
        accu[ele.year].push(ele.month);
      } else {
        accu[ele.year] = [];
        accu[ele.year].push(ele.month);
      }
      return accu;
    }, {});

    return (
      <List>
        {Object.keys(years).map(year => (
          <React.Fragment key={year}>
            <ListItem>
              <ListItemText primary={year} />
            </ListItem>
            <List>
              {years[year].map(month => (
                <ListItem key={year + " " + month}>
                  <ListItemText primary={this.months[month - 1]} />
                </ListItem>
              ))}
            </List>
          </React.Fragment>
        ))}
      </List>
    );
  }
}

export default graphql(
  FETCH_POSTS_DATES,
  {
    props: ({ data }) => ({
      isLoading: data.loading,
      data
    })
  },
  withLoading
)(DatesPanel);
