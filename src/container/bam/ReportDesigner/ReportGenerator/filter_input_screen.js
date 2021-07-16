import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Button,
  DatePickers, PickList, PickListTable,
  Checkbox,
  Switch,
  InputBox, DialogActions, DialogTitle,
  IconsButton, Spinner, List, ListItem, ListItemSecondaryAction, ListItemText,
  IconImage,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  DialogContent,
  useTranslation
} from "component";
import { GetReportGenerateData, GetPicklistData, ActUserPref, GetUserPref } from "global/bam/api/ApiMethods";
import { ReportGenerateJson, PicklistInputJson } from "global/json";
import { useSelector } from "react-redux";
import { EmptyObject } from "global/methods";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 200,
    height: "270px",
    overflowY: "auto",
    // backgroundColor: theme.palette.background.paper,
  },
  popup: {
    height: 140,
    width: 270,
    '& .MuiFormGroup-root': {
      flexDirection: "row"
    },
    '& .MuiDialogTitle-root': {
      padding: 8,
      fontSize: 12
    },
    '& .MuiDialogContent-root': {
      padding: 8,
      overflowY:"hidden"
    }
  },
  wrapper: {
    maxWidth: 550,
    margin: "0 auto"
  },
  content: {
    height: '270px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '230px',
    fontSize: "12px",
    flexWrap: "wrap"

  },
  saveFilter: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#0072C6",
    cursor: "pointer"
  },

  innerWrapper: {
    margin: "0 auto",
    height: props => props.dynamicHeight,
    overflow: "auto"
  },
  rightWrapper: {
    width: "59.7%",
    height: "250px"
  },
  listWrapper: {
    height: "250px"
  },
  leftWrapper: {
    width: "40%",
    position: "relative",
    borderRight: `1px solid ${theme.palette.borderColor}`,
    overflow: "Hidden"
  },
  heading: {
    fontSize: "14px",
    textAlign: "left",
    padding: "10px 10px",
    borderBottom: "1px solid #E4E4E4",
    margin: "0",
    boxSizing: "borderBox"
  },
  FilterWrapper: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    // alignItems: "center",
    border: `1px solid ${theme.palette.borderColor}`,
    borderRadius: "2px",

  },
  rightSection: {
    height: 270,
    overflow: "visible",
    overflowY: "auto",
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  trash: {
    marginLeft: theme.spacing(1),
  },
  toogleWrapper: {
    position: "static",
    borderTop: `1px solid ${theme.palette.borderColor}`,
    padding: "8px 10px 8px 10px",
    dispaly: "flex",
    bottom: "0",
    left: "0",
    width: "100%",
  },
  h5: {
    margin: 0,
    padding: "10px 0px 10px 10px",
    borderBottom: `1px solid ${theme.palette.borderColor}`,
    marginBottom: "50px",
    position: "sticky",
    top: 0,
    left: 0,
    textAlign: "left"
  },
  h4: {
    fontSize: "14px",
    textAlign: "center", fontWeight: 400,
    marginBottom: "15px",
  },
  buttonWrapper: {
    borderTop: "1px solid #E4E4E4",
    padding: "8px 10px 8px 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  inputBoxWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItem: "center",
    borderBottom: `1px solid ${theme.palette.borderColor}`,
    margin: "0",
    padding: "7px 10px 8px 10px",
    boxSizing: "borderBox"
  },

  toggleDiv: {
    fontSize: "12px",
    paddingRight:"20px",
    fontWeight: "600",
    color: "#0072C6",
    whiteSpace: "nowrap"
  },

  button: {
    marginLeft: "8px",
    background: "#FF6600",
    color: "#fff",
    border: "1px solid transparent",
    borderRadius: "2px",
    "&:hover": {
      backgroundColor: "#FF6600"
    }
  },
  clearButton: {
    border: `1px solid ${theme.palette.borderColor}`,
    color: "#000",
    borderRadius: "2px",
  },

  pinWrapper: {
    display: "flex",
    padding: "8px 10px 8px 10px",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    whiteSpace: "nowrap"
  },
  elementStyleCommon: {
    width: '138px',
  },
  switchBtn: {
    marginLeft: "12px",
  }

}));

const CheckboxListSecondary = props => {

  const {
    filters = null, setIsLoading = null,
    isLoading = null, snackbarState = null,
    objectId = null, setObjectId = null,
    isAdmin = false, setRadioValue = null,
    setFilterName = null, reportId = null,
    setFormData = null, formData = null,
    clearInputHandler = null, setFilterList = null,
    filterList = null, t
  } = props;
  const classes = useStyles();
  const [updatedFilter, setUpdatedFilter] = React.useState(filters);

  const handlePin = (value) => {
    let ar = [];
    updatedFilter.map(item => {
      if (item.filter_name === value.filter_name && item.is_local === value.is_local) {
        ar.push({ ...item, pinned: !item?.pinned })
      } else {
        ar.push(item)
      }

    })
    setUpdatedFilter(ar)

    let newArr = [];
    if (value)
      for (var i in value?.report_input_fields) {
        newArr.push(value?.report_input_fields[i])
      }

    let payload = {
      "opr": 1,
      "report_id": reportId ? reportId : "",
      "report_instance_id": "",
      "object_id": value?.object_id,
      "dashboard_id": "",
      "tab_id": "",
      "object_type": "RCF",
      "filter_name": value?.filter_name,
      "pinned": value.pinned === false ? true : false,
      "is_local": value?.is_local,
      "report_input_fields": newArr ? newArr : []
    }
    ActUserPref(payload)
      .then(response => {
        if (response != null && response.status.maincode === "0") {
          setFilterList(ar);
        }

      }).catch(error => {
        console.error('Error:', error);
      });
  };

  const onDeleteHandler = (value) => {
    let data = {
      "opr": 2,
      "object_id": value?.object_id,
      "object_type": "RCF",
      "is_local": value?.is_local,
    }
    setIsLoading({ ...isLoading, loading: true, msg: "Deleting..." })

    ActUserPref(data)
      .then(res => {
        if (res != null && res.status.maincode === "0" && res.data != null) {
          snackbarState.openSnackbar(`${t('bam:REPORT_DELETED_SUCCESS')}`, "success");
          const index = filters.findIndex((i) => i.object_id === res?.data?.object_id);
          filters.splice(index, 1);
          setFilterList(updatedFilter);
          setIsLoading({ ...isLoading, loading: false, msg: `${t('bam:LOADING')}...` });
          if (objectId === res?.data?.object_id) {
            clearInputHandler();
          }
        }
        else {
          snackbarState.openSnackbar(res.status.errormsg ? res.status.errormsg : `${t('bam:WENT_WRONG_ERROR')}`, "warning");
          setIsLoading({ ...isLoading, loading: false, msg: `${t('bam:LOADING')}...` })
        }
      })
      .catch(err => {  setIsLoading({ ...isLoading, loading: false, msg: `${t('bam:LOADING')}...` })
    });
  }

  let radioVal = false;

  const showFilterOnRight = (e) => {
    let filterIndex = filters.findIndex((i) => i.filter_name === e.target.outerText);
    let data = filters[filterIndex].report_input_fields;
    let objId = filters[filterIndex].object_id;
    radioVal = filters[filterIndex].is_local;
    setObjectId(objId)
    setRadioValue(radioVal)
    let filterData = [...formData];
    for (let i in data) {
      for (let j = 0; j < filterData.length; j++) {
        if (data[i].display_name === filterData[j].display_name) {
          filterData[j].value = data[i].value;
        }
      }
    }
    setFilterName(e?.target?.outerText)
    setFormData(filterData);
  };
  return (
    <React.Fragment>
      { (updatedFilter != null && updatedFilter.length > 0) ?
        <List dense className={classes.root}>
          {updatedFilter.map((value) => {
            const labelId = `checkbox-list-secondary-label-${value}`;

            return (
              <ListItem key={value} button>
                <ListItemText id={labelId} primary={value?.filter_name} onClick={(e) => showFilterOnRight(e)} />
                <ListItemSecondaryAction>
                  <Checkbox
                    edge="end"
                    name='checkbox'
                    checked={value.pinned}
                    onChange={() => handlePin(value)}
                    inputProps={{ 'aria-labelledby': labelId }}
                    icon={<IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/pin_grey.svg`} width={16} height={16} />}
                    checkedIcon={<IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/pin.svg`} width={20} height={20} />}
                  />
                  <IconImage disabled={!isAdmin && radioVal === false} className={classes.trash} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/trash_2.svg`} height={12} onClick={() => onDeleteHandler(value)} />

                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List> : (<div className={classes.content}><span ><IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/no_filter.svg`} width={90} height={90} /></span>
          <div >{t('bam:NO_SAVED_FILTER_MESSAGE')}<span style={{ display: "block" }}>{t('bam:PLEASE_ADD_REPORTS')}</span></div>
        </div>)}
    </React.Fragment>

  );
}

const SavePopup = props => {
  const classes = useStyles();
  const { data, snackbarState = null, inputData = null,
    setInputData = null, isAdmin = null, setObjectId = null,
    getSavedFilter = null, t } = props;

  const [newData, setNewData] = useState({ ...inputData });

  const dialogState = useSelector(state => {
    return state.normalDialogState;
  })

  useEffect(() => {
    setInputData({ ...newData });
  }, [newData])

  const onSave = () => {
    let payload = {
      ...data,
      is_local: newData?.radio === 'global' ? false : true,
    }

    setInputData({ ...newData });

    ActUserPref(payload)
      .then(response => {
        if (response != null && response.status.maincode === "0") {
          snackbarState.openSnackbar(`${t('bam:ADDED_SUCCESS')} `, 'Success');
          setObjectId();
          getSavedFilter();
          onCloseHandler();
        }
        else {
          snackbarState.openSnackbar(response.status.errormsg ? response.status.errormsg : `${t('bam:WENT_WRONG_ERROR')}`, 'warning')
        }
      }).catch(error => {
        console.error('Error:', error);
      });
  }


  const onCloseHandler = () => {
    dialogState.closeDialog();
  }

  const onChangeHandler = (e) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  }

  return (
    <div className={classes.popup}>
      <DialogTitle>{t('bam:SAVE_FILTER')}</DialogTitle>
      <DialogContent style={{borderTop:"1px solid #f8f8f8"}}>
        <FormControl component="fieldset">
          <FormLabel style={{ fontSize: 12 }} >{t('bam:SAVE_FILTER')}:</FormLabel>
          <RadioGroup value={newData.radio} name='radio' onChange={onChangeHandler}>
            <FormControlLabel value="local" control={<Radio />} label={t('bam:LOCAL')} />
            <FormControlLabel value="global" disabled={!isAdmin} control={<Radio />} label={t('bam:GLOBAL')} />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCloseHandler}>{t('bam:LABEL_CANCEL')}</Button>
        <Button variant="contained" color="primary" onClick={onSave}>{t('bam:BUTTON_SAVE')}</Button>
      </DialogActions>
    </div>)
}

export const FilterBox = (props) => {
  const classes = useStyles();
  const { data = [],
    onFormSubmit = null,
    drawer = false,
    reportId = null,
    setFilterList = null,
    filterList = null,
    setShowPinnedConfig = null,
    onDrawerClose = null,
    setFormNewData = null,
    snackbarState = null,
  } = props;
  const [store, globalSetting] = useSelector(state => {
    return [state.normalDialogState, state.globalSettings];
  });


  const { t } = useTranslation(globalSetting.locale_module)

  const { report_input_fields } = data;
  const [isLoading, setIsLoading] = useState({ msg: `${t('bam:LOADING')}...`, loading: true });
  const { loading, msg } = isLoading;
  const [formData, setFormData] = useState([]);
  const [filterName, setFilterName] = useState();
  const [isAdmin, setIsAdmin] = useState();
  const [objectId, setObjectId] = useState();
  const [radioValue, setRadioValue] = useState(true);
  const [filters, setFilters] = useState([]);
  const [showPinned, setShowPinned] = useState({});
  const [inputData, setInputData] = React.useState({ radio: radioValue === true ? 'local' : 'global' })

  useEffect(() => {
    let result = report_input_fields.map((res) => {
      if (res.custom_picklist_flag)
        return { ...res, loading: true, list: null, error_msg: "" }
      else if (!res.custom_picklist_flag && res.picklist_column_name != "" && res.type !== "9")
        return { ...res, loading: true, list: null, error_msg: "" }
      else
        return { ...res, error_msg: "" }
    })
    setFormData(result)
    setIsLoading({ ...isLoading, loading: false, msg: `${t('bam:LOADING')}...` })
  }, [data])

  const onChangeFormInput = (e, res, key) => {
    let formInput = [...formData]
    formInput[key] = { ...formInput[key], display_name: res?.display_name, name: res?.name, value: e.target.value }
    setFormData(formInput)
  }

  useEffect(() => {
    if (setFormNewData)
      setFormNewData(formData)
  }, [formData])

  const formSubmitHandler = (e) => {
    // getSavedFilter();
    e.preventDefault();
    onFormSubmit(formData);
  }

  const getFormElementValueFromDisplayName = (display_name, filter) => {
    let value = null;
    for (let i = 0; i < formData.length; i++) {
      if (formData[i].display_name === display_name) {
        value = formData[i].value;
      }
    }
    if ((value == null || value === "") && filter !== true)
      snackbarState.openSnackbar(`Specify value for ${display_name} first!`, 'warning', 3000);
    return value ? value : "";
  }

  const picklistReportGenerate = (index, input_data, filter, params = null) => {
    let data = input_data.custom_picklist_def
    let sub_action = 0;
    let param_info = [];
    if (input_data.custom_picklist_def.report_input_mappings != null) {
      sub_action = 1;
      param_info = input_data.custom_picklist_def.report_input_mappings.map(field => ({
        display_name: field.name,
        value: getFormElementValueFromDisplayName(field.name, filter)
      }));
    }

    if (filter === true && params != null) {
      let success = false;
      for (let i = 0; i < param_info.length; i++) {
        if (param_info[i].display_name === params.display_name) {
          param_info[i].value = params.value;
          success = true;
          break;
        }
      }
      if (!success)
        param_info = [...param_info, params];
    }

    let inputData = {
      ...ReportGenerateJson,
      act: 0,
      sub_action: sub_action,
      report_index: data.rpt_id,
      param_info: { params: param_info },
      report_output_category: 'PR',
    }

    let prevData = [...formData]
    prevData[index] = {
      ...prevData[index],
      loading: true,
    }

    setFormData(prevData)

    GetReportGenerateData(inputData)
      .then(res => {
        if (res != null && res.status.maincode === "0") {
          let data = res.data;
          let prevData = [...formData]
          prevData[index]["list"] = data;
          prevData[index]["loading"] = false;
          setFormData(prevData)
        }
        else {
          let data = res.status;
          let prevData = [...formData]
          prevData[index]["error_msg"] = data.errormsg;
          prevData[index]["loading"] = false;
          setFormData(prevData)
        }
      })
      .catch(err => { });
  }

  const picklistTableData = (index, input_data, params) => {
    let input_param = [...formData]
    input_param[index]["loading"] = true;
    setFormData(input_param)
    let { picklist_column_name } = input_data;
    let inputData = { ...PicklistInputJson, column_name: picklist_column_name, table_name: picklist_column_name.split(".")[0] }
    if (params === "next")
      inputData = { ...inputData, opr: "2", last_value: formData[index].list.last_value }
    else if (params === "prev")
      inputData = { ...inputData, opr: "1", first_value: formData[index].list.first_value }
    GetPicklistData(inputData)
      .then(res => {
        if (res != null && res.status.maincode === "0") {
          let data = res.data;
          let prevData = [...formData]
          prevData[index]["list"] = data;
          prevData[index]["loading"] = false;
          setFormData(prevData)
        }
        else {
          let data = res.status;
          let prevData = [...formData]
          prevData[index]["error_msg"] = data.errormsg;
          prevData[index]["loading"] = false;
          setFormData(prevData)
        }
      })
      .catch(err => { });
  }

  const getIndexFromKeyName = keyName => {
    for (let i = 0; i < formData.length; i++) {
      if (formData[i].display_name === keyName)
        return i;
    }
    return -1;
  }

  const getValueByMappedName = (val, value, delimiter) => {
    let valueString = [];

    for (let i = 0; i < val.length; i++) {
      valueString.push(val[i].val[value]);
    }

    valueString = valueString.join(delimiter);
    return valueString;
  }

  const onChangePicklistInput = (res, val, key, type, delimiter) => {

    let formInput = [...formData]
    if (type === "report") {
      for (let i = 0; i < res.custom_picklist_def.report_output_mappings.length; i++) {
        let keyName = res.custom_picklist_def.report_output_mappings[i].field.name;
        let index = getIndexFromKeyName(keyName);
        if (index !== -1) {
          formInput[index] = { ...formInput[index], value: getValueByMappedName(val, res.custom_picklist_def.report_output_mappings[i].mapped_name, delimiter) }
        }
      }
    }
    else if (type === "table")
      formInput[key] = { ...formInput[key], display_name: res.display_name, name: res.name, value: val.value }
    setFormData(formInput)
  }

  const clearInputHandler = () => {
    setFormData(formData.map((res) => { return ({ ...res, value: "" }) }));
    setFilterName();
    setObjectId();
    setRadioValue();
  }

  const getSavedFilter = () => {

    let data = {
      "opr": 0,
      "report_id": reportId ? reportId : "",
      "report_instance_id": "",
      "dashboard_id": "",
      "tab_id": "",
      "is_local": false,
      "object_type": "RCF,RCP",
    }
    setIsLoading({ ...isLoading, loading: true, msg: `${t('bam:LOADING')}...` })

    GetUserPref(data)
      .then(response => {
        if (response != null && response.status.maincode === "0") {
          setFilters(response?.data?.filters);
          setIsAdmin(response?.data?.is_admin)
          if (setFilterList) {
            setFilterList(response?.data?.filters);
          }
          setShowPinned(response?.data?.show_pinned_filters);
          if (setShowPinnedConfig) {
            setShowPinnedConfig(response?.data?.show_pinned_filters);
          }
          setIsLoading({ ...isLoading, loading: false, msg: `${t('bam:LOADING')}...` })

        }
        else {
          snackbarState.openSnackbar(response?.status?.errormsg, 'warning')
          setIsLoading({ ...isLoading, loading: false, msg: `${t('bam:LOADING')}...` })

        }
      }).catch(error => {
        console.error('Error:', error);
      });

  }


  useEffect(() => {
    setInputData({ radio: radioValue === true ? 'local' : 'global' })
  }, [radioValue])

  const onSaveFilter = () => {
    let arr = [];
    if (formData)
      for (let i = 0; i < formData.length; i++) {
        // if (formData[i].hidden_flag === false) {
        arr.push({
          display_name: formData[i].display_name,
          value: formData[i].value,
          pinned: checked.indexOf(formData[i].value) !== -1 ? true : false
        })
        // }
      }
    if (arr != null) {

      let data = {
        // opr: objectId !== undefined && (inputData.radio === 'global') || (isAdmin===true && inputData.radio === 'local') ? 0 : objectId !== undefined ? 1 : 0,
        opr: objectId !== undefined && (inputData.radio === 'global') ? 0 : objectId !== undefined ? 1 : 0,
        filter_name: filterName ? filterName : "",
        pinned: false,
        is_local: true,
        report_input_fields: arr,
        report_id: reportId ? reportId : "",
        object_id: objectId ? objectId : "",
        report_instance_id: "",
        dashboard_id: "",
        tab_id: "",
        object_type: "RCF",
      }

      if (filterName != null) {
        store.openDialog(
          <SavePopup
            t={t}
            data={data}
            inputData={inputData}
            setInputData={setInputData}
            snackbarState={snackbarState}
            setObjectId={setObjectId}
            radioValue={radioValue}
            getSavedFilter={getSavedFilter}
            setFormData={setFormData}
            isAdmin={isAdmin}
          />)

      } else {
        if (snackbarState)
          snackbarState.openSnackbar(`${t('bam:FILL_FILTER_NAME')} `, 'warning');
      }
    }

  }

  useEffect(() => {
    getSavedFilter();
  }, [])

  const searchHandler = (param, res, index) => {
    let indexOfSearchField = -1;

    let param_info = {}

    for (let i = 0; i < res.custom_picklist_def.report_input_mappings.length; i++) {
      if (res.custom_picklist_def.report_input_mappings[i].type === 'K') {
        indexOfSearchField = i;
        param_info = { display_name: res.custom_picklist_def.report_input_mappings[i].name, value: param };
        break;
      }
    }
    if (indexOfSearchField === -1) return;

    picklistReportGenerate(index, res, true, param_info)

  }

  const getMappedNameFromFieldName = (res, key) => {
    for (let i = 0; i < res?.custom_picklist_def?.report_output_mappings?.length; i++) {
      if (res.custom_picklist_def.report_output_mappings[i].field.name === key) {
        return res.custom_picklist_def.report_output_mappings[i].mapped_name;
      }
    }
    return key;
  }

  const onChangeHandler = (e) => {
    setFilterName(e.target.value);
  }

  const [checked, setChecked] = React.useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleChange = (event) => {

    setShowPinned({ object_id: showPinned?.object_id, pinned: event.target.checked })
    if (setShowPinnedConfig) {
      setShowPinnedConfig({ object_id: showPinned.object_id, pinned: event.target.checked })
    }

    let payload = {
      "opr": EmptyObject(showPinned) ? 0 : 1,
      "report_id": reportId ? reportId : '',
      "report_instance_id": "",
      "dashboard_id": "",
      "tab_id": "",
      "show_pinned_filters": showPinned?.pinned === true ? false : true,
      "object_type": "RCP",
      "object_id": showPinned != null ? showPinned.object_id : ""
    }
    ActUserPref(payload)
      .then(response => {
        if (response != null && response.status.maincode === "0")
          setShowPinned({ object_id: response?.data?.object_id, pinned: event?.target?.checked });
        if (setShowPinnedConfig) {
          setShowPinnedConfig({ object_id: response?.data?.object_id, pinned: event?.target?.checked });
        }
      }).catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div className={classes.FilterWrapper}>
      <div className={classes.leftWrapper}>
        <h4 className={classes.heading}>{t('bam:LIST_OF_FILTERS')}</h4>
        {loading ? <div className={classes.listWrapper}><Spinner msg={msg} /></div> :

          <CheckboxListSecondary isLoading={isLoading} setIsLoading={setIsLoading}
            filters={filters} snackbarState={snackbarState}
            reportId={reportId} isAdmin={isAdmin} setFilterName={setFilterName}
            setObjectId={setObjectId} objectId={objectId} filterList={filterList}
            setRadioValue={setRadioValue} clearInputHandler={clearInputHandler}
            setFormData={setFormData} formData={formData} setFilterList={setFilterList}
            t={t}
          />}

        <div className={classes.toogleWrapper}>
          <div style={{ display: "flex !important" }}>
            {/* <label className={classes.toggleDiv}>Show Pinned Config</label><Switch className={classes.switchBtn} size={"small"} /> */}
          </div>
          <div>
            <label className={classes.toggleDiv}>{t('bam:SHOW_PINNED_FILTERS')}</label>
            <Switch
              checked={showPinned?.pinned === true ? true : false}
              injectLiveValue
              onChange={(e) => handleChange(e)}
              className={classes.switchBtn}
              size={"small"} />
          </div>
        </div>
      </div>
      {loading ? <div className={classes.rightWrapper}><Spinner msg={msg} /></div> : <form onSubmit={formSubmitHandler} className={classes.rightWrapper}>
        <div className={classes.inputBoxWrapper}>
          <InputBox
            form={false}
            className={classes.inputBox}
            required={false}
            placeholder="Filter Name"
            value={filterName}
            name='filter_name'
            onChangeHandler={onChangeHandler}
            injectLiveValue={true}
          />
          {drawer ? <IconsButton type="CloseIcon" onClick={onDrawerClose} /> : null}
        </div>
        <div className={classes.rightSection}>
          {formData.map((res, key) => {
            if (res.custom_picklist_flag)
              return (res.hidden_flag === true ? null : <div className={classes.pinWrapper} key={key}>
                <PickListTable
                style={{width:"157px"}}
                  multiSelect={res.multi_selection}
                  label={res.display_name}
                  labelMinWidth="110px"
                  onOpen={() => picklistReportGenerate(key, res, res.custom_picklist_def.show_filter === "Y")}
                  labelMaxWidth="110px"
                  value={formData[key]?.value}
                  clearSearchResult={() => searchHandler("", res, key)}
                  list={res.list == null ? null : res.list}
                  loading={res.loading}
                  error_msg={res.error_msg}
                  name={res.display_name}
                  required={res.mandatory}
                  fullWidth={true}
                  form={false}
                  search={res.custom_picklist_def.show_filter === "Y"}
                  onSearch={(param) => searchHandler(param, res, key)}
                  valueKey={getMappedNameFromFieldName(res, res.custom_picklist_def.field_name)}
                  onChangeHandler={(result) => onChangePicklistInput(res, result, key, "report", res.delimiter)}
                />
                {/* <Checkbox
                  edge="end"
                  onChange={handleToggle(res.value)}
                  checked={checked.indexOf(res.value) !== -1}
                  icon={<IconImage url={"/icons/pin_grey.svg"} width={15} height={15} />}
                  checkedIcon={<IconImage url={"/icons/pin.svg"} width={15} height={15} />}
                /> */}
              </div>)
            else if (!res.custom_picklist_flag && res.picklist_column_name !== "" && res.type !== "9")
              return (res.hidden_flag === true ? null : <div className={classes.pinWrapper} key={key}>
                <PickList
                  label={res.display_name}
                  labelMinWidth="110px"
                  onOpen={() => picklistTableData(key, res)}
                  labelMaxWidth="110px"
                  value={res.value}
                  name={res.display_name}
                  required={res.mandatory}
                  list={res.list == null ? null : res.list}
                  loading={res.loading}
                  displayKey="value"
                  valueKey="value"
                  pagination={true}
                  search={true}
                  onChangePicklist={(params) => picklistTableData(key, res, params)}
                  error_msg={res.error_msg}
                  fullWidth={true}
                  form={false}
                  onChangeHandler={(result) => onChangePicklistInput(res, result, key, "table")} />
                {/* <Checkbox
                  edge="end"
                  onChange={handleToggle(res.value)}
                  checked={checked.indexOf(res.value) !== -1}
                  icon={<IconImage url={"/icons/pin_grey.svg"} width={15} height={15} />}
                  checkedIcon={<IconImage url={"/icons/pin.svg"} width={15} height={15} />}
                /> */}
              </div>)
            else if (res.type === "9")
              return (res.hidden_flag === true ? null : <div className={classes.pinWrapper} key={key}>
                <DatePickers
                  label={res.display_name}
                  value={res.value}
                  labelMinWidth="110px"
                  name={res.display_name}
                  required={res.mandatory}
                  error_msg={res.error_msg}
                  fontSize="0.75rem"
                  className={classes.elementStyleCommon}
                  injectLiveValue
                  onChange={(e) => {
                    onChangeFormInput(e, res, key)
                  }}
                  timeFormat={false}
                  form={false}
                />
                {/* <Checkbox
                  edge="end"
                  onChange={handleToggle(res.value)}
                  checked={checked.indexOf(res.value) !== -1}
                  icon={<IconImage url={"/icons/pin_grey.svg"} width={15} height={15} />}
                  checkedIcon={<IconImage url={"/icons/pin.svg"} width={15} height={15} />}
                /> */}
              </div>)
            else {
              return (res.hidden_flag === true ? null : <div className={classes.pinWrapper} key={key}>
                <InputBox label={res.display_name} labelMinWidth="110px" injectLiveValue={true}
                  labelMaxWidth="110px" value={res.value} required={res.mandatory} error_msg={res.error_msg} fullWidth={true} form={false} onChangeHandler={(e) => onChangeFormInput(e, res, key)} />
                {/* <Checkbox
                  edge="end"
                  onChange={handleToggle(res.value)}
                  checked={checked.indexOf(res.value) !== -1}
                  icon={<IconImage url={"/icons/pin_grey.svg"} width={15} height={15} />}
                  checkedIcon={<IconImage url={"/icons/pin.svg"} width={15} height={15} />}
                /> */}
              </div>
              )
            }
          })}
        </div>
        <div className={classes.buttonWrapper}>
          <label className={classes.saveFilter} onClick={onSaveFilter}>{t('bam:SAVE_THE_FILTER')}</label>
          <onSaveFilter />
          <div>
            <Button className={classes.clearButton} variant="outlined" onClick={clearInputHandler}>{t('bam:BUTTON_CLEAR')} </Button>
            <Button type="submit" className={classes.button} variant="outlined" >{t('bam:GENERATE')} </Button>
          </div>
        </div>

      </form>}
    </div>
  )
}

const Filter = (props) => {

  const { data, setFormNewData = null, onChangeEvent = null, filterList = null, setShowPinnedConfig = null, setFilterList = null, dynamicHeight = "500px", snackbarState = null } = props;
  const [reportId, setReportId] = useState(props?.report_id);

  const classes = useStyles({ dynamicHeight });

  const [globalSetting] = useSelector(state => {
    return [state.globalSettings];
  });

  const { t } = useTranslation(globalSetting.locale_module)

  const onFormSubmitHandler = (param) => {
    let validateInput = param.filter((res) => res.value === "").length > 0
    if (validateInput) {
      snackbarState.openSnackbar(`${t('bam:ALL_FILEDS_MUST_BE_FILLED')}`, "error", 5000)
      return false;
    }
    onChangeEvent("generate", param)
  }
  return (
    <React.Fragment>
      <h5 className={classes.h5}>{data.report_name}</h5>
      <div className={classes.innerWrapper} >
        <div className={classes.wrapper}>
          <h4 className={classes.h4}>{t('bam:REQUIRED_FIELDS_TO_GENERATE_REPORT')}</h4>
          <FilterBox t={t} setFormNewData={setFormNewData} filterList={filterList} reportId={reportId} setShowPinnedConfig={setShowPinnedConfig} setFilterList={setFilterList} onFormSubmit={onFormSubmitHandler} snackbarState={snackbarState} data={data} />
        </div>
      </div>
    </React.Fragment>
  )
}

export default Filter;
