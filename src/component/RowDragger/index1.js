import React, { Component } from "react";

import { SortableContainer, SortableElement } from "react-sortable-hoc";

import arrayMove from "array-move";

import { Typography, makeStyles, IconsButton, Toolbar } from "component";
const useStyles = makeStyles(theme => ({
  dragger_toolbar: {
    "& > *": {
      marginRight: theme.spacing(10)
      //  marginLeft:theme.spacing(10)
    }
  },
  sortingrow:{
            backgroundColor: theme.palette.common.white,
        height: "29px",
        margin: "8px 16px 8px 16px"
  }
}));
const SortableItem = SortableElement(({ value,...rest }) => {
  const classes = useStyles();
  return (
    <div
    className={classes.sortingrow}
    >
      <Toolbar variant="dense" className={classes.dragger_toolbar}>
        <IconsButton type="DragIndicatorIcon" />
        <Typography>Field Name {value}</Typography>
        <Typography>Type</Typography>
        <Typography>Alias</Typography>
      </Toolbar>
    </div>
  );
});

const SortableList = SortableContainer(({ items }) => {
  return (
    <div style={{ marginTop: "16px" }}>
      {items.map((value, index) => (
        <SortableItem key={`item-${value}`} index={index} value={value} />
      ))}
    </div>
  );
});

const RowDragger = props => {
  const [items, setItems] = React.useState(props.items);
  const onSortEnd = ({ oldIndex, newIndex }) => {
    props.onChange(arrayMove(items, oldIndex, newIndex));
    // setItems(arrayMove(items, oldIndex, newIndex))
    // console.log(arrayMove(items, oldIndex, newIndex))
    // this.setState(({items}) => ({
    //   items: arrayMove(items, oldIndex, newIndex),
    // }));
  };
  return <SortableList items={props.items} onSortEnd={onSortEnd} {...props} />;
};

export default RowDragger;
