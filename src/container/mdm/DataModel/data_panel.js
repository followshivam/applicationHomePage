import React, { useState } from "react";
import { makeStyles, Typography,} from "component";
import NotFound from "../../../component/GenericComponet/NotFound";
import DataObjectView from "./dataObject_view";

const useStyles = makeStyles((theme) => ({
  rightPannel: {
    width: "100%",
  },
  descList:{
    direction:(props)=> props.direction,
    textAlign:(props)=> (props.direction === "ltr" ? "left" : "right"),
    fontSize:"12px",
    marginTop:"4px",
    paddingLeft:(props)=> (props.direction === "ltr" ? "20px" : ""),
    paddingRight:(props)=> (props.direction === "rtl" ? "20px" : ""),
    color: "#3A3A3A"
  }
}));

const SearchDescription = React.memo((props) => {
  const { t, direction = "ltr" } = props;
  const classes = useStyles({direction});
  const list = [
    `${t("mdm:SEARCH_DESC1")}`,
    `${t("mdm:SEARCH_DESC2")}`,
    `${t("mdm:SEARCH_DESC3")}`,
    `${t("mdm:SEARCH_DESC4")}`,
  ];
  return (
    <div style={{display:"inline-block",direction:direction}}>
      <Typography
        noWrap={false}
        style={{
          maxWidth: "710px",
          fontSize: "12px",
          marginTop: "20px",
          fontWeight: "600",
          color: "#3A3A3A"
        }}
      >
        {t("mdm:SEARCH_DESC_HEADING")}
      </Typography>
      <ul className={classes.descList}>
        {list.map((listitem,index) => (
          <li key={index} style={{margin:"4px"}}>{listitem}</li>
        ))}
      </ul>
    </div>
  );
});

const DataPanel = React.memo((props) => {
  const { t, opr = "C0", selDataObject = null } = props;
  const [direction] = useState(`${t("mdm:HTML_DIR")}`);
  const classes = useStyles();

  const getTitle = (val) => {
    switch (val) {
      case "C0":
        return `${t("mdm:ADD_CATEGORY")}`;
      case "C1":
        return `${t("mdm:SELECT_CATEGORY_TO_VIEW_DATA_OBJECTS")}`;
      case "D0":
        return `${t("mdm:ADD_DATA_OBJECT")}`;
      case "D1":
        return `${t("mdm:SELECT_DATA_OBJECT")}`;
      case "S1":
        return `${t("mdm:SELECT_CATEGORY_DATA_OBJECT")}`;
      case "P0":
        return `${t("mdm:ADD_PROJECT")}`;
      case "P1":
        return `${t("mdm:SELECT_PROJECT_TO_VIEW_LIST_OF_PROCESSES")}`;
      case "P2":
        return `${t("mdm:SELECT_PROCESS_TO_VIEW_DATA_OBJECTS")}`;
      case "A1":
        return `${t("mdm:SELECT_PROJECT_TO_VIEW_LIST_OF_APPLICATIONS")}`;
      case "A2":
        return `${t("mdm:SELECT_APPLICATION_TO_VIEW_DATA_OBJECTS")}`;
      default:
        return `${t("mdm:ADD_CATEGORY")}`;
    }
  };

  const getMessage = (val) => {
    switch (val) {
      case "C0":
        return `${t("mdm:CATEGORY_DESCRIPTION")}`;
      case "C1":
        return `${t("mdm:CATEGORY_DESCRIPTION")}`;
      case "D0":
        return `${t("mdm:DATA_OBJECT_DESCRIPTION")}`;
      case "D1":
        return `${t("mdm:DATA_OBJECT_DESCRIPTION")}`;
      case "S1":
        return `${t("mdm:SEARCH_DESCRIPTION")}`;
      case "P0":
        return `${t("mdm:PROJECT_DESCRIPTION")}`;
      case "P1":
        return `${t("mdm:PROJECT_DESCRIPTION")}`;
      case "P2":
        return `${t("mdm:PROCESS_DESCRIPTION")}`;
      case "A1":
        return `${t("mdm:PROJECT_DESCRIPTION")}`;
      case "A2":
        return `${t("mdm:APPLICATION_DESCRIPTION")}`;
      default:
        return `${t("mdm:CATEGORY_DESCRIPTION")}`;
    }
  };

  const getActions = (val) => {
    switch (val) {
      case "C0":
        return [
          {
            id: 1,
            label: `${t("mdm:CREATE_CATEGORY")}`,
            type: "submit",
            variant: "contained",
            color: "primary",
            action: props.openCategoryPopup,
            iconurl: `${process.env.REACT_APP_CONTEXT_PATH}/icons/white_plus.svg`,
          },
        ];
      case "D0":
        return [
          {
            id: 1,
            label: `${t("mdm:IMPORT_DATA_OBJECT")}`,
            type: "button",
            variant: "outlined",
            color: "primary",
            action: null,
            iconurl: `${process.env.REACT_APP_CONTEXT_PATH}/icons/import.svg`,
            backgroundColor: "white",
          },
          {
            id: 2,
            label: `${t("mdm:CREATE_DATA_OBJECT")}`,
            type: "submit",
            variant: "contained",
            color: "primary",
            action: props.openDataObjectPopup,
            iconurl: `${process.env.REACT_APP_CONTEXT_PATH}/icons/white_plus.svg`,
          },
        ];
      case "P0":
        return [
          {
            id: 1,
            label: `${t("mdm:CREATE_PROJECT")}`,
            type: "submit",
            variant: "contained",
            color: "primary",
            action: props.openCategoryPopup,
            iconurl: `${process.env.REACT_APP_CONTEXT_PATH}/icons/white_plus.svg`,
          },
        ];
      default:
        return "";
    }
  };

  return (
    <div className={classes.rightPannel}>
      {selDataObject == null ? (
        <NotFound
          direction={`${t("mdm:HTML_DIR")}`}
          iconSize={"120px"}
          title={getTitle(opr)}
          message={getMessage(opr)}
          messageFontSize="12px"
          iconUrl={`${process.env.REACT_APP_CONTEXT_PATH}/icons/no_component_preview.svg`}
          actionButtons={getActions(opr)}
          descComponent={opr==="S1" && <SearchDescription t={t} direction={direction} />}
        />
      ) : (
        <DataObjectView
          selDataObject={selDataObject}
          t={t}
          direction={direction}
        />
      )}
    </div>
  );
});

export default DataPanel;
