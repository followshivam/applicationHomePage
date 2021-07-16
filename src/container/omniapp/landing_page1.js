import React, { useState, lazy, useEffect, Suspense } from "react";
import {
  makeStyles, AppBar, FullScreenDialog, CustomDialog, MainHeader, Sidebar, Spinner,FrameCreator,StyledTab
} from "component";
import { useDispatch, useSelector } from "react-redux";
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  FullScreenDialogInitialState, FullScreenDialogOpen, FullScreenDialogClose,
  NormalScreenDialogInitialState, NormalScreenDialogOpen, NormalScreenDialogClose
} from "redux/action";
//Container and components
import DynamicStyledTab from "component/DynamicStyledTab";
import { Applications } from "./applications/applications";
import { ExternalApplications } from "./external_applications/external_applications";
import Components from "./Components/components";
import AuditLogsParent from "./AuditLogs/audit_log_parent";
import { withRouter } from "react-router-dom/cjs/react-router-dom";
import { getWorkSpaceJSON1, getWorkSpaceJSON2, getWorkSpaceJSON3, getWorkSpaceJSON4 } from "global/json";
import { SnackBarInitialState, SnackBarOpen, SnackBarClose } from "redux/action";
import {GetWorkspaceDef} from "global/omniapp/api/ApiMethods";
import {LoginHandler} from "global/bam/api/ApiMethods";
import ReportDesigner from "container/bam/ReportDesigner/TableComponent/table.js"
import Dashboard from "container/bam/Bam_Dashboard"
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
    margin: " 7px 3px 7px 1118px",
    padding: "1px 9px",
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
    marginTop: '60px',
    flexGrow: "1",
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
    background: "#EFEFEF",
    padding: theme.spacing(0, 1, 0, 1),
    border: `1px solid ${theme.palette.borderColor}`,
    minHeight: "600px"
  },
  tabSelected: {
    color: theme.palette.primary.main
  },
  primary: {
    background: theme.palette.primary.main
  }
}));

const tabsArray = [
  { id: 1, index: 0, label: "Audit Log", component: <AuditLogsParent /> },
  { id: 2, index: 1, label: "Applications", component: <Applications /> },
  { id: 3, index: 2, label: "External Applications", component: <ExternalApplications /> },
  { id: 4, index: 3, label: "Components", component: <Components /> },
]

const Home = props => {
  const classes = useStyles();
  const [currentWorkSpace, setCurrentWorkSpace] = useState({})
  const [workspaceList, setWorkspaceList] = useState([]);
  const [sidebarList, setSidebarList] = useState([]);
  const [tabsList, setTabsList] = useState([]);
  const [tabData, setTabData] = useState({
    template_info: [],
    instance_desc: {}
  });
  const snackbarState = useSelector(state => {
    return state.snackbarState;
  });

  const [defaultValues, setDefaultValues] = useState({
    workspace_id: "",
    view_id: "",
    tab_id: ""
  });
    const [passedDefaultValues,setPassedDefaultValues]=useState({
   workspace_id: "",
    view_id: "",
    tab_id: ""
  });
  const [isLoading, setIsLoading] = useState({
    msg: "Loading...",
    loading: true
  });

  const { loading, msg } = isLoading;

  useEffect(() => {
    setIsLoading({ ...isLoading, loading: true });
    GetWorkspaceDef(passedDefaultValues).then((res)=>{
      if(res.data!=null && res.status.maincode==="0")
      {
        let response=res.data;

    let { workspace_id, view_id, tab_id } = passedDefaultValues;

    if (workspace_id === "" && view_id === "" && tab_id === "") {
      //* Initial load
      const { default_workspace_id, default_view_id, default_tab_id, workspaces } = response.workspace_info;
      let workspaceList = workspaces.map(res => {
        return {
          id: res.id,
          name: res.name,
          default_navigation: res.default_navigation,
          navigation_type: res.navigation_type,
          navigation_enabled: res.navigation_enabled
        }
      })

      let currentWorkSpace = workspaceList.filter(res => res.id == default_workspace_id)[0];
      let sidebarList = workspaces.filter(res => res.id == default_workspace_id)[0].views;
      let tabList = sidebarList.filter(res => res.id == default_view_id)[0].tabs;
      let tabRecord = tabList.filter(res => res.id == default_tab_id)[0];

      setCurrentWorkSpace(currentWorkSpace)
      setWorkspaceList(workspaceList)
      setSidebarList(sidebarList);
      setTabsList(tabList);
      setTabData({
        template_info: tabRecord.template_def,
        instance_desc: tabRecord.components
      });

      setDefaultValues({
        workspace_id: default_workspace_id,
        view_id: default_view_id,
        tab_id: default_tab_id
      })

    } else if (workspace_id !== "" && view_id === "" && tab_id === "") {
      //* workspace switch

      const { default_workspace_id, default_view_id, default_tab_id, workspaces } = response.workspace_info;

      let sidebarList = workspaces[0].views;
      let tabList = sidebarList.filter(res => res.id == default_view_id)[0].tabs;
      let tabRecord = tabList.filter(res => res.id == default_tab_id)[0];
      setCurrentWorkSpace(workspaces[0])
      setSidebarList(sidebarList);
      setTabsList(tabList);
      setTabData({
        template_info: tabRecord.template_def,
        instance_desc: tabRecord.components
      });

      setDefaultValues({
        workspace_id: default_workspace_id,
        view_id: default_view_id,
        tab_id: default_tab_id
      })

    } else if (workspace_id !== "" && view_id !== "" && tab_id === "") {
      //* view switchs
      const { default_view_id, default_tab_id, workspaces } =response.workspace_info;

      let sidebarList = workspaces[0].views;
      let tabList = sidebarList.filter(res => res.id == default_view_id)[0].tabs;
      let tabRecord = tabList.filter(res => res.id == default_tab_id)[0];
      setTabsList(tabList);
      setTabData({
        template_info: tabRecord.template_def,
        instance_desc: tabRecord.components
      });

    } else if (workspace_id !== "" && view_id !== "" && tab_id !== "") {
      //* tab switch
      const { workspaces } = response.workspace_info;
      let tabRecord = workspaces[0].views[0].tabs[0]
      setTabData({
        template_info: tabRecord.template_def,
        instance_desc: tabRecord.components
      });

    }

    setIsLoading({ ...isLoading, loading: false });
          }
      console.log(res)
    }).catch((err)=>{

    })
  }, [passedDefaultValues]);

  const [fullDialogStore, normalDialogStore] = useSelector(state => {
    return [state.fullDialogState, state.normalDialogState];
  });

  const dispatch = useDispatch();

  useEffect(() => {

    if(localStorage.getItem("b-sid")==null)
    {
       let data = {
      Locale: "en-US",
      UserIndex: localStorage.getItem("user_id"),
      UserId: localStorage.getItem("user_name"),
      SessionId: localStorage.getItem("session_id"),
      CabinetName: "ibps5sp1p2",
      PersonalName: "New User",
      FamilyName: "",
      ClientGMTOffset: "330",
      BatchSize: "20",
      ServerGMTOffset: "330",
      ThemeId: "0",
      EDS: "N",
      UDBEncrypt: "N"
    };
    LoginHandler(data)
      .then(res => {
        console.log(res)
        if (res.MainCode == 0) {
          localStorage.setItem("b-sid", res["b-sid"]);
        }
      })
      .catch(err => { });
  }
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
     dispatch(SnackBarInitialState({
      open: false,
      content: "",
      description: "",
      type: "success",
      duration: 2000,
      openSnackbar: (content, type, duration) => {
        dispatch(SnackBarOpen(content, type, duration))
      },
      closeSnackbar: () => {
        dispatch(SnackBarClose())
      }
    }));

  }, [])

  const workspaceChangeHandler = (item) => {
    setIsLoading({ ...isLoading, loading: true });
    setPassedDefaultValues({
      workspace_id: `${item.id}`,
      view_id: "",
      tab_id: ""
    })
    setIsLoading({ ...isLoading, loading: false });
  }
  const onChangeHandler = val => {
    setPassedDefaultValues({...passedDefaultValues,view_id: val,
                tab_id: ""});
  };
  return (
    <div className={classes.main_container}>
      <CssBaseline />
      {loading
        ? <Spinner msg={msg} />
        :
         <React.Fragment>
              <AppBar position="fixed" className={classes.appBar} dense="true">
              <MainHeader
                workspaceList={workspaceList}
                active={currentWorkSpace}
                onChangeWorkSpace={workspaceChangeHandler}
              />
            </AppBar>
               <Dashboard/>
         {currentWorkSpace.navigation_enabled?
<React.Fragment>

            <Sidebar
              sidebar_list={sidebarList}
              active={defaultValues.view_id}
               onChangeTab={onChangeHandler}
              labelKey="name"
              valueKey="id"
              drawer_type="tabs"
              expand={currentWorkSpace.default_navigation === "E"}
            />
            <div className={classes.container}>
              {/* <StyledTab tabsArray={tabsArray} tabHeight={'42px'} /> */}
              <DynamicStyledTab
                tabsArray={tabsList}
               activeTab={defaultValues.tab_id}
                changeTabHandler={(val)=>setPassedDefaultValues({...passedDefaultValues,tab_id:val})}
                tabData={tabData}
                tabHeight={'42px'}
                container={true} />
            </div>
            </React.Fragment>:
            <div className={classes.container}>
            
              {/* <StyledTab tabsArray={tabsArray} tabHeight={'42px'} /> */}
             {/*<FrameCreator app_name="dashboard" host="http://192.168.38.66:9000" report_id="" name="dashboard" dynamicWidth="700px" dynamicHeight="250px"/>
            */}</div>
         }
          </React.Fragment>
      }
      {fullDialogStore.open ? <FullScreenDialog >
        {fullDialogStore.component}
      </FullScreenDialog> : null}
      {normalDialogStore.open ? <CustomDialog >
        {normalDialogStore.component}
      </CustomDialog> : null}
    </div>
  );
};
export default withRouter(Home);