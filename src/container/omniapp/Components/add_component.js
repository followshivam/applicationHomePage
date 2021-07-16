import React, { useState, useEffect } from "react";
import {
  //Dialog,
  DialogTitle,
  makeStyles,
  DialogContent,
  useTranslation,
  //StyledTab as StyledTabs,
  DialogActions,
  Button,
  // InputBox,
  //Grid,
  // SelectBox,
  Divider,
  Typography,
  TableComponent,
  //IconsButton
} from "component";
import { InputBox, SelectBox } from "component/Form";
import Pagination from "@material-ui/lab/Pagination";
import { useSelector } from "react-redux";
import AdvanceCombo from "component/GenericComponet/AdvanceCombo";
import {
  ActComp,
  GetCompDetails,
  GetCompList,
} from "global/omniapp/api/ApiMethods";
import { useRef } from "react";

const useStyle = makeStyles((theme) => ({
  contentRoot: {
    // padding: theme.spacing(1, 2, 0, 2)
    width: "678px",
    minHeight: "380px",
    maxHeight: "380px",
    overflow: "auto",
  },
  selectBox: {
    width: "100%",
    marginLeft: "1.9rem",
  },
  content_space: {
    margin: "14px 0px",
  },

  header: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tableCellComponent: {
    minWidth: "140px",
  },
  spacing: {
    padding: theme.spacing(1.5, 2.5, 1.25, 1),
    backgroundColor: "#F5F5F5",
    alignItems: "stretch",
    borderTop: "1px solid #e0e0e0",
  },
  title: {
    margin: ".75rem 0",
    fontWeight: 600,
    color: "#656565",
    fontSize: "12px",
  },
}));

const TableCellComponent = (props) => {
  const { res, handleInputsListChange } = props;
  const classes = useStyle();
  if (res.options) {
    return (
      <SelectBox
        onChangeHandler={(event) => handleInputsListChange(event, res)}
        value={res.value}
        name="default"
        className={classes.tableCellComponent}
        list={res.options.map((option) => ({
          label: option.display_name,
          value: option.value,
        }))}
        form={true}
        label=""
      />
    );
  } else {
    return (
      <InputBox
        onChangeHandler={(event) => handleInputsListChange(event, res)}
        name="default"
        form={true}
        label=""
        value={res.value}
        className={classes.tableCellComponent}
      />
    );
  }
};

const InputsComponent = (props) => {
  const classes = useStyle();
  const { handleCheckbox, inputsList, t, handleInputsListChange } = props;
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
  };

  useEffect(() => {
    if (inputsList) {
      setRows(
        inputsList.map((input) => {
          let type;
          switch (input.type) {
            case 1:
              type = `${t("omniapp:NUMBER")}`;
              break;
            case 2:
              type = `${t("omniapp:STRING")}`;
              break;
            case 3:
              type = `${t("omniapp:FLOAT")}`;
              break;
            case 4:
              type = `${t("omniapp:DATE")}`;
              break;
            default:
              type = input.type;
              break;
          }

          return { ...input, type: type };
        })
      );
    }
  }, [inputsList]);
  const tableHeader = (handleInputsListChange) => {
    return [
      { id: "name", label: `${t("omniapp:NAME")}`, disablePadding: true },
      { id: "type", label: `${t("omniapp:TYPE")}`, disablePadding: true },
      {
        id: "",
        label: `${t("omniapp:DEFAULT_VALUE")}`,
        component: (res) => {
          return (
            <TableCellComponent
              res={res}
              handleInputsListChange={handleInputsListChange}
            />
          );
        },
      },
      {
        id: "description",
        label: `${t("omniapp:DESCRIPTION")}`,
        disablePadding: true,
      },
    ];
  };

  return (
    <div>
      <Typography className={classes.title}>{t("omniapp:INPUTS")}</Typography>
      <div style={{ border: "1px solid #F5F5F5" }}>
        <TableComponent
          headerColor="#fff"
          loading={false}
          minWidth="600px"
          direction={`${t("bam:HTML_DIR")}`}
          //dynamicHeight="180px"
          tableData={rows.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
          )}
          dynamicHeight="fit-content"
          disableFirstCell={true}
          headerData={tableHeader(handleInputsListChange)}
          onChangeCheckbox={handleCheckbox}
        />
      </div>
      {inputsList.length > 0 ? (
        <Pagination
          component="div"
          count={
            Number.isInteger(rows.length / rowsPerPage)
              ? rows.length / rowsPerPage
              : Math.trunc(rows.length / rowsPerPage) + 1
          }
          page={page + 1}
          onChange={handleChangePage}
          color="primary"
          classes={{ root: classes.paginationRootItem }}
          className={classes.ul}
          style={{ float: "right", padding: "20px 0px" }}
        />
      ) : null}
    </div>
  );
};

const AddComponent = (props) => {
  const {
    appName,
    currentEdit = undefined,
    onSuccessCallback,
    modalType,
  } = props;
  const [globalSetting] = useSelector((state) => {
    return [state.globalSettings];
  });
  const snackbarStore = useSelector((state) => {
    return state.snackbarState;
  });
  const normalDialogStore = useSelector((state) => state.normalDialogState);
  const { t } = useTranslation(
    globalSetting.locale_module
      ? globalSetting.locale_module
      : ["bam", "omniapp"]
  );
  const [comp_ins_id, setComp_ins_id] = useState(
    currentEdit ? currentEdit.ins_id : undefined
  );
  const [editMode] = useState(currentEdit ? true : false);
  const [direction] = useState(`${t("bam:HTML_DIR")}`);
  const classes = useStyle({ direction });
  const ref = useRef(null);
  const [components, setComponents] = useState([]);
  const [formData, setFormData] = useState({
    app_name: "",
    app_code: "",
    app_id: "",
    comp_name: "",
    name: "",
    description: "",
    comp_id: "",
    inputsList: [],
  });
  const [initFormData] = useState({
    app_name: "",
    app_code: "",
    app_id: "",
    comp_name: "",
    name: "",
    description: "",
    comp_id: "",
    inputsList: [],
  });

  useEffect(() => {
    if (editMode) {
      const payload = {
        opr: "4",
        comp_ins_id: comp_ins_id,
      };
      ActComp(JSON.stringify(payload))
        .then((res) => {
          console.log(res);
          if (res != null && res.status.maincode === "0") {
            const instance = res.data.instance;
            setFormData({
              ...formData,
              name: instance.ins_name,
              description: instance.description,
              app_name: instance.app_name,
              inputsList: instance.inputs,
              comp_name: instance.comp_name,
              app_id: instance.app_id,
              comp_id: instance.comp_id,
            });
          } else if (res != null) {
            const errorMsg = res.status.errormsg
              ? res.status.errormsg
              : res.status.description;
            snackbarStore.openSnackbar(
              errorMsg
                ? errorMsg
                : "Something went wrong, Please contact Admin",
              "error",
              2000
            );
          }
        })
        .catch((err) => {
          console.log(err);
          snackbarStore.openSnackbar(
            "Something went wrong, Please contact Admin",
            "error",
            2000
          );
        });
    }
  }, [comp_ins_id]);

  useEffect(() => {
    // if (!editMode) {
    const payload = { app_code: appName };
    GetCompList(JSON.stringify(payload))
      .then((res) => {
        if (res != null && res.status.maincode === "0") {
          const data = res.data;
          let modifiedApps = [];
          const modifiedComponents = data.components.map((component) => {
            return { label: component.name, id: component.comp_id };
          });
          setComponents(modifiedComponents);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // }
  }, []);

  const handleClear = () => {
    setFormData({
      ...initFormData,
    });
  }
  const handleComponentChange = (item) => {
      const componentId = item.id;
      const payload = { comp_id: componentId };
      GetCompDetails(JSON.stringify(payload))
        .then((res) => {
          if (res != null && res.status.maincode === "0") {
            const data = res.data;
            const inputsList = data.component.inputs;
            const modifiedInputsList = inputsList.map((input) => ({
              ...input,
              value: input.default_value,
            }));
            setFormData({
              ...formData,
              comp_id: data.component.comp_id,
              name: data.component.name,
              description: data.component.description,
              inputsList: modifiedInputsList,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const handleChange = (event) => {
    const name = event.target.name;
    setFormData({
      ...formData,
      [name]: event.target.value,
    });
  };

  const handleInputsListChange = (event, res) => {
    const updatedInputsList = [];
    let updatedInput = {};
    formData.inputsList.forEach((input) => {
      if (input.id === res.id) {
        updatedInput = { ...input, value: event.target.value };
      } else {
        updatedInput = input;
      }
      updatedInputsList.push(updatedInput);
    });
    setFormData({
      ...formData,
      inputsList: updatedInputsList,
    });
  };

  const handleSubmit = () => {
    let payload = {};
    if (editMode && comp_ins_id) {
      payload = {
        opr: "2",
        comp_ins_id: comp_ins_id,
        inputs: formData.inputsList,
      };
    } else if (!(comp_ins_id && editMode)) {
      payload = {
        opr: "1",
        ins_name: formData.name,
        description: formData.description,
        comp_id: formData.comp_id,
        inputs: formData.inputsList,
      };
    }
    ActComp(JSON.stringify(payload))
      .then((res) => {
        console.log(res);
        if (res != null && res.status.maincode === "0") {
          const description = res.status.description;
          snackbarStore.openSnackbar(description, "success", 2000);
          onSuccessCallback();
          normalDialogStore.closeDialog();
        } else if (res != null) {
          const errorMsg = res.status.errormsg
            ? res.status.errormsg
            : res.status.description;
          snackbarStore.openSnackbar(
            errorMsg ? errorMsg : "Something went wrong, Please contact Admin",
            "error",
            2000
          );
        }
      })
      .catch((err) => {
        console.log(err);
        snackbarStore.openSnackbar(
          "Something went wrong, Please contact Admin",
          "error",
          2000
        );
      });
  };

  return (
    <div style={{ minWidth: "40rem" }} dir={direction}>
      <DialogTitle>
        <div className={classes.header}>
          <div className={classes.headerTitle}>
            <Typography variant="h6">
              <strong>
                {modalType === "EDIT"
                  ? `${t("omniapp:EDIT_COMPONENT")} (${currentEdit.name})`
                  : t("omniapp:CREATE_COMPONENT")}
              </strong>
            </Typography>
          </div>
        </div>
      </DialogTitle>
      <DialogContent
        classes={{ root: classes.contentRoot }}
        style={{ padding: "0px 20px" }}
      >
        <Typography className={classes.title}>{`${t(
          "omniapp:BASIC_DETAILS"
        )}`}</Typography>

        <AdvanceCombo
          ref={ref}
          direction={direction}
          value={formData.comp_name}
          style={{ width: "100%" }}
          items={components}
          onSelectHandler={handleComponentChange}
          onClearHandler={handleClear}
          labelData={{
            label: `${t("omniapp:COMPONENT_TYPE")}`,
            minWidth: "133px",
            maxWidth: "133px",
            fontSize: "12px",
            fontWeight: "normal",
            fontColor: "#000",
          }}
        />
        {/* <div className={classes.content_space}>
          <InputBox
            onChangeHandler={handleComponentChange}
            onClick={handleComponentClick}
            className={classes.inputBox}
            value={formData.comp_id}
            injectLiveValue={true}
            label={t("omniapp:COMPONENT_TYPE")}
            form={false}
            labelMaxWidth="133px"
            labelMinWidth="133px"
            fontColor="#000000"
            style={{ width: "100%" }}
            type="text"
            name="comp_id"
            required={true}
            endAdornment={
              <InputAdornment position="end" style={{ marginLeft: "4px" }}>
                 <div style={{width: '20px', height: '27px', padding: '1.5px', border: '1px solid #e0e0e0'}}>
                     <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/Down.svg`}
                        height={5}/>
                </div>
              </InputAdornment>
            }
          />
        </div> */}
        <div className={classes.content_space}>
          <InputBox
            onChangeHandler={handleChange}
            className={classes.inputBox}
            value={formData.name}
            disabled={!formData.comp_id | editMode}
            injectLiveValue={true}
            label={t("omniapp:COMPONENT_NAME")}
            form={false}
            labelMaxWidth="133px"
            labelMinWidth="133px"
            fontColor="#000000"
            fontWeight="normal"
            fontSize="12px"
            style={{ width: "100%" }}
            type="text"
            name="name"
            direction={direction}
          />
        </div>

        <InputBox
          onChangeHandler={handleChange}
          className={classes.multiLineInputBox}
          value={formData.description}
          label={t("omniapp:DESCRIPTION")}
          form={false}
          disabled={!formData.comp_id | editMode}
          injectLiveValue={true}
          alignItems={"baseline"}
          labelMaxWidth="133px"
          labelMinWidth="133px"
          fontColor="#000000"
          fontWeight="normal"
          fontSize="12px"
          style={{ width: "100%", paddingTop: "0px" }}
          type="text"
          rows={2}
          multiline
          name="description"
          direction={direction}
        />
        <Divider style={{ marginTop: "3px", backgroundColor: "#e4e4e4" }} />

        <InputsComponent
          inputsList={formData.inputsList}
          t={t}
          handleInputsListChange={handleInputsListChange}
        />
      </DialogContent>
      <DialogActions className={classes.spacing}>
        <Button
          style={{ marginLeft: direction === "rtl" ? "8px" : 0 }}
          onClick={() => normalDialogStore.closeDialog()}
          variant="outlined"
        >
          {t("omniapp:LABEL_CANCEL")}{" "}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          style={{ width: "60px", whiteSpace: "nowrap" }}
        >
          {`${t("omniapp:SAVE")}`}
        </Button>
      </DialogActions>
    </div>
  );
};

export default AddComponent;
