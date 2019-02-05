import React, { Component } from "react";
import { FETCH_POSTS_DATES } from "../../graphql/blog";
import { graphql } from "react-apollo";
import withLoading from "../../hoc/withLoading";
import {
  ListItemText,
  List,
  ListItem,
  Button,
  Collapse,
  Typography
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";

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
    const {
      data,
      selectedMonth,
      selectedYear,
      switchYear,
      switchMonth
    } = this.props;
    let dates = [];

    if (data.postDates) {
      dates = data.postDates;
    }

    const years = dates.reduce((accu, { year, month }) => {
      if (accu.has(year)) {
        let newMonths = accu.get(year);
        newMonths.push(month);
        accu.set(year, newMonths);
      } else {
        accu.set(year, [month]);
      }
      return accu;
    }, new Map());

    return (
      <React.Fragment>
        <Typography variant="subheading">Filter by Date</Typography>
        <List>
          {Array.from(years, ([year, months]) => (
            <React.Fragment key={year}>
              <ListItem button onClick={() => switchYear(year)}>
                <ListItemText primary={year} />
                {year === selectedYear ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={year === selectedYear} timeout="auto" unmountOnExit>
                {selectedYear === year
                  ? months.map(month => (
                      <Button
                        key={year + "/" + month}
                        onClick={() => switchMonth(month)}
                        variant={month === selectedMonth ? "contained" : "text"}
                      >
                        {this.months[month - 1]}
                      </Button>
                    ))
                  : null}
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </React.Fragment>
    );
  }
}

DatesPanel.defaultProps = {
  selectedDates: []
};

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
