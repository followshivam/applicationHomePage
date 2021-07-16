import React, { useState } from 'react';
import Applications from '../applications/applications'
import Navigation from '../Navigation/navigation'
import Settings from '../Settings/settings'
import {
    clsx,
    List, ListItem, ListItemIcon,
    ListItemText, makeStyles, useTranslation
} from 'component'
import AuditLogsParent from 'container/bam/AuditLogs/audit_log_parent'
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { Drawer, Typography } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
const drawerWidth = 245;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxShadow :"0px 1px 2px 2px #e0e0e0"
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
        width: theme.spacing(4) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(5) + 1,
        },
    },
    drawerPaper: {
        width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        // padding: theme.spacing(3),
    },
    listIcon: {
        minWidth: 30
    },
    active_drawer: {
        // background: "#424242 0% 0% no-repeat padding-box",
        color: "#0072C6",
        borderLeft: `4px solid #0072C6`,
        transition: "all 0.1s ease-in",
    },
    drawerIcon: {
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        backgroundColor: "white",
        borderRadius: 15,
        border: 10,
        height: 30,
        width: 30
    }
}));

export default function MiddleDrawer() {
    const classes = useStyles();
    const [activeTab, setActiveTab] = useState("0");
    const { t, i18n } = useTranslation()
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const sidebarList = [
        {
            "id": "0",
            "name": "Applications & Components"
        },
        {
            "id": "1",
            "name": "Views"
        },
        {
            "id": "2",
            "name": "Language Settings"
        },
        {
            "id": "3",
            "name": "Audit Logs"
        },
        {
            "id": "4",
            "name": "Code Fragments"
        }
    ]

    const handleDrawer = () => {
        setIsDrawerOpen(drawerOpen => !drawerOpen);
    }
    const components = [
        <Applications />,
        <Navigation />,
        <Settings />,
        <AuditLogsParent />
    ]

    return (
        <div className={classes.root}>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: isDrawerOpen,
                    [classes.drawerClose]: !isDrawerOpen,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: isDrawerOpen,
                        [classes.drawerClose]: !isDrawerOpen,
                    }),
                }}
                anchor="left"
            >
                <div className={classes.toolbar} />
                <List>
                    {sidebarList.map((item, index) => (
                        <ListItem className={item.id === activeTab ? classes.active_drawer : undefined} button key={item.name} onClick={() => setActiveTab(item.id)}>
                            <ListItemIcon classes={{ root: classes.listIcon }}>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItem>
                    ))}
                </List>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                    position: "absolute", bottom: '12px', right: '-6px',
                    cursor: "pointer", width: "100%",
                }} onClick={handleDrawer}>
                    {
                        isDrawerOpen
                            ? <ChevronLeftIcon className={classes.drawerIcon} />
                            : <ChevronRightIcon className={classes.drawerIcon} />
                    }
                </div>
            </Drawer>
            <main className={classes.content}>
                {components[activeTab]}
            </main>
        </div>
    );
}