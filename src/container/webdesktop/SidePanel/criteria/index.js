import React, { useEffect, useState } from 'react';
import {
    IconImage, makeStyles,
    useTranslation, Checkbox, List,
    ListItem, ListItemSecondaryAction,
  Spinner, ListItemText, ListSubheader
} from 'component'
import { useSelector } from 'react-redux';
import { GetCriteria } from "global/webdesktop/api/ApiMethods";


const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    noDataFound: {
        color: "#F8F8F8",
        fontStyle: "italic",
        fontSize: "12px",
        display: "flex",
        margin: "0 0 20px 20px",
        opacity: 0.58

    },
    heading: {
        display: "flex",
        justifyContent: "space-between",
    },
    list: {
        color: "white",
        display: "flex",
        flexDirection: "column"
    },
    h6: {
        fontSize: '12px',
        whiteSpace: 'nowrap',
        color: '#D9D9D9',
        display: 'flex',
        // justifyContent:"space-between",
        alignItems: 'center',
        fontWeight: 500,
        paddingLeft: "16px",
    },
    switchBtn: {
        marginTop: "12px"
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
        // justifyContent: "space-between",
        paddingRight: "5px"
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

}));

export default function Criteria(props) {

    const { activeCriteria, handleActiveTab } = props;
    const [globalSetting, snackbarState] = useSelector(state => {
        return [state.globalSettings, state.snackbarState];
    });

    const { t } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])
    const [direction] = useState(`${t('bam:HTML_DIR')}`);
    const [isLoading, setIsLoading] = useState({ msg: `${t('bam:LOADING')}...`, loading: true });
    const { loading, msg } = isLoading;
    const classes = useStyles({ direction });
    const [data, setData] = useState();
    const [listData, setListData] = useState([{ "id": "", "name": "" }]);
    const [activeTab, setActiveTab] = useState({ name: listData && listData[0].name, id: 0 });
    const [inputData, setInputData] = useState({
        opr: "0",
        prefix: "",
        mode: "PM"
    });

    const getCriteria = () => {
        GetCriteria(inputData)
            .then(response => {
                if (response != null && response.status.maincode === "0") {
                    setIsLoading({ ...isLoading, loading: false, msg: `${t('bam:LOADING')}...` })
                    setData(response?.data);
                    setListData(response?.data?.criteria_list)
                }
                else {
                    snackbarState.openSnackbar((response != null && response?.status?.errormsg !== '') ? response?.status?.errormsg : "Something went wrong", 'warning')
                    setIsLoading({ ...isLoading, loading: false, msg: `${t('bam:LOADING')}...` })
                }
            }).catch(error => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        getCriteria();
    }, [inputData]);

    const handlePin = (value) => {
        console.log({ value })
    }

    const onChange = (key) => {
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
    };

    return (
        <div className={classes.root}>
            {loading ? <div className={classes.listWrapper}><Spinner msg={msg} /></div> :
                <>
                    <div className={classes.heading}>  <label className={classes.h6}>CRITERIA</label>
                        <div style={{ paddingTop: "12px" }}>
                            <IconImage style={{ paddingRight: "7px" }} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/refresh.svg`} width={16} height={16} />
                            <IconImage style={{ paddingRight: "12px" }} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/side_icon_4.svg`} width={16} height={16} />
                        </div>
                    </div>
                    {listData?.map((item, key) => {
                        return <List dense key={key}
                            subheader={<ListSubheader disableSticky={true} className={classes.listSubHeader}>
                            {item?.filter_list?.length > 0?<IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/comp_icon.svg`} width={20} height={20} />:null}
                            {item?.name}
                            </ListSubheader>} className={classes.list}>
                            {item?.filter_list?.length > 0 ? item?.filter_list.map((value, index) => {
                                const labelId = `checkbox-list-secondary-label-${value}`;

                                return (
                                    <ListItem key={index} className={activeCriteria && (value.id == activeTab.id && activeTab.name == item.name) ? classes.active_drawer : classes.ListItem}
                                        button key={value.name} onClick={() => { handleActiveTab("criteria"); setActiveTab({ name: value.name, id: value.id }) }}>
                                        <span style={{ borderRadius: "100px", width: "10px", height: "10px", display: "inline-block", margin: "0 5px 0 20px", backgroundColor: "skyblue"  }}/>
                                        <ListItemText className={classes.ListItemText} id={labelId} primary={value?.name!==''?value?.name:index} />
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
                            }) : <div className={classes.noDataFound} >No criteria found</div>
                            }
                        </List>
                    })}</>}
        </div>
    )
}















 // <List dense subheader={<ListSubheader disableSticky={true} className={classes.listSubHeader}>CRITERIA
        //     <Switch
        //         checked={showPinned}
        //         onChange={(e) => handleChange(e)}
        //         className={classes.switchBtn}
        //         size={"small"} /></ListSubheader>}
        //     className={classes.list}>
        //     {listData?.length > 0 ? listData?.map((value) => {
        //         const labelId = `checkbox-list-secondary-label-${value}`;

        //         return (
        //             <ListItem key={value.id} className={activeCriteria && (value.id == activeTab.id && activeTab.name == value.name) ? classes.active_drawer : classes.ListItem}
        //                 button key={value.name} onClick={() =>{handleActiveTab("criteria"); setActiveTab({ name: value.name, id: value.id })}}>
        //                 <ListItemIcon className={classes.listIcon}>
        //                     <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/comp_icon.svg`} width={20} height={20} />
        //                 </ListItemIcon>
        //                 <ListItemText className={classes.ListItemText} id={labelId} primary={value?.name} />
        //                 <ListItemSecondaryAction>
        //                     <Checkbox
        //                         edge="end"
        //                         name='checkbox'
        //                         checked={value.pinned}
        //                         onChange={() => handlePin(value)}
        //                         inputProps={{ 'aria-labelledby': labelId }}
        //                         icon={<IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/pin_grey.svg`} width={16} height={16} />}
        //                         checkedIcon={<IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/pin.svg`} width={20} height={20} />}
        //                     />
        //                 </ListItemSecondaryAction>
        //             </ListItem>
        //         );
        //     }) : <div className={classes.noDataFound} >No criteria found</div>}
        // </List>}