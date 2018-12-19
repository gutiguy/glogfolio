import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";

import { SortableContainer, SortableElement } from "react-sortable-hoc";

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14,
    whiteSpace: "normal",
    wordWrap: "break-word"
  }
}))(TableCell);

const styles = theme => ({
  table: {
    overflow: "scroll"
  },
  row: {
    backgroundColor: theme.palette.background.default
  },

  metadata: {
    textTransform: "uppercase"
  },

  drag: {
    cursor: "move"
  }
});

const SortableTable = SortableContainer(TableBody);
const SortableTableRow = SortableElement(TableRow);

const ATable = props => {
  const { rows, onSortEnd, tableFields, classes } = props;

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          {tableFields.map(data => {
            return (
              <CustomTableCell className={classes.metadata} key={data}>
                {data}
              </CustomTableCell>
            );
          })}
        </TableRow>
      </TableHead>
      <SortableTable onSortEnd={onSortEnd} useDragHandle={true}>
        {rows.map((row, index) => {
          return (
            <SortableTableRow className={classes.row} key={index} index={index}>
              {tableFields.map(data => {
                return (
                  <CustomTableCell className={classes.metadata} key={data}>
                    {row[data]}
                  </CustomTableCell>
                );
              })}
            </SortableTableRow>
          );
        })}
      </SortableTable>
    </Table>
  );
};

ATable.propTypes = {
  tableFields: PropTypes.array,
  onSortEnd: PropTypes.func,
  rows: PropTypes.array
};

ATable.defaultProps = {
  rows: [],
  tableFields: []
};

export default withStyles(styles)(ATable);
