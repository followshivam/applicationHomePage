import React, { useState, lazy, useEffect, Suspense } from "react";
import {
    makeStyles, AppBar, FullScreenDialog, useTranslation, CustomDialog, MainHeader, Sidebar, Home, IconImage
} from "component";
import { useDispatch, useSelector } from "react-redux";
import CssBaseline from '@material-ui/core/CssBaseline';
import {
    FullScreenDialogInitialState, FullScreenDialogOpen, FullScreenDialogClose,
    NormalScreenDialogInitialState, NormalScreenDialogOpen, NormalScreenDialogClose
} from "redux/action";
//Container and components
import StyledTab from "component/StyledTabs";
import { Applications } from "../applications/applications";
import Components from "../Components/components";
import AuditLogsParent from "../AuditLogs/audit_log_parent";
import Navigation from "../Navigation/navigation";
import { withRouter } from "react-router-dom/cjs/react-router-dom";
import Settings from '../Settings/settings'
import { ExternalApplications } from "../external_applications/external_applications";
import HealthConfigureTest from "../HealthConfigureTest/HealthConfigureTest";
import HomeScreen from "../../bam/Home/index";
import HomeTable from "./home";
import PersonPinIcon from '@material-ui/icons/PersonPin'
import ListComponent from "component/List";
import HeatChart from "./chart/HeatChart";
import DataModel from "../../../container/mdm/DataModel";

// const GridView = lazy(() => import("container/grid_view"));


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
        // overflow: "auto",
        minHeight: "750px",
        width: "100%"
    },
    container: {
        marginTop: '60px',
        flexGrow: "1",
        display: 'flex',
        flexDirection: 'column',
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



const Dashboard = props => {

    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(1);
    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t, i18n } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])
    const currentLang = localStorage.getItem('locale') && localStorage.getItem('locale')
    useEffect(() => {
        i18n.changeLanguage(currentLang)
    }, [currentLang])

    const [fullDialogStore, normalDialogStore] = useSelector(state => {
        return [state.fullDialogState, state.normalDialogState];
    });
    const sidebar_list = {
        layout_type: "default",
        item_list: [
            {
                id: 1,
                component: null,
                label: "Dashboard",
                default_url: "icons/reports.svg",
                tabs: [{ id: 1, index: 0, label: "Tab1", icon: "icons/reports.svg", disabled: false }, { id: 2, index: 1, label: "Tab2", icon: "icons/reports.svg", disabled: false }]
            },
            {
                id: 2,
                component: null,
                label: "My Inbox",
                default_url: "icons/scheduler.svg",
                tabs: [{ id: 1, index: 0, label: "Tab1", icon: "icons/reports.svg", disabled: false }, { id: 2, index: 1, label: "Tab2", icon: "icons/reports.svg", disabled: false }]
            },
            {
                id: 3,
                component: null,
                label: "Omniapp Configuration",
                default_url: "icons/auditlog.svg",
                tabs: [{ id: 1, index: 0, label: "Tab1", icon: "icons/reports.svg", disabled: false }, { id: 2, index: 1, label: "Tab2", icon: "icons/reports.svg", disabled: false }]
            },
            {
                id: 4,
                component: null,
                label: "User Management",
                default_url: "icons/auditlog.svg",
                tabs: [{ id: 1, index: 0, label: "Tab1", icon: "icons/reports.svg", disabled: false }, { id: 2, index: 1, label: "Tab2", icon: "icons/reports.svg", disabled: false }]
            }
        ]
    };

    const tabsArray = [
        { id: 0, index: 0, label: `${t('omniapp:CONFIGURE_HEALTH_TEST')}`, component: <HealthConfigureTest /> },
        { id: 1, index: 1, label: `${t('omniapp:APPLICATIONS')}`, component: <Applications />, icon: "icons/schedule_icon.svg" },
        { id: 2, index: 2, label: `${t('omniapp:EXTERNAL_APPLICATIONS')}`, component: <ExternalApplications /> },
        { id: 3, index: 3, label: `${t('omniapp:COMPONENTS')}`, component: <Components /> },
        { id: 4, index: 4, label: `${t('omniapp:NAVIGATION')}`, component: <Navigation /> },
        { id: 5, index: 5, label: `${t('omniapp:SETTINGS')}`, component: <Settings /> },
        { id: 6, index: 6, label: `${t('omniapp:AUDIT_LOGS')}`, component: <AuditLogsParent /> },
        { id: 7, index: 7, label: `${t('omniapp:Home')}`, component: <HomeScreen /> },
        { id: 8, index: 8, label: `Test`, component: <HomeTable /> },
        { id: 9, index: 9, label: `Chart`, component: <HeatChart /> },
        { id: 10, index: 10, label: "Data Model", component: <DataModel /> },

    ]
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
            <AppBar position="fixed" className={classes.appBar} dense="true">
                <MainHeader />
            </AppBar>
            <Sidebar
                sidebar_list={sidebar_list}
                active={activeStep}
                onChangeTab={onChangeHandler}
            />
            <div className={classes.container}>
                <StyledTab tabsArray={tabsArray} tabHeight={'42px'} />
            </div>
        </div>
    );
};
export default withRouter(Dashboard);