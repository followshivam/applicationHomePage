import React, { lazy, useState } from 'react';
import { clsx, IconImage, makeStyles, useTranslation } from 'component'
import { Button, Drawer } from '@material-ui/core';
import { useSelector } from 'react-redux';

const PinnedItems = lazy(() => import("./pinnedItems"));
const QueueList = lazy(() => import("./queueList"));
const Criteria = lazy(() => import("./criteria"));
const SearchBox = lazy(() => import("./searchBox"));
const QuickSearch = lazy(() => import("./quickSearch"));


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        height: "100%",
        width: "100%",
        position: "relative"
    },
    searchBox: {
        margin: "15px 0px",
        width: "80%",
        flexGrow: 1
    },
    drawerOpen: {
        width: "calc(100% + 6px)",
        background: "#1B263D",
        position: "absolute",
        overflow:"unset",
        top: "-6px",
        left: props => props.direction === 'ltr' ? "-6px" : "auto",
        right: props => props.direction === 'rtl' ? "-6px" : "auto",
        height: "calc(100% + 6px)",
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    // necessary for content to be below app bar
    // toolbar: theme.mixins.toolbar,

    active_drawer: {
        background: "#468AD941",
        height: "30px",
        borderLeft: `4px solid #0072C6`,
        transition: "all 0.1s ease-in",
        "&:hover": {
            background: '#468AD941 !important'
        },
    },

    icon: {
        marginRight: "5px"
    },
    advance: {
        color: "white",
        border: "1px solid #C4C4C4",
        width: "90%",
        height: "24px",
        borderRadius: "3px",
        fontSize: 12
    },
    lists: {
        overflowY: "auto"
    },
    forcedLoginButton: {
        color: "white",
        fontSize: 14,
        marginTop: "15px",
        width: "90%",
        height: "30px",
        borderRadius: "3px",
        backgroundColor: theme.palette.secondary.main,
        "&:hover": {
            background: theme.palette.secondary.main
        },
    },
}));

export default function SidePanel() {
    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });
    const { t } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])
    const [direction] = useState(`${t('bam:HTML_DIR')}`)
    const classes = useStyles({ direction });
    const [isDrawerOpen] = useState(true);

    let dynamicSideBar = document.getElementsByClassName("MuiDrawer-docked");
    dynamicSideBar[0].style.display = "none";

    const [activePinnedItems, setActivePinnedItems] = useState(false);
    const [activeQueue, setActiveQueue] = useState(false);
    const [activeCriteria, setActiveCriteria] = useState(false);

    const handleActiveTab = (type) => {
        if (type === 'pinnedItems') {
            setActivePinnedItems(true);
            setActiveQueue(false);
            setActiveCriteria(false)

        }
        else if (type === 'queue') {
            setActiveQueue(true)
            setActivePinnedItems(false);
            setActiveCriteria(false)
        }
        else if (type === 'criteria') {
            setActiveCriteria(true)
            setActivePinnedItems(false);
            setActiveQueue(false);
        }
    }

    return (
        <div className={classes.root}>
            <Drawer
                variant="permanent"
                classes={{ paper: clsx({ [classes.drawerOpen]: isDrawerOpen }) }}
                anchor="left" >
                <div style={{ borderBottom: "1px solid #C4C4C4", paddingBottom: "15px" }}>
                    <Button variant="contained" size="large" className={classes.forcedLoginButton} type="submit">
                        <IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/white_plus.svg`} height={12} />Create Workitem</Button>

                    <div style={{ display: "inline-flex", width: "90%" }}>
                        <div className={classes.searchBox}>
                            <SearchBox
                                height="14px"
                                width="100%"
                                direction={"ltr"}
                                placeholder={"Search"}
                            />
                        </div>
                        <div style={{ margin: "14px 0 0 6px" }}>
                        <QuickSearch />
                            {/* <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/more1.svg`} height={28} width={28} /> */}
                        </div>
                    </div>
                    <Button variant="outlined" size="large" className={classes.advance}>Advance Search</Button>
                </div>
                <div className={classes.lists}>
                    <PinnedItems activePinnedItems={activePinnedItems} handleActiveTab={handleActiveTab} />
                    <QueueList activeQueue={activeQueue} handleActiveTab={handleActiveTab} />
                    <Criteria activeCriteria={activeCriteria} handleActiveTab={handleActiveTab} />
                </div>
            </Drawer>
        </div >
    );
}






{ // const [listData] = useState([
    //     {
    //         "id": "0",
    //         "name": "PINNED ITEMS",
    //         "batching": false,
    //         "subList": [
    //             {
    //                 "id": "0",
    //                 "name": "My Queue",
    //                 "icon": {
    //                     "active_url": `${process.env.REACT_APP_CONTEXT_PATH}/icons/comp_icon.svg`,
    //                     "height": "15px",
    //                     "width": "22px"
    //                 }
    //             },
    //             {
    //                 "id": "1",
    //                 "name": "Views",

    //                 "icon": {
    //                     "active_url": `${process.env.REACT_APP_CONTEXT_PATH}/icons/comp_icon.svg`,
    //                     "height": "15px",
    //                     "width": "22px"
    //                 }
    //             },
    //             {
    //                 "id": "2",
    //                 "name": "Process",

    //                 "icon": {
    //                     "active_url": `${process.env.REACT_APP_CONTEXT_PATH}/icons/comp_icon.svg`,
    //                     "height": "15px",
    //                     "width": "22px"
    //                 }
    //             },
    //             {
    //                 "id": "3",
    //                 "name": "savings",

    //                 "icon": {
    //                     "active_url": `${process.env.REACT_APP_CONTEXT_PATH}/icons/comp_icon.svg`,
    //                     "height": "15px",
    //                     "width": "22px"
    //                 }
    //             },

    //         ]
    //     },
    //     {
    //         "id": "1",
    //         "name": "QUEUE LIST",
    //         "batching": true,
    //         "subList": [
    //             {
    //                 "id": "0",
    //                 "name": "My Queue",

    //                 "icon": {
    //                     "active_url": `${process.env.REACT_APP_CONTEXT_PATH}/icons/comp_icon.svg`,
    //                     "height": "15px",
    //                     "width": "22px"
    //                 }
    //             },
    //             {
    //                 "id": "1",
    //                 "name": "Views",

    //                 "icon": {
    //                     "active_url": `${process.env.REACT_APP_CONTEXT_PATH}/icons/comp_icon.svg`,
    //                     "height": "15px",
    //                     "width": "22px"
    //                 }
    //             },
    //         ]
    //     },
    //     {
    //         "id": "2",
    //         "name": "CRITERIA",
    //         "batching": false,
    //         "subList": [
    //             {
    //                 "id": "0",
    //                 "name": "My Queue",

    //                 "icon": {
    //                     "active_url": `${process.env.REACT_APP_CONTEXT_PATH}/icons/comp_icon.svg`,
    //                     "height": "15px",
    //                     "width": "22px"
    //                 }
    //             },
    //             {
    //                 "id": "1",
    //                 "name": "Views",

    //                 "icon": {
    //                     "active_url": `${process.env.REACT_APP_CONTEXT_PATH}/icons/comp_icon.svg`,
    //                     "height": "15px",
    //                     "width": "22px"
    //                 }
    //             },
    //         ]
    //     },

    // ]);

    /* {listData.map((item, key) => {
                        return <List dense key={key}
                            subheader={<ListSubheader className={classes.listSubHeader}>{item.name}
                                {item?.batching && (item?.subList.length > 0) ? <div > <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/left_arrow.svg`} width={16} height={16} />
                                    <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/right_arrow.svg`} width={16} height={16} />
                                </div> : null} </ListSubheader>} className={classes.list}>
                            {item?.subList.length > 0 ? item?.subList.map((value, index) => {
                                const labelId = `checkbox-list-secondary-label-${value}`;

                                return (
                                    <ListItem key={index} className={(value.id == activeTab.id && activeTab.name == item.name) ? classes.active_drawer : classes.ListItem}
                                        button key={value.name} onClick={() => setActiveTab({ name: item.name, id: value.id })}>
                                        <ListItemIcon className={classes.listIcon}>
                                            <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/comp_icon.svg`} width={20} height={20} />
                                        </ListItemIcon>
                                        <ListItemText className={classes.ListItemText} id={labelId} primary={value?.name} />
                                        <ListItemSecondaryAction>
                                            <Checkbox
                                                edge="end"
                                                name='checkbox'
                                                checked={value.pinned}
                                                // onChange={() => handlePin(value)}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                                icon={<IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/pin_grey.svg`} width={16} height={16} />}
                                                checkedIcon={<IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/pin.svg`} width={20} height={20} />}
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                );
                            }) : <div className={classes.noDataFound}>No data found</div>}
                        </List>
                    })} */}