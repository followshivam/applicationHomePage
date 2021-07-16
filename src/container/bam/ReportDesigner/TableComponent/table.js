import React, { useEffect, useState, lazy, Suspense } from "react";
import {
  makeStyles,
  Button,
  Tabs,
  Tab,
  Paper,
  Dropdown,
  DropdownFilter,
  Spinner,
  Confirmation,
  SearchBox,
  IconImage,
  IconsButton,
  TableComponent,
  Typography,
  useTranslation
} from "component";
import { GetReportList, GetCategoryList, ReportAction, ImportExportReport } from "global/bam/api/ApiMethods";
import { GetReportListInput } from "global/json";
import { useDispatch, useSelector } from "react-redux";
import { ReportDetails } from "redux/action";
import { GetRegex } from "global/validator";
//import CreateUpdateReport from "container/ReportDesigner/Create_Update_Report";
const CreateUpdateReport = lazy(() => import("container/bam/ReportDesigner/Create_Update_Report"));
const Trends = lazy(() => import("container/bam/ReportDesigner/Trends/trends"));
const ShowQuery = lazy(() => import("container/bam/ReportDesigner/ShowQuery/query"));
const OmniFlowImport = lazy(() => import("container/bam/ReportDesigner/Import/import_from_omniflow"));
const SystemImport = lazy(() => import("container/bam/ReportDesigner/Import/import_from_system"));
const ManageCategory = lazy(() => import("container/bam/ReportDesigner/Category/manage_category"));
const HealthStatus = lazy(() => import("container/bam/ReportDesigner/HealthStatus/HealthStatus"));

// const tabHeight = '27px';
const useToolbarStyles = makeStyles(theme => ({
  root: {
    height: "24px",
    borderRadius: "5px"
  },
  child_toolbar1: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    // overflowX: "auto",
    flexWrap: "noWrap",
    backgroundColor: "#EFEFEF",
  },
  button: {
    padding: "0",
    lineHeight: "normal",
    // fontWeight: 600,
    fontSize: '12px',
    padding: "6px 12px",
    backgroundColor: "#F6F6F6",
    height: "27px",

    // border: `1px solid ${theme.palette.borderColor}`,
  },
  ul: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
    marginRight: "10px"

  },

  li: {
    padding: "1px 8px",
    backgroundColor: theme.palette.common.white,
    marginLeft: "2px",
    // border: `1px solid ${theme.palette.borderColor}`,
    fontWeight: 600,
    fontSize: '12px',
  },
  dropdownWrapper: {
    paddingLeft: "5px",
    flex: " 0 0 300px",
    width: "300px"
  },
  secondHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 0px 4px ",
  },
  rightWrapper: {
    paddingBottom: "0px",
  },
  buttonWrapper: {
    marginRight: "12px",
    padding: "2px 9px",
    // borderRadius: "3px",
    backgroundColor: theme.palette.common.white,
    '& .MuiButton-iconSizeSmall span': {
      marginLeft: props => props.direction === "rtl" ? "10px !important" : "-2px"
    },

  },
  add_report: {
    marginRight: "12px",
    padding: "2px 9px",
    // borderRadius: "3px",
    marginBottom: "1px",
    '& .MuiButton-iconSizeSmall span': {
      marginLeft: props => props.direction === "rtl" ? "10px !important" : "-2px"
    },
  },
  tabs: {
    // minHeight: tabHeight,
    // height: tabHeight,
    minHeight: "37px",
    height: "37px",
    flex: " 0 0 480px",
    width: "480px"
  },
  tab: {
    border: `1px solid ${theme.palette.borderColor}`,
    opacity: 1,
    textTransform: 'none',
    minHeight: "37px",
    height: "37px",
    fontSize: "12px",
    color: "black",
    backgroundColor: "white"
  },

  tabSelected: {
    fontWeight: '600',
    color: "black",
    backgroundColor: theme.palette.common.white,
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
  labelClass: {
    fontSize: 11
  }
}));

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    direction: props => props.direction
  },
  paper: {
    width: "100%",
    // marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.common.white
  },

  icon: {
    marginRight: theme.spacing(3),
  },
  head: {
    backgroundColor: '#FFFFFF',
  },

  title: {
    // fontWeight: 600,
  },

}));



const EnhancedTableToolbar = props => {
  const {
    data,
    loader,
    fullDialog,
    inputData = {},
    defaultRights,
    t = null,
    ImportExportHandler = null,
    onClearSearch = null,
    onDeleteHandler = null,
    onRefresh = null,
    direction,
    selected = [],
    getCategoryList = null } = props;
  const { enable_prev, enable_next } = data;
  const { loading, msg } = loader;
  const showDelButton = selected && selected.length > 0;
  const regexDetails = useSelector(state => state.regexDetails)
  const [REGEX, setREGEX] = useState(regexDetails);
  const classes = useToolbarStyles({ direction });
  const dispatch = useDispatch();
  const [normalDialog] = useSelector(state => {
    return [state.normalDialogState];
  });

  useEffect(() => {
    setREGEX(GetRegex(dispatch, "WD", regexDetails));
  }, [dispatch])

  const [configValue, setconfigValue] = useState(0)
  const tabsArray = [
    { label: `${t('bam:GENERAL_REPORTS')}`, index: 0, value: "GR" },
    { label: `${t('bam:HIDDEN_REPORTS')}`, index: 1, value: "HR" },
    { label: `${t('bam:TREND_REPORTS')}`, index: 2, value: "TR" },
  ];

  const handleConfigurations = (e, val) => {
    setconfigValue(val);
    if (val === 0) { props.onChange("category", { name: "GR", id: 0 }); }
    if (val === 1) { props.onChange("category", { name: "HR", id: -1 }); }
    if (val === 2) { props.onChange("category", { name: "TR", id: -2 }); }
  };

  const onSearchSubmit = (obj) => {
    props.onChange("search", obj.searchString)
  }

  return (
    <React.Fragment>

      <div className={classes.secondHead}>
        <div className={classes.secondHead}>
          <SearchBox
            height="14px"
            name="search"
            direction={direction}
            placeholder={t('bam:TITLE_SEARCH')}
            onSearchSubmit={onSearchSubmit}
            clearSearchResult={onClearSearch}
            regex={REGEX.AlphaNumwithComma}
          />
          <ul className={classes.ul}>
            <li style={{ marginLeft: "12px" }}>
              <DropdownFilter
                direction={direction}
                className={classes.buttonWrapper}
                variant=""
                color=""
                type="button"
                label={t('bam:BUTTON_FILTER')}
                inputState={inputData}
                onChangeHandler={props.onChange}
                name=""
                startIcon={<IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/filter_simple.svg`} height={15} />} />
            </li>
            {inputData.healthstatus_code !== "0" ?
              <li style={{ marginLeft: "12px" }}>
                <Button className={classes.filterOptions} color="primary" variant="outlined" endIcon={<IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/circle_cross.svg`} height={15} onClick={() => props.onChange("status", "0")} />} >
                  <div
                    // className={classes.filterOptionText}
                    style={{
                      display: 'flex',
                      // "& > *": {
                      //   marginRight: '2px'
                      // }
                    }}
                  >
                    <Typography variant="subtitle1">{t('bam:STATUS')}: {" "}</Typography> <Typography variant="subtitle1" style={{ color: '#808080', marginLeft: '2px' }}>{` ${inputData.healthstatus_code === "1" ? ` ${t('bam:LABEL_GOOD')}` : inputData.healthstatus_code === "2" ? ` ${t('bam:LABEL_AVERAGE')}` : ` ${t('bam:LABEL_CRITICAL')}`}`}</Typography>
                  </div>
                </Button>
              </li>
              : null}
          </ul>

        </div>
        <div className={classes.rightWrapper}>
          <Button className={classes.buttonWrapper} variant="outlined" color="primary" startIcon={<IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/refresh.svg`} height={15} />} onClick={() => { setconfigValue(0); onRefresh() }} >{t('bam:BUTTON_REFRESH')}</Button>
          <Dropdown className={classes.buttonWrapper} direction={direction} type="button" label={t('bam:EXPORT')} startIcon={<IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/export2.svg`} height={15} />}
            list={[
              { id: 1, value: "Export Selected ", disabled: selected.length < 1, label: `${t('bam:EXPORT_SELECTED')}`, labelFontSize: 11, action: () => ImportExportHandler(selected) },
              { id: 2, value: "Export ALL", disabled: false, label: `${t('bam:EXPORT_ALL')}`, labelFontSize: 11, action: () => ImportExportHandler(data.reports) }]} />
          {showDelButton ? <Button className={classes.buttonWrapper} variant="outlined" color="primary" startIcon={<IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/trash_3.svg`} height={15} />} onClick={() => onDeleteHandler(selected)} >{t('bam:BUTTON_DELETE')}</Button> : null}
          <Dropdown className={classes.buttonWrapper} direction={direction} type="button" label={t('bam:IMPORT')} startIcon={<IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/import.svg`} height={15} />}
            list={[
              { id: 1, value: "Import From Omniflow", disabled: true, label: `${t('bam:IMPORT_REPORTS_OMNIFLOW')}`, labelFontSize: 11, action: () => normalDialog.openDialog(<Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}><OmniFlowImport /></Suspense>, "Import (from Omniflow)") },
              { id: 2, value: "Import From System", disabled: false, label: `${t('IMPORT_FROM_SYSTEM')}`, labelFontSize: 11, action: () => normalDialog.openDialog(<Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}><SystemImport /></Suspense>, "Import (from System)") }]} />
          {defaultRights === "1" ? <Button className={classes.add_report} variant="contained" color="primary" startIcon={<IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/white_plus.svg`} height={15} />}
            onClick={() => fullDialog.openDialog(<Suspense fallback={<div ><Spinner msg="" /></div>}><CreateUpdateReport report_index={null} /></Suspense>, "Report Creation")}
          >{t('bam:ADD_REPORT')}</Button> : null}
          {direction === "rtl" ? <React.Fragment>
            <IconsButton type="ArrowForwardIosIcon" disabled={!enable_next} onClick={() => { props.onChange("next") }} />
            <IconsButton type="ArrowBackIosIcon" disabled={!enable_prev} onClick={() => { props.onChange("prev") }} /></React.Fragment>
            : <React.Fragment> <IconsButton type="ArrowBackIosIcon" disabled={!enable_prev} onClick={() => { props.onChange("prev") }} />
              <IconsButton type="ArrowForwardIosIcon" disabled={!enable_next} onClick={() => { props.onChange("next") }} />
            </React.Fragment>
          }
        </div>
      </div>
      <div className={classes.child_toolbar1}>
        <Tabs value={configValue} className={classes.tabs} variant="standard" onChange={handleConfigurations}>
          {tabsArray.map((res, key) => <Tab label={res.label} key={key} classes={{ selected: classes.tabSelected, root: classes.tab }} />)}
        </Tabs>
        {/*<div className={classes.dropdownWrapper}>
          <Dropdown 
            variant="outlined"
            color=""
            classname="category"
            label="More Category"
            type="button"
            endIcon={<IconImage url={"/icons/Down.svg"} height={5}
            />}
            list_type="category"
            list={props.categoryList}
          />
          <Button className={classes.button} startIcon={<IconImage className={classes.icon} url={"/icons/plus_blue.svg"} height={15} />}
            onClick={() => normalDialog.openDialog(<Suspense fallback={<div style={{ height: "150px", minWidth: "480px" }}><Spinner msg="" /></div>}><ManageCategory onCloseAction={getCategoryList} /></Suspense>, "Category")}
          > Add New Category</Button>
        </div>*/}
      </div>
    </React.Fragment>
  );
};

export default function EnhancedTable(props) {
  const { toolbar = true } = props;
  const [selected, setSelected] = React.useState([]);
  const [inputData, setInputData] = React.useState(GetReportListInput);
  const [reportData, setReportData] = useState({});
  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState({ msg: "", loading: true });
  const { loading, msg } = isLoading;
  const [store, fullDialog, snackBar, globalSetting] = useSelector(state => {
    return [state.normalDialogState, state.fullDialogState, state.snackbarState, state.globalSettings];
  });
  const { t } = useTranslation(globalSetting.locale_module)
  const [direction, setDirection] = useState(`${t('bam:HTML_DIR')}`);
  const classes = useStyles({ direction });

  const dispatch = useDispatch()



  const headCells = [
    {
      id: "report_name",
      sort_id: "report_name",
      numeric: false,
      disable_padding: true,
      sort: false,
      className: "",
      onClick: (res) => {
        dispatch(ReportDetails({ [`${res.report_index}`]: `${res.report_index} test` }))
        window.open(`${process.env.REACT_APP_CONTEXT_PATH}/bam/generate/${res.report_index}`, "_blank", "top=400,left=400,width=850,height=590")
      },
      // onClick: (res) => { window.open(`/oapweb/bam/generate/${res.report_index}`, "_blank", "top=400,left=400,width=850,height=590") },
      label: `${t('bam:REPORT_NAME')}`,
      typographyProps: { className: classes.title }
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
      id: "",
      sort_id: "average_execution_time",
      component: (res) => { return (res && res.health_status && res.health_status.map(n => n.average_execution_time)) },
      numeric: true,
      disable_padding: true,
      status: false,
      sort: false,
      label: `${t('bam:AVERAGE_TIME')}`
    },
    {
      id: "",
      component: (res) => {
        return (<div style={{ display: "flex" }}>
          <div>
            {res && res.health_status && res.health_status[0]["blocked"] ?
              <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/block.svg`} height={12} />
              : res.health_status[0]["status_desc"] === "3" ? <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/block.svg`} height={12} />
                : res.health_status[0]["status_desc"] === "1" ? <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/good.svg`} height={12} />
                  : <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/average.svg`} height={12} />}
          </div>
          <div style={{ margin: "1px 0 0 5px" }}>
            {res && res.health_status &&
              ((res.health_status[0]["status_desc"] === "1") ? res.health_status[0]["blocked"] ? `${t('bam:LABEL_BLOCKED')}` : `${t('bam:LABEL_GOOD')}`
                : (res.health_status[0]["status_desc"] === "2") ? res.health_status[0]["blocked"] ? `${t('bam:LABEL_BLOCKED')}` : `${t('bam:LABEL_AVERAGE')}`
                  : `${t('bam:LABEL_BLOCKED')}`)
            }</div></div>)
      },
      onClick: (res) => { store.openDialog(<Suspense fallback={<div style={{ height: "450px", minWidth: "600px" }}><Spinner msg="" /></div>}><HealthStatus refresh={onRefreshHandler} closeDialog={store.closeDialog} report_index={res.report_index} report_name={res.report_name} data={res} /></Suspense>, "Health Status") },
      numeric: false,
      sort: false,
      status: false,
      disablePadding: false,
      label: `${t('bam:HEALTH_STATUS')}`
    },
    {
      id: "",
      align: direction === "ltr" ? "right" : "left",
      component: (res) => {
        return (<React.Fragment> <IconImage disabled={res && res.user_rights && res.user_rights.charAt(1) === '0'} className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/edit.svg`} height={15} onClick={() => fullDialog.openDialog(<Suspense fallback={<div ><Spinner msg="" /></div>}><CreateUpdateReport report_index={res.report_index} /></Suspense>, "Report Creation")} />
          <IconImage disabled={res && res.user_rights && res.user_rights.charAt(2) === '0'} className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/trash_2.svg`} height={15} onClick={() => onDeleteHandler(res)} />
          <Dropdown className={classes.icon} type="icons" endIcon="MoreVertIcon" list={[
            // { id: 1, value: "Show Query", label: `${t('bam:SHOW_QUERY')}`, "startIcon": `${process.env.REACT_APP_CONTEXT_PATH}/icons/show_query.svg`, action: () => store.openDialog(<Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}><ShowQuery data={res} /></Suspense>, "Show Query") },
            { id: 2, value: "Exports", label: `${t('bam:EXPORTS')}`, "startIcon": `${process.env.REACT_APP_CONTEXT_PATH}/icons/grey_export.svg`, action: () => ImportExportHandler([res]) },
            { id: 3, value: "Trends", label: `${t('bam:LABEL_TRENDS')}`, "startIcon": `${process.env.REACT_APP_CONTEXT_PATH}/icons/trends.svg`, action: () => store.openDialog(<Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}><Trends data={res} /></Suspense>, "Trends") }
          ]} /></React.Fragment>)
      },
      disable_padding: false,
    },

  ];
  const onChange = (key, param) => {
    if (key === "prev") {
      setInputData({
        ...inputData, opr: 2,
        last_index: (reportData && reportData.first_index),
        last_name: (reportData && reportData.first_name),
        last_blockedstatus: reportData?.first_blocked_status

      })
    }
    if (key === "next") {
      setInputData({
        ...inputData, opr: 1,
        last_index: (reportData && reportData.last_index),
        last_name: (reportData && reportData.last_name),
        last_blockedstatus: reportData?.last_blocked_status
      })
    }
    if (key === "search") {
      setInputData({
        ...inputData, opr: 0, category_id: 0, category: "GR", filter: param,
        last_index: '',
        last_name: ''
      })
    }

    if (key === "category") {
      setInputData({
        ...inputData, opr: 0, category_id: param.id, category: param.name,
        last_index: '',
        last_name: ''
      })
    }
    if (key === "status") {
      setInputData({
        ...inputData, opr: 0,
        last_index: '',
        last_name: '',
        healthstatus_code: param,
        // hide_blocked: true
      })
    }
    if (key === "show_blocked_on_top") {
      setInputData({
        ...inputData, opr: 0,
        last_index: '',
        last_name: '',
        showblocked_top: param
      })
    }
    if (key === "hide_blocked") {
      setInputData({
        ...inputData, opr: 0,
        last_index: '',
        last_name: '',
        hide_blocked: param
      })
    }
  };

  const defaultRights = reportData && reportData.default_rights && reportData.default_rights.charAt(0);



  useEffect(() => {
    getReportDesignerList();
  }, [inputData]);

  useEffect(() => {
    getCategoryList();
  }, []);

  const getReportDesignerList = () => {
    setIsLoading({ ...isLoading, loading: true });
    GetReportList(inputData)
      .then(res => {
        if (res != null && res.status.maincode === "0") {
          setReportData(res.data);
          setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
        }
      })
      .catch(err => { });
  };
  const getCategoryList = () => {
    GetCategoryList({ screenid: "ReportDesigner" })
      .then(res => {
        let response = res.data;
        if (response != null && res.status.maincode === "0") {
          setCategoryList(response.category.map((result) => { return ({ ...result, action: (param) => onChange("category", param) }) }))
          setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
        }
      })
      .catch(err => { });
  }

  const onDeleteHandler = (res) => {
    let data = {
      "opr": "2",
      "reports": {
        report:
          res.length > 0 ? res : [res]
      }
    }
    store.openDialog(<Confirmation title={t('bam:CONFIRM_DELETE_PROCESS')} description="" button_label={t('bam:BUTTON_DELETE')} action={() => {
      ReportAction(data)
        .then(res => {
          if (res != null && res.status.maincode === "0") {
            snackBar.openSnackbar(`${t('bam:REPORT_SUCCESS_DELETED')}`, "success");
            getReportDesignerList();
          }
          else {
            snackBar.openSnackbar(res.status.errormsg, "error");
            getReportDesignerList();
          }
        })
        .catch(err => { });
    }} />, "")
  }

  const ImportExportHandler = (res) => {
    let data = {
      "opr": "1",
      "report_index": res && res.map((report) => report.report_index)
    }
    ImportExportReport(data)
      .then(res => {
        if (res != null) {
          let fileDownload = require('js-file-download');
          fileDownload(res, 'Report.xml');
          snackBar.openSnackbar(`${t('bam:REPORT_SUCCESS_EXPORTED')}`, "success");
          getReportDesignerList()
        }
      })
      .catch(err => { });
  }
  const onRefreshHandler = () => {
    setIsLoading({ ...isLoading, loading: true });
    setInputData(GetReportListInput)
    GetReportList(GetReportListInput)
      .then(res => {
        if (res != null && res.status.maincode === "0") {
          setReportData(res.data);
          setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
        }
      })
      .catch(err => { });
  }

  const onClearSearch = () => {
    setInputData(GetReportListInput);
  }
  const checkBoxHandler = (data) => {
    setSelected(data);
  }
  return (
    <div className={classes.root}>
      {toolbar ? <EnhancedTableToolbar
        data={reportData}
        loader={isLoading}
        direction={direction}
        onChange={onChange}
        selected={selected}
        onDeleteHandler={onDeleteHandler}
        ImportExportHandler={ImportExportHandler}
        categoryList={categoryList}
        onClearSearch={onClearSearch}
        getCategoryList={getCategoryList}
        fullDialog={fullDialog}
        defaultRights={defaultRights}
        onRefresh={onRefreshHandler}
        inputData={inputData}
        t={t}
      /> : null}
      <Paper className={classes.paper} elevation={0}>
        <TableComponent
          dynamicHeight="calc(100vh - 9.2rem)"
          overflowRequired={true}
          tableData={reportData.reports}
          headerData={headCells}
          selectType="checkbox"
          direction={`${t('bam:HTML_DIR')}`}
          loading={loading}
          disableFirstCell={false}
          onChangeCheckbox={checkBoxHandler}

        />

      </Paper>
    </div>
  );
}
