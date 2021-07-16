import { Category } from "@material-ui/icons";
import { makeStyles, useTranslation } from "component";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import CategoryPanel from "./category_panel";
import { DataModelPopup } from "./DataModelPopup";
import DataPanel from "./data_panel";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    margin: "-10px",
  },
}));

const DataModel = (props) => {
  const classes = useStyles();
  const [modalType, setModalType] = useState("ADD");
  const [openCategory, setOpenCategory] = useState(false);
  const [openDataObject, setOpenDataObject] = useState(false);
  const [selDataObject, setSelDataObject] = useState(null);
  const [opr, setOpr] = useState("C0");
  const globalSettings = useSelector((store) => store.globalSettings);
  const { t } = useTranslation(
    globalSettings.locale_module
      ? globalSettings.locale_module
      : ["bam", "omniapp", "mdm"]
  );

  const closeCategoryPopup = () => {
    setOpenCategory(false);
  };

  const openCategoryPopup = (_) => {
    setOpenCategory(!openCategory);
  };

  const closeDataObjectPopup = () => {
    setOpenDataObject(false);
  };

  const openDataObjectPopup = (_) => {
    setOpenDataObject(!openDataObject);
  };

  const dataObjectClickHandler = (item) => {
    console.log(JSON.stringify(item));
    setSelDataObject(item);
  }

  const handleOpenCategory = (data) => {
    // C0 : add a Category
    // C1 : select a Category to view data objects
    // D0 : Add a data object
    // D1 : Select a data object
    // S1 : select a category/object to view further (search)
    // P0 : Add a Project
    // P1 : Select a project to view list of processes
    // P2 : Select a process to view data objects
    // A1 : Select a project to view list of Application/Surveys
    // A2 : Select an application to view data objects
    setOpr(data);
  }

  return (
    <div className={classes.root}>
      <CategoryPanel
        openCategoryPopup={openCategoryPopup}
        {...props}
        t={t}
        onSelectCategory={handleOpenCategory}
        openDataObjectPopup={openDataObjectPopup}
        dataObjectClickHandler={dataObjectClickHandler}
      />
      <DataPanel
        openCategoryPopup={openCategoryPopup}
        openDataObjectPopup={openDataObjectPopup}
        selDataObject={selDataObject}
        {...props}
        t={t}
        opr={opr}
      />
      {openCategory && (
        <DataModelPopup
          modalType={modalType}
          open={openCategory}
          setOpen={setOpenCategory}
          handleClose={closeCategoryPopup}
        />
      )}
      {openDataObject && (
        <DataModelPopup
          modalType={modalType}
          open={openDataObject}
          setOpen={setOpenDataObject}
          handleClose={closeDataObjectPopup}
        />
      )}
    </div>
  );
};

export default DataModel;
