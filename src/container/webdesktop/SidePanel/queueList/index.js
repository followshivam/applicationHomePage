import React, { useEffect, useState } from 'react';
import {
    IconImage, makeStyles, Typography,
    Spinner, useTranslation, Checkbox, List,
    ListItem, ListItemSecondaryAction, ListItemIcon,
    ListItemText, ListSubheader, SearchBox
} from 'component'
import { useSelector } from 'react-redux';
import { GetQueueList, SetPrefQueues } from "global/webdesktop/api/ApiMethods";
import { GetWDQueueList } from "global/json";


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
    searchBox: {
        padding: "14px 5px 0 15px"
    },
    searchIcon: {
        marginLeft: "100px"
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
        width: "100%",
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

export default function QueueList(props) {

    const { activeQueue, handleActiveTab } = props;
    const [globalSetting, snackbarState] = useSelector(state => {
        return [state.globalSettings, state.snackbarState];
    });

    const { t } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp", "wd"])
    const [direction] = useState(`${t('bam:HTML_DIR')}`)
    const [isLoading, setIsLoading] = useState({ msg: `${t('bam:LOADING')}...`, loading: true });
    const { loading, msg } = isLoading;
    const classes = useStyles({ direction });
    const [data, setData] = useState();
    const [inputData, setInputData] = useState(GetWDQueueList);
    const [lens, setLens] = useState(true);
    const [queueList, setQueueList] = useState([{ "id": "", "name": "" }]);
    const [activeTab, setActiveTab] = useState({ name: queueList[0].name, id: 0 });

    const getQueueList = () => {
        GetQueueList(inputData)
            .then(response => {
                if (response != null && response.status.maincode === "0") {
                    setIsLoading({ ...isLoading, loading: false, msg: `${t('bam:LOADING')}...` })
                    setData(response?.data)
                    setQueueList(response?.data?.queuelist)
                }
                else {
                    snackbarState.openSnackbar(response != null ? response?.status?.errormsg : "Something went wrong", 'warning')
                    setIsLoading({ ...isLoading, loading: false, msg: `${t('bam:LOADING')}...` })
                }
            }).catch(error => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        getQueueList();
    }, [inputData]);

    const handlePin = (value) => {

        let payload = {
            "object_id": "1",
            "favourite_queue_list": "" + value.id
        }
        SetPrefQueues(payload)
            .then(response => {
                if (response != null && response.status.maincode === "0") {
                    setIsLoading({ ...isLoading, loading: false, msg: `${t('bam:LOADING')}...` })
                    console.log("response", response)
                }
                else {
                    snackbarState.openSnackbar(response != null ? response?.status?.errormsg : "Something went wrong", 'warning')
                    setIsLoading({ ...isLoading, loading: false, msg: `${t('bam:LOADING')}...` })
                }
            }).catch(error => {
                console.error('Error:', error);
            });
    };

    const onChange = (key, param) => {
        if (key === "prev") {
            setInputData({
                ...inputData, opr: 2,
                last_queue_id: (data && data.first_queue_id),
                last_queue_name: (data && data.first_queue_name),
            })
        }
        if (key === "next") {
            setInputData({
                ...inputData, opr: 1,
                last_queue_id: (data && data.last_queue_id),
                last_queue_name: (data && data.last_queue_name),
            })
        }
        if (key === "search") {
            setInputData({
                ...inputData, opr: 0, queue_filter: param,
            })
        }
    };

    const onSearchSubmit = (obj) => {
        onChange("search", obj?.searchString)
        // setLens(true)
    }

    const onClearSearch = () => {
        setInputData(GetWDQueueList);
    }
    return (
        <div className={classes.root}>
            {loading ? <div className={classes.listWrapper}><Spinner msg={msg} /></div> :

                <List subheader={<div style={{ display: "flex", whiteSpace: "nowrap" }}><ListSubheader disableSticky={true} className={classes.listSubHeader}>QUEUE LIST
                    <div style={{ display: "flex" }}> {lens ? <IconImage className={classes.searchIcon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/search_lens.png`} width={16} height={16} onClick={() => { setLens(false) }} />
                        : <span className={classes.searchBox}>
                            <SearchBox width="100%" height="7px" direction={"ltr"} placeholder={"search"} onSearchSubmit={onSearchSubmit} clearSearchResult={onClearSearch} />
                        </span>}
                        {<div> <IconImage disabled={!(data?.enable_prev)} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/left_arrow.svg`} width={16} height={16} onClick={() => { onChange("prev") }} />
                            <IconImage disabled={!(data?.enable_next)} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/right_arrow.svg`} width={16} height={16} onClick={() => { onChange("next") }} />
                        </div>}
                    </div>
                </ListSubheader></div>} className={classes.list}>
                    {queueList?.length > 0 ? queueList.map((value) => {
                        const labelId = `checkbox-list-secondary-label-${value}`;

                        return (
                            <ListItem key={value?.id} className={activeQueue && (value.id == activeTab.id && activeTab.name == value.name) ? classes.active_drawer : classes.ListItem}
                                button key={value.name} onClick={() => { handleActiveTab("queue"); setActiveTab({ name: value.name, id: value.id }) }}>
                                <ListItemIcon className={classes.listIcon}>
                                    <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/comp_icon.svg`} width={20} height={20} />
                                </ListItemIcon>
                                <Typography variant="subtitle1" noWrap={true}>
                                    <ListItemText className={classes.ListItemText} id={labelId} primary={value?.name} />
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
                    }) : <div className={classes.noDataFound}>No queues found</div>}
                </List>}

        </div>
    );
}
