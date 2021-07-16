import React, { useEffect, useState } from "react";
import { useSelector, } from "react-redux";
import { GetTabAction, GetTemplateList } from "global/bam/api/ApiMethods";
import { AddTabInput, GetTemplateInput } from "global/json";

import {
  makeStyles,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Typography,
  FormLabel,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputBox,
  SelectBox,
  Spinner,
  IconImage,
} from "component";

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
    height: '380px',
    width: '715px'
  },
  spinnerLoad: {
    height: '260px',
    width: '715px'
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
  span: {
    display: "inline-block",
    verticalAlign: "middle",
    fontWeight: 600,
    fontSize: "0.75rem",
    color: "rgb(96, 96, 96)"
  },
  list: {
    color: "#0072C6",
    fontSize: "12px",
    marginBottom: "20px",
  }

}));


export default function ManageTabsView(props) {
  const classes = useStyles();
  const { respData, dashboard_id = "", onCallBack = null, t } = props;
  const [normalStoreDialog, snackBar] = useSelector(state => {
    return [state.normalDialogState, state.snackbarState];
  });
  const handleClose = () => {
    normalStoreDialog.closeDialog()
  };
  const [templateList, setTemplateList] = useState([]);
  const [inputData, setInputData] = React.useState({ ...AddTabInput, dashboard_id: dashboard_id, group_id: dashboard_id })
  const onChangeHandler = (e) => {
    if (e.target.name === "togglable") {
      setInputData({ ...inputData, [e.target.name]: e.target.checked ? "Y" : "N" });
    } else {
      setInputData({ ...inputData, [e.target.name]: e.target.value });
    }
  }

  const [isLoading, setIsLoading] = useState({ msg: "", loading: true });
  const { loading } = isLoading;

  useEffect(() => {
    getTemplate_list();
    if (respData != null) {
      setInputData({
        ...inputData,
        tab_name: respData && respData.tab_name,
        template_id: respData && respData.template_id,
        togglable: respData && respData.togglable
      });

    }
  }, []);

  const getTemplate_list = () => {
    setIsLoading({ ...isLoading, loading: true });
    GetTemplateList(GetTemplateInput)
      .then(res => {
        if (res != null && res.status.maincode === "0") {
          let selectVal = res && res.data && res.data.templates.map((name) => ({
            value: name.template_id,
            label: name.template_name,
          })
          );
          const newTemplateList = [...templateList, ...selectVal];
          setTemplateList(newTemplateList);
          setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
        }
      })
      .catch(err => { });
  };

  const AddTab = () => {
    let data = {
      ...inputData,
      togglable: inputData && inputData.togglable,
      opr: (respData != null) ? "3" : "1",
      flag: (respData != null) ? "T" : "",
      tab_id: (respData != null) ? respData && respData.tab_id : "",
    }
    setIsLoading({ ...isLoading, loading: true });

    if (data.tab_name !== "") {
      GetTabAction(data)
        .then(res => {
          if (res != null && res.status.maincode === "0") {
            snackBar.openSnackbar(`${t('bam:TAB_ADDED_SUCCESS')}`, "success");
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

  const action_button = [
    {
      id: 1,
      label: `${t('bam:BUTTON_CLOSE')}`,
      type: 'button',
      variant: 'outlined',
      color: 'primary',
      action: handleClose
    },
    {
      id: 2,
      label: `${t('bam:BUTTON_SAVE')}`,
      type: 'submit',
      variant: 'contained',
      color: 'primary',
      action: AddTab
    },
  ];


  return (

    <div className={classes.root}>
      <DialogTitle>
        <div className={classes.header}>
          <div className={classes.headerTitle}>
            <Typography variant="h6"><strong>{t('bam:BUSINESS_ACTIVITY_MONITOR_TABS_MANAGE')}</strong></Typography>
          </div>
        </div>

      </DialogTitle>
      {loading ? (<React.Fragment>
        {respData ? <div className={classes.spinner}>
          <Spinner />
        </div> :
          <div className={classes.spinnerLoad}>
            <Spinner />
          </div>}
      </React.Fragment>
      ) : (<DialogContent
        className={classes.dialogContentLanding}>
        <div className={classes.header}>
          <div className={classes.wrapper}>
            <div className={classes.leftWrapper}>
              <div className={classes.h6}>
                <label>{t('bam:NEW_TABS_PROPERTIES')}</label>
              </div>
              <div className={classes.homeTab}>

                <InputBox
                  label={t('bam:TAB_NAME')}
                  form={false}
                  labelMaxWidth="120px"
                  labelMinWidth="120px"
                  value={inputData.tab_name}
                  style={{ width: "150px" }}
                  name='tab_name'
                  injectLiveValue={true}
                  onChangeHandler={onChangeHandler}
                  required={true}
                />
              </div>
              <div className={classes.homeTab}>
                <span className={classes.span}>{t('bam:TOGGLABLE')} </span>
                <span style={{ marginLeft: "50px" }}>
                  <Checkbox
                    name='togglable'
                    checked={inputData.togglable === 'Y'}
                    onChange={onChangeHandler}
                  />
                </span>
              </div>
              <div className={classes.homeTab}>
                <SelectBox style={{ width: "150px" }}
                  label={t('bam:TEMPLATE')}
                  name='template_id'
                  list={templateList}
                  value={inputData.template_id}
                  labelMaxWidth="120px"
                  labelMinWidth="120px"
                  form={false}
                  required={true}
                  onChange={onChangeHandler}
                />
              </div>
              {respData ? <div className={classes.homeTab}>
                <span>
                  <FormControl component="fieldset">
                    <FormLabel className={classes.MuiFormLabel}  >{t('bam:REPORT_INSTANCE_ASSIGNMENT')}</FormLabel>
                    <RadioGroup value={inputData.radio} name='radio' onChange={onChangeHandler}>
                      <FormControlLabel value="Manual assignment" control={<Radio />} label={t('bam:MANUAL_ASSIGN')} />
                      <FormControlLabel value="Automatic assignment" control={<Radio />} label={t('bam:AUTOMATIC_ASSIGN')} />
                      <FormControlLabel value="Delete instances" control={<Radio />} label={t('bam:DELETE_ALL')} />
                    </RadioGroup>
                  </FormControl>

                </span>
              </div> : null}
            </div>
            <div className={classes.rightWrapper}>
              <div className={classes.h6}>
                <label style={{ paddingLeft: "14px" }}>{t('bam:TEMPLATE_PREVIEW')}</label>
              </div>
              <div style={{ display: "block", width: '318px', height: "180px", border: "1px solid #E4E4E4", margin: "15px" }}>
                <IconImage className={classes.icon} url={"icons/temp.png"} height={150} width={250} />
              </div>
            </div>
          </div>

          {/* </Paper> */}
        </div>

      </DialogContent>)}
      <DialogActions>
        {action_button.map((res, key) => {
          return (<Button
            variant={res.variant}
            color={res.color}
            onClick={res.action}
            type={res.type}
          >
            {res.label}
          </Button>)
        })}
      </DialogActions>

    </div>
  );
}

