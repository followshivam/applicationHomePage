import React, { useState } from 'react';
import { clsx, makeStyles } from "component";
import { Avatar, List, ListItem, ListItemIcon, Typography, Drawer, Popover, ListItemText, Collapse } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import InboxIcon from '@material-ui/icons/Inbox';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

const drawerWidth = 240;

const useStyle = makeStyles((theme) => ({
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
        paddingTop: '56px',
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
        paddingTop: '56px',
        [theme.breakpoints.up('sm')]: {
            width: "80px",
        },
    },
    listItem: { dislay: "flex", flexWrap: "wrap" },
    listItemOpen: { height: "42px", flexDirection: "row", justifyContent: 'flex-start', alignItems: "center" },
    listItemClose: {
        height: "67px", width: '80px',
        display: 'flex', flexWrap: "wrap", textAlign: 'center', justifyContent: "center", alignItems: "center",
        paddingLeft: '8px', paddingRight: '8px', whiteSpace: 'pre-line',
    },
    labelClose: {
        fontSize: "10px",
        color: 'white'
    },
    listIcon: {
        minWidth: '20px',
        display: 'block'
    },
    active_tab: {
        background: "#424242 0% 0% no-repeat padding-box",
        borderLeft: `2px solid ${theme.palette.primary.main}`,
        transition: "all 0.1s ease-in",
    },
    primary: {
        background: theme.palette.primary.main
    },
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(.5),
        boxShadow: 'none',
        overflow: 'visible',
        background: '#393939',
        marginLeft: '-1px',
        minWidth: '210px',
        // minHeight: '176px',
        background: '#424242',
    },
    muiListroot: {
        '& .MuiListItem-root': {
            cursor: 'pointer',
            borderLeft: '4px solid transparent',
            padding: theme.spacing(1),
            '&:hover': {
                borderLeft: '4px solid #FF6600',
                background: '#505050'
            },
        },
        '& .MuiListItemIcon-root': {
            'minWidth': '25px',
            color: 'white'
        },
        '& .MuiListItemText-root': {
            color: 'white'
        }
    },
    wrapper: {
        paddingLeft: '20px',
        '& .MuiListItem-root': {
            cursor: 'pointer',
            borderLeft: '4px solid transparent',
            padding: theme.spacing(1),
            '&:hover': {
                borderLeft: '4px solid #FF6600',
                background: '#505050'
            },
        },
    }
}))

const subMenu = [
    { label: 'Process Management' },
    { label: 'Queue Management' },
    { label: 'Process Variable Mapping' },
    { label: 'Case Detail and Information' },
]

const Sidebar = props => {
    const classes = useStyle();
    const { sidebar_list, active, onChangeTab = null,labelKey="Demo",valueKey="",drawer_type="tabs",expand=false } = props;
    const [isDwrawerOpen, setIsDwrawerOpen] = useState(expand);
    const [subListCollapse, setSubListCollapse] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);


    const handleDrawer = () => {
        setIsDwrawerOpen(!isDwrawerOpen);
        setSubListCollapse(-1)
    };

    const clickHandler = index => {
        if (onChangeTab != null) {
            onChangeTab(index);
        }
    };

    const id = Boolean(anchorEl) ? 'sidebarMenu-popover' : undefined;

    return (
        <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: isDwrawerOpen,
                [classes.drawerClose]: !isDwrawerOpen,
            })}
            classes={{
                paper: clsx(classes.drawerPaper, {
                    [classes.drawerOpen]: isDwrawerOpen,
                    [classes.drawerClose]: !isDwrawerOpen,
                }),
            }}
        >
            {/* <Toolbar /> */}
            <List>
                <ListItem button
                    className={clsx(classes.listItem, {
                        [classes.listItemOpen]: isDwrawerOpen,
                        [classes.listItemClose]: !isDwrawerOpen,
                    })}
                    onClick={() => console.log("id")}
                >
                    <ListItemIcon className={classes.listIcon}>
                        {/* //* for Dwrawer Open and close Drawer */}
                        {
                            !isDwrawerOpen
                                ? <>
                                    <Avatar variant="cirle" className={classes.primary}>
                                        <AddIcon style={{ height: "26px", width: "35px", color: "white" }} />
                                    </Avatar>
                                    <Typography className={classes.labelClose}>Create</Typography>
                                </>
                                : <div className={classes.primary}
                                    style={{
                                        width: '217px',
                                        height: '27px',
                                        borderRadius: '2px',
                                        display: 'grid',
                                        placeItems: 'center',
                                    }}>
                                    <Typography style={{ color: 'white' }}> + Create</Typography>
                                </div>
                        }

                    </ListItemIcon>

                </ListItem>

                {sidebar_list.map((res, index) => {
                    const checkActive = res[valueKey] === active ? true : false;
                    return (<>
                        <ListItem button key={index}
                            className={clsx(checkActive ? classes.active_tab : "", classes.listItem, {
                                [classes.listItemOpen]: isDwrawerOpen,
                                [classes.listItemClose]: !isDwrawerOpen,
                            })}
                            // onClick={() => clickHandler(res.id)}
                            onClick={(event) => {
                                // if (!isDwrawerOpen) setAnchorEl(event.currentTarget)
                                // else setSubListCollapse(subListCollapse === index ? -1 : index)
                                clickHandler(res[valueKey])
                            }}
                        >
                            <ListItemIcon className={classes.listIcon}>
                                <InboxIcon style={{ height: "26px", width: "35px", color: "white" }} />
                            </ListItemIcon>
                            {
                                isDwrawerOpen
                                    ? <ListItemText primary={res[labelKey]} />
                                    : <Typography className={classes.labelClose}>{res[labelKey]}</Typography>
                            }
                            {
                                (drawer_type!="tabs" && isDwrawerOpen
                                    ? subListCollapse === index
                                        ? <ExpandLess />
                                        : <ExpandMore />
                                    : null)
                            }
                        </ListItem>
                        {drawer_type!="tabs" && (<Collapse in={subListCollapse === index} timeout="auto" unmountOnExit className={classes.wrapper}>
                            <List component="div">
                                {[0, 1, 2, 3].map((item, index) => (
                                    <ListItem button className={classes.nested}>
                                        <ListItemIcon>
                                            <SubdirectoryArrowRightIcon style={{ color: 'white' }} />
                                        </ListItemIcon>
                                        <ListItemText primary={`${item} Test List`} />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>)}
                    </>
                    )
                })}
            </List>

            {
                (drawer_type!="tabs" && !isDwrawerOpen) && <Popover
                    id={id}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    classes={{
                        popover: classes.popover,
                        paper: classes.paper,
                    }}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <List component="nav" classes={{ root: classes.muiListroot }} aria-label="contacts">
                        {subMenu.map((item, index) => {
                            return (
                                <ListItem button>
                                    <ListItemIcon>
                                        <SubdirectoryArrowRightIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={item.label} />
                                </ListItem>
                            )
                        })}
                    </List>
                </Popover>
            }

            <p onClick={handleDrawer}
                style={{
                    bottom: 0, position: "absolute", cursor: "pointer",
                    width: "100%", textAlign: "right", right: '5px'
                }}>
                {isDwrawerOpen ? "Collapse << " : "Expand >> "}
            </p>
        </Drawer >
    );
};

export default Sidebar;