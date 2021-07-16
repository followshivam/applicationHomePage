import React from "react";
import {
  makeStyles,
  Typography,
  Popover,
  List,
  ListItem,
  IconImage,
  ListItemText,
  ListItemSecondaryAction,
} from "component";
import ExpandMoreOutlinedIcon from "@material-ui/icons/ExpandMoreOutlined";

const useHeaderSelectStyles = makeStyles((theme) => ({
  headTitle: {
    color: "#000000",
    fontSize: "14px",
    fontWeight: 600,
    paddingRight: (props) => (props.direction === "ltr" ? "10px" : "null"),
    paddingLeft: (props) => (props.direction === "rtl" ? "10px" : "null"),
  },
  onRightHeadTitle: {
    color: "#000000",
    fontSize: "12px",
    fontWeight: 300,
    overflow: "hidden",
    textAlign: "initial",
    textOverflow: "ellipsis",
    width: "90%",
    whiteSpace: "nowrap",
  },
  root: {
    padding: theme.spacing(0, 1),
    cursor: "pointer",
    height: "28px",
    direction: (props) => props.direction,
  },
  secondaryAction: {
    right: (props) => (props.direction === "ltr" ? "10px" : "auto"),
    left: (props) => (props.direction === "rtl" ? "10px" : "auto"),
  },
  menuDiv: {
    width: (props) => props.width,
    minHeight: "30px",
    padding: "2px",
    borderRadius: "3px",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    maxHeight: "200px",
  },
  rightPopup: {
    padding: "0 2px",
    justifyContent: "space-between",
    height: "28px",
    border: "1px solid #D3D3D3",
    width: "94%",
    margin: "auto",
    borderRadius: "2px",
  },
  paper: {
    borderRadius: "3px",
  },
}));

const DropDownMenu = React.memo(function DropDownMenu(props) {
  const {
    itemList = [],
    active = "",
    onChangeHandler = null,
    placeholder = "Select",
    direction = "ltr",
    font = { fontSize: "0.75rem", fontWeight: "normal", fontColor: "#000" },
    width = "140px",
    openSideways = false,
  } = props;
  const classes = useHeaderSelectStyles({ direction, width });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const onClickListHandler = (item) => {
    if (item.id !== active.id) {
      onChangeHandler(item);
      setAnchorEl(null);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          ...props.style,
        }}
        className={openSideways ? classes.rightPopup : null}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <Typography
          style={props.typographyStyle}
          className={openSideways ? classes.onRightHeadTitle : classes.headTitle}
        >
          {active.name ? active.name : placeholder}
        </Typography>
        {/* <IconImage url={`icons/down_arrow.png`} width={14} height={8} /> */}
        <ExpandMoreOutlinedIcon
          style={{
            transform: openSideways
              ? direction === "ltr"
                ? "rotate(270deg)"
                : "rotate(90deg)"
              : "rotate(0deg)",
          }}
          fontSize="medium"
        />
      </div>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: openSideways ? "top" : "bottom",
          horizontal: openSideways && direction === "ltr" ? "right" : "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: openSideways && direction === "rtl" ? "right" : "left",
        }}
        style={{
          marginLeft: openSideways ? direction === "ltr" ? "0.8rem": "-0.8rem": 0,
          direction: direction,
        }}
        classes={{
          paper: classes.paper,
        }}
      >
        <div className={classes.menuDiv}>
          <List dense={true}>
            {itemList.map((item, index) => (
              <ListItem
                className={classes.root}
                key={index}
                selected={item.id === active.id}
                onClick={() => onClickListHandler(item)}
              >
                {item?.icon ? (
                  <IconImage
                    url={`icons/${item.icon}`}
                    width={16}
                    height={16}
                  />
                ) : null}
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    style: {
                      fontSize: font.fontSize,
                      fontWeight: font.fontWeight,
                      color: font.fontColor,
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    },
                  }}
                  style={{
                    marginLeft: direction === "ltr" ? "6px" : "null",
                    marginRight: direction === "rtl" ? "6px" : "null",
                    textAlign: direction === "ltr" ? "left" : "right",
                  }}
                />
                {item.id === active.id ? (
                  <ListItemSecondaryAction className={classes.secondaryAction}>
                    {item?.icon ? (
                      <IconImage
                        url={"icons/tick.svg"}
                        width={14}
                        height={14}
                      />
                    ) : null}
                  </ListItemSecondaryAction>
                ) : null}
              </ListItem>
            ))}
          </List>
        </div>
      </Popover>
    </div>
  );
});

export default DropDownMenu;
