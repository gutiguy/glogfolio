import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Edit from "@material-ui/icons/Edit";
import Reorder from "@material-ui/icons/Reorder";
import React from "react";
import { SortableHandle } from "react-sortable-hoc";

const DragHandle = SortableHandle(() => <Reorder>reorder_icon</Reorder>);

function injectButtons({ rows, handleEdit, handleSelection }) {
  if (!rows) {
    return [];
  }
  return rows.map(row => ({
    ...row,
    drag: <DragHandle />,
    select: (
      <Checkbox
        key={row.id}
        onClick={function() {
          handleSelection(row);
        }}
      />
    ),
    edit: (
      <Button
        onClick={function() {
          handleEdit(row);
        }}
      >
        <Edit>edit_icon</Edit>{" "}
      </Button>
    )
  }));
}

export { injectButtons };
