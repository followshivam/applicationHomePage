import React, { useState } from 'react';
import { clsx, makeStyles, useTranslation } from "component";
import { Avatar, List, ListItem, ListItemIcon, Typography, Drawer, Popover, ListItemText, Collapse } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { useSelector } from 'react-redux'

const drawerWidth = 240;

const useStyle = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        // position: 'unset'
    },
    drawerPaper: {
        background: "#222222 0% 0% no-repeat padding-box",
        color: theme.palette.common.white,
        // position: 'relative'
    },
    toolbar: theme.mixins.toolbar,
    drawerOpen: {
        width: drawerWidth,
        // paddingTop: '56px',
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
        // paddingTop: '56px',
        [theme.breakpoints.up('sm')]: {
            width: "80px",
        },
    },
    listItem: { dislay: "flex", flexWrap: "wrap", borderLeft: `4px solid #222222`, paddingTop: '12px' },
    listItemOpen: { flexDirection: "row", justifyContent: 'flex-start', alignItems: "center", padding: theme.spacing(1) },
    listItemClose: {
        minHeight: "67px", width: '80px',
        flexDirection: 'column',
        display: 'flex', flexWrap: "wrap", textAlign: 'center', justifyContent: "center", alignItems: "center",
        paddingLeft: '2px', paddingRight: '11px', whiteSpace: 'pre-line',
    },
    labelClose: {
        fontSize: "12px",
        color: 'white'
    },
    labelOpen: {
        fontSize: "12px",
        color: 'white',
        paddingLeft: theme.spacing(1),
        marginTop: 0
    },
    listIcon: {
        minWidth: '20px',
        display: 'block',
    },
    active_tab: {
        background: "#424242 0% 0% no-repeat padding-box",
        borderLeft: `4px solid ${theme.palette.omniapp_color}`,
        transition: "all 0.1s ease-in",
    },
    primary: {
        background: theme.palette.omniapp_color
    },
    toolbar: theme.mixins.toolbar,
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
                borderLeft: '4px solid #F46A0F',
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
                borderLeft: '4px solid #F46A0F',
                background: '#505050'
            },
        },
    }
}))

const Sidebar = props => {
    const classes = useStyle();
    const { sidebar_list, active, onChangeTab = null, createButtonRequired = true, giveMeDrawerState, createButton, labelKey = "Demo", valueKey = "", tabsArray = [], expand = false, sidebarStructure = "TABS" } = props;
    const [isDwrawerOpen, setIsDwrawerOpen] = useState(false); // useState(expand);
    const [subListCollapse, setSubListCollapse] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const [globalSetting] = useSelector(
        state => {
            return [
                state.globalSettings
            ]
        }
    )
    const { t } = useTranslation(globalSetting.locale_module)

    const handleDrawer = () => {
        if (giveMeDrawerState) {
            giveMeDrawerState(!isDwrawerOpen)
        }
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
            <div className={classes.toolbar} />
            <List>
                {createButtonRequired && <ListItem button
                    className={clsx(classes.listItem, {
                        [classes.listItemOpen]: isDwrawerOpen,
                        [classes.listItemClose]: !isDwrawerOpen,
                    })}
                    style={{ height: !isDwrawerOpen ? '67px' : '47px' }}
                    onClick={createButton}
                >
                    <ListItemIcon className={classes.listIcon}>
                        {/* //* for Dwrawer Open and close Drawer */}
                        {
                            !isDwrawerOpen
                                ? <>
                                    <Avatar variant="circular" className={classes.primary} style={{ width: '31px', height: '30px', margin: 'auto' }}>
                                        <AddIcon style={{ height: "20px", width: "20px", color: "white" }} />
                                    </Avatar>
                                    <Typography className={classes.labelClose} style={{ paddingTop: '3px' }}>{t('bam:CREATE')}</Typography>
                                </>
                                : <div
                                    style={{
                                        minWidth: '217px',
                                        height: '27px',
                                        borderRadius: '2px',
                                        display: 'grid',
                                        placeItems: 'center',
                                        background: '#F46A0F',
                                        marginLeft: '-2px',
                                    }}>
                                    <Typography className={classes.labelOpen} style={{ padding: 0 }}> + {t('bam:CREATE')}</Typography>
                                </div>
                        }

                    </ListItemIcon>

                </ListItem>}

                {sidebar_list.map((res, index) => {

                    const checkActive = res[valueKey] == active ? true : false;
                    return (
                        <React.Fragment key={index}>
                            <ListItem button
                                className={clsx(checkActive ? classes.active_tab : "", classes.listItem, {
                                    [classes.listItemOpen]: isDwrawerOpen,
                                    [classes.listItemClose]: !isDwrawerOpen,
                                })}
                                // onClick={() => clickHandler(res.id)}
                                onClick={(event) => {
                                    if (sidebarStructure === "TREES") {
                                        if (tabsArray.length <= 1)
                                            clickHandler(res[valueKey])
                                        else
                                            if (!isDwrawerOpen) setAnchorEl(event.currentTarget)
                                            else setSubListCollapse(subListCollapse === index ? -1 : index)
                                    }
                                    else
                                        clickHandler(res[valueKey])
                                }}
                            >
                                <ListItemIcon className={classes.listIcon}>
                                    <img src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/side_icon_${index + 1}.svg`} alt={index} style={{ height: "26px", width: "35px", color: "white" }} />

                                </ListItemIcon>
                                {
                                    isDwrawerOpen
                                        ? <ListItemText className={classes.labelOpen} primary={res[labelKey]} />
                                        : <Typography className={classes.labelClose}>{res[labelKey]}</Typography>
                                }
                                {
                                    isDwrawerOpen && sidebarStructure === "TREES"
                                        ? subListCollapse === index
                                            ? <ExpandLess />
                                            : <ExpandMore />
                                        : null
                                }
                            </ListItem>
                            <Collapse in={subListCollapse === index} timeout="auto" unmountOnExit className={classes.wrapper}>
                                {
                                    (sidebarStructure === "TREES" && tabsArray.length > 1)
                                        ? <List component="div">
                                            {tabsArray.map((item, i) => (
                                                <ListItem button className={classes.nested} key={i}>
                                                    <ListItemIcon>
                                                        <SubdirectoryArrowRightIcon style={{ color: 'white' }} />
                                                    </ListItemIcon>
                                                    <ListItemText primary={item.name} />
                                                </ListItem>
                                            ))}
                                        </List>
                                        : null
                                }
                            </Collapse>
                        </React.Fragment>
                    )
                })}
            </List>

            {
                (!isDwrawerOpen && tabsArray.length > 1) &&
                <Popover
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
                        {sidebarStructure === "TREES"
                            ? tabsArray.map((item, index) => {
                                return (
                                    <ListItem button key={index}>
                                        <ListItemIcon>
                                            <SubdirectoryArrowRightIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={item.name} />
                                    </ListItem>
                                )
                            })
                            : null
                        }
                    </List>
                </Popover>
            }
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                position: "absolute", bottom: '12px', right: '8px',
                cursor: "pointer"
            }} onClick={handleDrawer}>
                <Typography style={{ marginRight: '8px' }}>
                    {isDwrawerOpen ? `${t('bam:COLLAPSE')}` : `${t('bam:EXPAND')}`}
                </Typography>
                {
                    isDwrawerOpen
                        ? <img src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/collapse.svg`} alt="Collapse" />
                        : <img src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/expand.svg`} alt="Expand" />
                }
            </div>

        </Drawer >
    );
};

export default Sidebar;