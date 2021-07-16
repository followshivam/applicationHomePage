import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconImage,
  Tooltip,
  Spinner,
  clsx,useTranslation,
  SearchBox,
  DropdownFilter,
} from "component";
import { EmptyObject } from "global/methods";
import NotFound from "component/NotFound";
import { useSelector } from 'react-redux';


const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  title: {
    fontSize: "16px",
    fontWeight: "600",
    margin: "0px 0px 10px 15px"
  },
  spinner: {
    height: "600px"
  },
  head: {
    backgroundColor: props => props.backgroundColor != null ? props.backgroundColor : theme.palette.backgroundContainer,
  },
  tableWrap: {
    thead: {
      th: {
        borderBottom: "none"

      },
    },
    tr: {
      td: {
        paddingTop: "2px",
        whiteSpace: "nowrap",

      },
      th: {
        paddingTop: "2px",
        whiteSpace: "nowrap",
      },
    },
  },
  buttonWrapper: {
    margin: "0px 16px",
    height: "27.5px",
    width: "138px",
    backgroundColor: theme.palette.common.white
  },
  TableCell: {
    // maxWidth: "100px",
    borderBottom: "4px inset !important"
  },
  headerRightWrapper: {
    display: "flex",
    flexWrap: "wrap"

  },
  row_color: {
    backgroundColor: theme.palette.common.white,
    '& .MuiTableRow-hover': {
      boxShadow: "0px 3px 6px #00000029",
      transition: "100% 2s ease-in"  },
  },
  root1: {
    height: props => props.dynamicHeight,
    display: 'grid',
    paddingBottom: "12px",
    minWidth: props => props.minWidth
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
  sticky: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "15px",
    width: "100%",
    flexWrap: "wrap",
    zIndex: 99,
    background: "#f8f8f8",
    position: "sticky",
    top: "55px"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "15px",
    width: "100%",
    flexWrap: "wrap",
    zIndex: 99,
    background: "#f8f8f8",
  },


}));

function EnhancedTableHead(props) {
  const {
    classes,
    imageInfo,
    headerData = [],
    disableImg = false,
  } = props;



  return (
    <TableHead>
      <TableRow >
        {disableImg === true ? null :
          <TableCell className={clsx(classes.TableCell, classes.head)}>
            <IconImage className={classes.icon}
              url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/file.svg`}
              height={25} width={25} />
          </TableCell>}
        {headerData.map((headCell, key) => (
          <TableCell
            className={clsx(classes.TableCell, classes.head)}
            align={headCell.align}
            key={key}
            width={headCell.width != null ? headCell.width : null}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
};



const RecentTable = (props) => {
  const {
    tableData = [],
    headerData = [],
    dynamicHeight = "100%",
    loading = true,
    disableImg = false,
    minWidth = "700px",
    backgroundColor = null,
    isSearch = true,
    isFilter = true,
    imageInfo = {
      path: `${process.env.REACT_APP_CONTEXT_PATH}/icons/`,
      ext: '.svg'
    }
  } = props;
  const classes = useStyles({ dynamicHeight, backgroundColor, minWidth });
  const [selected, setSelected] = React.useState([]);
  const [goingUp, setGoingUp] = React.useState(false);
  const [globalSetting] = useSelector(state => {
    return [state.globalSettings];
  });
  const { t } = useTranslation(globalSetting.locale_module)
  
  useEffect(() => {
    const header = document.getElementById("myHeader");
    const sticky = header.offsetTop - 55;
    const scrollCallBack = window.addEventListener("scroll", () => {
      if (window.pageYOffset > sticky) {
        setGoingUp(true)
      } else {
        setGoingUp(false)
      }
    });
    return () => {
      window.removeEventListener("scroll", scrollCallBack);
    };
  }, []);


  return (
    <div className={classes.root}>
      <div id="myHeader" className={goingUp ? classes.sticky : classes.header}>
        <Typography className={classes.title} noWrap={true} > Recents</Typography>
        <div className={classes.headerRightWrapper}>
          <form onSubmit={(e) => {
            e.preventDefault();
            let param = e.target.search.value.trim();
            if (param != '') {
              // props.onChange("search", param)
            }
          }}>
            {isSearch ?
              <SearchBox
                height="27.5px" width="200px"
                clearSearchResult={"onClearSearch"}
                name="search" placeholder={t('bam:TITLE_SEARCH')}
              />
              : null}
          </form>
          {isFilter ? <div className={classes.buttonWrapper}>
            <DropdownFilter
              variant=""
              color=""
              type="button"
              label={t('bam:All Status')}
              // inputState={inputData}
              onChangeHandler={props.onChange}
              name=""
            />
          </div> : null}
        </div>
      </div >
      <TableContainer classes={{ root: classes.root1 }} style={{ placeItems: (EmptyObject(tableData) || tableData.length < 1) ? "center" : "start" }} >
        <Table
          className={classes.tableWrap}
          stickyHeader
        >
          {loading ? (
            <div className={classes.spinner}>
              <Spinner />
            </div>
          ) :
            (EmptyObject(tableData) || tableData.length < 1) ?
              <div><NotFound msg="" /></div>
              : <React.Fragment>
                <EnhancedTableHead
                  classes={classes}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  headerData={headerData}
                  imageInfo={imageInfo}
                  {...props}
                />
                <TableBody >
                  {tableData.map((i, index) => {
                    return (
                      i?.value.map((res, ind) => {
                        console.log("lable :",i)
                        return (
                          <TableRow
                            className={classes.row_color}
                            hover={true}
                            role="checkbox"
                            tabIndex={-1}
                            key={ind}
                          >
                            {/* {i.label} */}
                            {disableImg === true ? null : <TableCell className={classes.TableCell} >
                              <IconImage className={classes.icon} url={`${imageInfo.path}${res.img_type === '1' ? 'Report' : 'Schedule_icon'}${imageInfo.ext}`} height={25} width={25} />
                            </TableCell>}
                            {headerData.map((result, key1) => {
                              return (<TableCell
                                key={key1}
                                align={result.align != null ? result.align : "left"}
                                className={clsx(classes.TableCell, result.className, result.onClick != null ? classes.clickable : "")}
                                width={result.width != null ? result.width : null}
                                onClick={result.onClick != null ? () => result.onClick(res) : null}
                              >
                                {(result.id === "" && result.component != null) ?

                                  result.component(res, index) : (<Tooltip title={`${res[result.id]}`} arrow key=''>
                                    <Typography
                                      variant="subtitle1"
                                      noWrap={true}
                                      {...result.typographyProps}
                                    >
                                      <div> {res[result.id] ? res[result.id] : "-"}</div>
                                      <div> {res.type ? res.type : "-"}</div>

                                    </Typography>
                                  </Tooltip>)}
                              </TableCell>)
                            })}
                          </TableRow>
                        );
                      }))
                  })}
                </TableBody>

              </React.Fragment>}
        </Table>
      </TableContainer>
    </div >
  );
}

export default RecentTable;

