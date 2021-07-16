import React, { useState, Suspense, useEffect } from "react";
import { IconImage, SelectBox, Spinner, useTranslation, DialogContent, DialogTitle, IconsButton, Pagination, makeStyles, Typography, DialogActions, Button } from "component";
import { CreateTrend, ResetTrend } from "redux/action";
import { useSelector, useDispatch } from "react-redux";
import { ActTrend, GetTrendList, SchedulerManagement, GetTrendDefinition } from "global/bam/api/ApiMethods";

import { BlankTrendStateJson } from "global/json";
import MultiStep from "component/MultiStep";


const TrendsPreferences = React.lazy(() => import("./trends_preferences"));
const TrendsProperties = React.lazy(() => import("./trends_properties"));
const TrendsReferences = React.lazy(() => import("./trends_recurrence"));
const TrendsAuditLog = React.lazy(() => import("./trends_audit_log"));
const LandingScreen = React.lazy(() => import("./landing_screen"))


const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    width: '100%',
    // borderBottom: `1px solid ${theme.palette.backgroundContainer}`,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerControls: {
    paddingLeft: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    flexGrow: '1'
  },
  span: {
    fontSize: "12px",
    color: "#606060",
    margin: "20px 0px 18px 24px"
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  content: {
    width: '100%',
    height: 'calc(100% - 56px)',
    // marginTop: "5px"
    // height: '350px',
  },
  trendControls: {
    width: theme.spacing(16),
    display: 'flex',
    justifyContent: 'flex-end',
    "& > *": {
      marginRight: theme.spacing(1)
    }
  },
  headerControlsAdd: {
    flex: '1',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  dialogContentLanding: {
    padding: '0',
    width: '800px',
    overflow: 'visible',
  },
  dialogContent: {
    width: '800px',
    height: '500px',
  },
  paginationControls: {
    minWidth: theme.spacing(4)
  },
  loadingSpinner: {
    minHeight: "374px",
    width: '800px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))

const ReadAndDeleteTrends = props => {
  const { data = {}, successEvent = null, setTrendId, t } = props;
  const classes = useStyles();
  const [trendInput, setTrendInput] = useState({
    "opr": "0",
    "report_id": data.report_index,
    "scheduler_type": "TA",
    "sort_order": "A",
    "last_index": "",
    "last_value": "",
    "prefix": "",
    "type": "List"
  });
  const [trendList, setTrendList] = useState(null);
  const [isLoading, setIsLoading] = useState({ msg: "", loading: true });
  const { loading, msg } = isLoading;
  const normalStoreDialog = useSelector(state => {
    return state.normalDialogState;
  });
  const handleClose = () => {
    normalStoreDialog.closeDialog()
  };

  let activeComponent = null;
  const [active, setActive] = useState('landing');

  useEffect(() => {
    switch (active) {
      case 'auditLog':
        activeComponent = <TrendsAuditLog />;
        break;
      default:
        getTrendList()
        activeComponent = <LandingScreen />
    }
  }, [trendInput])

  const getTrendList = () => {
    setIsLoading({ ...isLoading, loading: true })
    GetTrendList(trendInput)
      .then(res => {
        let response = res
        // console.log(response)
        if (response != null && res.status.maincode === "0") {
          setTrendList(response.data)
          // console.log(response.data);
          setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 500);
        }
        // else if (res.status.maincode === "18") {
        else {
          setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 500);
        }
      })
      .catch(err => { });
  }
  const onPaginationChange = (key) => {
    switch (key) {
      case "prev":
        setTrendInput({ ...trendInput, opr: "2" })
        break;
      case "next":
        setTrendInput({ ...trendInput, opr: "1" })
        break;
      default:
        break;
    }
  }




  const [list, setList] = useState([]);

  const snackbarState = useSelector(store => store.snackbarState);
  const deleteSelectedTrends = () => {
    ActTrend({ opr: '2', scheduler_list: list.map(item => item.trend_id) }).then(response => {
      if (response != null && response.status.maincode === "0") {
        snackbarState.openSnackbar(`${t('bam:TREND_DELETED_SUCCESS')}`, "Success")
      }
      else if (response != null && response.status.maincode !== "0") {
        snackbarState.openSnackbar(`${t('bam:ERROR')}: ${response.status.erromsg}`, "error");
      }
      else {
        snackbarState.openSnackbar(`${t('bam:WENT_WRONG_ERROR')}`, "error");
      }
      getTrendList();
    })
  }

  const trendsManagement = action => {
    let payload = {
      opr: action,
      scheduler_list: list.map(item => item.trend_id),
    }

    SchedulerManagement(payload).then(response => {
      if (response != null && response.status != null && response.status.maincode === "0") {
        snackbarState.openSnackbar(`${t('bam:SELECTED_TRENDS')} ${action === 0 ? t('bam:STATUS_STARTED') : t('bam:STATUS_STOPPED')} ${t('bam:SUCCESSFULLY')}`, 'Success')
        setList([])
        getTrendList();
      }
      else if (response != null && response.status != null && response.status.maincode !== "0") {
        snackbarState.openSnackbar(`${t('bam:WARNING')}: ${response.status.errormsg}`, 'warning')
      }
    }).catch(err => {
      snackbarState.openSnackbar(`${t('bam:WENT_WRONG_ERROR')}`, 'error')
    })
  }

  // const [trendState]

  const modifyTrend = (index) => {
    const trend_id = trendList.data[index].trend_id;
    setTrendId(trend_id);
    successEvent(1);
  }

  const createNewTrend = () => {
    setTrendId(-1);
    successEvent(1);
  }

  const displayStart = () => {
    for (let i = 0; i < list.length; i++) {
      if (list[i].status_id === 0) return true;
    }
    return false;
  }
  const displayStop = () => {
    for (let i = 0; i < list.length; i++) {
      if (list[i].status_id === 1 || list[i].status_id === 2 || list[i].status_id === 50) return true;
    }
    return false;
  }


  const buttonGroupLandingPage =
    <div className={classes.headerControls}>
      <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/refresh.svg`} height={15} onClick={() => getTrendList()} />
      <div className={classes.trendControls} >
        {list.length !== 0 ?
          <IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/trash_2.svg`} height={15} width={15} onClick={() => deleteSelectedTrends()} />
          : null}
        {list.length !== 0 && displayStart() ?
          <IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/play.svg`} height={17} width={17} onClick={() => trendsManagement(0)} />
          : null}
        {list.length !== 0 && displayStop() ?
          <IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/stop.svg`} height={17} width={17} onClick={() => trendsManagement(2)} />
          : null}
        <IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/audit_logs.svg`} height={15} width={15} onClick={() => setActive('auditLog')} />
        <IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/plus_blue.svg`} height={15} width={15} onClick={() => createNewTrend()} />
        {active === 'landing' ? <div className={classes.paginationControls}>
          <Pagination disabled_prev={trendList == null ? true : !trendList.enable_prev} disabled_next={trendList == null ? true : !trendList.enable_next} onChange={onPaginationChange} />
        </div> : null}
      </div>
    </div>

  const components = [
    { label: `landing`, component: LandingScreen },
    { label: `auditLog`, component: TrendsAuditLog }
  ]

  return <React.Fragment>
    <DialogTitle>
      <div className={classes.header}>
        <div className={classes.headerTitle}>
          <Typography variant="h6"><strong>{t('bam:LABEL_TRENDS')}</strong> ({data.report_name})</Typography>
        </div>
        {buttonGroupLandingPage}
      </div>

    </DialogTitle>
    <DialogContent
      className={classes.dialogContentLanding}>
      <div className={classes.content}>
        {loading === false ? components.map((res, key) => (
          active === res.label ? <Suspense fallback={<div style={{ minHeight: "374px", width: '800px' }}><Spinner /></div>}><res.component modifyTrend={modifyTrend} list={list} setList={setList} trendList={trendList != null ? trendList.data : []} onPrev={() => setActive('landing')} closeDialog={handleClose} /></Suspense> : null
        )) : <div className={classes.loadingSpinner}><Spinner /></div>}
      </div>
    </DialogContent>
    <DialogActions>
      <Button
        variant="outlined"
        onClick={handleClose}>
        {t('bam:LABEL_CANCEL')}
      </Button>
      {active === 'auditLog' ? <Button variant="outlined" color="primary" onClick={() => setActive('landing')}>{t('bam:BUTTON_PREVIOUS')}</Button> : null}
    </DialogActions>
  </React.Fragment >
}

const CreateAndUpdateTrends = (props) => {
  const { data = null, successEvent = null, report_index = null, trendId, t } = props;

  const step_list = [
    { label: `${t('bam:TREND_PROPERTIES')}`, component: TrendsProperties },
    { label: `${t('bam:TREND_PREFERENCES')}`, component: TrendsPreferences },
    { label: `${t('bam:TRENDS_RECURRENCE')}`, component: TrendsReferences },
  ]

  const classes = useStyles();
  const dispatch = useDispatch()

  const normalStoreDialog = useSelector(state => {
    return state.normalDialogState;
  });
  const trendState = useSelector(state => {
    return state.createTrendsState;
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (trendId !== -1) {
      GetTrendDefinition({ scheduler_id: trendId }).then(response => {
        dispatch(ResetTrend({ current_step: 1, opr: '1', scheduler_list: [`${trendId}`], modifyMode: true, ...response.data }))
      }).then(() => {
        setTimeout(() => setIsLoading(false), 500);
      })
    }
    else {
      dispatch(ResetTrend({ current_step: 1, opr: '0', ...BlankTrendStateJson, modifyMode: false, ...data }))
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [trendId]);

  const onCloseHandler = () => {
    normalStoreDialog.closeDialog();
    dispatch(ResetTrend({ current_step: 1 }))
  };

  const onNextHandler = () => {
    let stepNumber = trendState["current_step"];
    if (stepNumber < 3) {
      dispatch(CreateTrend({ ...trendState, current_step: stepNumber + 1 }));
    }
    else {
      dispatch(ResetTrend({ current_step: 1 }))
      successEvent(0);
    }
  }
  const onPreviousHandler = () => {
    let stepNumber = trendState["current_step"];
    if (stepNumber === 1) {
      dispatch(ResetTrend({ current_step: 1 }))
      successEvent(0);
    }
    else {
      dispatch(CreateTrend({ ...trendState, current_step: stepNumber - 1 }));
    }
  }



  const buttonGroupAddPageCommon =
    <div className={classes.headerControlsAdd}>
      <SelectBox
        label={t('bam:LOCALE_TIME_ZONE')}
        list={[{ value: 0, label: 'English(United States)[en_us]' }]}
        value={0}
        labelMinWidth="120px"
        labelMaxWidth="120px"
        form={false}
      />
    </div>
  return <React.Fragment>
    <DialogTitle style={{ padding: '16px 16px' }}>
      <div className={classes.header}>
        <div className={classes.headerTitle}>
          <Typography variant="h6"><b>{t('bam:ADD_TREND')}</b> ({data.report_name})</Typography>
        </div>
        {buttonGroupAddPageCommon}
      </div>

    </DialogTitle>

    {isLoading === false ? <div className={classes.dialogContent}>
      <MultiStep active={trendState.current_step} step_list={step_list} />
      <div className={classes.content}>
        {step_list.map((res, key) => {
          return (key + 1 === trendState.current_step ? <Suspense fallback={<div style={{ minHeight: "250px" }}><Spinner /></div>}><res.component onNext={onNextHandler} onPrev={onPreviousHandler} onCancel={onCloseHandler} trendId={trendId} /></Suspense> : null)
        })}
      </div>
    </div> : <div style={{ height: '450px', width: '800px' }}><Spinner /></div>}


  </React.Fragment >
}
const Trends = props => {
  const { data = [] } = props;
  const [nextStep, setNextStep] = useState(0);


  const [globalSetting] = useSelector(state => {
    return [state.globalSettings];
  });

  const { t } = useTranslation(globalSetting.locale_module)

  const [trendId, setTrendId] = useState(-1);

  return (
    <React.Fragment>
      {nextStep === 0 ?
        <ReadAndDeleteTrends t={t} data={data} successEvent={(val) => setNextStep(val)} setTrendId={setTrendId} /> :
        <CreateAndUpdateTrends t={t} data={data} successEvent={(val) => setNextStep(val)} trendId={trendId} />
      }
    </React.Fragment>
  );
};
export default Trends;