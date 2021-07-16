import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { EmptyObject } from "global/methods";
import {
  Checkbox, TableBody, Table, TableCell, TableContainer,
  TableHead, TableRow, TableSortLabel, Typography, Radio, Tooltip
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

import { IconImage, Spinner, clsx, Dropdown, NotFound } from "component";


const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    direction: props => props.direction,
    '& .MuiTableCell-root': {
      borderBottom: "2px solid #f8f8f8",
    }
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },

  spinner: {
    height: "600px"
  },
  head: {
    backgroundColor: props => props.headerColor != null ? props.headerColor : theme.palette.backgroundContainer,
  },

  TableCell: {
    maxWidth: "100px",

  },
  row_color: {
    transition: "all 100ms ease-in",
    // '&:hover': {
    //   boxShadow: "0px 3px 6px #00000029",
    // },
    backgroundColor: "#fff",

  },
  root1: {
    height: props => props.dynamicHeight,
    display: 'grid',
    direction: props => props.direction,
    paddingBottom: props => props.paddingBottom,
    minWidth: props => props.minWidth,
    overflowY: "hidden",
    overflow: props => props.overflowRequired ? "scroll" : undefined
  },
  clickable: {
    cursor: "pointer"
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    numSelected,
    rowCount,
    direction,
    headerData = [],
    selectType,
    order,
    orderBy,
    onRequestSort,
    imageInfo,
    disableFirstCell = false,
    action = [],

  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow >
        {disableFirstCell === true ? null :
          <TableCell padding="checkbox" className={clsx(classes.head)}>
            {selectType === "checkbox" ?
              <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={onSelectAllClick}
              />
              : selectType === "img" ? <IconImage className={clsx(classes.icon)} url={`${imageInfo.path}file${imageInfo.ext}`}
                width={22} height={22} /> : null}
          </TableCell>}
        {headerData.map((headCell, key) => (
          <TableCell
            align={headCell?.align ?headCell?.align:direction==="ltr"?"left":"right"}
            className={classes.head}
            key={key}
            sortDirection={orderBy === headCell.sort_id ? order : false}
            width={headCell.width != null ? headCell.width : null}
          >
            {headCell.sort ? <TableSortLabel
              active={orderBy === headCell.sort_id}
              direction={orderBy === headCell.sort_id ? order : 'asc'}
              onClick={createSortHandler(headCell.sort_id)}
            >
              {headCell.label} {orderBy === headCell.sort_id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel> : <React.Fragment>{headCell.label}</React.Fragment>}
          </TableCell>
        ))}
        {action.length > 0 ? <TableCell className={classes.head}> </TableCell> : null}
      </TableRow>
    </TableHead>
  );
}


function descendingComparator(a, b, orderBy) {
  if (orderBy === "average_execution_time") {
    let d = b && b.health_status && b.health_status.map((i) => i.average_execution_time)[0];
    let e = a && a.health_status && a.health_status.map((i) => i.average_execution_time)[0];
    if (d < e) {
      return -1;
    }
    if (d > e) {
      return 1;
    }
    return 0;
  } else {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
}

function getComparator(order, orderBy) {

  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const actionStyle = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
}))

const ActionComponent = (props) => {
  const classes = actionStyle();
  const { action = [], res = null } = props;
  return (action.length > 0 ? <TableCell align={props.direction === 'rtl' ? 'left' : "right"}>{action.map((result, key) => {
    switch (result.action_type) {
      case "icon":
        let { onClick = null, icon_url = "", height = 15, className = null } = result;
        return (<IconImage className={clsx(classes.icon, className)} url={icon_url} height={height}
          onClick={onClick != null ? () => onClick(res) : null}
        />);
        break;
      case "dropdown":
        let { list = [], ...rest } = result;
        return (<Dropdown
          list={list.map((list_res, index) => (
            {
              ...list_res,
              action: () => list_res.action != null ?
                list_res.action(res)
                : null
            }))}
          {...rest}
        />);
        break;
      default:
        return null;
        break
    }
  })}</TableCell> : null)
}

const TableComponent = (props) => {
  const {
    tableData = [],
    headerData = [],
    action = [],
    dynamicHeight = "100%",
    direction = "ltr",
    loading = true,
    multiLine = false,
    disableFirstCell = false,
    onChangeCheckbox = null,
    selectType = "checkbox",
    minWidth = "700px",
    paddingBottom = "12px",
    headerColor = null,
    overflowRequired = false,
    boldFirstColumn = false,
    imageInfo = {
      path: undefined, //`${process.env.REACT_APP_CONTEXT_PATH}/icons/`,
      ext: undefined, //'.svg'
      img_type: undefined, //'report'
    },
    notFound
  } = props;

  const classes = useStyles({ dynamicHeight, direction, headerColor, minWidth, overflowRequired ,paddingBottom});
  const [selected, setSelected] = React.useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');

  useEffect(() => {
    setSelected([])
  }, [tableData.length, loading])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = tableData
      setSelected(newSelecteds);
      onChangeCheckbox(newSelecteds)
      return;
    }
    setSelected([]);
    onChangeCheckbox([])
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    onChangeCheckbox(newSelected)
  };

  const onRadioClick = (event, name) => {
    setSelected([name]);
    onChangeCheckbox([name])
  }


  const isSelected = name => selected.indexOf(name) !== -1;

  return (
    <div className={classes.root}>
      {/* <Paper className={classes.paper}> */}
      <TableContainer classes={{ root: classes.root1 }} style={{ placeItems: (EmptyObject(tableData) || tableData.length < 1) ? "center" : "start" }} >
        <Table
          stickyHeader
        >
          {loading ? (
            <div className={classes.spinner}>
              <Spinner />
            </div>
          ) :
            (EmptyObject(tableData) || tableData.length < 1) ?
              <div><NotFound {...notFound} /></div>
              : <React.Fragment>
                <EnhancedTableHead
                  classes={classes}
                  numSelected={selected.length}
                  order={order}
                  direction={direction}
                  orderBy={orderBy}
                  imageInfo={imageInfo}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                  rowCount={tableData.length}
                  headerData={headerData}
                  disableFirstCell={disableFirstCell}
                  selectType={selectType}
                  {...props}
                />
                <TableBody >
                  {stableSort(tableData, getComparator(order, orderBy)).map((res, index) => {
                    const isItemSelected = isSelected(res);
                    return (
                      (res.hidden_flag == null || res.hidden_flag === false) && <TableRow
                        className={classes.row_color}
                        // hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isItemSelected}>
                        {disableFirstCell === true ? null : <TableCell padding="checkbox">
                          {selectType === "checkbox" ? <Checkbox
                            onClick={event => handleClick(event, res)}
                            checked={isItemSelected}
                          />
                            : selectType === "img" ? <IconImage url={`${imageInfo.path}${imageInfo.img_type}${imageInfo.ext}`}
                              width={22} height={22} /> : <Radio
                              onChange={event => onRadioClick(event, res)}
                              checked={isItemSelected}
                            />}
                        </TableCell>}
                        {headerData.map((result, key1) => {
                          return (<TableCell
                            key={key1}
                            align={result.align != null ? result.align : direction==="ltr"?"left":"right"}
                            className={clsx(classes.TableCell, result.className, result.onClick != null ? classes.clickable : "")}
                            width={result.width != null ? result.width : null}
                            onClick={result.onClick != null ? () => result.onClick(res) : null}
                          >
                            {(result.id === "" && result.component != null) ?

                              result.component(res, index) : (<Tooltip title={`${res[result.id]}`} arrow key='name'>
                                <Typography
                                  variant="subtitle1"
                                  noWrap={!multiLine}
                                  style={{ wordBreak: "break-word" , fontWeight: (boldFirstColumn && key1==0) ? '600' : ''}}
                                  {...result.typographyProps}
                                >
                                  {res[result.id] ? res[result.id] : "-"}
                                </Typography>
                              </Tooltip>)}
                          </TableCell>)
                        })}
                        <ActionComponent {...props} res={res} />
                      </TableRow>
                    );
                  })}
                </TableBody>

              </React.Fragment>}
        </Table>
      </TableContainer>
      {/* </Paper> */}
    </div >
  );
}

export default TableComponent;


/*

EXAMPLE

const headCells = [
        {
            id: "trend_title",
            numeric: false,
            disablePadding: true,
            label: "Trend Name",
            align:"left"
        },
                {
            id: "description",
            numeric: false,
            disablePadding: true,
            label: "Description",
            align:"left"
        },
        {
            id: "next_run_time",
            numeric: true,
            disablePadding: true,
            label: "Next Run",
            align:"left"
        },

        {
            id: "last_run_time",
            numeric: true,
            disablePadding: true,
            label: "Last Run",
            align:"left"
        },
        {
            id: "",
            component:(res)=>{return(<InputBox label={res.trend_title} form={true}/>)},
            numeric: false,
            disablePadding: true,
            label: "Input Box",
            align:"center"
        },
                {
            id: "",
            component:(res)=>{return(<Checkbox/>)},
            numeric: false,
            disablePadding: true,
            label: "Checkbox",
            align:"center"
        },
           {
            id: "",
            numeric: false,
            disablePadding: true,
            label: "",
            align:"center"
        }
    ];


        const tableData=[{
        id:1,
        trend_title:"Test",
        description:"bjnjk,m",
        next_run_time:"5451",
        last_run_time:"46456",
        status:true
    },
    {
        id:2,
        trend_title:"Test",
        description:"bjnjk,m",
        next_run_time:"415",
        last_run_time:"46456",
        status:true
    },
    {
        id:3,
        trend_title:"Test",
        description:"bjnjk,m",
        next_run_time:"",
        last_run_time:"46456",
        status:true
    }]


     <TableComponent disableFirstCell={false} onChangeCheckbox={checkBoxHandler} headerData={headCells} tableData={tableData}
           action={
               [
                   {
                       action_type:"icon",
                       icon_url:"icons/edit.svg",
                       height:"",
                       onClick:(res)=>{console.log(res)},
                       className:""
                   },
                   {
                       action_type:"dropdown",
                       type:"",
                        label:"",
                         startIcon:"",
                         className:"",
                          endIcon:"MoreVertIcon",
                          list_type:"category",
                       list:[{
                           id: 1,
                            value: "Export Selected ",
                            disabled:false,
                           label:"Test",
                           startIcon:"",
                           action:(res)=>{console.log(res)},



                       }]
                   },

               ]
           }
           />



    const checkBoxHandler=(data)=>{
        // console.log(data);
    }

 */