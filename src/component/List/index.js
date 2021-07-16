import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import { Dropdown, makeStyles, Spinner, useTranslation } from "component";
import { useState } from "react";
import AddEditAppplicationModal from "container/omniapp/applications/AddEditAppplicationModal";
import { Suspense } from "react";
import { useSelector } from "react-redux";

const useStyle = makeStyles((theme) => ({
  root: {
    margin: "3px 0px",
  },
  listItem: {
    backgroundColor: "white",
    padding: "0px",
    direction: (props) => props.direction,
  },
  divider: {
    width: "95%",
    margin: "0px auto",
    border: "none",
    borderTop: "0.5px solid rgba(0,0,0,0.12)",
  },
  subHeader: {
    fontWeight: 800,
    backgroundColor: "#e6f2f547",
    margin: "0px 3px",
    position: "relative",
    padding: "0px 5px",
    lineHeight: "30px",
    fontSize: "12px",
  },
  activeClass: {
    fontWeight: 800,
  },
  secondaryItem: {
    right: (props) => (props.direction === "ltr" ? 0 : "auto"),
    left: (props) => (props.direction === "rtl" ? 0 : "auto"),
    fontSize: "0.75rem",
  },
  listDiv: {
    width: "100%",
    padding: (props) => (props.direction === "ltr" ? "0 7px 0 0" : "0 0 0 7px"),
    maxHeight: `calc( ( 100vh - 200px ))`,
    overflow: "scroll",
    "&::-webkit-scrollbar": {
      width: "0.250em",
    },
  },
}));

const ListComponent = (props) => {
  const {
    data = [],
    scrollHandler,
    entry,
    icon_url,
    direction = "ltr",
  } = props;
  const classes = useStyle({ direction });

  return (
    <div className={classes.listDiv}>
      {data &&
        data.map((res, index) => (
          <List
            classes={{ root: classes.root }}
            key={index}
            subheader={
              <ListSubheader classes={{ root: classes.subHeader }}>
                {res.key}
              </ListSubheader>
            }
          >
            <div
              style={
                {
                  // maxHeight: `calc( ( 100vh - 250px ) / ${data.length} )`,
                  // overflow: "scroll"
                }
              }
            >
              {res.list.map((item, index) => (
                <ListItemComponent
                  data={item}
                  entry={entry}
                  id={item.app_id}
                  scrollHandler={() => scrollHandler(item.app_id)}
                  {...item}
                  key={item.name}
                  divider={index !== 0}
                  secondary_name={item.app_context}
                  icon_url={icon_url}
                  direction={direction}
                  enableHover={true}
                  HoverComponent={<DropDownOnHover data={item}/>}
                />
              ))}
            </div>
          </List>
        ))}
    </div>
  );
};

const DropDownOnHover = (props) => {
  const {
    data = [],
  } = props;
  const normalDialogStore = useSelector((state) => {
    return state.normalDialogState;
  });
  const globalSettings = useSelector((store) => store.globalSettings);
  const { t } = useTranslation(
    globalSettings.locale_module
      ? globalSettings.locale_module
      : ["bam", "omniapp"]
  );
  const handleClose = () => {
    normalDialogStore.closeDialog();
  };
  return (
    <Dropdown
      image_url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/more.svg`}
      height={12}
      width={12}
      list={[
        {
          id: 1,
          value: "Modify",
          label: `${t("omniapp:MODIFY")}`,
          labelFontSize: "12px",
          action: () => {
            console.log("item", data);
            normalDialogStore.openDialog(
              <Suspense
                fallback={
                  <div style={{ height: "250px", minWidth: "600px" }}>
                    <Spinner msg="" />
                  </div>
                }
              >
                <AddEditAppplicationModal
                  modalType="EDIT"
                  data={data}
                  handleClose={handleClose}
                />
              </Suspense>
            );
          },
        },
      ]}
    />
  );
};

export const ListItemComponent = (props) => {
  const {
    name,
    count,
    divider = false,
    scrollHandler,
    data,
    id,
    secondary_name,
    direction,
    icon_url,
    height,
    onClickHandler = null,
    enableHover = false,
    HoverComponent = null,
    countColor = "#000"
  } = props;
  const classes = useStyle({ direction });
  const [hover, setHover] = useState(false);
  // const normalDialogStore = useSelector((state) => {
  //   return state.normalDialogState;
  // });
  // const handleClose = () => {
  //   normalDialogStore.closeDialog();
  // };

  // const globalSettings = useSelector((store) => store.globalSettings);
  // const { t } = useTranslation(
  //   globalSettings.locale_module
  //     ? globalSettings.locale_module
  //     : ["bam", "omniapp"]
  // );

  const onClickHandlerWrapper = (data) => {
    if (onClickHandler != null) onClickHandler(data);
  };

  return (
    <div id={`l_${id}`} style={{ height: height }}>
      {divider && <hr className={classes.divider} />}
      <ListItem
        classes={{ root: classes.listItem }}
        onClick={() => onClickHandlerWrapper(data)}
        onMouseEnter={() => (enableHover ? setHover(true) : null)}
        onMouseLeave={() => (enableHover ? setHover(false) : null)}
      >
        {icon_url !== "" && (
          <img
            src={`${icon_url}`}
            alt={""}
            width="16px"
            height="16px"
            style={{
              margin: 
              // secondary_name
              //   ? "0px 6px"
              //   : 
                direction === "ltr"
                ? "0px 6px 0px 0px"
                : "0px 0px 0px 6px",
              position: "relative",
              top: secondary_name ? "-9px" : "null",
            }}
          />
        )}
        <ListItemText
          primary={<span id={`lt_${id}`}>{name}</span>}
          secondary={
            secondary_name ? (
              <span style={{ fontSize: "12px" }} id={`ls_${id}`}>
                {secondary_name}
              </span>
            ) : null
          }
          onClick={scrollHandler}
          style={{
            cursor: "pointer",
            textAlign: direction === "ltr" ? "left" : "right",
          }}
        />
        {
          <ListItemSecondaryAction
            id={`la_${id}`}
            style={{ cursor: "pointer" }}
            classes={{ root: classes.secondaryItem }}
            onMouseEnter={() => (enableHover ? setHover(true) : null)}
            onMouseLeave={() => (enableHover ? setHover(false) : null)}
          >
            {!hover && <div style={{color: countColor}}>{+count <= 9 ? `0${count}` : count}</div>}
            {hover && enableHover && (
              <>{HoverComponent}</>
            )}
          </ListItemSecondaryAction>
        }
      </ListItem>
    </div>
  );
};

export default ListComponent;
