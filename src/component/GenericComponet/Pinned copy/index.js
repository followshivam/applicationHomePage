import React, { useState } from 'react';
import PropTypes from "prop-types";
import { Dropdown, Spinner } from 'component';
import RecentActivity from '../RecentActivity';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: "10px"
  },
  root_tile: {
    minWidth: props => props.width,
    maxWidth: props => props.width,
    maxHeight: props => props.height,
     margin: props => props.direction === "rtl" ? '0 0 19px 0px' : '0 5px 19px 0',
    boxShadow: '0px 3px 6px #0000001F',
    borderRadius: '4px',
    display: 'flex',
    border: '1px solid white',
    backgroundColor: theme.palette.common.white,
    '&:hover': {
      boxShadow: '0px 6px 12px #0000001F',
      border: "1px solid #1281DD"
    },
    cursor: 'pointer'
  },
  tile_container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent:"space-between",
    // paddingRight: props => props.direction === "rtl" ? '10px' : 0,
    maxHeight: props => props.viewLength ? "none" : "85px",
    overflow: "hidden",
    
  },
  heading: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: "space-between"
  },
  title: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "10px",
    paddingRight: props => props.direction === "rtl" ? '10px' : 0
  },
  count: {
    fontSize: "16px",
    marginBottom: "10px",
    color:"#606060",
    padding: props => props.direction === "rtl" ? '0 5px 0 0' : '0 0 0 5px'
  },
  root_tile_right: {
    padding: '6px 16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  tile_title: {
    textAlign: props => props.direction === "rtl" ? 'right' : 'left',
    fontSize: '14px',
    textTransform:"capitalize",
    maxWidth: "174px",
    fontWeight: "600",
    letterSpacing: '0px',
    color: '#000000',
    lineHeight:"19px",
    opacity: 1,
    margin: props => props.direction === "rtl" ? '0 0 8px 5px' : '0 5px 8px 0'
  },
  tile_status: {
    textAlign: props => props.direction === "rtl" ? 'right' : 'left',
    fontSize: '11px',
    letterSpacing: '0px',
    color: '#606060',
    opacity: 1,
    margin: '0 8px 0 3px'

  },
  tile_type: {
    textAlign: props => props.direction === "rtl" ? 'right' : 'left',
    fontSize: '11px',
    letterSpacing: '0px',
    color: '#606060',
    opacity: 1,
    maxWidth: "98px",
    margin: '0 8px 0 3px'

  },
  tile_subDesc: {
    fontSize: '10px',
    color: '#606060',
    lineHeight: '10px',
    paddingTop: "8px"
  },
  tile_subStatus: {
    display: "flex",
    alignItems: "center"
  },
  view_all: {
    color: "#0072C6",
    margin: "4px 16px",
    fontWeight: "600",
    fontSize: "12px",
    cursor: "pointer"
  }
}));


const Pinned = (props) => {
  const {
    pinnedData = [],
    headerData = [],
    action = [],
    defaultView = "tile",
    direction = `lft`,
    loading = false,
    height = "63pt",
    width = "165pt",
    imageInfo = {
      path: `${process.env.REACT_APP_CONTEXT_PATH}/icons/`,
      ext: '.svg',
    },
    label = {
      heading: `Pinned`,
      viewLess: `View Less`,
      viewAll: `View All`,
      last_modified: `Last Modified`,
    } 
  } = props;

  const [view, setView] = useState(defaultView);
  const [viewLength, setViewLength] = useState(false);
  const [hover, setHover] = useState(null);
  const [recentList, setRecentList] = useState([{ value: pinnedData }]);
  const classes = useStyles({ direction, width, height, viewLength });

  const onClickHandler = () => {
    if (pinnedData.length > 4) {
      setViewLength(!viewLength);
      if (viewLength) {
        setRecentList([{ value: pinnedData.slice(0, 4) }])
      } else {
        setRecentList([{ value: pinnedData}])
      }
    }
  }
  const onHover = (key) => {
    setHover(key)
  }
  const onHoverExit = () => {
    setHover(null)
  }

  return (
    <div className={classes.root}>
      {loading ? (
        <div className={classes.spinner}>
          <Spinner />
        </div>
      ) :
        (<React.Fragment>
          <div className={classes.heading} style={{ direction: direction }}>

            <div style={{ display: "flex" }}>

              <Typography className={classes.title} noWrap={true} > {label.heading}</Typography>
              <Typography className={classes.count} noWrap={true} > ({pinnedData?.length})</Typography>
              <div className={classes.view_all} onClick={onClickHandler}>
                {viewLength ? label?.viewLess : label?.viewAll}
              </div>

            </div>
            
            <div style={{ marginRight: "3px" }}>
              <Dropdown type="icons" endIcon="MoreVertIcon" list={[
                { id: 1, value: "Tile View", label: `Tile View`, "startIcon": `${process.env.REACT_APP_CONTEXT_PATH}/icons/tile_view.svg`, action: () => { setView('tile') } },
                { id: 2, value: "List View", label: `List View`, "startIcon": `${process.env.REACT_APP_CONTEXT_PATH}/icons/list_view.svg`, action: () => { setView('list') } },
              ]} />
            </div>
          </div>
          {view !== 'list' 
          ? 
          <div className={classes.tile_container} style={{ direction: direction }} >

            {pinnedData && pinnedData.map((res, key) => {
              return (
                <div key={key} className={classes.root_tile}
                  onMouseEnter={() => onHover(key)}
                  onMouseLeave={() => onHoverExit(key)}>

                  <div className={classes.root_tile_right}>

                    <div style={{ display: "flex" }}>
                      <Typography className={classes.tile_title} noWrap={true}>{res.name}</Typography>
                      {/* {res.version !== '' ? <Typography style={{ color: "#828282" }} >{res.version}</Typography> : null} */}
                    </div>

                    <div style={{ direction: props.direction, display: 'flex' }}>

                      <div className={classes.tile_subStatus}>
                        {(res.status === 'Good' || res.status === 'Enable') ?
                          <img src={`${imageInfo.path}good${imageInfo.ext}`} height={10} />
                          : (res.status === 'Running') ? <img src={`${imageInfo.path}running${imageInfo.ext}`} height={10} />
                            : <img src={`${imageInfo.path}block${imageInfo.ext}`} height={10} />}
                        {
                          (res?.type != '' && res?.type != undefined) &&
                          <Typography className={classes.tile_type} noWrap={true}>{res?.type}</Typography>
                        }
                      </div>

                      <div className={classes.tile_subStatus}>
                        <img src={`${imageInfo.path}${res.img_type}${imageInfo.ext}`} height={15} width={15} />
                        {
                          (res?.type != '' && res?.type != undefined) &&
                          <Typography className={classes.tile_type} noWrap={true}>{res?.type}</Typography>
                        }
                      </div>

                    </div>

                    <div style={{ display: "flex", whiteSpace: "nowrap", height: "25px" }}>

                      <div>
                        {res?.last_modified && <Typography className={classes.tile_subDesc}>{label.last_modified}:{res?.last_modified}</Typography>}
                      </div>

                      <div style={{ margin: "4px 0 0 20px", height: "15px" }}>
                        {(hover != null && hover === key) ?
                          <div >
                            {action?.map((item, index) => {
                              return (
                                <React.Fragment key={index}> { item.component()} </React.Fragment>
                              )
                            })}
                          </div> : null}
                      </div>

                    </div>
                  </div>
                </div>
              )
            })}
            </div>
            : <div >
              <RecentActivity
                headerData={headerData}
                recentList={recentList}
                isSticky={false}
                loading={loading}
                isSearch={false}
                direction={direction}
                heading={``}
                imageInfo={{
                  path: `${process.env.REACT_APP_CONTEXT_PATH}/icons/`,
                  ext: '.svg',
                }}
              />
            </div>
          }
        </React.Fragment>
        )}
    </div>
  );
};

Pinned.propTypes = {
  loading: PropTypes.bool.isRequired,
  pinnedData: PropTypes.array.isRequired,
  headerData: PropTypes.array.isRequired,
  defaultView: PropTypes.string,
  direction: PropTypes.string,
  imageInfo: PropTypes.shape({
    path: PropTypes.string.isRequired,
    ext: PropTypes.string.isRequired
  }),
  label: PropTypes.shape({
    heading: PropTypes.string.isRequired,
    viewLess: PropTypes.string.isRequired,
    viewAll: PropTypes.string.isRequired,
    last_modified: PropTypes.string.isRequired,
  }),
};
export default Pinned;

