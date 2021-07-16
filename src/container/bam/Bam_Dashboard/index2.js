import React, { useState, lazy, useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  makeStyles,
  AppBar,
  CssBaseline,
  FullScreenDialog,
  CustomDialog,
  MainHeader,
  Sidebar,
  StyledTab,
  Spinner,
  Dropdown,
  IconImage
} from "component";
import {
  FullScreenDialogInitialState,
  FullScreenDialogOpen,
  FullScreenDialogClose,
  NormalScreenDialogInitialState,
  NormalScreenDialogOpen,
  NormalScreenDialogClose
} from "redux/action";
import { GetDashboardList, GetDashboardDef } from "global/bam/api/ApiMethods";
import GridView from "./grid_view";
import { DummyJson1, DummyJson2, DummyJson3 } from "global/json";
const ManageDashboard = lazy(() => import("./Dashboard/dashboard"));
const UserPrefrences = lazy(() => import("./UserPreference/user_preference"));
const Templates = lazy(() => import("./templates.js"));
const ManageTabs = lazy(() => import("./Tabs/tabs"));
//const GridView = lazy(() => import("./grid_view"));
const tabHeight = 42;
const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    background: "white"
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
    marginTop: "60px",
    flexGrow: "1"
  }
}));

const sidebar_list = {
  layout_type: "default",
  item_list: [
    // {
    //   id: 1,
    //   component: null,
    //   label: "Dashboard",
    //   default_url: "icons/reports.svg",
    //   tabs: [{ id: 1, index: 0, label: "Tab1", icon: "icons/reports.svg", disabled: false }, { id: 2, index: 1, label: "Tab2", icon: "icons/reports.svg", disabled: false }]
    // },
    // {
    //   id: 2,
    //   component: null,
    //   label: "My Inbox",
    //   default_url: "icons/scheduler.svg",
    //   tabs: [{ id: 1, index: 0, label: "Tab1", icon: "icons/reports.svg", disabled: false }, { id: 2, index: 1, label: "Tab2", icon: "icons/reports.svg", disabled: false }]
    // },
    // {
    //   id: 3,
    //   component: null,
    //   label: "Omniapp Configuration",
    //   default_url: "icons/auditlog.svg",
    //   tabs: [{ id: 1, index: 0, label: "Tab1", icon: "icons/reports.svg", disabled: false }, { id: 2, index: 1, label: "Tab2", icon: "icons/reports.svg", disabled: false }]
    // },
    // {
    //   id: 4,
    //   component: null,
    //   label: "User Management",
    //   default_url: "icons/auditlog.svg",
    //   tabs: [{ id: 1, index: 0, label: "Tab1", icon: "icons/reports.svg", disabled: false }, { id: 2, index: 1, label: "Tab2", icon: "icons/reports.svg", disabled: false }]
    // }
  ]
};

const tabsArray = [{ id: 1, index: 0, label: "Tab1", component: GridView }];

const Dashboard = props => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState("1");
  const [sidebarList, setSidebarList] = useState([]);
  const [tabsList, setTabsList] = useState([]);
  const [tabData, setTabData] = useState({
    template_info: [],
    instance_desc: {}
  });
  const [defaultValues, setDefaultValues] = useState({
    dashboard_id: "",
    tab_id: ""
  });
  const [isLoading, setIsLoading] = useState({
    msg: "Loading...",
    loading: true
  });
  const { loading, msg } = isLoading;
  const [fullDialogStore, normalDialogStore] = useSelector(state => {
    return [state.fullDialogState, state.normalDialogState];
  });

  const dispatch = useDispatch();
  const onChangeHandler = val => {
    setDefaultValues({dashboard_id:val,tab_id:""});
  };

  useEffect(() => {
    setIsLoading({ ...isLoading, loading: true });
    let { dashboard_id, tab_id } = defaultValues;
    if (dashboard_id === "" && tab_id === "") {
      let default_dashboard =
        DummyJson1.data.dashboard_info.default_dashboard_id;
      let default_tab = DummyJson1.data.dashboard_info.default_tab_id;
      let data = DummyJson1.data.dashboard_info.dashboards;
      let sidebarData = data.map(res => {
        return { id: res.id, name: res.name };
      });
      let tabList = data.filter(res => res.id === default_dashboard)[0].tabs;
      let tabRecord = tabList.filter(res => res.id === default_tab)[0];
      setTabData({
        template_info: tabRecord.template_def,
        instance_desc: tabRecord.instances
      });
      setDefaultValues({
        dashboard_id: default_dashboard,
        tab_id: default_tab
      });
      setSidebarList(sidebarData);
      setTabsList(tabList);
    } else if (dashboard_id !== "" && tab_id === "") {
      /* Sidebar Switch*/
      // let default_dashboard=DummyJson2.data.dashboard_info.default_dashboard_id;
      let default_tab = DummyJson2.data.dashboard_info.default_tab_id;
      let data = DummyJson2.data.dashboard_info.dashboards;
      let tabList = data[0].tabs;
      let tabRecord = tabList.filter(res => res.id === default_tab)[0];
      setTabData({
        template_info: tabRecord.template_def,
        instance_desc: tabRecord.instances
      });
      //setDefaultValues({dashboard_id:default_dashboard,tab_id:default_tab});
      setTabsList(tabList);
    } else if (dashboard_id !== "" && tab_id !== "") {
      /* Tab Switch */
      let default_tab = DummyJson2.data.dashboard_info.default_tab_id;
      let data = DummyJson2.data.dashboard_info.dashboards;
      let tabRecord = data[0].tabs[0];
      setTabData({
        template_info: tabRecord.template_def,
        instance_desc: tabRecord.instances
      });
      //setDefaultValues({dashboard_id:default_dashboard,tab_id:default_tab});
    }
    setIsLoading({ ...isLoading, loading: false });
  }, [defaultValues]);
  useEffect(() => {
    dispatch(
      FullScreenDialogInitialState({
        open: false,
        label: "",
        openDialog: (component, label) => {
          dispatch(FullScreenDialogOpen(component, label));
        },
        closeDialog: () => {
          dispatch(FullScreenDialogClose());
        }
      })
    );
    dispatch(
      NormalScreenDialogInitialState({
        open: false,
        label: "",
        openDialog: (component, label) => {
          dispatch(NormalScreenDialogOpen(component, label));
        },
        closeDialog: () => {
          dispatch(NormalScreenDialogClose());
        }
      })
    );
  }, []);
  const getDashboardDef = (dashboard_id, tab_id) => {
    let inputData = {
      dashboard_id: dashboard_id,
      tab_id: tab_id
    };
    setIsLoading({ ...isLoading, loading: true });
    GetDashboardDef(inputData)
      .then(res => {
        if (res != null && res.status.maincode === "0") {
          setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 500);
        }
      })
      .catch(err => {});
  };
  console.log(tabsList)
  console.log(sidebarList)
  console.log(tabData)
  return (
    <div className={classes.main_container}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar} dense="true">
        <MainHeader />
      </AppBar>
      {loading?<Spinner msg={msg}/>:<React.Fragment><Sidebar
        sidebar_list={sidebarList}
        active={defaultValues.dashboard_id}
        onChangeTab={onChangeHandler}
        labelKey="name"
        valueKey="id"
      />
       <div className={classes.container}>
        <StyledTab tabsArray={tabsList} activeTab={defaultValues.tab_id} changeTabHandler={(val)=>setDefaultValues({...defaultValues,tab_id:val})} tabData={tabData} tabHeight={'42px'} container={true}>  
         <Dropdown  name={true} type="button" label="Manage" startIcon={<IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/eye.svg`} height={15} />}
                  list={[
                    { id: 1, value: "Tabs", label: "Tabs" ,action: () => normalDialogStore.openDialog(<Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}><ManageTabs  /></Suspense>, "Business Activity Monitor (Manage Tabs)") },
                    { id: 2, value: "Dashboard", label: "Dashboard",action: () => normalDialogStore.openDialog(<Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}><ManageDashboard/></Suspense>, "Dashbord") },
                    { id: 3, value: "Templates", label: "Templates",action: () => normalDialogStore.openDialog(<Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}><Templates/></Suspense>, "Templates") },
                    { id: 4, value: "User Preference", label: "User Prefrence",action: () => normalDialogStore.openDialog(<Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}><UserPrefrences/></Suspense>, "User Prefrence") },
                  ]}
                /> 
        </StyledTab>
                
      </div>
  </React.Fragment> } 
 {/*
  */}
      {fullDialogStore.open ? (
        <FullScreenDialog>{fullDialogStore.component}</FullScreenDialog>
      ) : null}
      {normalDialogStore.open ? (
        <CustomDialog>{normalDialogStore.component}</CustomDialog>
      ) : null}
    </div>
  );
};
export default Dashboard;
