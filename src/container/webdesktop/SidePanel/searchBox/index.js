
import React, { useState, useEffect } from 'react';
import { makeStyles, Button, Grid } from "component";
import InputBase from '@material-ui/core/InputBase';
import { validateRegex } from 'global/validator';
import { GetSearchConf, GetWorkItemList, GetAliasList } from "global/webdesktop/api/ApiMethods";
import { GetWDWorkItemList } from "global/json";
import { useSelector } from 'react-redux';
import DropDownMenu from "component/GenericComponet/DropDownMenu";

const useStyles = makeStyles((theme) => ({
  searchBox: (props) => {
    return {
      position: 'relative',
      marginLeft: 0,
      display: "flex",
      direction: props.direction,
    }
  },
  comboDiv: {
    position: "absolute",
    display: "flex",
    direction: (props) => props.direction,
    right: (props) => (props.direction === "ltr" ? "0px" : "none"),
    left: 0,// (props) => (props.direction === "rtl" ? "0px" : "none"),
    top: "28px",
    zIndex: 999,
    maxHeight: "120px",
    borderRadius: "3px",
    minHeight: "85px",
    width: "100%",
    boxShadow: "0px 3px 6px #00000029",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    padding: "3px",
  },
  button: {
    color: "white",
    fontSize: 12,
    width: "95%",
    marginBottom: "4px",
    height: "28px",
    borderRadius: "3px",
    backgroundColor: theme.palette.secondary.main,
    "&:hover": {
      background: theme.palette.secondary.main
    },
  },
  searchIcon: {
    position: 'absolute',
    right: props => props.direction === "rtl" ? 'none' : '6px',
    left: props => props.direction === "ltr" ? 'none' : '6px',
    height: '100%',
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer'
  },
  cancelIcon: {
    position: 'absolute',
    top: '50%',
    right: props => props.direction === "rtl" ? 'none' : '25px',
    left: props => props.direction === "ltr" ? 'none' : '25px',
    transform: 'translateY(-50%)',
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer'
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    paddingLeft: props => props.direction === "ltr" ? 6 : `46px !important`,
    paddingRight: props => props.direction === "rtl" ? 6 : `46px !important`,
    fontSize: '12px',
    borderRadius:"2px",
    background: props => props.background,
    transition: theme.transitions.create('width'),
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    height: props => props.height,
    width: props => props.width ? props.width : '289px',
    '&::placeholder': {
      fontSize: '12px',
      textOverflow: 'ellipsis',
      background: 'transparent !important'
    },
  },

}));

const DropDown = (props) => {
  const {
    open, setInputData, inputData, data, searchValue,
    setToShow, toShow, searchHandler, activeProcess, setActiveProcess,
    isAliasListActive, setIsAliasListActive, direction,
    selectedFilterVal, setSelectedFilterVal
  } = props;
  const classes = useStyles();
  const [processList, setProcessList] = React.useState();
  const [firstSelection, setFirstSelection] = React.useState();
  const [aliaslist, setAliasList] = React.useState([{ name: 'All Alias', id: 'All Alias' }]);
  const [alias, setAlias] = React.useState();

  const onChangeHandler = (item) => {

    if (item.type === 'system_vars') {
      setSelectedFilterVal(item);
      setToShow(true);
      setIsAliasListActive(false)
    }
    if (item.type === 'queuelist') {
      setInputData({
        ...inputData, queue_type: item.queue_type, queue_id: item?.queue_id,
        queue_reassign: item.queue_reassign === 'Y' ? 'true' : 'false',
        order_by: item.order_by, sort_order: item.sort_order, process_def_id: "",
        filter: {
          ...inputData.filter, queue_id: item?.queue_id
        }
      });
      setSelectedFilterVal(item);
      setToShow(false);
      setIsAliasListActive(true)
      setAlias()
      getAliasList(item?.queue_id)
    }
    if (item.type === 'quick_search_vars' || item.type === 'global_queue_vars') {
      setIsAliasListActive(false)
      setSelectedFilterVal(item);
      setToShow(false);
      if (item.type === 'global_queue_vars') {
        setInputData({
          ...inputData, order_by: item?.order_by, queue_type: "G", queue_id: item.queue_id,
          filter: {
            search_flag: "3",
            queue_id: item?.queue_id,
            search_attributes: [{
              operator: "3",
              join_condition: "AND",
              var_alias: item?.var_name,
              type: item.queue_type,
              value: ""
            }]
          }
        });
      } else {
        setInputData({
          ...inputData, process_def_id: item.process_def_id,
          filter: {
            search_flag: "2",
            search_prev_version: true,
            process_def_id: item?.process_def_id,
            process_name: item?.process_name,
            search_attributes: [{
              operator: "3",
              join_condition: "AND",
              var_alias: item?.var_name,
              type: item.process_type,
              value: ""
            }]
          }
        });
      }
    }
    if (item.type === 'alias') {
      setAlias(item);
      setInputData({
        ...inputData, filter: {
          ...inputData.filter,
          search_flag: "4",
          search_attributes: [{
            var_alias: item.name,
            type: 3,
          }]
        }
      });

    }
    if (item.type === 'processlist') {
      setInputData({
        ...inputData, process_def_id: item?.id,

        filter: {
          ...inputData.filter,
          search_flag: "0",
          process_def_id: item?.id,
          process_name: item?.name
        }
      });
      setActiveProcess(item)

    }
  }

  useEffect(() => {

    let modDataList = [];

    if (data?.searchvariables?.system_vars) {
      [].concat(data?.searchvariables?.system_vars).forEach(searchvar => modDataList.push({
        name: searchvar.name, id: searchvar.name, type: 'system_vars'
      }))
    }
    if (data?.searchvariables?.quick_search_vars) {
      [].concat(data?.searchvariables?.quick_search_vars).forEach(searchvar => modDataList.push({
        name: searchvar.name, id: searchvar.name, type: 'quick_search_vars',
        process_def_id: searchvar?.process_def_id, process_name: searchvar?.process_name,
        process_type: searchvar?.type, var_name: searchvar?.var_name
      }))
    }
    if (data?.searchvariables?.global_queue_vars) {
      [].concat(data?.searchvariables?.global_queue_vars).forEach(searchvar => modDataList.push({
        name: searchvar.name, id: searchvar.name, type: 'global_queue_vars',
        queue_type: searchvar.type, queue_id: searchvar.queue_id, order_by: searchvar?.order_by,
        var_name: searchvar?.var_name
      }))
    }
    if (data?.queues?.queuelist) {
      [].concat(data?.queues?.queuelist).forEach(searchvar => modDataList.push({
        name: searchvar.name, id: searchvar.name, type: 'queuelist',
        queue_type: searchvar.type, queue_id: searchvar.id,
        queue_reassign: searchvar.allow_reassignment,
        order_by: searchvar.orderby, sort_order: searchvar.sort_order
      }))
    }

    setFirstSelection(modDataList);
    if (modDataList?.length > 0) {
      onChangeHandler(modDataList[0])
    }

    let modifiedProcessList = [];
    modifiedProcessList = data?.processes?.processlist.map(process => {
      return { name: process.display_name, id: process?.id, type: 'processlist' }
    })
    setProcessList(modifiedProcessList);
    if (modifiedProcessList?.length === 1) {
      onChangeHandler(modifiedProcessList[0])
    }
  }, [data])

  const getAliasList = (param) => {
    let payLoad = {
      "queue_id": param,
      "process_id": ""
    }
    GetAliasList(payLoad)
      .then(response => {
        let modifiedAliasList = [];
        if (response != null && response.status.maincode === "0") {
          [].concat(response?.data?.aliaslist).forEach(val =>
            modifiedAliasList.push({ name: val.var_alias, id: val?.id, type: 'alias' }))
        }
        else {
          modifiedAliasList.push({ name: 'All Alias', id: 'All Alias', type: 'alias' })
        }
        setAliasList(modifiedAliasList)
        if (modifiedAliasList.length === 1) {
          onChangeHandler(modifiedAliasList[0])
        }
      }).catch(error => {
        console.error('Error:', error);
      });
  }
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {open &&
        <div className={classes.comboDiv} id="gridDiv">
          <Grid direction="column" container wrap="nowrap">
            <Grid item style={{ height: "100%" }}>
              <div style={{ padding: "8px 0" }}>
                <div style={{ paddingTop: "5px" }}>
                  <DropDownMenu
                    itemList={firstSelection}
                    active={selectedFilterVal}
                    openSideways={true}
                    width={"160px"}
                    direction={direction}
                    onChangeHandler={onChangeHandler}
                  /></div>
                <div style={{ paddingTop: "5px" }}>
                  {toShow && <DropDownMenu
                    itemList={processList}
                    openSideways={true}
                    direction={direction}
                    placeholder = 'Select Process'
                    width={"160px"}
                    active={processList.length > 1 ? activeProcess : processList[0]}
                    onChangeHandler={onChangeHandler}
                  />}</div>
                {isAliasListActive && <DropDownMenu
                  itemList={aliaslist}
                  openSideways={true}
                  width={"160px"}
                  direction={direction}
                  active={aliaslist.length > 1 ? alias : aliaslist[0]}
                  onChangeHandler={onChangeHandler}
                />}
              </div>
              <Button disabled={searchValue === ""} variant="contained" size="large"
                className={classes.button} type="submit" onClick={() => searchHandler()}>Search</Button>
            </Grid>
          </Grid>
        </div>
      }
    </div>
  );
}

const SearchBox = (props) => {

  const {
    name = "search",
    width = "200px",
    height = "28px",
    placeholder = "Search",
    regex = null,
    direction = "ltr",
    background = "#fff !important"
  } = props;

  const classes = useStyles({ height, width, direction, background });
  const [snackbarState] = useSelector(state => { return [state.snackbarState] });
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const [toShow, setToShow] = React.useState(false);
  const [activeProcess, setActiveProcess] = React.useState();
  const [selectedFilterVal, setSelectedFilterVal] = React.useState();
  const [isAliasListActive, setIsAliasListActive] = React.useState(false);
  const [data, setData] = useState();
  const [inputData, setInputData] = React.useState(GetWDWorkItemList);

  const onKeyDownEvent = (event) => {
    if (event.keyCode === 13) {
      searchHandler()
    }
  }

  const onChangeHandler = (e) => {
    let isRegexPassed = regex !== null ? validateRegex(e.target.value, regex) : true // to test the regex with the typed value

    if (isRegexPassed || e.target.value.length === 0) { //*  e.target.value.length === 0 -> this is used when you want delete the last charcter using backspace
      setSearchValue(e.target.value);
    }
  }

  const cancelHandler = () => {
    setSearchValue("");
    // setInputData(GetWDWorkItemList);
    setToShow(false);
    // setIsAliasListActive(false);
    // setActiveProcess();
    // setSelectedFilterVal();
  }

  const searchHandler = () => {
    let val = document.getElementById('searchInputBox').value;
    setOpen(false)
    setSearchValue(val)
    getWorkItemList(searchValue)
  }

  const getWorkItemList = (params) => {
    const searchAttribute = inputData.filter.search_attributes[0];
    searchAttribute.value = params;
    const filter = inputData.filter;
    filter.search_prefix = params;

    let payload = {
      ...inputData, option: "4", search: true, filter: filter
    }
    console.log("payload", payload)
    GetWorkItemList(payload)
      .then(response => {
        if (response != null && response.status.maincode === "0") {
          console.log("workItemList Data :", response)
        }
        else {
          snackbarState.openSnackbar((response != null && response?.status?.errormsg !== '') ? response?.status?.errormsg : "Something went wrong", 'warning')
        }
      }).catch(error => {
        console.error('Error:', error);
      });
  }

  const getSearchConf = () => {
    GetSearchConf()
      .then(response => {
        if (response != null && response.status.maincode === "0") {
          setData(response?.data)
        }
        else {
          snackbarState.openSnackbar(response != null ? response?.status?.errormsg : "Something went wrong", 'warning')
        }
      }).catch(error => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    getSearchConf();
  }, []);

  return (
    <div className={classes.searchBox} id="searchBoxId">
      <InputBase
        name={name}
        id="searchInputBox"
        placeholder={placeholder ? placeholder : ""}
        autoComplete="off"
        value={searchValue}
        classes={{ root: classes.inputRoot, input: classes.inputInput }}
        style={{ width: width }}
        inputProps={{ 'aria-label': 'search' }}
        onChange={onChangeHandler}
        onKeyDown={onKeyDownEvent}
        onClick={() => setOpen(!open)}
      />

      <DropDown open={open} data={data}
        snackbarState={snackbarState}
        setInputData={setInputData}
        searchValue={searchValue}
        direction={direction}
        searchHandler={searchHandler}
        inputData={inputData}
        isAliasListActive={isAliasListActive}
        setIsAliasListActive={setIsAliasListActive}
        toShow={toShow} selectedFilterVal={selectedFilterVal}
        setSelectedFilterVal={setSelectedFilterVal}
        activeProcess={activeProcess}
        setActiveProcess={setActiveProcess}
        setToShow={setToShow}
      />

      {
        searchValue !== "" && <div className={classes.cancelIcon} onClick={cancelHandler}>
          <img src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/search_close.png`} alt="lens" width="16px" height="16px" />
        </div>
      }
      <div className={classes.searchIcon} onClick={() => searchHandler()}>
        <img src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/search_lens.png`} alt="lens" width="16px" height="16px" />
      </div>
    </div >
  );
}

export default React.memo(SearchBox);


