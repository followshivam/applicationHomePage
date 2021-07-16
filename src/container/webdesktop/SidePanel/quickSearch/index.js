
import React, { useState, useEffect } from 'react';
import {
  makeStyles, Popover, IconImage, Typography,
  Spinner, useTranslation, Checkbox, List,
  ListItem, ListItemSecondaryAction, ListItemIcon,
  ListItemText, ListSubheader
} from "component";
import { GetSearchConf, GetWorkItemList } from "global/webdesktop/api/ApiMethods";
import { GetWDWorkItemList } from "global/json";
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    paddingBottom: "20px"
  },
  list: {
    display: "flex",
    flexDirection: "column",
    borderBottom: "1px solid #C3C4C3",
    paddingBottom: "20px"
  },
  listIcon: {
    minWidth: 30
  },
  active_drawer: {
    background: "#468AD941",
    height: "30px",
    borderLeft: `4px solid #0072C6`,
    transition: "all 0.1s ease-in",
    "&:hover": {
      background: '#468AD941 !important'
    },
  },
  listSubHeader: {
    color: "#000000",
    fontSize: "14px",
    fontWeight: 600,
    display: "flex",
    width: "100%",
    paddingRight: "5px",
    justifyContent: "space-between"
  },
  ListItemText: {
    color: '#000000',
    '& .MuiTypography-body2': {
      fontSize: 12,
      fontWeight: 300,
      color: '#000000'
    },
  },
  subText:{
   color:'#0072C6',
   fontSize:"12px",
   opacity:'0.9',
   marginRight:"13px"
  },
  ListItem: {
    // borderLeft: `4px solid transparent`,
    height: "30px",
    '& .MuiTypography-body2': {
      fontSize: 12,
      fontWeight: 300,
      color: '#000000'
    },
  },
  icon: {
    marginRight: "5px"
  },
  paper: {
    borderRadius: "6px",
    width: props => props.width
  },
  noDataFound: {
    color: "#000000",
    fontStyle: "italic",
    fontSize: "12px",
    opacity: 0.58,
    display: "flex",
    margin: "0 0 20px 20px"
  },

}));

const QuickSearch = (props) => {

  const {
    width = "300px",
    height = "128px",
    direction = "ltr",
    openSideways = true,
    background = "#fff !important"
  } = props;

  const [globalSetting, snackbarState] = useSelector(state => {
    return [state.globalSettings, state.snackbarState];
  });

  const { t } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp", "wd"])
  const [isLoading, setIsLoading] = useState({ msg: `${t('bam:LOADING')}...`, loading: false });
  const { loading, msg } = isLoading;
  const classes = useStyles({ height, width, direction, background });
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const anchor = Boolean(anchorEl);
  const [inputData, setInputData] = React.useState(GetWDWorkItemList);
  // const [searchList, setSearchList] = useState([{ "id": "", "name": "" }]);
  const [listData] = useState([
    {
      "id": "0",
      "name": "Recent searches",
      "batching": false,
      "subList": [
        {
          "id": "0",
          "name": "LM-12345",

        },
        {
          "id": "1",
          "name": "LM-123",

        },
        {
          "id": "2",
          "name": "LM-45",

        },


      ]
    },
    {
      "id": "1",
      "name": "Saved searches",
      "batching": true,
      "subList": [
        {
          "id": "0",
          "name": "Test_Search",
        },
        {
          "id": "1",
          "name": "Home_Loan",
        },
        {
          "id": "2",
          "name": "Testing",
        },

      ]
    },
    {
      "id": "2",
      "name": "Suggestions",
      "batching": true,
      "subList": [
        {
          "id": "0",
          "name": "Workitems assigned to me",
        },
        {
          "id": "1",
          "name": "Workitems I have created",
        },
        {
          "id": "2",
          "name": "Cases assigned to me",
        },
        {
          "id": "3",
          "name": "Tasks assigned to me",
        },
        {
          "id": "4",
          "name": "Recently completed tasks",
        }
      ]
    },

  ]);
  const [activeTab, setActiveTab] = useState({ name: listData[0].name, id: 0 });

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
          // setData(response?.data)
        }
        else {
          snackbarState.openSnackbar(response != null ? response?.status?.errormsg : "Something went wrong", 'warning')
        }
      }).catch(error => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    // getSearchConf();
  }, []);

  return (
    <div className={classes.root}    >
      <IconImage
        className={classes.searchIcon}
        url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/more1.svg`}
        width={28}
        height={28}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      />
      <Popover
        open={anchor}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: openSideways ? "top" : "bottom",
          horizontal: openSideways && direction === "ltr" ? "right" : "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: openSideways && direction === "rtl" ? "right" : "left",
        }}
        style={{
          marginLeft: openSideways ? direction === "ltr" ? "0.6rem" : "-0.6rem" : 0,
          direction: direction,
        }}
        classes={{
          paper: classes.paper,
        }}
      >
        {loading ? <div className={classes.listWrapper}><Spinner msg={msg} /></div> :
          <div style={{padding:"0 15px"}}>  {listData.map((item, key) => {
            return <List subheader={<div style={{ display: "flex", whiteSpace: "nowrap" }}><ListSubheader disableSticky={true} className={classes.listSubHeader}>{item.name}
              <div className={classes.subText}>{item?.name === "Saved searches" ? "View All" : item?.name === "Recent searches" ? "Clear All" : null}</div>
            </ListSubheader></div>} className={classes.list}>
              {item?.subList.length > 0 ? item?.subList.map((value) => {
                const labelId = `checkbox-list-secondary-label-${value}`;
                return (
                  <ListItem key={value?.id}
                    //  className={(value.id == activeTab.id && activeTab.name == value.name) ? classes.active_drawer : classes.ListItem}
                    className={classes.ListItem}
                    button key={value.name} onClick={() => { setActiveTab({ name: value.name, id: value.id }) }}>
                    <ListItemIcon className={classes.listIcon}>
                      <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/comp_icon.svg`} width={20} height={20} />
                    </ListItemIcon>
                    <Typography variant="subtitle1" noWrap={true}>
                      <ListItemText className={classes.ListItemText} id={labelId} primary={value?.name} />
                    </Typography>
                    {item?.name === "Saved searches" ? <ListItemSecondaryAction>
                      <Checkbox
                        edge="end"
                        name='checkbox'
                        checked={value.pinned}
                        // onChange={() => handlePin(value)}
                        inputProps={{ 'aria-labelledby': labelId }}
                        icon={<IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/pin_grey.svg`} width={16} height={16} />}
                        checkedIcon={<IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/pin.svg`} width={20} height={20} />}
                      />
                    </ListItemSecondaryAction> : null}
                  </ListItem>
                );
              }) : <div className={classes.noDataFound}>No queues found</div>}
            </List>
          })}</div>}
      </Popover>
    </div>
  );
}

export default React.memo(QuickSearch);


