import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  makeStyles,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Tooltip,
  Spinner,
  Pagination,
  Button,
  NotFound,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Input,
} from "component";
import { GetAuditLog, GetReportList, GetSchedulerList, GetTrendList, GetUserList } from "global/api/ApiMethods";
import stylesheet from "./style.module.css";
import { filterJsonTrendsAuditLog, UserListInput } from "global/json";
import { useSelector, useDispatch } from "react-redux";
import { InputBox, PickList } from "component/Form";


const tabHeight = '30px';
const useToolbarStyles = makeStyles(theme => ({
  root: {
    height: "24px",
    borderRadius: "5px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    margin: "15px 0px 15px 0px",
    display: "inline-block"
  },
  span: {
    display: "inline-block",
    verticalAlign: "middle"
  },
  homeTab: {
    display: "flex",
    fontSize: "12px",
    whiteSpace: "noWrap",
    color: "##606060",
    fontWeight: 600,
    margin: "10px 0px 10px 0",
    alignItems: "center"
  },
  tabs: {
    minHeight: tabHeight,
    height: tabHeight
  },
  tab: {
    backgroundColor: theme.palette.common.white,
    fontSize: '12px',
    minWidth: '50px',
    textTransform: 'none',
    minHeight: tabHeight,
    height: tabHeight,
    fontWeight: 'bold',
    marginRight: "2px"
  },
  tab_container: {
    flexGrow: 1,
    backgroundColor: theme.palette.common.white,
  },
  tabSelected: {
    color: theme.palette.primary.main
  },
}));

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  paper: {
    width: "100%",
    height: '480px',
    marginBottom: theme.spacing(2)
  },

  table: {
    minWidth: 1
  },
  head: {
    backgroundColor: '#FFFFFF',
  },
  root1: {
    maxHeight: "800px",
    paddingBottom: "12px"
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  },

}));

const headCells = [
  {
    id: "Date & Time",
    numeric: false,
    disablePadding: true,
    label: "Date & Time"
  },
  {
    id: "Description",
    numeric: false,
    disablePadding: false,
    label: "Description"
  },

];


function EnhancedTableHead(props) {
  const { classes } = props;

  return (
    <TableHead>
      <TableRow >

        {headCells.map(headCell => (
          <TableCell
            className={classes.head}
            key={headCell.id}
            align={headCell.numeric ? "center" : "left"}
            padding={headCell.disablePadding ? "none" : "default"} >

            {headCell.label}

          </TableCell>
        ))}
        <TableCell
          className={classes.head}>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired
};

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { data, loader, setInputData, inputData, getDataFromApi, resetTableData } = props;
  const { loading, msg } = loader;

  const [configValue, setConfigValue] = useState(0);

  let jsonInput = {
    "from_date": "",
    "to_date": "",
    "action_id": "",
    "action_by": "",
  }


  const actionPerformedList = [
    { value: 1, label: 'Execution Started' },
    { value: 2, label: 'Execution Finished' },
    { value: 3, label: 'Report Execution Started' },
    { value: 4, label: 'Report Execution Finished' },
    { value: 50, label: 'Report Execution Failed' },
    { value: 51, label: 'Execution Failed' },
    { value: 7, label: 'Report Batch Execution' },
  ]

  const getActionLabelFromId = id => {
    for (let i = 0; i < actionPerformedList.length; i++) {
      if (actionPerformedList[i].value === id) {
        return actionPerformedList[i].label
      }
    }
    return "NULL";
  }

  const handleConfigurations = (e, val) => {
    setConfigValue(val)
    let current_case, type = "";


    switch (val) {
      case 0: {
        current_case = 'audit_log';
        type = ""
        break;
      }
      case 1: {
        current_case = 'scheduler';
        type = "RS";
        break;
      }
      case 2: {
        current_case = 'trend';
        type = "TA"
        break;
      }
      default:
        break;
    }
    setInputData({ ...inputData, screen_id: current_case, type: type, ...jsonInput });
    setState(jsonInput)
    resetTableData();
    // setTimeout(getDataFromApi(), 200);
  }
  const tabsArray = [
    { index: 0, label: "Reports Audit", component: null, action: null },
    { index: 1, label: "Scheduler Audit", component: null, action: null },
    { index: 2, label: "Trends Audit", component: null, action: null },
  ]

  const labelArray = [
    "Report Filter", "Scheduler Filter", "Trend Filter"
  ];

  const picklistPair = [
    {
      displayKey: "report_title",
      valueKey: "report_id"
    }, {
      displayKey: "scheduler_title",
      valueKey: "scheduler_id"
    }, {
      displayKey: "trend_title",
      valueKey: "trend_id"
    },
  ]


  const [state, setState] = useState(jsonInput);

  const snackbarState = useSelector(store => store.snackbarState);
  const [trendList, setTrendList] = useState({ loading: true, list: null, error_msg: "" })
  const [userList, setUserList] = useState({ loading: true, list: null, error_msg: "" })
  const onChangePicklistInput = (result, key) => {
    if (key === "name")
      setState({
        ...state,
        action_by: result[key]
      })
    else
      setState({
        ...state,
        object_id: result[key],

      })
  }
  const onOpenPicklist = (type) => {
    if (type === 1) {
      if (configValue === 0) {
        let payload = { "category_id": 0, "category_name": "GR", "filter": "", "opr": "0", "last_index": "", "last_name": "", "type": "List", "last_blockedstatus": "", "hide_blocked": false, "showblocked_top": false, "healthstatus_code": "0" }
        GetReportList(payload).then((res) => {
          if (res != null && res.status.maincode === "0") {

            setTrendList({ ...trendList, loading: false, list: res.data })
          }
          else {
            setTrendList({ ...trendList, loading: false, error_msg: res.status.errormsg })
          }
        }).catch((err) => { })

      }
      else if (configValue === 1) {
        let payload = {
          "opr": "0",
          "node_id": "",
          "report_id": "",
          "scheduler_type": "RS",
          "sort_order": "A",
          "last_index": "",
          "last_value": "",
          "prefix": ""
        }
        GetSchedulerList(payload).then((res) => {
          if (res != null && res.status.maincode === "0") {
            setTrendList({ ...trendList, loading: false, list: res.data })
          }
          else {
            setTrendList({ ...trendList, loading: false, error_msg: res.status.errormsg })
          }
        }).catch((err) => { })
      }
      else {
        let payload = {
          "opr": "0",
          "report_id": "",
          "scheduler_type": "TA",
          "sort_order": "A",
          "last_index": "",
          "last_value": "",
          "prefix": ""
        }
        GetTrendList(payload).then((res) => {
          if (res != null && res.status.maincode === "0") {
            setTrendList({ ...trendList, loading: false, list: res.data })
          }
          else {
            setTrendList({ ...trendList, loading: false, error_msg: res.status.errormsg })
          }
        }).catch((err) => { })
      }

    }
    else {
      GetUserList(UserListInput).then((res) => {
        if (res != null && res.status.maincode === "0") {
          setUserList({ ...userList, loading: false, list: res.data })
        }
        else {
          setUserList({ ...userList, loading: false, error_msg: res.status.errormsg })
        }
      }).catch((err) => { })
    }
  }

  console.log(state);

  const handleChange = event => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    })
  }


  const clearFilters = () => {
    setState(jsonInput)
    setInputData({ ...inputData, ...jsonInput });
    setSelected([]);
  }

  const applyFilters = () => {
    setInputData({ ...inputData, ...state, action_id: selected.join(', ') })
    getDataFromApi();
  }

  const [selected, setSelected] = useState([]);

  const handleMultiSelect = event => {
    setSelected(event.target.value)
  }



  // console.log(selected)

  return (
    <React.Fragment>
      <div className={classes.tabs}>
        <Tabs value={configValue} className={classes.tabs} variant="scrollable" onChange={handleConfigurations}>
          {tabsArray.map((res, key) => <Tab label={res.label} key={key} classes={{ selected: classes.tabSelected, root: classes.tab }} />)}
        </Tabs>
      </div>
      <div className={classes.secondHead}>
        <div className={stylesheet.child_toolbar1}>

          <PickList label={`${labelArray[configValue]}`}
            labelMinWidth="100px"
            onOpen={() => onOpenPicklist(1)}
            labelMaxWidth="100px"
            value={state.object_id}
            name="action_by"
            list={trendList.list == null ? null : trendList.list}
            loading={trendList.loading}
            injectLiveValue={true}
            displayKey={`${picklistPair[configValue].displayKey}`}
            valueKey={`${picklistPair[configValue].valueKey}`}
            pagination={true}
            // search={true}
            error_msg={trendList.error_msg} fullWidth={true} form={false}
            onChangeHandler={(result) => onChangePicklistInput(result, "object_id")}
          />

          <PickList
            label="Action By"
            labelMinWidth="70px"
            onOpen={() => onOpenPicklist(2)}
            labelMaxWidth="70px"
            value={state.action_by}
            name="action_by"
            list={userList.list == null ? null : userList.list}
            loading={userList.loading}
            injectLiveValue={true}
            displayKey="name"
            valueKey="user_index"
            pagination={true}
            // search={true}
            //  onChangePicklist={(params) => picklistTableData(key, res, params)}
            error_msg={userList.error_msg}
            fullWidth={true}
            form={false}
            onChangeHandler={(result) => onChangePicklistInput(result, "name")}
          />

          <InputBox
            form={false}
            label="From Date"
            type="date"
            name="from_date"
            onChange={handleChange}
            injectLiveValue={true}
            value={state.from_date}
            labelMaxWidth="60px"
            labelMinWidth="60px"
          />

          <InputBox
            form={false}
            label="To Date"
            type="date"
            name="to_date"
            onChange={handleChange}
            injectLiveValue={true}
            value={state.to_date}
            labelMaxWidth="50px"
            labelMinWidth="50px"
          />

          <Select
            renderValue={(selected) => selected.map(id => getActionLabelFromId(id)).join(', ')}
            style={{ width: '200px' }}
            multiple
            onChange={handleMultiSelect}
            input={<Input />}
            value={selected}
          >
            {actionPerformedList.map((item, index) => (
              <MenuItem key={index} value={item.value}>
                <Checkbox />
                <ListItemText primary={item.label} />
              </MenuItem>
            ))}
          </Select>




        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className={classes.label} style={{}}>Audit Log Result(s)</label>
          <div style={{ minWidth: '170px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button variant="outlined" onClick={() => clearFilters()}>Clear Filters</Button>
            <Button variant="contained" color="primary" onClick={() => applyFilters()}>Generate</Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default function AuditLogs(props) {
  const { toolbar = true } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  // const [selected, setSelected] = React.useState([]);

  const moddedJson = filterJsonTrendsAuditLog;
  moddedJson.screen_id = 'audit_log';
  moddedJson.type = '';
  moddedJson.batch_size = '';
  moddedJson.sort_order = 'd'

  const [inputData, setInputData] = React.useState(moddedJson);
  // const [reportData, setReportData] = useState({});
  // const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState({ msg: "Loading", loading: false });
  const { loading, msg } = isLoading;
  const [store, fullDialog, snackbarState, reportState] = useSelector(state => {
    return [state.normalDialogState, state.fullDialogState, state.snackbarState, state.ReportState];
  });

  const onChange = (key, param) => {
    console.log(key)
  };

  const resetTableData = () => {
    setIsLoading({ msg: "Setting up Component...", loading: true })
    setAuditData({ history_items: [] });
    setIsLoading({ msg: "Finished Loading...", loading: false });
  }


  // useEffect(() => {
  //   getCategoryList();
  // }, [])


  // const getReportDesignerList = () => {
  //   setIsLoading({ ...isLoading, loading: true });
  //   GetReportList(inputData)
  //     .then(res => {
  //       if (res != null && res.status.maincode === "0") {
  //         setReportData(res.data);
  //         setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 500);
  //       }
  //     })
  //     .catch(err => { });
  // };

  const [auditData, setAuditData] = useState({ history_items: [] })

  const getDataFromApi = () => {
    setIsLoading({ msg: "Fetching Data From Server", loading: true });
    GetAuditLog(inputData).then(response => {
      if (response != null && response.status.maincode === '0') {
        setAuditData(response.data);
        setTimeout(setIsLoading({ ...isLoading, loading: false }), 500);
      }
      else if (response != null && response.status.maincode !== '0') {
        setAuditData({ history_items: [] })
        snackbarState.openSnackbar(response.status.errormsg, 'warning')
        setTimeout(setIsLoading({ ...isLoading, loading: false }), 500);
      }
    }).catch(err => {
      snackbarState.openSnackbar("Something went wrong", 'error');
    })
  }


  const onPaginationChange = (key) => {
    switch (key) {
      case "prev":
        setInputData({ ...inputData, i_action: "2", last_value: auditData.first_value })
        break;
      case "next":
        setInputData({ ...inputData, i_action: "1", last_value: auditData.last_value })
        break;
      default:
        break;
    }
  }

  const onRefreshHandler = () => {
    setInputData(moddedJson);
  }
  return (
    <div className={classes.root}>
      {toolbar ? <EnhancedTableToolbar
        data={auditData}
        loader={isLoading}
        onChange={onChange}
        setInputData={setInputData}
        // getCategoryList={getCategoryList}
        getDataFromApi={getDataFromApi}
        fullDialog={fullDialog}
        onRefresh={onRefreshHandler}
        inputData={inputData}
        resetTableData={resetTableData}
      /> : null}
      <div style={{ height: '40px', width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination disabled_prev={auditData == null ? true : !auditData.enable_prev} disabled_next={auditData == null ? true : !auditData.enable_next} onChange={onPaginationChange} />
      </div>

      <Paper className={classes.paper} elevation={0}>
        <TableContainer classes={{ root: classes.root1 }}>
          <Table
            className={stylesheet.tableWrap}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
            stickyHeader
          >
            {isLoading.loading ? (
              <div style={{ height: "480px" }}>
                <Spinner msg={msg} />
              </div>
            ) : (auditData.history_items.length !== 0 ?
              <React.Fragment>
                <EnhancedTableHead
                  classes={classes}
                  rowCount={auditData.history_items.length}
                />

                <TableBody>
                  {auditData.history_items.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.name}
                      >

                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          style={{ maxWidth: "120px" }} >
                          <Tooltip title={`${row && row.action_date_time != null ? row.action_date_time : row.date_time}`} arrow key='name'>
                            <Typography className={classes.headline}
                              variant="subtitle2"
                              noWrap={true}
                            >
                              {row && row.action_date_time != null ? row.action_date_time : row.date_time}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="left">
                          <Tooltip title={row.description} arrow key='des'>
                            <Typography >
                              {row && (row.description) ? row.description : '-'}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </React.Fragment> :
              <div style={{ height: '100%', width: '100%' }}>
                <NotFound />
              </div>
              )}
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
