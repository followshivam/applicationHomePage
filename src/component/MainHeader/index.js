import React from "react";
import {  makeStyles } from "@material-ui/core/styles";
import fade from "@material-ui/core/Fade"
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import InsertChartOutlinedOutlinedIcon from "@material-ui/icons/InsertChartOutlinedOutlined";
import MessageOutlinedIcon from "@material-ui/icons/MessageOutlined";
import BookmarksIcon from "@material-ui/icons/Bookmarks";
import Divider from "@material-ui/core/Divider";
import { List, ListItem, ListItemText, ListItemSecondaryAction, Popover, ListItemIcon } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { IconImage } from "component"

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        fontSize: "18px",
        paddingRight: "20px",
        color: "green",
        marginLeft: "6px"
    },
    headerSelect: {
        minWidth: "200px",
        "&.MuiInput-underline:before": {
            borderBottom: "none"
        }
    },
    search: {
        position: "relative",
        background: "#F8F8F8 0% 0% no-repeat padding-box",
        border: "1px solid #E6E6E6",
        borderRadius: "2px",
        "&:hover": {
            backgroundColor: `fade(${theme.palette.common.white}, 0.25)`
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: "100%",
        minWidth: "350px",
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(3),
            width: "auto"
        }
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        top: "0",
        right: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
        color: theme.palette.common.black,
    },
    inputRoot: {
        color: theme.palette.common.black,
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: "10px",
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch"
        }
    },
    sectionDesktop: {
        display: "none",
        [theme.breakpoints.up("sm")]: {
            display: "flex",
            alignItems: 'center'
        },
        "& .MuiIconButton-root": {
            margin: "0 12px"
        },
        "& .MuiSvgIcon-root": {
            width: "21px",
            height: "21px",
            '&:last-child': {
                width: "29px",
                height: "29px",
            }
        },
        '& img': {
            width: '23px',
            height: '23px',
            '&:last-child': {
                width: "29px",
                height: "29px",
                marginLeft: theme.spacing(0.5)
            }
        },
        '& .MuiBadge-badge': {
            height: '16px',
            minWidth: '13px',
            fontSize: '10px',
            background: '#F42E32',
            color: theme.palette.common.white
        }
    },
    appBar: {
        flexGrow: 1,
        background: "#FFFFFF 0% 0% no-repeat",
        borderBottom: "2px solid #FF6600",
        zIndex: theme.zIndex.drawer + 1,
        height: "55px",
        boxShadow: 'none',
    }
}));

const useHeaderSelectStyles = makeStyles((theme) => ({
    headTitle: {
        letterSpacing: '0.48px',
        color: '#1B1B1B',
        fontSize: '16px',
        fontWeight: 'bold',
        padding: theme.spacing(0, 1, 0, .5)
    },
    root: {
        padding: theme.spacing(1, 1.5),
        cursor: 'pointer'
    },
}));

    export const HeaderSelectDropdown = React.memo(function HeaderSelectDropdown(props) {
    const classes = useHeaderSelectStyles();
    const { workspaceList = [], active = "", onChangeWorkSpace = null } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [currentWorkSpace, setCurrentWorkSpace] = React.useState(props.active ? props.active : "");
    const open = Boolean(anchorEl);

    const onClickListHandler = (item) => {
        if (item.id !== active.id) {
            setCurrentWorkSpace(item)
            onChangeWorkSpace(item)
            setAnchorEl(null)
        }
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                onClick={(event) => setAnchorEl(event.currentTarget)}
            >
                <Typography className={classes.headTitle}>{currentWorkSpace.name}</Typography>
                <ArrowDropDownIcon fontSize="large" style={{ fill: '#000' }} />
            </div>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <div style={{ width: '215px', minHeight: '50px', boxShadow: '0px 3px 6px #00000029' }}>
                    <List dense={true}>
                        {
                            workspaceList.map((item, index) => (
                                <ListItem className={classes.root} key={index} selected={item.id === active.id} onClick={() => onClickListHandler(item)}>
                                    <ListItemText primary={item.name} />
                                    {/* <ListItemSecondaryAction className={classes.secondaryAction}>
                                        <IconButton edge="end" aria-label="ChevronRightIcon">
                                            <ChevronRightIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>*/}
                                </ListItem>
                            ))
                        }
                    </List>
                </div>
            </Popover>
        </div>
    )
})

const MainHeader = (props) => {
    const { workspaceList = [], active = "", onChangeWorkSpace = null, onLogout = null } = props;
    const classes = useStyles();
    const classesPopover = useHeaderSelectStyles()
    const [profileAnchorEl, setProfileAnchorEl] = React.useState(null);

    const isprofilePopoverOpen = Boolean(profileAnchorEl);

    return (
        <div className={classes.appBar}>
            {/* <AppBar position="static" className={classes.appBar}> */}
            <Toolbar style={{ minHeight: '55px' }}>
                <img
                    src="https://landing.newgensoft.com/hs-fs/hubfs/Newgen%20Favicon%20White%20BG.png?width=108&height=108"
                    alt="logo"
                    width="30px"
                />
                <Typography className={classes.title} variant="h6" noWrap>NEWGEN</Typography>
                <Divider
                    orientation="vertical"
                    center="true"
                    style={{ height: "44px", width: "1.5px", marginRight: "20px" }}
                />

                <HeaderSelectDropdown workspaceList={workspaceList} active={active} onChangeWorkSpace={onChangeWorkSpace} />

                <div className={classes.grow} />
                {/* <div className={classes.search}>
                        <InputBase
                            placeholder="Search"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput
                            }}
                            inputProps={{ "aria-label": "search" }}
                        />
                        <div className={classes.searchIcon}>
                            <SearchIcon style={{ color: '#000' }} />
                        </div>
                    </div> */}
                <div className={classes.sectionDesktop}>
                    <IconButton aria-label="show 4 new mails">
                        <Badge badgeContent={4} color="secondary">
                            <img src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/chat_log.svg`} alt="log" />
                        </Badge>
                    </IconButton>
                    <IconButton aria-label="show 17 new notifications">
                        <Badge badgeContent={3} color="secondary">
                            <img src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/chart_heart_bit.svg`} alt="chart-heart" />
                        </Badge>
                    </IconButton>
                    <IconButton>
                        <Badge badgeContent={3} color="secondary">
                            <img src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/paper_pin.svg`} alt="pin" />
                        </Badge>
                    </IconButton>

                    <img src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/user_icon.svg`} onClick={(event) => setProfileAnchorEl(event.currentTarget)} />

                    <Popover
                        open={isprofilePopoverOpen}
                        anchorEl={profileAnchorEl}
                        onClose={() => setProfileAnchorEl(null)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        className={classesPopover.paper}
                    >
                        <div style={{ width: '110px', minHeight: '30px', boxShadow: '0px 3px 6px #00000029' }}>
                            <List dense={true}>
                                <ListItem className={classesPopover.root} key={1}
                                    onClick={onLogout}>
                                    <ListItemIcon style={{ minWidth: '24px' }}>
                                        <ExitToAppIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={"logout"} />
                                </ListItem>
                            </List>
                        </div>
                    </Popover>
                </div>
            </Toolbar>
            {/* </AppBar> */}
        </div>
    );
}

export default MainHeader;