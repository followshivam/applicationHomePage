import React, { useState, lazy, useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  makeStyles,
  // AppBar,
  // CssBaseline,
  // MainHeader,
  // Sidebar,
  DynamicStyledTab,
  Spinner,
  Dropdown,
  DynamicSidebar,
  IconImage,
  useTranslation
} from "component";
import { GetDashboardList, GetDashboardDef } from "global/bam/api/ApiMethods";
import GridView from "./grid_view";
// import { DummyJson1, DummyJson2, DummyJson3 } from "global/json";
const ManageDashboard = lazy(() => import("./Dashboard/dashboard"));
const UserPrefrences = lazy(() => import("./UserPreference/user_preference"));
const Templates = lazy(() => import("./templates.js"));
const ManageTabs = lazy(() => import("./Tabs/tabs"));
const DefaultLayout = lazy(() => import("./default_layout"));
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
  root: {
    display: 'flex',
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
    // marginTop: '55px',
    flexGrow: "1",
    overflow: "scroll",
    height: "calc(100vh - 60px)"
  },
  manage: {
    paddingBottom: "4px",
    paddingRight: "5px"
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
  const [fullDialogStore, normalDialogStore, globalSetting] = useSelector(state => {
    return [state.fullDialogState, state.normalDialogState, state.globalSettings];
  });

  const { t } = useTranslation(globalSetting.locale_module)
  const [tabData, setTabData] = useState({
    column_count : '3' , 
    template_info: [],
    instance_desc: {}
  });
  const [defaultValues, setDefaultValues] = useState({
    dashboard_id: "",
    tab_id: ""
  });
  const [passedDefaultValues, setPassedDefaultValues] = useState({
    dashboard_id: "",
    tab_id: "",
    opt: "0"
  });
  const [isLoading, setIsLoading] = useState({
    msg: `${t('bam:LOADING')}...`,
    loading: true
  });
  const { loading, msg } = isLoading;


  const dispatch = useDispatch();
  const onChangeHandler = val => {
    setPassedDefaultValues({ dashboard_id: val, tab_id: "", opt: "2" });
  };

  const getData = () => {
    let { dashboard_id, tab_id, opt } = passedDefaultValues;
    let inputData = {
      dashboard_id: dashboard_id,
      opt: passedDefaultValues.opt,
      tab_id: tab_id,
      user_id: localStorage.getItem("user_id")
    };
    //setIsLoading({ ...isLoading, loading: true });
    GetDashboardDef(inputData)
      .then(res => {
        console.log(res)
        if (res != null) {
          // setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 500);
          let response = res.data.dashboard_info;
          let default_dashboard =
            response.default_dashboard_id;
          let default_tab = response.default_tab_id;
          let data = response.dashboards;
          let tabList = data.filter(res => res.id === default_dashboard)[0].tabs;
          let tabRecord = tabList.filter(res => res.id === default_tab)[0];
          // console.log(tabList)
          if (dashboard_id === "" && tab_id === "") {

            let sidebarData = data.map(res => {
              return { id: res.id, name: res.name };
            });



            setSidebarList(sidebarData);
            setTabsList(tabList);
          } else if (dashboard_id !== "" && tab_id === "") {
            /* Sidebar Switch*/
            setTabsList(tabList);
          }
          setTabData({
            column_count : tabRecord.column_count,
            template_info: tabRecord.template_def,
            instance_desc: tabRecord.instances
          });
          setDefaultValues({
            dashboard_id: default_dashboard,
            tab_id: default_tab
          });
          setIsLoading({ ...isLoading, loading: false });
        }
      }).catch(err => { });
  }
  useEffect(() => {
    getData();
  }, [passedDefaultValues])
  const callBackHandler = () => {
    getData();
  }
  return (<React.Fragment>
    {loading ? <Spinner msg={msg} /> : <div className={classes.root}><DynamicSidebar
      sidebar_list={sidebarList}
      active={defaultValues.dashboard_id}
      createButtonRequired={false}
      onChangeTab={onChangeHandler}
      drawer_type="tabs"
      expand={false}
      labelKey="name"
      valueKey="id"
    />
      <div className={classes.container}>
        <DynamicStyledTab tabsArray={tabsList}
          empty_component={DefaultLayout}
          defaultValues={defaultValues}
          onCallBack={callBackHandler}
          changeTabHandler={(val) => setPassedDefaultValues({ dashboard_id: defaultValues.dashboard_id, tab_id: val, opt: "1" })}
          tabData={tabData} tabHeight="40px" container={true}>
          <div className={classes.manage}>
            <Dropdown name={true} type="button" label={t('bam:MANAGE')} startIcon={<IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/manage.svg`} height={15} />}
              list={[
                { id: 1, value: "Tabs", label: `${t('bam:TABS')}`, labelFontSize:11, action: () => normalDialogStore.openDialog(<Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}><ManageTabs onCallBack={callBackHandler} dashboard_id={defaultValues.dashboard_id} /></Suspense>, "Business Activity Monitor (Manage Tabs)") },
                { id: 2, value: "Dashboard", label: `${t('bam:DASHBOARD')}`, labelFontSize:11, action: () => normalDialogStore.openDialog(<Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}><ManageDashboard onCallBack={callBackHandler} dashboard_id={defaultValues.dashboard_id} /></Suspense>, "Dashbord") },
                { id: 3, value: "Templates", label: `${t('bam:TEMPLATES')}`, labelFontSize:11, action: () => normalDialogStore.openDialog(<Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}><Templates onCallBack={callBackHandler} dashboard_id={defaultValues.dashboard_id} /></Suspense>, "Templates") },
                { id: 4, value: "User Preference", label: `${t('bam:USER_PREFERENCE')}`, labelFontSize:11, action: () => normalDialogStore.openDialog(<Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}><UserPrefrences onCallBack={callBackHandler} dashboard_id={defaultValues.dashboard_id} /></Suspense>, "User Prefrence") },
              ]}
            />
          </div>
        </DynamicStyledTab>

      </div>
    </div>}
  </React.Fragment>
  );
};
export default Dashboard;
