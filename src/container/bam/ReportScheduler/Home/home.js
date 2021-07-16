
import React, { useEffect, useState, Suspense } from "react";
import {
  makeStyles,
  Button,
  DropdownFilter,
  Spinner,
  useTranslation,
  SearchBox,
  IconImage,
  Paper,
  IconsButton,
  TableComponent,
  Typography,
  Dropdown,
  Tooltip
} from "component";
import { GetSchedulerList, SchedulertAction, SchedulerManagement, ExtConnect } from "global/bam/api/ApiMethods";
import { GetSchedulerListInput } from "global/json";
import { useSelector } from "react-redux";
import AddScheduler from "../AddScheduler/add_scheduler";

const AuditLog = React.lazy(() => import("container/bam/ReportScheduler/audit_log"));

const useToolbarStyles = makeStyles(theme => ({
  root: {
    height: "24px",
    borderRadius: "5px"
  },

  button: {
    padding: "0",
    lineHeight: "normal",
    fontWeight: 600,
    fontSize: '12px',
    padding: "6px 12px",
    backgroundColor: "#F6F6F6",
    border: `1px solid ${theme.palette.borderColor}`,
  },
  ul: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
    marginRight: "10px"

  },

  li: {
    padding: "2px 10px",
    backgroundColor: theme.palette.common.white,
    marginLeft: "2px",
    border: `1px solid ${theme.palette.borderColor}`,
    fontWeight: 600,
    fontSize: '12px',
  },

  secondHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 0px 8px "
  },
  buttonWrapper: {
    marginRight: "12px",
    padding: "2px 9px",
    borderRadius: "3px",
    backgroundColor: theme.palette.common.white
  },
  add_report: {
    marginRight: "12px",
    padding: "2px 9px",
    borderRadius: "3px",
  },
  filterOptions: {
    backgroundColor: theme.palette.common.white,
    lineHeight: "normal",
    fontWeight: 400,
    fontSize: '12px',
    // padding: "2px 9px",
    // height: "27px",
    marginRight: "5px",
    border: '1px solid transparent',
    '&:hover': {
      border: '1px solid transparent',
      backgroundColor: 'white',
    },
    filterOptionText: {
      display: 'flex',
      flexDirection: 'row',
      "& > *": {
        marginLeft: '2px'
      }
    }
  },
  rightWrapper: {
    paddingBottom: "8px"
  }
}));

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    // marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.common.white
  },

  title: {
    fontWeight: 600,
  },
  table: {
    minWidth: 1
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  head: {
    backgroundColor: '#FFFFFF',
  },



}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { data, loader, t = null, inputData = {}, getReportSchedularList, normalDialog = null, onDeleteHandler = null, onStartStopHandler = null, onRefresh = null, selected = [] } = props;
  const { enable_prev, enable_next } = data;
  const { loading, msg } = loader;
  const showDelButton = selected && selected.length > 0;
  const [startStop, setStartStop] = useState(0);

  const onExternalConnect = () => {
    const payload = {
      CalledFrom: "EXT",
      UserId: localStorage.getItem('user_name') && 'manik',
      UserIndex: localStorage.getItem('user_id') && '1040',
      SessionId: localStorage.getItem('session_id'),
      CabinetName: 'ibps5sp1p2',
      LaunchClient: 'RI',
      ReportIndex: '1',
    }

    ExtConnect(payload);
  }

  useEffect(() => {
    let status = undefined;
    if (selected.length > 0 && selected.filter(element => element.status_id === '0').length === selected.length) {
      status = '0'
    } else if (selected.length > 0 && selected.filter(element => element.status_id !== '0').length === selected.length) {
      status = '1';
    } else {
      status = undefined
    }
    setStartStop(status);
  }, [selected])

  return (

    <React.Fragment>
      <div className={classes.secondHead}>
        <div className={classes.secondHead}>
          <form onSubmit={(e) => {
            e.preventDefault();
            let param = e.target.search.value.trim();
            if (param !== '')
              props.onChange("search", param)
          }}>
            {/* <SearchBox height="27.5px" name="search" /> */}
          </form>

          <ul className={classes.ul}>
            <li style={{ marginLeft: "12px" }}>
              {/* <DropdownFilter className={classes.buttonWrapper}
              t={t}
                variant=""
                type="button"
                label={t('BUTTON_FILTER')}
                inputState={inputData}
                screen="schedular"
                onChangeHandler={props.onChange}
                name=""
                startIcon={<IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/filter_simple.svg`} height={15} />} /> */}
            </li>
            {inputData.status !== "0" ?
              <li style={{ marginLeft: "12px" }}>
                <Button className={classes.filterOptions} color="primary" variant="outlined" endIcon={<IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/circle_cross.svg`} height={15} onClick={() => props.onChange("status", "0")} />} >
                  <div style={{ display: 'flex' }}>
                    <Typography variant="subtitle1">{t('bam:STATUS')}: {" "}</Typography> <Typography variant="subtitle1" style={{ color: '#808080', marginLeft: '2px' }}>{` ${inputData.status === "1" ? `${t('bam:STATUS_RUNNING')}` : `${t('bam:STATUS_STOPPED')}`}`}</Typography>
                  </div>
                </Button>
              </li>
              : null}
          </ul>
        </div>
        <div className={classes.rightWrapper}>
          {/* <Button className={classes.buttonWrapper} variant="outlined" color="primary" startIcon={<IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/export2.svg`} height={15} />} onClick={() => { onExternalConnect() }} >{t('bam:EXTERNAL_CONNECT')}</Button> */}
          <Button className={classes.buttonWrapper} variant="outlined" color="primary" startIcon={<IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/refresh.svg`} height={15} />} onClick={() => { onRefresh() }} >{t('bam:BUTTON_REFRESH')}</Button>
          <Button className={classes.buttonWrapper} variant="outlined" color="primary" onClick={() => normalDialog.openDialog(<Suspense fallback={<div ><Spinner /></div>}><AuditLog /></Suspense>, "Audit Logs")} startIcon={<IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/audit.svg`} height={15} />}  >{t('bam:AUDIT')}</Button>
          {startStop ? startStop === '0' ? <Button className={classes.buttonWrapper} variant="outlined" color="primary" startIcon={<IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/play.svg`} height={20} width={20} />} onClick={() => onStartStopHandler("start", selected)} >{t('bam:BUTTON_START')}</Button>
            : <Button className={classes.buttonWrapper} variant="outlined" color="primary" startIcon={<IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/stop-new.svg`} height={16} />} onClick={() => onStartStopHandler("stop", selected)}>{t('bam:BUTTON_STOP')}</Button> : null}
          {showDelButton ? <React.Fragment>  <Button className={classes.buttonWrapper} variant="outlined" color="primary" startIcon={<IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/trash_3.svg`} height={15} />} onClick={() => onDeleteHandler(selected)} >{t('bam:BUTTON_DELETE')}</Button></React.Fragment> : null}
          <Button onClick={() => normalDialog.openDialog(<Suspense fallback={<div><Spinner /></div>}><AddScheduler t={t} getReportSchedularList={getReportSchedularList} /></Suspense>)} className={classes.add_report} variant="contained" color="primary" startIcon={<IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/white_plus.svg`} height={15} />}> {t('bam:ADD_SCHEDULER')}</Button>

          <IconsButton type="ArrowBackIosIcon" disabled={!enable_prev} onClick={() => { props.onChange("prev") }} />
          <IconsButton type="ArrowForwardIosIcon" disabled={!enable_next} onClick={() => { props.onChange("next") }} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default function EnhancedTable(props) {
  const { toolbar = true } = props;
  const classes = useStyles();
  const [selected, setSelected] = React.useState([]);
  const [inputData, setInputData] = React.useState(GetSchedulerListInput);
  const [reportData, setReportData] = useState({});
  const [isLoading, setIsLoading] = useState({ msg: "", loading: true });
  const { loading, msg } = isLoading;
  const [normalDialog, snackBar, globalSetting] = useSelector(state => {
    return [state.normalDialogState, state.snackbarState, state.globalSettings];
  });

  const { t } = useTranslation(globalSetting.locale_module)


  const headCells = [
    {
      id: "scheduler_title",
      sort_id: "scheduler_title",
      numeric: false,
      disable_padding: true,
      sort: false,
      className: "",
      label: `${t('bam:SCHEDULER_TITLE')}`,
      // typographyProps: { className: classes.title }
    },
    {
      id: "description",
      sort_id: "description",
      numeric: false,
      disable_padding: false,
      status: false,
      sort: false,
      label: `${t('bam:DESCRIPTION')}`
    },
    {
      id: "next_run_time",
      sort_id: "next_run_time",
      numeric: false,
      sort: false,
      disablePadding: false,
      label: `${t('bam:NEXT_RUN_TIME')}`
    },
    {
      id: "last_run_time",
      sort_id: "last_run_time",
      numeric: false,
      sort: false,
      disablePadding: false,
      label: `${t('bam:LAST_RUN_TIME')}`
    },
    {
      id: "",
      component: (res) => {
        return (<div style={{ display: "flex", alignItems: "center" }}><span style={{ borderRadius: "100px", width: "10px", verticalAlign: "middle", height: "10px", display: "inline-block", marginRight: "5px", backgroundColor: res && res.status === t('bam:STATUS_STOPPED') ? "red" : res?.status === t('bam:STATUS_STARTED') || res?.status === t('bam:STATUS_COMPLETED') ? "#0f0" : "yellow" }}
        /><Tooltip title={`${res.status}`} arrow key='name'>
            <Typography
              style={{ width: "93%" }}
              variant="subtitle1"
              noWrap={true}
            >
              {res && (res.status) ? res.status : '-'}
            </Typography>
          </Tooltip></div>)
      },
      numeric: false,
      status: false,
      disablePadding: false,
      label: `${t('bam:STATUS')}`
    },
    {
      id: "",
      component: (res) => {
        return (<React.Fragment> <IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/edit.svg`} height={15} onClick={() => normalDialog.openDialog(<Suspense fallback={<div style={{ minHeight: "250px" }}><Spinner /></div>}><AddScheduler getReportSchedularList={getReportSchedularList} scheduler_id={res && res.scheduler_id} title="Modify Scheduler" /></Suspense>,)} />
          <IconImage className={classes.icon} url={res.status === 'Stopped' ? `${process.env.REACT_APP_CONTEXT_PATH}/icons/play_grey.svg` : `${process.env.REACT_APP_CONTEXT_PATH}/icons/stop-new.svg`} height={15} onClick={() => onStartStopHandler(res.status === 'Stopped' ? "start" : "stop", res)} />
          <Dropdown className={classes.icon} type="icons" endIcon="MoreVertIcon" list={[
            { id: 1, value: "Execute", label: `${t('bam:IMMEDIATE_EXECUTE')}`, "startIcon": `${process.env.REACT_APP_CONTEXT_PATH}/icons/show_query.svg`, action: null },
          ]} /></React.Fragment>)
      },
      numeric: false,
      status: false,
      disablePadding: false,
    },

  ];

  const onChange = (key, param) => {
    if (key === "prev") {
      setInputData({
        ...inputData, opr: 2,
        last_index: (reportData?.first_scheduler_id),
        last_value: (reportData?.first_scheduler_title),
      })
    }
    if (key === "next") {
      setInputData({
        ...inputData, opr: 1,
        last_index: (reportData?.last_scheduler_id),
        last_value: (reportData?.last_scheduler_title),
      })
    }
    if (key === "search") {
      setInputData({
        ...inputData, opr: 0, category_id: 0, category_name: "GR", prefix: param,
        last_index: '',
        last_value: ''
      })
    }

    if (key === "status") {
      setInputData({
        ...inputData, opr: 0,
        last_index: '',
        last_value: '',
        status: param
      })
    }
    if (key === "show_blocked_on_top") {
      setInputData({
        ...inputData, opr: 0,
        last_index: '',
        last_value: '',
        showblocked_top: param
      })
    }
    if (key === "hide_blocked") {
      setInputData({
        ...inputData, opr: 0,
        last_index: '',
        last_value: '',
        hide_blocked: param
      })
    }
  };

  useEffect(() => {
    getReportSchedularList();
  }, [inputData]);

  const getReportSchedularList = () => {
    setIsLoading({ ...isLoading, loading: true });
    GetSchedulerList(inputData)
      .then(res => {
        if (res != null && res.status.maincode === "0") {
          setReportData(res.data);
          setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
        }
      })
      .catch(err => { });
  };
  const checkBoxHandler = (data) => {
    setSelected(data);
  }

  const onRefreshHandler = () => {
    setIsLoading({ ...isLoading, loading: true });
    setInputData(GetSchedulerListInput)
    GetSchedulerList(GetSchedulerListInput)
      .then(res => {
        if (res != null && res.status.maincode === "0") {
          setReportData(res.data);
          setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
        }
      })
      .catch(err => { });
  }

  const onDeleteHandler = (res) => {
    let schedulerId = res.map((id) => id.scheduler_id);
    let data = {
      "opr": "2",
      "scheduler_list": res.length > 0 ? schedulerId : [res.schedulerId]
    }
    // store.openDialog(<Confirmation title="Are you sure you want to delete this Process?" description="" button_label="Delete" action={() => {
    setIsLoading({ ...isLoading, loading: true });
    SchedulertAction(data)
      .then(response => {
        if (response != null && response.status.maincode === "0") {
          snackBar.openSnackbar("Schedule Deleted Successfully", "success");
          setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);

          getReportSchedularList();
        }
        else {
          snackBar.openSnackbar(response.status.errormsg, "error");
          setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
        }
      })
      .catch(err => { });
    // }} />, "")
  }

  const onStartStopHandler = (key, res) => {
    let data = { opr: key === "stop" ? "2" : "0", scheduler_list: res.length > 0 ? res.map((result) => result.scheduler_id) : [res.scheduler_id] };
    SchedulerManagement(data).then(resp => {
      if (resp != null && resp.status.maincode === "0") {
        //  let result = [...reportData.scheduler_list];
        // let currentIndex = result.findIndex((response)=>res.scheduler_id === response.scheduler_id)
        // result[currentIndex]={...result[currentIndex],status:key==="start"?"Stopped":"Started"}
        // setReportData({...reportData,scheduler_list:result})
        getReportSchedularList();
        snackBar.openSnackbar(key === 'stop' ? " Successfully Stopped" : " Successfully Started", "success");
      }
      else {
        snackBar.openSnackbar(resp.status.errormsg, "error");
      }
    })
      .catch(err => { });
  }


  return (
    <div className={classes.root}>
      {toolbar ? <EnhancedTableToolbar
        t={t}
        data={reportData}
        loader={isLoading}
        getReportSchedularList={getReportSchedularList}
        onChange={onChange}
        selected={selected}
        onStartStopHandler={onStartStopHandler}
        onDeleteHandler={onDeleteHandler}
        normalDialog={normalDialog}
        onRefresh={onRefreshHandler}
        inputData={inputData}
      /> : null}
      <Paper className={classes.paper} elevation={0}>
        <TableComponent
          dynamicHeight='calc(100vh - 7.4rem)'
          overflowRequired={true}
          tableData={reportData.scheduler_list}
          headerData={headCells}
          loading={loading}
          disableFirstCell={false}
          onChangeCheckbox={checkBoxHandler}
        />
      </Paper>
    </div>
  );
}
