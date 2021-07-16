import React, { useEffect, useState } from 'react';
import {
    IconImage, makeStyles, Typography,
    Spinner, useTranslation, Checkbox, List,
    ListItem, ListItemSecondaryAction, ListItemIcon,
    ListItemText, ListSubheader
} from 'component'
import { useSelector } from 'react-redux';
import { GetPrefQueues, SetPrefQueues } from "global/webdesktop/api/ApiMethods";


const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        paddingBottom: "20px"
    },
    list: {
        color: "white",
        display: "flex",
        flexDirection: "column"
    },


    listIcon: {
        minWidth: 30
    },
    active_drawer: {
        background: "#468AD941",
        height: "30px",
        borderLeft: `4px solid #0072C6`,
        transition: "all 0.1s ease-in",
        "&:hover": {
            background: '#468AD941 !important'
        },
    },
    listSubHeader: {
        color: "#D9D9D9",
        fontSize: "12px",
        display: "flex",
        paddingRight: "5px",
        justifyContent: "space-between"
    },
    ListItemText: {
        '& .MuiTypography-body2': {
            fontSize: 12,
            fontWeight: 300
        },

    },
    ListItem: {
        borderLeft: `4px solid transparent`,
        height: "30px",
        '& .MuiTypography-body2': {
            fontSize: 12,
            fontWeight: 300
        },

    },
    icon: {
        marginRight: "5px"
    },
    noDataFound: {
        color: "#F8F8F8",
        fontStyle: "italic",
        fontSize: "12px",
        opacity: 0.58,
        display: "flex",
        margin: "0 0 20px 20px"
    },

}));

export default function PinnedItems(props) {

    const { activePinnedItems, handleActiveTab } = props;
    const [globalSetting, snackbarState] = useSelector(state => {
        return [state.globalSettings, state.snackbarState];
    });
    const { t } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp", "wd"])
    const [direction] = useState(`${t('bam:HTML_DIR')}`)
    const [isLoading, setIsLoading] = useState({ msg: `${t('bam:LOADING')}...`, loading: true });
    const { loading, msg } = isLoading;
    const classes = useStyles({ direction });
    const [pinnedItems, setPinnedItems] = useState([
        {
            "id": "0",
            "name": "My Queue",
        },
    ]);
    const [activeTab, setActiveTab] = useState({ name: pinnedItems && pinnedItems[0]?.queue_name, id: 0 });

    useEffect(() => {
        GetPrefQueues()
            .then(response => {
                if (response != null && response.status.maincode === "0") {
                    setIsLoading({ ...isLoading, loading: false, msg: `${t('bam:LOADING')}...` })
                    setPinnedItems(response?.data?.preferences?.pref_data?.queue_list)
                }
                else {
                    snackbarState.openSnackbar(response != null ? response?.status?.errormsg : "Something went wrong", 'warning')
                    setIsLoading({ ...isLoading, loading: false, msg: `${t('bam:LOADING')}...` })

                }
            }).catch(error => {
                console.error('Error:', error);
            });
    }, [])

    const handlePin = (value) => {
        console.log({ value })
        let payload = {
            "object_id": "",
            "favourite_queue_list": ""
        }
        SetPrefQueues(payload)
            .then(response => {
                if (response != null && response.status.maincode === "0") {
                    setIsLoading({ ...isLoading, loading: false, msg: `${t('bam:LOADING')}...` })
                    console.log("resp", response)
                }
                else {
                    snackbarState.openSnackbar(response != null ? response?.status?.errormsg : "Something went wrong", 'warning')
                    setIsLoading({ ...isLoading, loading: false, msg: `${t('bam:LOADING')}...` })
                }
            }).catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div className={classes.root}>
            {loading ? <div className={classes.listWrapper}><Spinner msg={msg} /></div>
                : <List dense subheader={<ListSubheader disableSticky={true} className={classes.listSubHeader}>PINNED ITEMS</ListSubheader>} className={classes.list}>
                    {pinnedItems?.length > 0 ? pinnedItems?.map((value) => {
                        const labelId = `checkbox-list-secondary-label-${value}`;

                        return (
                            <ListItem key={value?.id} className={activePinnedItems && (value.id == activeTab.id && activeTab.name == value.queue_name) ? classes.active_drawer : classes.ListItem}
                                button key={value.queue_name} onClick={() => {handleActiveTab("pinnedItems"); setActiveTab({ name: value.queue_name, id: value.id })}}>
                                <ListItemIcon className={classes.listIcon}>
                                    <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/comp_icon.svg`} width={20} height={20} />
                                </ListItemIcon>
                                <Typography variant="subtitle1" noWrap={true}>
                                    <ListItemText className={classes.ListItemText} id={labelId} primary={value?.queue_name} />
                                </Typography>
                                <ListItemSecondaryAction>
                                    <Checkbox
                                        edge="end"
                                        name='checkbox'
                                        checked={value.pinned}
                                        onChange={() => handlePin(value)}
                                        inputProps={{ 'aria-labelledby': labelId }}
                                        icon={<IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/pin_grey.svg`} width={16} height={16} />}
                                        checkedIcon={<IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/pin.svg`} width={20} height={20} />}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    }) : <div className={classes.noDataFound} >No pinned items found</div>}
                </List>}
        </div>
    );
}

