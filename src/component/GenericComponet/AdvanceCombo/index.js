import React, { useState ,useEffect, useRef , forwardRef } from "react";
import {
  makeStyles,
  List,
  ListItem,
  ListItemText,
  fade,
  Grid,
  InputLabel,
  Typography,
  IconImage,
} from "component";
import InputBase from "@material-ui/core/InputBase";
import { Tooltip } from "@material-ui/core";
import { validateRegex } from "global/validator";

const useStyle = makeStyles((theme) => {
  return {
    searchBox: (props) => {
      return {
        position: "relative",
        marginLeft: 0,
        display: "flex",
        width: "100%",
        backgroundColor: theme.palette.common.white,
        direction: props.direction,
        border: `1px solid ${theme.palette.borderColor}`,
        borderRadius: "2px",
        transition: theme.transitions.create(["border-color", "box-shadow"]),
        "&:focus": {
          boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
          borderColor: theme.palette.primary.main,
        },
      };
    },
    input: {
      position: "relative",
      fontSize: 11,
      color: "#606060",
      padding: "6px 4px",
      width: (props) => props.width,
      height: (props) => props.height,
    },
    dropdownIcon: {
      position: "absolute",
      right: (props) => (props.direction === "rtl" ? "none" : "12px"),
      left: (props) => (props.direction === "ltr" ? "none" : "12px"),
      height: "100%",
      display: "grid",
      placeItems: "center",
      cursor: "pointer",
    },
    cancelIcon: {
      position: "absolute",
      top: "50%",
      right: (props) => (props.direction === "rtl" ? "none" : "37px"),
      left: (props) => (props.direction === "ltr" ? "none" : "37px"),
      transform: "translateY(-50%)",
      display: "grid",
      placeItems: "center",
      cursor: "pointer",
    },
    comboDiv: {
      position: "absolute",
      display: "flex",
      direction: (props) => props.direction,
      right: (props) => (props.direction === "ltr" ? "0px" : "none"),
      left: (props) => (props.direction === "rtl" ? "0px" : "none"),
      top: "25px",
      zIndex: 999,
      maxHeight: "160px",
      width: "100%",
      boxShadow: "0px 3px 6px #00000029",
      background: "#FFFFFF 0% 0% no-repeat padding-box",
      padding: "3px",
    },
    listItem: {
      textAlign: (props) => (props.direction === "ltr" ? "left" : "right"),
    },
    input_label: (props) => {
      return {
        ...theme.typography.input_label,
        minWidth:
          props.labelData.minWidth !== null
            ? props.labelData.minWidth
            : "133px",
        maxWidth:
          props.labelData.maxWidth !== null
            ? props.labelData.maxWidth
            : "133px",
        fontSize:
          props.labelData.fontSize !== null ? props.labelData.fontSize : "12px",
        fontWeight:
          props.labelData.fontWeight !== null
            ? props.labelData.fontWeight
            : "normal",
        color:
          props.labelData.fontColor !== null
            ? props.labelData.fontColor
            : "#000",
      };
    },
    input_label_root: { display: "contents" },
    required_field: {
      color: "red",
    },
    container: (props) => {
      return {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        direction: props.direction,
        width: "100%",
      };
    },
  };
});

const AdvanceCombo = forwardRef((props, ref) => {
  const {
    name = "advance_search",
    width = "100%",
    height = "24px",
    onSelectHandler = null,
    onClearHandler = null,
    regex = null,
    items = [],
    direction = "ltr",
    value = null,
    required = false,
    disabled = false,
    info = false,
    infoText = null,
    labelData = null,
  } = props;
  const [showList, setShowList] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef(null);

  const classes = useStyle({ direction, width, height, labelData });

  const onChangeHandler = (e) => {
    let isRegexPassed =
      regex !== null ? validateRegex(e.target.value, regex) : true; // to test the regex with the typed value
    if (isRegexPassed || e.target.value.length === 0)
      setSearchValue(e.target.value);
  };

  const cancelHandler = () => {
    setSearchValue("");
    if (onClearHandler != null) onClearHandler();
    inputRef.current.focus();
    setShowList(true);
  };

  const onSelectHandlerWrapper = (item) => {
    setSearchValue(item.label);
    if (onSelectHandler != null) onSelectHandler(item);

    setShowList(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (showList && ref.current && !ref.current.contains(event.target)) {
        setShowList(false);
        const item = items.find((element) => {
          return element.label.toLowerCase() === searchValue.toLowerCase();
        });
        if (typeof item != "undefined" && onSelectHandler != null) {
          setSearchValue(item.label);
          onSelectHandler(item);
        } else {
          setSearchValue("");
          if (onClearHandler != null) onClearHandler();
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div className={classes.container} ref={ref}>
      {labelData != null && (
        <InputLabel
          shrink
          className={["fieldlabel", classes.input_label].join(" ")}
          classes={{ root: classes.input_label_root }}
        >
          <Typography
            noWrap={true}
            variant="div"
            className={classes.input_label}
          >
            {labelData.label}
            {required && <span className={classes.required_field}>*</span>}
            {info ? (
              <Tooltip title={infoText != null ? infoText : ""}>
                <IconImage
                  style={{
                    margin: direction === "ltr" ? "0 0 0 5px" : "0 5px 0 0",
                  }}
                  height={12}
                  width={12}
                  url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/info_icon.svg`}
                />
              </Tooltip>
            ) : null}
          </Typography>
        </InputLabel>
      )}
      <div className={classes.searchBox} id="advSearchBoxId">
        <InputBase
          name={name}
          id="searchBoxInput"
          autoComplete="off"
          className={classes.input}
          onClick={() => setShowList(true)}
          value={value !== "" ? value : searchValue}
          onChange={onChangeHandler}
          inputRef={inputRef}
        />
        {searchValue !== "" && (
          <div className={classes.cancelIcon} onClick={cancelHandler}>
            <img
              src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/close.png`}
              alt="close"
              width="16px"
              height="16px"
            />
          </div>
        )}
        <div
          className={classes.dropdownIcon}
          onClick={() => setShowList(!showList)}
        >
          <img
            src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/down_arrow.png`}
            alt="dropdown"
            width="14px"
            height="8px"
          />
        </div>

        {showList && items.length > 0 && (
          <div className={classes.comboDiv} id="advanceComboDiv">
            <Grid direction="column" container wrap="nowrap">
              <Grid item style={{ height: "100%" }}>
                  <List
                    component="div"
                    style={{ height: "100%", overflow: "auto" }}
                  >
                    {items.map(
                      (item) =>
                        searchValue != null &&
                        item.label
                          .toLowerCase()
                          .startsWith(searchValue.toLowerCase()) && (
                          <ListItem
                            button
                            key={item.id}
                            className={classes.listItem}
                            style={{ padding: "2px 9px" }}
                            onClick={(event) => {
                              onSelectHandlerWrapper(item);
                            }}
                          >
                            <ListItemText
                              primary={item.label}
                              primaryTypographyProps={{
                                variant: "body2",
                                style: {
                                  fontSize: "12px",
                                  padding: "0px",
                                  color: "black",
                                },
                              }}
                            />
                          </ListItem>
                        )
                    )}
                  </List>
              </Grid>
            </Grid>
          </div>
        )}
      </div>
    </div>
  );
});
export default AdvanceCombo;
