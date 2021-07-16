import React, { useState, lazy, useEffect, Suspense } from "react";
import {
  Typography, Spinner, makeStyles, IconImage, clsx, Dialog, Slide, Paper, Toolbar, Dropdown, Tabs,
  Tab, AppBar, Button, IconButton, FullScreenDialog, CustomDialog,Grid
} from "component";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { FullScreenDialogInitialState, FullScreenDialogOpen, FullScreenDialogClose, NormalScreenDialogInitialState, NormalScreenDialogOpen, NormalScreenDialogClose } from "redux/action";
const ReportDesigner = lazy(() => import("../ReportDesigner/Home/home"));
const ReportScheduler = lazy(() => import("../ReportScheduler/report_scheduler"));
const GridView = lazy(() => import("./grid_view"));
const ManageDashboard = lazy(() => import("./Dashboard/dashboard"));
const UserPrefrences = lazy(() => import("./UserPreference/user_preference"));
const Templates = lazy(() => import("./templates.js"));
const ManageTabs = lazy(() => import("./Tabs/tabs"));
const drawerWidth = 240;

const tabHeight = 42
const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: "white"
  },
  buttonWrapper: {
    margin:" 7px 3px 7px 1118px",
    padding: "1px 9px",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerPaper: {
    background: "#222222 0% 0% no-repeat padding-box",
    color: theme.palette.common.white,
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),

    overflowX: 'hidden',
    width: "80px",
    [theme.breakpoints.up('sm')]: {
      width: "80px",
    },
  },
  listItem: { dislay: "flex", flexWrap: "wrap" },
  listItemOpen: { height: "39px", flexDirection: "row", justifyContent: "center", alignItems: "center" },
  listItemClose: { height: "62px", flexDirection: "column", justifyContent: "center", alignItems: "center" },
  labelClose: {
    marginLeft: "-20px",
    fontSize: "10px"
  },
  main_container: {
    display: "flex",
    flex: 1,
    background: theme.palette.backgroundContainer,
    overflow: "auto",
    minHeight: "750px",
    width: "100%"
  },
  container: {
    //  paddingLeft: theme.spacing(3),
    //paddingRight: theme.spacing(3),
    // flexGrow: "1",
    minHeight: "750px",
    // marginLeft:"80px"
  },
  active_tab: {
    background: "#393939 0% 0% no-repeat padding-box",
    borderLeft: `2px solid ${theme.palette.primary.main}`,
    transition: "all 0.1s ease-in",
    //  width:"76px",
  },
  tabs: {
    minHeight: tabHeight,
    height: tabHeight
  },
  tab: {
    border: `1px solid ${theme.palette.borderColor}`,
    backgroundColor: theme.palette.common.white,
    fontSize: '12px',
    minWidth: '72px',
    textTransform: 'none',
    minHeight: tabHeight,
    height: tabHeight
  },
  tab_container: {
    flexGrow: 1,
    width: 'calc(97vw - 80)',
    // backgroundColor: theme.palette.backgroundContainer,
    background: "#EFEFEF",
    padding: theme.spacing(0, 1, 0, 1),
    border: `1px solid ${theme.palette.borderColor}`,
    minHeight: "600px"
  },
  tabSelected: {
    color: theme.palette.primary.main
  },
  
}));
const Sidebar = props => {
  const classes = useStyles();
  const { sidebar_list, active, onChangeTab = null } = props;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(!open);
  };
  const clickHandler = index => {
    if (onChangeTab != null) {
      onChangeTab(index);
    }
  };
  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx(classes.drawerPaper, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <Toolbar />
      <List>
        {sidebar_list.item_list.map((res, index) => {
          const checkActive = res.id === active ? true : false;
          return (
            <ListItem button key={index}
              className={clsx(checkActive ? classes.active_tab : "", classes.listItem, {
                [classes.listItemOpen]: open,
                [classes.listItemClose]: !open,
              })}
              onClick={() => clickHandler(res.id)}
            >
              <ListItemIcon> <InboxIcon style={{ height: "20px", width: "35px", color: "white" }} /> </ListItemIcon>
              <ListItemText primary={res.label} classes={{ primary: classes.labelClose }} />
            </ListItem>
          )
        })}
      </List>
      <p onClick={handleDrawerClose} style={{ bottom: 0, position: "absolute", cursor: "pointer",width:"100%",textAlign:"right" }}>{open ? "Collapse <<" : "Expand >>"}</p>
    </Drawer>

  );
};

const TabPanel = props => {
   const classes = useStyles()
   const { children, value, index } = props

   return <div>{value === index && <div>{children}</div>}</div>
}

const Container = React.memo(function Container(props){
  const classes = useStyles();
  const { sidebar_list, active } = props;
  const [configValue, setconfigValue] = useState(0);
  const store = useSelector(state => {
    return state.normalDialogState;
  });
  const handleConfigurations = (e, val) => {
    setconfigValue(val)
  }
  return (
    <div >
      {sidebar_list.layout_type === "default" ? sidebar_list.item_list.map((res, key) => {
        return res.id === active ? (<Paper key={key}>
            <Grid container justify="space-between" alignItems="center">
              <Tabs item  value={configValue} className={classes.tabs} variant="standard" onChange={handleConfigurations} >
                {res.tabs.map((result, key1) => <Tab label={result.label} key={key1}  classes={{ selected: classes.tabSelected, root: classes.tab }} />)}
              </Tabs>
              <Grid item >
                    <Dropdown  name={true} type="button" label="Manage" startIcon={<IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/eye.svg`} height={15} />}
                  list={[
                    { id: 1, value: "Tabs", label: "Tabs" ,action: () => store.openDialog(<Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}><ManageTabs data={res} /></Suspense>, "Business Activity Monitor (Manage Tabs)") },
                    { id: 2, value: "Dashboard", label: "Dashboard",action: () => store.openDialog(<Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}><ManageDashboard/></Suspense>, "Dashbord") },
                    { id: 3, value: "Templates", label: "Templates",action: () => store.openDialog(<Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}><Templates/></Suspense>, "Templates") },
                    { id: 4, value: "User Preference", label: "User Prefrence",action: () => store.openDialog(<Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}><UserPrefrences/></Suspense>, "User Prefrence") },
                  ]}
                />
                </Grid>
                </Grid>
                <GridViewContainer res={res} configValue={configValue}  classes={classes}/>
            </Paper>
        ) : null;
      }) : sidebar_list.item_list.map((res, key) => {
        return res.id === active ? (
          <Suspense
            fallback={
              <div style={{ height: "100vh" }}>
                <Spinner msg="" />
              </div>
            }
          >
            <res.component />
          </Suspense>
        ) : null;
      })}
    </div>
  );
});
const GridViewContainer=React.memo(function(props){
  const {res=[],configValue,classes}=props;
  return( <div  className={classes.tab_container}>
                {res.tabs.map((result, key1) => <TabPanel value={configValue} index={result.index}>
                  <Suspense fallback={<div style={{ minHeight: "516px" }}>
                    <Spinner msg="" />
                  </div>}>
                    <GridView data={result} value={configValue}/></Suspense>
                </TabPanel>)}
              </div>)
})
const sidebar_list = {
  layout_type: "default",
  item_list: [
    {
      id: 1,
      component: ReportDesigner,
      label: "Dashboard1",
      default_url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/reports.svg`,
      tabs: [{ id: 1, index: 0, label: "Tab1", icon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/reports.svg`, disabled: false }, { id: 2, index: 1, label: "Tab2", icon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/reports.svg`, disabled: false }]
    },
    {
      id: 2,
      component: ReportScheduler,
      label: "Dashboard2",
      default_url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/scheduler.svg`,
      tabs: [{ id: 1, index: 0, label: "Tab1", icon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/reports.svg`, disabled: false }, { id: 2, index: 1, label: "Tab2", icon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/reports.svg`, disabled: false }]
    },
    {
      id: 3,
      component: ReportDesigner,
      label: "Dashboard3",
      default_url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/auditlog.svg`,
      tabs: [{ id: 1, index: 0, label: "Tab1", icon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/reports.svg`, disabled: false }, { id: 2, index: 1, label: "Tab2", icon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/reports.svg`, disabled: false }]
    }
  ]
};

const Dashboard = props => {

  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(1);
  const [fullDialogStore, normalDialogStore] = useSelector(state => {
    return [state.fullDialogState, state.normalDialogState];
  });

  const dispatch = useDispatch();
  const onChangeHandler = val => {
    setActiveStep(val);
  };
  useEffect(() => {
    dispatch(FullScreenDialogInitialState({
      open: false,
      label: "",
      openDialog: (component, label) => {
        dispatch(FullScreenDialogOpen(component, label))
      },
      closeDialog: () => {
        dispatch(FullScreenDialogClose())
      }
    }));
    dispatch(NormalScreenDialogInitialState({
      open: false,
      label: "",
      openDialog: (component, label) => {
        dispatch(NormalScreenDialogOpen(component, label))
      },
      closeDialog: () => {
        dispatch(NormalScreenDialogClose())
      }
    }));

  }, [])
  return (
    <div className={classes.main_container}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar} dense>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
  <Sidebar
        sidebar_list={sidebar_list}
        active={activeStep}
        onChangeTab={onChangeHandler}
      />
      <div className={classes.container}>
        <Toolbar />
        <Container sidebar_list={sidebar_list} active={activeStep} />
      </div>
      {fullDialogStore.open ? <FullScreenDialog >
        {fullDialogStore.component}
      </FullScreenDialog> : null}
      {normalDialogStore.open ? <CustomDialog >
        {normalDialogStore.component}
      </CustomDialog> : null}
    </div>
  );
};
export default Dashboard;