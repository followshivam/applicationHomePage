import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  makeStyles,
  Button,
  Typography,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputBox,
  TableComponent,
  SelectBox,
  Spinner,
  useTranslation
} from "component";
import { AddOtherAppInput } from "global/json";
import { ActReportInstance, GetReportInstanceDefinition } from "global/bam/api/ApiMethods";



const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  header: {
    // display: 'flex',
    width: '100%',
    // borderBottom: `1px solid ${theme.palette.backgroundContainer}`,
    justifyContent: 'space-between',
    alignItems: 'center',
    // padding:"15px"
  },
  spinner: {
    height: '450px',
    width: '800px'
  },
  headerControls: {
    paddingLeft: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    flexGrow: '1'
  },
  content: {
    width: '100%',
    height: 'calc(100% - 51px)'
    // height: '350px',
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  h6: {
    fontSize: "12px",
    color: "#606060",
    fontWeight: 300,
    margin: "10px 0 10px 0"
  },
  homeTab: {
    display: "flex",
    whiteSpace: "noWrap",
    margin: "10px 0px 28px 0",
    alignItems: "center"
  },
  MuiFormLabel: {
    fontSize: "0.75rem",
    paddingBottom: "10px",
    color: '#767676 !important',
  },
  rightWrapper: {
    // width: "40%",
    margin: "0 auto",
    position: "relative",
  },
  leftWrapper: {
    width: "50%",
    flexGrow: 1,
    marginRight: "45px"
  },
  wrapper: {
    width: "100%",
    display: "flex",
  },

  list: {
    fontSize: "12px",
    marginBottom: "20px",
  }

}));

const AddApplication = props => {


  const {
    data,
    modifyMode = false,
    onCallBack = null
  } = props;

  const classes = useStyles();
  const [inputData, setInputData] = useState(AddOtherAppInput);

  const [isLoading, setIsLoading] = useState({ msg: "", loading: false });
  const [showAddParam, setShowAddParam] = useState("");
  const [tableData, setTableData] = useState([])
  const { loading } = isLoading;
  let tab_id = data && data.tab_id;
  let container_id = data && data.container_id;


  const [snackBar, normalDialog, globalSetting] = useSelector(state => {
    return [state.snackbarState, state.normalDialogState, state.globalSettings];
  });

  const { t } = useTranslation(globalSetting.locale_module)

  useEffect(() => {
    if (modifyMode) {
      GetReportInstanceDefinition({ report_instance_id: data.report_instance_id }).then(response => {
        if (response != null && response.data != null && response.status.maincode === "0") {
          setInputData({ ...response.data });
          setTableData([...response.data.input_fields]);
        }
        else {
          snackBar.openSnackbar('Empty response recieved from server, can\'t Modify Application now', 'error', 5000);
          setTimeout(() => normalDialog.closeDialog(), 5000)
        }
      })
    }
  }, [])

  const handleOnChangeParameter = (event, index) => {
    const newTableData = [...tableData];
    const tableEntry = {
      sys_var_name: newTableData[index].sys_var_name,
      alias: event.target.value,
    }
    newTableData[index] = tableEntry;
    setTableData([...newTableData]);
  }



  const headerData = [
    {
      id: "sys_var_name",
      numeric: false,
      disablePadding: true,
      label: `${t('bam:SYSTEM_VARIABLE')}`
    },
    {
      id: "",
      component: (res, index) => <InputBox injectLiveValue value={tableData[index].alias} onChange={event => handleOnChangeParameter(event, index)} />,
      numeric: false,
      disablePadding: false,
      label: `${t('bam:PARAMETER_ALIAS')}`
    },

  ];
  const List = [{ label: `${t('bam:SESSIONID')}`, value: 0 },
  { label: `${t('bam:USERINDEX')}`, value: 1 },
  { label: `${t('bam:USERID')}`, value: 2 },
  { label: `${t('bam:CABINET')}`, value: 3 },
  ];
  const onChangeHandler = (e) => {
    if (e.target.name === "parameter") {
      setShowAddParam(List[parseInt(e.target.value)].label);
    }
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  }

  const [counter, setCounter] = useState(0)

  const addParameter = () => {
    setTableData([...tableData, { sys_var_name: showAddParam, alias: "", unique_id: counter }])
    // setShowAddParam("");
    setCounter(counter => counter + 1);
  };
  const handleClose = () => {
    normalDialog.closeDialog()
  };



  const onDeleteHandler = (res) => {
    const newTableData = tableData.filter(item => item.unique_id !== res.unique_id);
    setTableData(newTableData);
  }

  const onAddApplication = () => {
    let data = {
      ...inputData,
      opr: modifyMode ? "1" : '0',
      container_id: container_id,
      tab_id: tab_id,
      input_fields: tableData.map(field => ({
        sys_var_name: field.sys_var_name,
        alias: field.alias,
      })),
    }
    setIsLoading({ ...isLoading, loading: true });

    if (data.app_url !== "" && data.report_instance_name !== "") {
      ActReportInstance(data)
        .then(res => {
          if (res != null && res.status.maincode === "0") {
            snackBar.openSnackbar(`${t('bam:ADDED_APPLICATION_SUCCESS')}`, "success");
            setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
            onCallBack()
            handleClose()
          } else {
            snackBar.openSnackbar(res.status.errormsg, "error");
            setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
          }
        })
        .catch(err => { });
    }
    else {
      snackBar.openSnackbar(`${t('bam:PLEASE_FILL_REQ_FIELDS')}`, "error");
      setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
    }
  };
  return (

    <div className={classes.root}>
      <DialogTitle>
        <div className={classes.header}>
          <div className={classes.headerTitle}>
            <Typography variant="h6">{modifyMode ? `${t('bam:MODIFY_APPLICATION')}` : `${t('bam:ADD_APPLICATION')}`}</Typography>
          </div>
        </div>

      </DialogTitle>
      {loading ? (
        <div className={classes.spinner}>
          <Spinner />
        </div>
      ) : (<DialogContent
        className={classes.dialogContentLanding}>
        <div className={classes.header}>
          <div className={classes.wrapper}>
            <div className={classes.leftWrapper}>

              <div className={classes.h6}>
                <label className={classes.list}>{t('bam:APPLICATION_PROPERTIES')}:</label>
              </div>
              <div className={classes.homeTab}>
                <InputBox
                  style={{ width: "240px" }}
                  label={t('bam:INSTANCE_NAME')}
                  form={false}
                  labelMaxWidth="120px"
                  labelMinWidth="120px"
                  value={inputData.report_instance_name}
                  name="report_instance_name"
                  injectLiveValue={true}
                  onChangeHandler={onChangeHandler}
                  required={true}
                />
              </div>
              <div className={classes.homeTab}>
                <InputBox
                  style={{ width: "520px" }}
                  label={t('bam:URL')}
                  form={false}
                  labelMaxWidth="120px"
                  labelMinWidth="120px"
                  value={inputData.app_url}
                  name="app_url"
                  injectLiveValue={true}
                  onChangeHandler={onChangeHandler}
                  required={true}
                />
              </div>
              <div className={classes.h6}>
                <label className={classes.list}>{t('bam:MAP_PARAMETERS')}:</label>
              </div>
              <div className={classes.homeTab}>
                <SelectBox
                  style={{ width: "150px" }}
                  label={t('bam:SELECT_PARAMETER')}
                  name='parameter'
                  // value={inputData.template_id}
                  labelMaxWidth="120px"
                  labelMinWidth="120px"
                  form={false}
                  onChangeHandler={onChangeHandler}
                  list={List}
                />
                {showAddParam !== "" ?
                  <Button style={{ marginLeft: "5px" }} variant="contained" color="primary" onClick={addParameter} >{t('bam:ADD')}</Button>
                  : null}

              </div>
              <div className={classes.homeTab} >
                <TableComponent
                  dynamicHeight="180px"
                  tableData={tableData}
                  headerData={headerData}
                  loading={false}
                  disableFirstCell={true}
                  action={
                    [

                      {
                        action_type: "icon",
                        icon_url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/trash_2.svg`,
                        height: "15",
                        onClick: (res) => { onDeleteHandler(res) },
                        className: ""
                      },
                    ]
                  }
                />              </div>
            </div>
          </div>

          {/* </Paper> */}
        </div>
        <div className={classes.content}>
        </div>
      </DialogContent>)}
      <DialogActions className={classes.actionBar}>
        <Button variant="outlined" onClick={handleClose}>{t('bam:BUTTON_CLOSE')}</Button>
        <Button variant="contained" color="primary" onClick={onAddApplication}>{t('bam:BUTTON_SAVE')}</Button>
      </DialogActions>

    </div>
  );
}

export default AddApplication;