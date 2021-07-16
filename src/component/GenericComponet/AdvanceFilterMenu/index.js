import React, { useState } from "react";
import { Tooltip } from "@material-ui/core";

import {
  Typography,
  makeStyles,
  List,
  ListItem,
  ListItemText,
} from "component";

const useStyle = makeStyles((theme) => {
  return {
    container: {
      border: "1px solid #c4c4c4",
      borderRadius: "2px",
      position: "relative",
      direction: (props) => props.direction,
      display: "flex",
      flexDirection: "row",
      height: (props) => props.height,
      alignItems: (props) => (props.alignItems ? props.alignItems : "center"),
    },
    input_label: (props) => {
      return {
        ...theme.typography.input_label,
        fontSize: props.font.fontSize,
        fontWeight: props.font.fontWeight,
        marginLeft: props.direction === "ltr" ? "6px" : "null",
        marginRight: props.direction === "rtl" ? "6px" : "null",
        color: "#606060",
        lineHeight: 2.1876,
      };
    },
    selectedValue: (props) => {
      return {
        fontSize: props.font.fontSize,
        fontWeight: props.font.fontWeight,
        color: props.font.fontColor,
        lineHeight: 2.1876,
        marginLeft: props.direction === "ltr" ? "2px" : "none",
        marginRight: props.direction === "rtl" ? "2px" : "none",
      };
    },
    dropdownIcon: {
      position: "absolute",
      right: (props) => (props.direction === "rtl" ? "none" : "6px"),
      left: (props) => (props.direction === "ltr" ? "none" : "6px"),
      height: "100%",
      display: "grid",
      placeItems: "center",
      cursor: "pointer",
    },
    comboDiv: {
      position: "absolute",
      direction: (props) => props.direction,
      left: (props) => (props.direction === "ltr" ? "0px" : "none"),
      right: (props) => (props.direction === "rtl" ? "0px" : "none"),
      top: "28px",
      zIndex: 999,
      maxHeight: "160px",
      width: "100%",
      boxShadow: "0px 3px 6px #00000029",
      borderRadius: "3px",
      background: "#FFFFFF 0% 0% no-repeat padding-box",
      padding: "3px",
    },
    listItem: {
      textAlign: (props) => (props.direction === "ltr" ? "left" : "right"),
    },
  };
});

const AdvanceFilterMenu = (props) => {
  const {
    value = 0,
    itemList = [],
    onSelectHandler = null,
    alignItems = "center",
    height = "28px",
    iconRequired = true,
    direction = "ltr",
    preText = null,
    font = { fontSize: "12px" , fontWeight : "normal" , fontColor: "#000"},
    ...rest
  } = props;
  const classes = useStyle({
    alignItems,
    direction,
    height,
    font
  });
  const [selectedValue, setSelectedValue] = React.useState(itemList[value].label);
  const [showList, setShowList] = useState(false);

  const onSelectHandlerWrapper = (item) => {
    setSelectedValue(item.label);
    if (onSelectHandler != null) onSelectHandler(item);
    setShowList(false);
  };

  return (
    <div className={classes.container} {...rest}>
      <div
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={() => setShowList(!showList)}
      >
        {iconRequired && (
          <img
            style={{
              margin: direction === "ltr" ? "0 0 0 6px" : "0 6px 0 0",
              verticalAlign: "middle",
            }}
            src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/sort.png`}
            width="16px"
            height="16px"
            alt="sort"
          />
        )}
        {preText != null && (
          <Typography
            className={classes.input_label}
            style={{ color: "#606060" }}
          >
            {preText}
          </Typography>
        )}
        <div style={{ maxWidth: preText != null ? "8.125rem" : "9.375rem" }}>
          <Tooltip title={selectedValue}>
            <Typography className={classes.selectedValue} noWrap>
              {selectedValue}
            </Typography>
          </Tooltip>
        </div>
        <div className={classes.dropdownIcon}>
          <img
            src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/down_arrow.png`}
            alt="dropdown"
            width="14px"
            height="8px"
          />
        </div>
      </div>
      {showList && itemList.length > 0 && (
        <div className={classes.comboDiv}>
          <List component="div" style={{ height: "100%", overflow: "auto" }}>
            {itemList.map((item, index) => (
              <ListItem
                button
                key={index}
                className={classes.listItem}
                style={{ padding: "4px 7px" }}
                onClick={() => {
                  onSelectHandlerWrapper(item);
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    variant: "body2",
                    style: {
                      fontSize: font.fontSize,
                      padding: "0px",
                      color: font.fontColor,
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </div>
  );
};

export default AdvanceFilterMenu;
