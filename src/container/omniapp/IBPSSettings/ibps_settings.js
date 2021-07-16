import React, { useState, useEffect, lazy } from 'react';
import { useSelector } from 'react-redux';
import {
    clsx,
    List, ListItem, ListItemIcon,
    ListItemText, makeStyles, NotFound, IconImage, useTranslation
} from 'component'
import { Drawer } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
const ApplicationsAndComponents = lazy(() => import('container/omniapp/ApplicationsAndComponents/applications_and_components'));
const drawerWidth = 222;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        margin: "-10px",
        direction: props => props.direction
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        height: "calc(100vh - 56px)",
        whiteSpace: 'nowrap',

    },
    paperAnchorLeft: {
        left: 'auto',
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
        overflowX: 'none',
        width: theme.spacing(5.5) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(6.5) + 1,
        },
    },
    drawerPaper: {
        // width: drawerWidth,
        // paddingTop : 12,
        overflowY: 'unset',
        // overflowX: "hidden",
        // boxShadow: "0px 1px 2px 2px #e0e0e0"
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        //padding: theme.spacing(1),
        padding: '0px',
        paddingTop: theme.spacing(2)
    },
    listIcon: {
        minWidth: 30
    },
    active_drawer: {
        color: "#0072C6",
        backgroundColor: "#F1F9FF",
        opacity: "1",
        borderLeft: props => props.direction === "ltr" ? '3px solid #0072C6' : undefined,
        borderRight: props => props.direction === "rtl" ? '3px solid #0072C6' : undefined,
        transition: "all 0.1s ease-in",
    },
    inactive_drawer: {
        borderLeft: props => props.direction === "ltr" ? '3px solid white' : undefined,
        borderRight: props => props.direction === "rtl" ? '3px solid white' : undefined
    },
    iconContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: "absolute",
        bottom: '20px',
        right: props => props.direction === "ltr" ? '-16px' : undefined,
        left: props => props.direction === "rtl" ? '-16px' : undefined,
        cursor: "pointer",
    },
    drawerIcon: {
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        backgroundColor: "white",
        borderRadius: 15,
        height: 30,
        width: 30
    },
    primaryText: {
        fontWeight: 800
    }
}));

export default function IBPSSettings() {

    const globalSettings = useSelector(store => store.globalSettings);
    const { t } = useTranslation(
        globalSettings.locale_module
            ? globalSettings.locale_module
            : ['bam', 'omniapp']
    )
    const [direction] = useState(`${t('bam:HTML_DIR')}`)
    const classes = useStyles({ direction });
    const [activeTab, setActiveTab] = useState("0");
    const [component, setComponent] = useState()
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const sidebarList = [
        {
            "id": "0",
            "name": "Applications & Components",
            "component": <ApplicationsAndComponents />,
            "icon": {
                "active_url": `${process.env.REACT_APP_CONTEXT_PATH}/icons/app_sel_icon.svg`,
                "inactive_url": `${process.env.REACT_APP_CONTEXT_PATH}/icons/app_icon.svg`,
                "height": "15px",
                "width": "22px"
            }
        },
        {
            "id": "1",
            "name": "Views",
            "component": <NotFound />,
            "icon": {
                "active_url": `${process.env.REACT_APP_CONTEXT_PATH}/icons/tab_sel_icon.svg`,
                "inactive_url": `${process.env.REACT_APP_CONTEXT_PATH}/icons/tab_icon.svg`,
                "height": "17px",
                "width": "17px"
            }
        },
        {
            "id": "2",
            "name": "Language Settings",
            "component": <NotFound />,
            "icon": {
                "active_url": `${process.env.REACT_APP_CONTEXT_PATH}/icons/lang_sel.svg`,
                "inactive_url": `${process.env.REACT_APP_CONTEXT_PATH}/icons/lang.svg`,
                "height": "16px",
                "width": "17px"
            }
        },
        {
            "id": "3",
            "name": "Audit Logs",
            "component": <NotFound />,
            "icon":  {
                "active_url": `${process.env.REACT_APP_CONTEXT_PATH}/icons/segment_sel.svg`,
                "inactive_url": `${process.env.REACT_APP_CONTEXT_PATH}/icons/segment.svg`,
                "height": "17px",
                "width": "17px"
            }
        },
        {
            "id": "4",
            "name": "Themes",
            "component": <NotFound />,
            "icon": {
                "active_url": `${process.env.REACT_APP_CONTEXT_PATH}/icons/theme_sel.svg`,
                "inactive_url": `${process.env.REACT_APP_CONTEXT_PATH}/icons/theme.svg`,
                "height": "17px",
                "width": "17px"
            }
        }
    ]

    const handleDrawer = () => {
        setIsDrawerOpen(drawerOpen => !drawerOpen);
    }

    useEffect(() => {
        setComponent(sidebarList.find(item => item.id === activeTab).component)
    }, [activeTab])


    return (
        <div className={classes.root}>
            <Drawer
                variant="permanent"
                direction={direction}
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: isDrawerOpen,
                    [classes.drawerClose]: !isDrawerOpen,
                })}
                classes={{
                    paperAnchorLeft: classes.paperAnchorLeft,
                    paper: clsx(classes.drawerPaper, {
                        [classes.drawerOpen]: isDrawerOpen,
                        [classes.drawerClose]: !isDrawerOpen,
                    }),
                }}
            >
                <div className={classes.toolbar} />
                <List>
                    {sidebarList.map((item, index) => (
                        <ListItem className={item.id === activeTab ? classes.active_drawer : classes.inactive_drawer} button key={item.name} onClick={() => setActiveTab(item.id)}>
                            <ListItemIcon classes={{ root: classes.listIcon }}><IconImage url={item.id === activeTab ? item.icon.active_url : item.icon.inactive_url} width={item.icon.width} height={item.icon.height} /></ListItemIcon>
                            {isDrawerOpen && <ListItemText primary={item.name} classes={{ primary: classes.primaryText }} />}
                        </ListItem>
                    ))}
                </List>
                <div className={classes.iconContainer} onClick={handleDrawer}>
                    {
                        isDrawerOpen
                            ? direction === 'ltr' ? <ChevronLeftIcon className={classes.drawerIcon} /> : <ChevronRightIcon className={classes.drawerIcon} />
                            : direction === 'ltr' ? <ChevronRightIcon className={classes.drawerIcon} /> : <ChevronLeftIcon className={classes.drawerIcon} />
                    }
                </div>
            </Drawer>
            <main className={classes.content}>
                {component}
            </main>
        </div>
    );
}