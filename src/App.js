import React, {useState, lazy, useEffect, Suspense} from 'react';
import './App.css';
import LeftNavbar from "./LeftNavbar"
import Header from "./Header"
import {
    makeStyles,
    AppBar,
    FullScreenDialog,
    CustomDialog,
    MainHeader,
    Sidebar,
    Spinner,
    DynamicSidebar,
    Pinned,
    RecentActivity,
    FrameCreator,
    DashboardTile,
    useTranslation,
    IconImage,
    Dropdown,
    Typography,
    EmptyHome,
    NotFound
} from "component";

import {HomeTiles} from 'global/bam/api/ApiMethods'
import DynamicStyledTab from "component/DynamicStyledTab";
import Home from "container/Home"

import {useDispatch, useSelector} from "react-redux";
import axios from "axios";

import {GlobalSettings, LogoutDetails, SetRegexDetails} from "redux/action";

// var pinnedData={}

// axios.get("http://192.168.160.49:8081/launchpad/pinnedList/appDesigner")
// .then(res=>{
//     pinnedData=res.data
//     }
// )

const pinnedData = require('./newData.json')
const listData = require('./data.json')

const tabHeight = 42
const useStyles = makeStyles(theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme
            .transitions
            .create([
                'width', 'margin'
            ], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            }),
        background: "white"
    },
    buttonWrapper: {
        margin: " 7px 3px 7px 1118px",
        padding: "1px 9px"
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
        flexGrow: "1"
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

function App() {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [currentWorkSpace,
        setCurrentWorkSpace] = useState({})
    const [workspaceList,
        setWorkspaceList] = useState([]);
    const [sidebarList,
        setSidebarList] = useState([]);
    const [passedDefaultValues,
        setPassedDefaultValues] = useState({workspace_id: "", view_id: "", tab_id: ""});

    const [anchorEl,
        setAnchorEl] = React.useState(null);
    const [drawerState,
        setDrawerState] = useState(false);

    const [defaultValues,
        setDefaultValues] = useState({workspace_id: "", view_id: "", tab_id: ""});
    const [isLoading,
        setIsLoading] = useState({msg: "Loading...", loading: true});
    const [homeTiles,
        setHomeTiles] = useState([]);
    const [direction,
        setDirection] = useState('ltr')
    const [tabsList,
        setTabsList] = useState([]);
    const [tabData,
        setTabData] = useState({template_info: [], instance_desc: {}});

    const [globalSetting] = useSelector(state => {
        return [state.globalSettings]
    })

    const {t} = useTranslation(globalSetting.locale_module
        ? globalSetting.locale_module
        : ['bam', 'omniapp'])

    const workspaceChangeHandler = (item) => {
        setIsLoading({
            ...isLoading,
            loading: true
        });
        setDefaultValues({workspace_id: item.id, view_id: "", tab_id: ""})
        setIsLoading({
            ...isLoading,
            loading: false
        });
    }

    const onChangeHandler = val => {
        setPassedDefaultValues({workspace_id: defaultValues.workspace_id, view_id: val, tab_id: ""});
    };

    const handleClick = (event) => {
        // ref.current.style.top = '5rem' if (drawerState) {   ref.current.style.left =
        // '14rem' } else {   ref.current.style.left = '4rem' }
        setAnchorEl(event.currentTarget);
    };

    const tilesData = [
        {
            type: 'Good',
            img_info: {
                background_color: '#0d6f0829',
                url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/report_good.svg`
            },
            hover_border_color: '#0d6f0880'
        }, {
            type: 'Average',
            img_info: {
                background_color: '#0072c629',
                url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/report_average.svg`
            },
            hover_border_color: '#0072C666'
        }, {
            type: 'Blocked',
            img_info: {
                background_color: '#d53d3d26',
                url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/blocked.svg`
            },
            hover_border_color: '#d53d3d80'
        }, {
            type: 'Critical',
            img_info: {
                background_color: '#d53d3d26',
                url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/report_critical.svg`
            },
            hover_border_color: '#d53d3d80'
        }
    ]

    const HeadCells = [
        {
            category: `${t('bam:NAME')}`,
            component: item => (
                <div
                    style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    height: '45px',
                    padding: t('bam:HTML_DIR') === 'rtl'
                        ? '0 0 0 20px'
                        : '0 20px 0 0'
                }}>
                    <Typography variant='subtitle1' noWrap={true}>
                        {item.name}
                        <Typography
                            variant='subtitle1'
                            noWrap={true}
                            style={{
                            fontSize: '11px',
                            color: '#606060'
                        }}>
                            {item.version}
                            {item.type}
                        </Typography>
                    </Typography>
                </div>
            )
        }, {
            category: `${t('bam:STATUS')}`,
            component: item => (
                <div>
                    <div style={{
                        display: 'flex'
                    }}>
                        {item.status === 'Good' || item.status === 'Enable'
                            ? (<IconImage
                                url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/good.svg`}
                                height={10}/>)
                            : item.status === 'Running'
                                ? (<IconImage
                                    url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/running.svg`}
                                    height={10}/>)
                                : (<IconImage
                                    url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/block.svg`}
                                    height={10}/>)}
                        <Typography
                            variant='subtitle1'
                            noWrap={true}
                            style={{
                            fontSize: '11px',
                            color: '#606060',
                            marginLeft: '2px'
                        }}>
                            {item.status}
                        </Typography>
                    </div>
                    <Typography
                        variant='subtitle1'
                        noWrap={true}
                        style={{
                        fontSize: '11px',
                        color: '#606060',
                        marginLeft: '2px'
                    }}>
                        {item.status === 'Running'
                            ? `Next Run:`
                            : `Average Time :`}{' '} {item.average_time}
                    </Typography>
                </div>
            )
        }, {
            category: `Last opened on`,
            component: item => (
                <div>
                    <Typography variant='subtitle1' noWrap={true}>
                        {item.last_opened || item.last_modified}
                        <Typography
                            variant='subtitle1'
                            noWrap={true}
                            style={{
                            fontSize: '11px',
                            color: '#606060',
                            marginLeft: '2px'
                        }}>
                            Edited by {item.user}
                            at {item.time}
                        </Typography>
                    </Typography>
                </div>
            )
        }, {
            category: ``,
            type: `action`,
            component: item => (
                <div
                    style={{
                    display: 'flex',
                    width: '100px',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        marginRight: '8px'
                    }}>
                        {' '}
                        <IconImage
                            url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/pinned.svg`}
                            height={17}
                            width={17}
                            onClick={() => console.log('2')}/>{' '}
                    </div>
                    <div style={{
                        marginRight: '8px'
                    }}>
                        {' '}
                        <IconImage
                            url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/launch.svg`}
                            height={17}
                            width={17}
                            onClick={() => console.log('2')}/>{' '}
                    </div>
                    <div style={{
                        marginRight: '8px'
                    }}>
                        {' '}
                        <IconImage
                            url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/home_edit.svg`}
                            height={17}
                            width={17}
                            onClick={() => console.log('1')}/>{' '}
                    </div>
                    <div style={{
                        marginRight: '8px'
                    }}>
                        {' '}
                        <Dropdown
                            type='icons'
                            endIcon='MoreHorizIcon'
                            list={[
                            {
                                id: 1,
                                value: 'Show Query',
                                label: `Show Query`,
                                startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/show_query.svg`
                            }, {
                                id: 2,
                                value: 'Exports',
                                label: `Exports`,
                                startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/grey_export.svg`
                            }, {
                                id: 3,
                                value: 'Trends',
                                label: `Trends`,
                                startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/trends.svg`
                            }
                        ]}/>
                    </div>
                </div>
            )
        }
    ]

    const Action = [
        {
            component: () => (
                <div style={{
                    display: 'flex'
                }}>
                    <div style={{
                        marginRight: '8px'
                    }}>
                        {' '}
                        <IconImage
                            url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/pinned.svg`}
                            height={17}
                            width={17}
                            onClick={() => console.log('pin clicked')}/>{' '}
                    </div>
                    <div>
                        {' '}
                        <Dropdown
                            type='icons'
                            endIcon='MoreHorizIcon'
                            list={[
                            {
                                id: 1,
                                value: 'Demo Data',
                                label: `Demo Data`,
                                startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/show_query.svg`
                            }, {
                                id: 2,
                                value: 'Demo Data',
                                label: `Demo Data`,
                                startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/grey_export.svg`
                            }
                        ]}/>
                    </div>
                </div>
            )
        }
    ]

    useEffect(() => {
        getHomeTiles();
        setDirection(`${t('bam:HTML_DIR')}`)
    }, [])

    const RecentHeadCells = [
        {
            category: `${t('bam:NAME')}`,
            component: item => (
                <div
                    style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    height: '45px',
                    minWidth: "150px",
                    overflow: "hidden",
                    whitespace: "nowrap",
                    textOverflow: "ellipsis",
                    padding: t('bam:HTML_DIR') === 'rtl'
                        ? '0 0 0 10px'
                        : '0 10px 0 0'
                }}>
                    <Typography variant='subtitle1' noWrap={true} style={{
                            fontSize: '12px',
                            color: '#606060'
                        }}>
                        {item.name}
                        <Typography
                            variant='subtitle1'
                            noWrap={true}
                            style={{
                            fontSize: '12px',
                            color: '#606060'
                        }}>
                            {item.version}
                            {item.type}
                        </Typography>
                    </Typography>
                </div>
            )
        }, {
            category: `${t('bam:STATUS')}`,
            component: item => (
                <div>
                    <div style={{
                        display: 'flex'
                    }}>
                        {item.status === 'Good' || item.status === 'Enable'
                            ? (<IconImage
                                url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/good.svg`}
                                height={10}/>)
                            : item.status === 'Running'
                                ? (<IconImage
                                    url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/running.svg`}
                                    height={10}/>)
                                : (<IconImage
                                    url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/block.svg`}
                                    height={10}/>)}
                        <Typography
                            variant='subtitle1'
                            noWrap={true}
                            style={{
                            fontSize: '11px',
                            color: '#606060',
                            marginLeft: '2px'
                        }}>
                            {item.status}
                        </Typography>
                    </div>
                    <Typography
                        variant='subtitle1'
                        noWrap={true}
                        style={{
                        fontSize: '11px',
                        color: '#606060',
                        marginLeft: '2px'
                    }}>
                        {item.status === 'Running'
                            ? `Next Run:`
                            : `Average Time :`}{' '} {item.average_time}
                    </Typography>
                </div>
            )
        }, {
            category: `Last opened on`,
            component: item => (
                <div>
                    <Typography variant='subtitle1' noWrap={true}>
                        {item.last_opened || item.last_modified}
                        <Typography
                            variant='subtitle1'
                            noWrap={true}
                            style={{
                            fontSize: '11px',
                            color: '#606060',
                            marginLeft: '2px'
                        }}>
                            Edited by {item.user}
                            at {item.time}
                        </Typography>
                    </Typography>
                </div>
            )
        }, {
            category: ``,
            type: `action`,
            component: item => (
                <div
                    style={{
                    display: 'flex',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        marginRight: '8px'
                    }}>
                        {' '}
                        <IconImage
                            url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/launch.svg`}
                            height={17}
                            width={17}
                            onClick={() => console.log('2')}/>{' '}
                    </div>
                    <div style={{
                        marginRight: '8px'
                    }}>
                        {' '}
                        <IconImage
                            url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/home_edit.svg`}
                            height={17}
                            width={17}
                            onClick={() => console.log('1')}/>{' '}
                    </div>
                    <div >
                        <Dropdown
                            type='icons'
                            endIcon='MoreHorizIcon'
                            list={[
                            {
                                id: 1,
                                value: 'Show Query',
                                label: `Show Query`,
                                startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/show_query.svg`
                            }, {
                                id: 2,
                                value: 'Exports',
                                label: `Exports`,
                                startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/grey_export.svg`
                            }, {
                                id: 3,
                                value: 'Trends',
                                label: `Trends`,
                                startIcon: `${process.env.REACT_APP_CONTEXT_PATH}/icons/trends.svg`
                            }
                        ]}/>
                    </div>
                </div>
            )
        }
    ]

    const homeTilesJson = {
        "data": {
            "tiles": [
                {
                    "title": "219",
                    "description": {
                        "label": "Health",
                        "value": "Good"
                    },
                    "healthstatus": "1"
                }, {
                    "title": "6",
                    "description": {
                        "label": "Health",
                        "value": "Average"
                    },
                    "healthstatus": "2"
                }, {
                    "title": "3",
                    "description": {
                        "label": "Health",
                        "value": "Critical"
                    },
                    "healthstatus": "3"
                }, {
                    "title": "5",
                    "description": {
                        "label": "",
                        "value": "Blocked"
                    },
                    "healthstatus": "4"
                }
            ]
        },
        "status": {
            "maincode": "0",
            "suberrorcode": "0",
            "subject": "",
            "description": "",
            "errormsg": ""
        }
    }

    const workspaceDef = {
        "data": {
            "server_info": {
                "session_id": "479643227",
                "is_admin": true,
                "batch_size": "20",
                "locale": "en_US",
                "family_name": "",
                "client_gmt_offset": "330",
                "server_gmt_offset": "330",
                "cabinet_name": "ibps5sp1p2",
                "theme_id": "0",
                "eds": "N",
                "udb_encrypt": "N",
                "user_index": "9",
                "user_name": "vidushi",
                "personal_name": "New User"
            },
            "workspace_info": {
                "default_workspace_id": "1",
                "default_view_id": "0",
                "default_tab_id": "1",
                "default_navigation": "E",
                "navigation_type": "1",
                "navigation_enabled": true,
                "workspaces": [
                    {
                        "id": "1",
                        "name": "iBPS Report Designer",
                        "views": [
                            {
                                "id": "0",
                                "name": "Home",
                                "tabs": [
                                    {
                                        "id": "1",
                                        "name": "Home",
                                        "template_id": "10",
                                        "template_def": [
                                            {
                                                "container_id": "108",
                                                "X": "1",
                                                "Y": "1",
                                                "colspan": "1",
                                                "rowspan": "1",
                                                "dimension": {
                                                    "width": "100",
                                                    "height": "400"
                                                }
                                            }
                                        ],
                                        "components": {
                                            "108": {
                                                "id": "18",
                                                "name": "Home",
                                                "load_url": "http://192.168.153.130:8080/bam/components/home",
                                                "c_input_info": {},
                                                "c_load_json": {
                                                    "app_context": "bam",
                                                    "app_Domain": "",
                                                    "app_id": "2",
                                                    "app_loc": "1",
                                                    "app_name": "BAM",
                                                    "app_port": "",
                                                    "app_ssl": false,
                                                    "custom_js": "",
                                                    "ins_type": "1",
                                                    "refresh": true
                                                }
                                            }
                                        }
                                    }
                                ]
                            }, {
                                "id": "1",
                                "name": "Reports",
                                "tabs": []
                            }, {
                                "id": "2",
                                "name": "Scheduler",
                                "tabs": []
                            }, {
                                "id": "3",
                                "name": "Audit Logs",
                                "tabs": []
                            }, {
                                "id": "4",
                                "name": "IBPS Settings",
                                "tabs": []
                            }
                        ]
                    }, {
                        "id": "2",
                        "name": "Dashboards",
                        "views": []
                    }, {
                        "id": "3",
                        "name": "Data Model Designer",
                        "views": []
                    }, {
                        "id": "4",
                        "name": "iBPS Runtime Workspace",
                        "views": []
                    }
                ]
            }
        },
        "inis": {
            "date_format": "dd/MMM/yyyy"
        },
        "status": {
            "maincode": "0",
            "suberrorcode": "0",
            "subject": "",
            "description": "",
            "errormsg": ""
        }
    }

    const getHomeTiles = () => {
        // HomeTiles({}).then(res => {     if (res != null && res.status.maincode ===
        // '0') {         let merged = []         for (let i = 0; i <
        // res.data.tiles.length; i++) {             merged.push({ ...res.data.tiles[i],
        //                 ...tilesData.find(itmInner => itmInner.type ==
        // res.data.tiles[i].description.value)             }) }
        // setHomeTiles(merged)     } }).catch(err => {})
        let merged = []
        for (let i = 0; i < homeTilesJson.data.tiles.length; i++) {
            merged.push({
                ...homeTilesJson.data.tiles[i],
                ...tilesData.find(itmInner => itmInner.type == homeTilesJson.data.tiles[i].description.value)
            })
        }
        setHomeTiles(merged)
    }

    useEffect(() => {
        // setIsLoading({ ...isLoading, loading: true });
        // GetWorkspaceDef(passedDefaultValues).then((res) => {
        if (workspaceDef.data != null && workspaceDef.status.maincode === "0") {
            let response = workspaceDef.data;
            let dateFormat = workspaceDef.inis.date_format;

            if (dateFormat != null) {
                dateFormat = dateFormat.toUpperCase();
                for (let i = 0; i < dateFormat.length; i++) {
                    // dateFormat[i] = dateFormat[i];

                    if (dateFormat[i] === 'E') 
                        dateFormat[i] = 'D';
                    }
                } else 
                dateFormat = 'DD/MM/YYYY';
            
            dispatch(GlobalSettings({
                date_format: dateFormat,
                ...response.server_info,
                locale_module: ['bam', 'omniapp', 'mdm']
            }))

            let {workspace_id, view_id, tab_id} = passedDefaultValues;
            const {
                default_workspace_id,
                default_view_id,
                default_tab_id,
                default_navigation,
                navigation_enabled,
                navigation_type,
                workspaces
            } = response.workspace_info;
            if (workspace_id === "" && view_id === "" && tab_id === "") {
                //* Initial load

                let workspaceList = workspaces.map(res => {
                    return {id: res.id, name: res.name}
                })

                let currentWorkSpace = workspaceList.filter(res => res.id === default_workspace_id)[0];
                let sidebarList = workspaces.filter(res => res.id === default_workspace_id)[0].views;
                let tabList = sidebarList.filter(res => res.id === default_view_id)[0].tabs;
                let tabRecord = tabList.filter(res => res.id === default_tab_id)[0];

                setCurrentWorkSpace(currentWorkSpace)
                setWorkspaceList(workspaceList)
                setSidebarList(sidebarList);
                setTabsList(tabList);
                setTabData({template_info: tabRecord.template_def, instance_desc: tabRecord.components});

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
                setTabData({template_info: tabRecord.template_def, instance_desc: tabRecord.components});

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
                setTabData({template_info: tabRecord.template_def, instance_desc: tabRecord.components});
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
                setTabData({template_info: tabRecord.template_def, instance_desc: tabRecord.components});
                setDefaultValues({
                    default_navigation,
                    navigation_enabled,
                    navigation_type,
                    workspace_id: default_workspace_id,
                    view_id: default_view_id,
                    tab_id: default_tab_id
                })
            }
            // loginBam(); loginWebDesktop(); loginMDM(); } }).catch((err) => { })
        }
    }, [passedDefaultValues]);

    return (
        <div
        className="App"
        style={{
        display: "flex",
        flexDirection: "column"
    }}>
        {/* <Header />
            <LeftNavbar /> */}

        <AppBar position="fixed" className={classes.appBar} dense="true" style={{position:"static"}}>

            <MainHeader
                workspaceList={workspaceList}
                active={currentWorkSpace}
                onChangeWorkSpace={workspaceChangeHandler}/>

        </AppBar>

        <div style={{display:"flex",height:"calc(100vh-55px)"}} >

            <DynamicSidebar
                sidebar_list={sidebarList}
                active={defaultValues.view_id}
                onChangeTab={onChangeHandler}
                labelKey="name"
                valueKey="id"
                createButton={handleClick}
                drawer_type="tabs"
                giveMeDrawerState={setDrawerState}
                expand={defaultValues.default_navigation === "E"}/> {/* <Home/> */}
            
            <div style={{display:"flex",flexDirection:"column", padding:"15px 5px"}}>
                <DashboardTile
                    tileList={homeTiles}
                    direction={`${t('bam:HTML_DIR')}`}
                    width={'180pt'}/>

                {/* <div>
                    <NotFound />
                    
                    <EmptyHome />
                </div>     */}

                <Pinned
                    pinnedData={pinnedData}
                    headerData={HeadCells}
                    action={Action}
                    defaultView={'tile'}
                    direction={`${t('bam:HTML_DIR')}`}
                    loading={false}
                    height={'67pt'}
                    width={'180pt'}
                    imageInfo={{
                    path: `${process.env.REACT_APP_CONTEXT_PATH}/icons/`,
                    ext: '.svg'
                }}
                    label={{
                    heading: `${t('bam:Pinned')}`,
                    viewLess: `${t('bam:View Less')}`,
                    viewAll: `${t('bam:View All')}`,
                    last_modified: `${t('bam:Last Modified')}`
                }}/>

                <RecentActivity
                    headerData={RecentHeadCells}
                    recentList={listData}
                    loading={false}
                    isSearch={true}
                    direction={`${t('bam:HTML_DIR')}`}
                    heading={`${t('bam:Recents')}`}
                    searchProps={{
                    searchingKey: 'name',
                    placeholder: `${t('bam:TITLE_SEARCH')}`,
                    regex: null
                }}
                    imageInfo={{
                    path: `${process.env.REACT_APP_CONTEXT_PATH}/icons/`,
                    ext: '.svg'
                }}/>

            </div>

        </div>

    </div> 

    //     <div className={classes.root}>
    //      <div style={{ display: 'flex' }}>
    //         <div style={{ width: '100%' }}>
    //            <div style={{ margin: '5px 0px 20px 0' }}>
    //            <DashboardTile
    //                     tileList={homeTiles}
    //                     direction={`${t('bam:HTML_DIR')}`}
    //                     width={'180pt'}/ >
    //            </div>            <Pinned
    // pinnedData={pinnedData}                     headerData={HeadCells}
    //          action={Action}                     defaultView={'tile'}
    //         direction={`${t('bam:HTML_DIR')}`}
    // loading={false}                     height={'67pt'}
    // width={'180pt'}                     imageInfo={{                     path:
    // `${process.env.REACT_APP_CONTEXT_PATH}/icons/`,                     ext:
    // '.svg'                 }}                     label={{
    // heading: `${t('bam:Pinned')}`,                     viewLess: `${t('bam:View
    // Less')}`,                     viewAll: `${t('bam:View All')}`,
    //      last_modified: `${t('bam:Last Modified')}`                 }}/>
    //        <RecentActivity                     headerData={RecentHeadCells}
    //               recentList={listData}                     loading={false}
    //               isSearch={true}
    // direction={`${t('bam:HTML_DIR')}`}
    // heading={`${t('bam:Recents')}`}                     searchProps={{
    //          searchingKey: 'name',                     placeholder:
    // `${t('bam:TITLE_SEARCH')}`,                     regex: null
    // }}                     imageInfo={{                     path:
    // `${process.env.REACT_APP_CONTEXT_PATH}/icons/`,                     ext:
    // '.svg'                 }}/>            </div>      </div>   </div>
    );
}

export default App;
