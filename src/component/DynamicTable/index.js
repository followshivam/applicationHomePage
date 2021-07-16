import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  NotFound
} from "component";
import { EmptyObject } from "global/methods";
import { Checkbox } from "@material-ui/core";
import { withRouter } from "react-router";
import { ReportDetails } from "redux/action";
import { useDispatch } from "react-redux";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    direction: props => props?.direction,

  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  head: {
    backgroundColor: '#f0f0f0',

  },

  root1: {
    height: props => props.dynamicHeight,
    maxHeight: 'calc(100vh - 38px)',
    paddingBottom: "12px",
    boxSizing: 'border-box',
    direction: props => props?.direction,
    // overflowX: 'unset'
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
  notFoundIcon: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing(2)
  }
}));

function EnhancedTableHead(props) {
  const {
    classes,
    header_data,
    order,
    orderBy,
    direction,
    onRequestSort,
    ChangeHandler,
    showBatching,
    multiSelect,
    serverOrder,
    serverOrderBy,
    setServerOrder,
    setServerOrderBy,
    table_properties
  } = props;

  const createSortHandler = (property) => (event) => {
    if (!showBatching) {
      onRequestSort(event, property);
    }
    else {
      const isAsc = serverOrderBy === property && serverOrder === 'asc';
      setServerOrderBy(property)
      setServerOrder(isAsc ? 'desc' : 'asc')
    }
  };



  return (
    <TableHead>
      <TableRow>
        {multiSelect && <TableCell padding="checkbox"></TableCell>}
        {header_data.c_arr.map((headCell, key) => {
          let tableCellHeadStyle = {}
          if (table_properties.tableCellHeadStyle) {
            tableCellHeadStyle = table_properties.tableCellHeadStyle(key === header_data.c_arr.length - 1)
          }
          return (<TableCell
            key={key}
            style={tableCellHeadStyle}
            align={table_properties.header_font_alignment ? table_properties.header_font_alignment : headCell.numeric ? "center" : direction==="ltr"?"left":"right"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={!showBatching ? (orderBy === headCell.val ? order : false) : (serverOrderBy === headCell.val ? serverOrder : false)}
          >
            {showBatching ? <TableSortLabel
              active={serverOrderBy === headCell.val}
              direction={serverOrderBy === headCell.val ? serverOrder : 'asc'}
              onClick={createSortHandler(headCell.val)}
            >
              {headCell.val}
              {serverOrderBy === headCell.val ? (
                <span className={classes.visuallyHidden}>
                  {serverOrder === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
              :
              <TableSortLabel
                active={orderBy === headCell.val}
                direction={orderBy === headCell.val ? order : 'asc'}
                onClick={createSortHandler(headCell.val)}
              >
                {headCell.val} {orderBy === headCell.val ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>}
          </TableCell>)
        })}
      </TableRow>
    </TableHead>
  );
}


function descendingComparator(a, b, orderBy) {

  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
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

const DynamicTable = (props) => {
  const {
    data = null,
    ChangeHandler = null,
    multiSelect = false,
    direction = 'ltr',
    dynamicHeight = "100%",
    picklist = false,
    picklist_val = "",
    handleToggle = null,
    showBatching = true,
    serverOrder = 'asc',
    serverOrderBy = '',
    setServerOrder,
    setServerOrderBy,
    drillHandler
  } = props;
  const table_properties = data && data.table_properties ? data.table_properties : {};
  const classes = useStyles({ dynamicHeight });
  const [reportData, setReportData] = useState();

  const [isLoading, setIsLoading] = useState({ msg: "", loading: true });
  const { loading, msg } = isLoading;
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const dispatch = useDispatch();
  useEffect(() => {

    let dataCopy = [...data.table.row_arr];
    let headerData = dataCopy[0];

    for (let i = 1; i < dataCopy.length; i++) {
      for (let j = 0; j < dataCopy[i].c_arr.length; j++) {
        let newObj = {
          [headerData.c_arr[j].val]: dataCopy[i].c_arr[j].val,
          "bg_col": dataCopy[i]?.c_arr[j]?.bg_col,
          "label_color": dataCopy[i]?.c_arr[j]?.label_color,
          "lnk_dta": dataCopy[i]?.c_arr[j]?.lnk_dta,
        }
        dataCopy[i].c_arr[j] = newObj;
      }
    }

    let newData = [];

    for (let i = 0; i < dataCopy.length; i++) {
      let currentObject = { ...dataCopy[i] }
      for (let j = 0; j < currentObject.c_arr.length; j++) {
        currentObject = {
          ...currentObject,
          ...currentObject.c_arr[j]
        }
      }
      newData.push(currentObject);
    }
    setReportData(newData);
  }, [data]);
  useEffect(() => {
    setIsLoading({ ...isLoading, loading: false });
  }, [reportData]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const row = (reportData != null && reportData.length > 0 && reportData.slice(1));
  const header = (reportData != null && reportData.length > 0 && reportData[0]);

  const findIndex = (index) => {
    for (let i = 0; i < picklist_val.length; i++) {
      if (picklist_val[i].index === index) {
        return true;
      }
    }
    return false;
  }


  return (
    <div style={{ flex: '1' }}>
      <div style={{ height: '100%' }}>
        {isLoading.loading === false && <TableContainer classes={{ root: classes.root1 }}>
          <Table
            //   className={stylesheet.tableWrap}
            aria-labelledby="tableTitle"
            size="dense"
            aria-label="enhanced table"
            stickyHeader
            
            style={{...table_properties.tableBodyStyle}}
          >
            {(EmptyObject(reportData) || reportData.length < 2) ?
              (<NotFound msg="" />) :
              <React.Fragment>
                <EnhancedTableHead
                  table_properties={table_properties}
                  classes={classes}
                  direction={direction}
                  showBatching={showBatching}
                  ChangeHandler={ChangeHandler}
                  order={order}
                  orderBy={orderBy}
                  serverOrder={serverOrder}
                  serverOrderBy={serverOrderBy}
                  setServerOrder={setServerOrder}
                  setServerOrderBy={setServerOrderBy}
                  onRequestSort={handleRequestSort}
                  header_data={reportData.length > 0 ? reportData[0] : []}
                  multiSelect={multiSelect}
                />
                <TableBody >
                  {stableSort(row, getComparator(order, orderBy)).map((res, rowindex) => {
                    return (
                      <TableRow
                        hover
                        style={table_properties.tableRowStyle}
                        role="checkbox"
                        key={rowindex}
                        selected={picklist && findIndex(rowindex) ? true : false}
                        onClick={picklist ? () => handleToggle(res, rowindex) : null}
                      >
                        {multiSelect && <TableCell
                          padding="checkbox"
                        >
                          <Checkbox
                            checked={picklist && findIndex(rowindex) ? true : false}
                            onClick={picklist ? () => handleToggle(res, rowindex) : null}
                          />
                        </TableCell>}
                        {res.c_arr.map((record, index) => {
                          let tableCellStyle = {}
                          if (table_properties.tableCellStyle) {
                            tableCellStyle = table_properties.tableCellStyle(row.length === rowindex - 1, res.c_arr.length === index - 1)
                          }
                          return (<TableCell
                            align={table_properties.row_font_alignment ? table_properties.row_font_alignment : direction==="ltr"?"left":"right"}
                            style={{
                              backgroundColor: record?.bg_col ? record.bg_col : '',
                              color: record?.label_color ? record.label_color : '',
                              borderBottom: "2px solid #f8f8f8",
                              ...tableCellStyle,
                            }}
                          >
                            {record && header && header.c_arr ? record.lnk_dta ? <a style={{
                              // fontWeight: record.lnk_dta ? 800 : undefined,
                              cursor: record.lnk_dta ? 'pointer' : undefined,
                              color: 'black',
                              textDecoration: 'underline',
                            }} onClick={() => drillHandler(record.lnk_dta)} >{record[header.c_arr[index].val]}</a> : record[header.c_arr[index].val] : '-'}
                          </TableCell>)
                        })}
                      </TableRow>
                    );
                  })}

                </TableBody>
              </React.Fragment>}
          </Table>
        </TableContainer>
        }
      </div>
    </div>
  );
}

export default withRouter(DynamicTable);