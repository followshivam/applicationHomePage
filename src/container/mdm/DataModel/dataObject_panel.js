import React from "react";
import {
  makeStyles,
  List,
  Dropdown,
  Typography,
  IconImage,
} from "component";
import { ListItemComponent } from "component/List";

const useStyles = makeStyles((theme) => ({
  dataModelActions: {
    display: "flex",
    justifyContent: "space-between",
    direction: (props) => props.direction,
  },
  listItem: {
    padding: "3px 10px 2px",
  },
  headTitle: {
    color: "#000000",
    fontSize: "14px",
    fontWeight: 600,
    paddingLeft: (props) => (props.direction === "ltr" ? "6px" : "null"),
    paddingRight: (props) => (props.direction === "rtl" ? "6px" : "null"),
  },
}));

export const HoverComponent = (props) => {
  const { direction, t } = props;
  const classes = useStyles({ direction });
  return (
    <div style={{ direction: direction, display: "flex"}}>
      <Dropdown
        image_url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/more_actions.png`}
        height={20}
        width={20}
        list={[
          {
            id: 1,
            value: "Modify",
            label: `${t("mdm:MODIFY")}`,
            labelFontSize: "12px",
            startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/edit.png`,
            iconHeight: "16px",
            iconWidth: "16px",
            className: `${classes.listItem}`,
          },
          {
            id: 2,
            value: "View ER Diagram",
            label: `${t("mdm:VIEW_ER_DIAGRAM")}`,
            labelFontSize: "12px",
            startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/ER_diagram.png`,
            iconHeight: "16px",
            iconWidth: "16px",
            className: `${classes.listItem}`,
          },
          {
            id: 3,
            value: "Download data",
            label: `${t("mdm:DOWNLOAD_DATA")}`,
            labelFontSize: "12px",
            startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/download.svg`,
            iconHeight: "16px",
            iconWidth: "16px",
            className: `${classes.listItem}`,
          },
          {
            id: 4,
            value: "Export Definition",
            label: `${t("mdm:EXPORT_DEFINITION")}`,
            labelFontSize: "12px",
            startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/download.svg`,
            iconHeight: "16px",
            iconWidth: "16px",
            className: `${classes.listItem}`,
          },
          {
            id: 5,
            value: "Audit History",
            label: `${t("mdm:AUDIT_HISTORY")}`,
            labelFontSize: "12px",
            startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/audit.svg`,
            iconHeight: "16px",
            iconWidth: "16px",
            className: `${classes.listItem}`,
          },
          {
            id: 6,
            value: "Delete",
            label: `${t("mdm:DELETE")}`,
            labelFontSize: "12px",
            startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/delete.png`,
            iconHeight: "16px",
            iconWidth: "16px",
            className: `${classes.listItem}`,
            labelColor: "red"
          },
        ]}
      />
    </div>
  );
};

const DataObjectPanel = (props) => {
  const {
    t,
    direction = "ltr",
    dataObjectList = [],
    selectedCategory = "",
    backClickHandler = null,
    openDataObjectPopup = null,
    dataObjectClickHandler = null
  } = props;
  const classes = useStyles({ direction });
  return (
    <>
      <div className={classes.dataModelActions}>
        <div style={{ display: "flex" }}>
          <IconImage
            url={`icons/back.png`}
            width={16}
            height={16}
            onClick={() => backClickHandler()}
          />
          <Typography className={classes.headTitle}>
            {selectedCategory.name}
          </Typography>
        </div>
        <Dropdown
          image_url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/add.png`}
          height={16}
          width={16}
          list={[
            {
              id: 1,
              value: "Create",
              label: `${t("mdm:CREATE_DATA_OBJECT")}`,
              labelFontSize: "12px",
              startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/create_data_obj.png`,
              iconHeight: "16px",
              iconWidth: "16px",
              className: `${classes.listItem}`,
              action: () => openDataObjectPopup()
            },
            {
              id: 2,
              value: "Import",
              label: `${t("mdm:IMPORT_DATA_OBJECT")}`,
              labelFontSize: "12px",
              startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/import_data_obj.png`,
              iconHeight: "16px",
              iconWidth: "16px",
              className: `${classes.listItem}`,
            },
          ]}
        />
      </div>
      <div style={{ width: "100%", marginTop: "10px" }}>
        <List component="div" style={{ height: "100%", overflow: "auto" }}>
          {dataObjectList &&
            dataObjectList.map((item, index) => (
              <ListItemComponent
                data={item}
                name={item.name}
                id={item.id}
                key={index}
                icon_url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/data_object.svg`}
                direction={direction}
                height="32px"
                enableHover={true}
                onClickHandler={dataObjectClickHandler}
                countColor="#7c7c7c"
                HoverComponent={<HoverComponent direction={direction} t={t}/>}
              />
            ))}
        </List>
      </div>
    </>
  );
};

export default DataObjectPanel;
