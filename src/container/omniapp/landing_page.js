import React, { useState, lazy, useEffect, Suspense } from "react";
import {
  makeStyles, AppBar, MainHeader,
  // Sidebar,
  Spinner, useTranslation,
  // StyledTab,
  DynamicSidebar,
  // Dropdown,
  Menu, MenuItem, ListItemText
} from "component";

import CssBaseline from '@material-ui/core/CssBaseline';
// import SidePanel from "container/webdesktop/SidePanel";
//Container and components
import DynamicStyledTab from "component/DynamicStyledTab";
// import { Applications } from "./applications/applications";
// import { ExternalApplications } from "./external_applications/external_applications";
// import Components from "./Components/components";
// import AuditLogsParent from "./AuditLogs/audit_log_parent";
import { withRouter } from "react-router-dom/cjs/react-router-dom";

import { GetWorkspaceDef, Logout } from "global/omniapp/api/ApiMethods";
import { LoginHandler } from "global/bam/api/ApiMethods";
import { LoginWDHandler } from "global/webdesktop/api/ApiMethods";
import { useDispatch, useSelector } from "react-redux";
import { GlobalSettings, LogoutDetails, SetRegexDetails } from "redux/action";
// import { Redirect } from "react-router";
import { useRef } from "react";
import StyledTabInProgress from "component/DynamicStyledTab In Progress";
import { LoginMDMHandler } from "global/mdm/api/ApiMethods";
const Dashboard = lazy(() => import("container/bam/Bam_Dashboard"));
const AddScheduler = lazy(() => import('container/bam/ReportScheduler/AddScheduler/add_scheduler'))
const CreateUpdateReport = lazy(() => import("container/bam/ReportDesigner/Create_Update_Report"));
const tabHeight = 42
const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: "white",
    boxShadow: 'none',
    position: 'unset'
  },
  buttonWrapper: {
    margin: " 7px 3px 7px 1118px",
    padding: "1px 9px",
  },
  main_container: {
    background: theme.palette.backgroundContainer,
    overflow: "auto",
    // minHeight: "750px",
    width: "100%"
  },
  container: {
    flexGrow: "1",
    overflow: "auto",
    height: "calc(100vh - 55px)"
  },
  primary: {
    background: theme.palette.primary.main
  },
  MuiListItem: {
    root: {
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white,
        },
      },
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    }
  },
}));
const ITEM_HEIGHT = 48;
const Home = props => {
  const classes = useStyles();
  const { logoutCallback = null } = props;
  const [currentWorkSpace, setCurrentWorkSpace] = useState({})
  const [workspaceList, setWorkspaceList] = useState([]);
  const [sidebarList, setSidebarList] = useState([]);
  const [tabsList, setTabsList] = useState([]);
  const ref = useRef();
  const [loginDetails, normalDialog, fullDialog] = useSelector(state => [state.loginDetails, state.normalDialogState, state.fullDialogState])
  const [tabData, setTabData] = useState({
    template_info: [],
    instance_desc: {}
  });

  const { t, i18n } = useTranslation()
  const snackbarState = useSelector(store => store.snackbarState);
  const currentLang = localStorage.getItem('locale') && localStorage.getItem('locale')
  useEffect(() => {
    i18n.changeLanguage(currentLang)
  }, [currentLang])

  const [defaultValues, setDefaultValues] = useState({
    workspace_id: "",
    view_id: "",
    tab_id: "",
    default_navigation: "",
    navigation_enabled: false,
    navigation_type: '',
  });
  const [passedDefaultValues, setPassedDefaultValues] = useState({
    workspace_id: "",
    view_id: "",
    tab_id: "",
  });
  const [isLoading, setIsLoading] = useState({
    msg: `${t('bam:LOADING')}...`,
    loading: true
  });

  const { loading, msg } = isLoading;
  const dispatch = useDispatch();
  useEffect(() => {
    // setIsLoading({ ...isLoading, loading: true });
    GetWorkspaceDef(passedDefaultValues).then((res) => {
      if (res.data != null && res.status.maincode === "0") {
        let response = res.data;
        let dateFormat = res.inis.date_format;

        if (dateFormat != null) {
          dateFormat = dateFormat.toUpperCase();
          for (let i = 0; i < dateFormat.length; i++) {
            // dateFormat[i] = dateFormat[i];

            if (dateFormat[i] === 'E') dateFormat[i] = 'D';
          }
        }
        else
          dateFormat = 'DD/MM/YYYY';

        dispatch(GlobalSettings({ date_format: dateFormat, ...response.server_info, locale_module: ['bam', 'omniapp','mdm'] }))

        let { workspace_id, view_id, tab_id } = passedDefaultValues;
        const { default_workspace_id, default_view_id, default_tab_id, default_navigation,
          navigation_enabled, navigation_type, workspaces } = response.workspace_info;
        if (workspace_id === "" && view_id === "" && tab_id === "") {
          //* Initial load

          let workspaceList = workspaces.map(res => { return { id: res.id, name: res.name } })

          let currentWorkSpace = workspaceList.filter(res => res.id === default_workspace_id)[0];
          let sidebarList = workspaces.filter(res => res.id === default_workspace_id)[0].views;
          let tabList = sidebarList.filter(res => res.id === default_view_id)[0].tabs;
          let tabRecord = tabList.filter(res => res.id === default_tab_id)[0];

          setCurrentWorkSpace(currentWorkSpace)
          setWorkspaceList(workspaceList)
          setSidebarList(sidebarList);
          setTabsList(tabList);
          setTabData({
            template_info: tabRecord.template_def,
            instance_desc: tabRecord.components
          });

          setDefaultValues({
            default_navigation,
            navigation_enabled,
            navigation_type,
            workspace_id: default_workspace_id,
            view_id: default_view_id,
            tab_id: default_tab_id
          })

        } else if (workspace_id !== "" && view_id === "" && tab_id === "") {
          //* workspace switch

          let sidebarList = workspaces[0].views;
          let tabList = sidebarList.filter(res => res.id === default_view_id)[0].tabs;
          let tabRecord = tabList.filter(res => res.id === default_tab_id)[0];
          setCurrentWorkSpace(workspaces[0])
          setSidebarList(sidebarList);
          setTabsList(tabList);
          setTabData({
            template_info: tabRecord.template_def,
            instance_desc: tabRecord.components
          });

          setDefaultValues({
            default_navigation,
            navigation_enabled,
            navigation_type,
            workspace_id: default_workspace_id,
            view_id: default_view_id,
            tab_id: default_tab_id
          })

        } else if (workspace_id !== "" && view_id !== "" && tab_id === "") {
          //* view switchs

          let sidebarList = workspaces[0].views;
          let tabList = sidebarList.filter(res => res.id === default_view_id)[0].tabs;
          let tabRecord = tabList.filter(res => res.id === default_tab_id)[0];
          setTabsList(tabList);
          setTabData({
            template_info: tabRecord.template_def,
            instance_desc: tabRecord.components
          });
          setDefaultValues({
            default_navigation,
            navigation_enabled,
            navigation_type,
            workspace_id: default_workspace_id,
            view_id: default_view_id,
            tab_id: default_tab_id
          })

        } else if (workspace_id !== "" && view_id !== "" && tab_id !== "") {
          //* tab switch
          let tabRecord = workspaces[0].views[0].tabs[0]
          setTabData({
            template_info: tabRecord.template_def,
            instance_desc: tabRecord.components
          });
          setDefaultValues({
            default_navigation,
            navigation_enabled,
            navigation_type,
            workspace_id: default_workspace_id,
            view_id: default_view_id,
            tab_id: default_tab_id
          })
        }
        loginBam();
        loginWebDesktop();
        loginMDM();
      }
    }).catch((err) => {

    })
  }, [passedDefaultValues]);

  // mdm login handler 


  const loginMDM = () => {

    if (localStorage.getItem("mdm_sid") === null || localStorage.getItem("mdm_sid") === undefined || localStorage.getItem("mdm_sid") === '') {
      let data =
      {
        locale: localStorage.getItem('locale') ? localStorage.getItem('locale') : 'en_US',
        user_index: localStorage.getItem("user_id"),
        user_id: localStorage.getItem("user_name"),
        session_id: localStorage.getItem("session_id"),
        cabinet_name: loginDetails.cabinet_name,
        personal_name: loginDetails.personal_name,
        family_name: "",
        client_gmt_offset: loginDetails.client_gmt_offset,
        batch_size: loginDetails.batch_size,
        server_gmt_offset: loginDetails.server_gmt_offset,
        theme_id: loginDetails.theme_id,
        eds: loginDetails.eds,
        udb_encrypt: loginDetails.udb_encrypt,
      };

      if (loginDetails != {}) {
        LoginMDMHandler(data)
          .then(res => {
            console.log('inner api response call')
            console.log(res)
            // if (res.maincode == 0 && res["mdm_sid"]) {

            //   localStorage.setItem("mdm_sid", res["mdm_sid"]);
            // }
          })
          .catch(err => {
          });
      }
    }
  }

  const loginWebDesktop = () => {

    if (localStorage.getItem("WD_SID") === null || localStorage.getItem("WD_SID") === undefined || localStorage.getItem("WD_SID") === '') {
      let data = {
        locale: localStorage.getItem('locale') ? localStorage.getItem('locale') : 'en_US',
        user_index: localStorage.getItem("user_id"),
        user_id: localStorage.getItem("user_name"),
        session_id: localStorage.getItem("session_id"),
        cabinet_name: loginDetails.cabinet_name,
        personal_name: loginDetails.personal_name,
        family_name: "",
        client_gmt_offset: loginDetails.client_gmt_offset,
        batch_size: loginDetails.batch_size,
        server_gmt_offset: loginDetails.server_gmt_offset,
        theme_id: loginDetails.theme_id,
        eds: loginDetails.eds,
        udb_encrypt: loginDetails.udb_encrypt,
      };

      if (loginDetails != {}) {
        LoginWDHandler(data)
          .then(res => {
            if (res.maincode == 0 && res["WD_SID"]) {
              localStorage.setItem("WD_SID", res["WD_SID"]);
            }
          })
          .catch(err => {
          });
      }
    }
  }
  const loginBam = () => {

    if (localStorage.getItem("b-sid") === null || localStorage.getItem("b-sid") === undefined || localStorage.getItem("b-sid") === '') {
      let data = {
        Locale: localStorage.getItem('locale') ? localStorage.getItem('locale') : 'en_US',
        UserIndex: localStorage.getItem("user_id"),
        UserId: localStorage.getItem("user_name"),
        SessionId: localStorage.getItem("session_id"),
        CabinetName: loginDetails.cabinet_name,
        PersonalName: loginDetails.personal_name,
        FamilyName: "",
        ClientGMTOffset: loginDetails.client_gmt_offset,
        BatchSize: loginDetails.batch_size,
        ServerGMTOffset: loginDetails.server_gmt_offset,
        ThemeId: loginDetails.theme_id,
        EDS: loginDetails.eds,
        UDBEncrypt: loginDetails.udb_encrypt
      };

      if (loginDetails != {}) {
        LoginHandler(data)
          .then(res => {
            if (res.MainCode == 0 && res["b-sid"]) {
              localStorage.setItem("b-sid", res["b-sid"]);
              setIsLoading({ ...isLoading, loading: false });
            } else {
              snackbarState.openSnackbar('Something went wrong. Redirecting to Login Page!', "warning", 3000)
              setIsLoading({ ...isLoading, loading: false });
              // localStorage.clear();
              props.history.replace('/login');
            }
          })
          .catch(err => {
            snackbarState.openSnackbar('Something went wrong. Redirecting to Login Page', "error", 3000)
            setIsLoading({ ...isLoading, loading: false });
            props.history.replace('/login');
          });
      } else {
        setIsLoading({ ...isLoading, loading: false });
        props.history.replace('/login');
      }
    }
    else {
      setIsLoading({ ...isLoading, loading: false });
    }
  }

  const workspaceChangeHandler = (item) => {

    setIsLoading({ ...isLoading, loading: true });
    setPassedDefaultValues({
      workspace_id: item.id,
      view_id: "",
      tab_id: ""
    })
  }
  const onChangeHandler = val => {
    setPassedDefaultValues({
      workspace_id: defaultValues.workspace_id, view_id: val,
      tab_id: ""
    });
  };
  const logoutHandler = () => {
    setIsLoading({ ...isLoading, loading: true });
    Logout().then((res) => {
      if (res != null && res.status.maincode === "0") {
        dispatch(LogoutDetails())
        localStorage.clear();
        props.history.push("/")
      }
      else {
        // setIsLoading({ ...isLoading, loading: false });
      }

    }).catch((err) => { })

  }
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [drawerState, setDrawerState] = useState(false);

  const handleClick = (event) => {
    ref.current.style.top = '5rem'
    if (drawerState) {
      ref.current.style.left = '14rem'
    } else {
      ref.current.style.left = '4rem'
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // let handleSideBar = (sidebarList.map((i) => i?.name)?.includes("Search Panel"));
  return (
    <div className={classes.main_container}>
      <CssBaseline />
      {loading
        ? <div style={{ height: "100vh", margin: "0 auto" }}><Spinner msg={msg} /></div>
        : <div id="header" style={{ display: 'flex', flexDirection: 'column' }}>
          <AppBar className={classes.appBar} dense="true">
            <MainHeader
              workspaceList={workspaceList}
              active={currentWorkSpace}
              onChangeWorkSpace={workspaceChangeHandler}
              onLogout={logoutHandler}
              {...props}
            />
          </AppBar>

          {/* <div className={classes.container}>
            <Applications />
          </div> */}

          {defaultValues.navigation_enabled
            ? <div style={{ display: 'flex', height: "calc(100vh - 55px)" }}>
              <DynamicSidebar
                sidebar_list={sidebarList}
                active={defaultValues.view_id}
                onChangeTab={onChangeHandler}
                labelKey="name"
                valueKey="id"
                createButton={handleClick}
                drawer_type="tabs"
                giveMeDrawerState={setDrawerState}
                expand={defaultValues.default_navigation === "E"}
              />
              {defaultValues.workspace_id === '4' || defaultValues.workspace_id === '3' ?
                <div className={classes.container}>
                  {/* {!handleSideBar ? */}
                  <StyledTabInProgress
                    tabsArray={tabsList}
                    defaultValues={defaultValues}
                    changeTabHandler={(val) => setPassedDefaultValues({ ...passedDefaultValues, tab_id: val })}
                    tabData={tabData}
                    tabHeight={'42px'}
                    container={true} />
                  {/* : <SidePanel />} */}
                </div>
                :
                <div className={classes.container}>
                  <DynamicStyledTab
                    tabsArray={tabsList}
                    defaultValues={defaultValues}
                    changeTabHandler={(val) => setPassedDefaultValues({ ...passedDefaultValues, tab_id: val })}
                    tabData={tabData}
                    tabHeight={'42px'}
                    container={true} />
                </div>}
            </div>
            :
            <Suspense
              fallback={
                <div style={{ minHeight: '100vh', margin: "0 auto" }}>
                  <Spinner msg='' />
                </div>
              }
            >
              <Dashboard />
            </Suspense>
          }
        </div>
      }
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        // ref={ref}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          ref: ref,
          style: {
            maxHeight: ITEM_HEIGHT * 5.1,
            minWidth: "200px",
            minHeight: "80px"
            // width: '20ch',
          },
        }}

      >
        {[
          {
            id: 1, value: "Add Report ", label: `${t('bam:ADD_REPORT')}`,
            action: () => fullDialog.openDialog(<Suspense fallback={<div ><Spinner msg="" /></div>}><CreateUpdateReport report_index={null} /></Suspense>, "Report Creation")
          },
          {
            id: 2, value: "Add Scheduler", label: `${t('bam:ADD_SCHEDULER')}`,
            action: () => normalDialog.openDialog(<Suspense fallback={<div><Spinner /></div>}><AddScheduler t={t} /></Suspense>)
          }
        ]
          .map((res) => (<MenuItem classes={{ root: classes.MuiListItem }} key={res.id} onClick={() => { handleClose(); return res.action != null ? res.action() : null }}>
            <ListItemText primary={res.label} primaryTypographyProps={{ variant: "subtitle2", style: { fontSize: 12, fontWeight: 600 } }} />
          </MenuItem>))
        }
      </Menu>
    </div >
  );
};
export default withRouter(Home);