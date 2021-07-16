import React, { useEffect, useState } from "react";
import { useSelector, } from "react-redux";
import {
    makeStyles,
    Button,
    Typography,
    Checkbox,
    DialogActions,
    DialogContent,
    DialogTitle,
    SelectBox,
    InputBox,
    Spinner,
    useTranslation
} from "component";
import { UserPreferenceListInput, GetTabInput } from "global/json";
import { UserPrefrencesList, GetTabList } from "global/bam/api/ApiMethods";
import RowDragger from "component/RowDraggerV2";



const useStyles = makeStyles(theme => ({
    root: {
        width: "100%"
    },
    header: {
        // display: 'flex',
        width: '100%',
        // borderBottom: `1px solid ${theme.palette.backgroundContainer}`,
        justifyContent: 'space-between',
        alignItems: 'center',
        // padding:"15px"
    },
  
    headerControls: {
        paddingLeft: theme.spacing(1),
        display: 'flex',
        justifyContent: 'space-between',
        flexGrow: '1'
    },
    content: {
        width: '100%',
        height: 'calc(100% - 51px)'
        // height: '350px',
    },
    box: {
        display: "block",
        width: '160px',
        height: "160px",
        border: "1px solid #E4E4E4"
    },
    paper: {
        width: "100%",
        marginBottom: theme.spacing(2)
    },
    h6: {
        fontSize: "12px",
        color: "#606060",
        fontWeight: 300,
        margin: "10px 0 10px 0"
    },
    homeTab: {
        display: "flex",
        whiteSpace: "noWrap",
        margin: "10px 0px 10px 0",
        alignItems: "center"
    },
    rightWrapper: {
        // width: "40%",
        margin: "0 auto",
        position: "relative",
    },
    leftWrapper: {
        width: "50%",
        flexGrow: 1,
        marginRight: "45px"
    },
    wrapper: {
        width: "100%",
        display: "flex",
    },
    span: {
        display: "inline-block",
        verticalAlign: "middle",
        fontSize: "0.75rem",
        fontWeight: 600,
        color: "rgb(96, 96, 96)"
    },
    spinner: {
        height: '260px',
        width: '580px'
    }

}));


export default function UserPrefrences(props) {
    const classes = useStyles();
    const [normalStoreDialog, snackBar, globalSetting] = useSelector(state => {
        return [state.normalDialogState, state.snackbarState, state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    const handleClose = () => {
        normalStoreDialog.closeDialog()
    };

    const [inputData, setInputData] = React.useState(UserPreferenceListInput)

    const [tabList, setTabList] = useState([]);

    const [isLoading, setIsLoading] = useState({ msg: "", loading: true });

    const { loading } = isLoading;

    const [data, setData] = useState();

    const onChangeHandler = (e) => {
        if (e.target.name === "is_tab_switch" || e.target.name === "refresh_interval") {
            setInputData({ ...inputData, [e.target.name]: e.target.checked });
        } else {
            setInputData({ ...inputData, [e.target.name]: e.target.value });
        }
    }

    useEffect(() => {
        getTab_list();
    }, [GetTabInput]);

    const getTab_list = () => {
        setIsLoading({ ...isLoading, loading: true });
        GetTabList(GetTabInput)
            .then(res => {
                if (res != null && res.status.maincode === "0") {
                    let selectVal = res && res.data && res.data.tab_list.map((name) => ({
                        value: name.tab_id,
                        label: name.tab_name,
                    })
                    );
                    const newTabList = [...tabList, ...selectVal];
                    setTabList(newTabList);
                    setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
                }
            })
            .catch(err => { });
    };

    const userPref = () => {
        let data = {
            ...inputData,
            is_tab_switch: inputData && (inputData.is_tab_switch === true) ? "Y" : "N",
            refresh_interval: inputData && (inputData.refresh_interval === true) ? "Y" : "N",
            opr: 0,
        }
        if (((inputData.refresh_interval === true) && data.alerts_refresh_interval !== "") || ((inputData.is_tab_switch === true) && data.tab_switch_interval !== "")) {
            UserPrefrencesList(data)
                .then(res => {
                    if (res != null && res.status.maincode === "0") {
                        snackBar.openSnackbar(`${t('bam:PREFERENCE_ADDED_SUCCESS')}`, "success");
                        console.log("res", res);
                        handleClose()
                    } else {
                        snackBar.openSnackbar(res.status.errormsg, "error");
                    }
                })
                .catch(err => { });
        }
        else {
            snackBar.openSnackbar(`${t('bam:PLEASE_FILL_REQ_FIELDS')}`, "error")

        }
    };

    const onChangeHandlerDragger = (newData) => {
        setData(newData);
    }

    useEffect(() => {
        let data = tabList.map((res) => (
            {
                unique_id: `${res.value}`,
                component: <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                }}>
                    <Typography noWrap={true} >
                        {res.label}
                    </Typography>
                </div>
            }))

        setData(data);
    }, [tabList])

    const action_button = [
        {
            id: 1,
            label: `${t('bam:BUTTON_CLOSE')}`,
            type: 'button',
            variant: 'outlined',
            color: 'primary',
            action: handleClose
        },

        {
            id: 2,
            label: `${t('bam:BUTTON_SAVE')}`,
            type: 'submit',
            variant: 'contained',
            color: 'primary',
            action: userPref
        },
    ]
    return (

        <div className={classes.root}>
            <DialogTitle>
                <div className={classes.header}>
                    <div className={classes.headerTitle}>
                        <Typography variant="h6"><strong>{t('bam:BUSINESS_ACTIVITY_MONITOR_PREFERENCE')}</strong></Typography>
                    </div>

                </div>

            </DialogTitle>
            {loading ? (
                <div className={classes.spinner}>
                    <Spinner />
                </div>
            ) : (<DialogContent
                className={classes.dialogContentLanding}>
                <div className={classes.header}>
                    {/* <Paper className={classes.paper}> */}
                    <div className={classes.wrapper}>
                        <div className={classes.leftWrapper}>
                            <div className={classes.h6}>
                                <label>{t('bam:SET_PREFERENCE')}:</label>
                            </div>
                            <div className={classes.homeTab}>
                                <SelectBox
                                    name='home_tab_id'
                                    list={tabList} value=""
                                    label={t('bam:HOME_TAB')}
                                    form={false}
                                    labelMaxWidth="160px"
                                    labelMinWidth="160px"
                                    onChange={onChangeHandler}
                                    required={true}
                                    style={{ width: "160px" }}
                                />
                            </div>
                            <div className={classes.homeTab}>
                                <span className={classes.span}>{t('bam:TOGGLE_TABS')}</span>
                                <span style={{ marginLeft: "88px" }}>
                                    <Checkbox
                                        name='is_tab_switch'
                                        onChange={onChangeHandler} />
                                </span>
                            </div>
                            <div className={classes.homeTab}>

                                <InputBox style={{ width: "64px" }}
                                    label={t('bam:TAB_SWITCH_INTERVAL')}
                                    form={false}
                                    labelMaxWidth="160px"
                                    labelMinWidth="160px"
                                    type="number"
                                    name='tab_switch_interval'
                                    onChangeHandler={onChangeHandler}
                                    required={inputData.is_tab_switch === true ? true : false}
                                    disabled={inputData.is_tab_switch !== true}
                                />
                                <Typography variant="subtitle1" style={{ marginLeft: "5px" }}>{t('bam:MINUTES')}</Typography>
                            </div>
                            <div className={classes.homeTab}>
                                <span className={classes.span}>{t('bam:REFRESH_INTERVAL')}</span>
                                <span style={{ marginLeft: "60px" }}>
                                    <Checkbox
                                        name='refresh_interval'
                                        onChange={onChangeHandler} />
                                </span>
                            </div>
                            <div className={classes.homeTab}>

                                <InputBox style={{ width: "64px" }}
                                    label={t('bam:ALERTREFRESHINTERVAL')}
                                    form={false}
                                    labelMaxWidth="160px"
                                    labelMinWidth="160px"
                                    type="number"
                                    name='alerts_refresh_interval'
                                    required={inputData.refresh_interval === true ? true : false}
                                    disabled={inputData.refresh_interval !== true}
                                    onChangeHandler={onChangeHandler} />
                                <Typography variant="subtitle1" style={{ marginLeft: "5px" }}>{t('bam:MINUTES')}</Typography>
                            </div>
                        </div>
                        <div className={classes.rightWrapper}>
                            <div className={classes.h6}>
                                <label> {t('bam:TABS_ORDER')}:</label>
                            </div>
                            <div className={classes.box}>
                                <RowDragger data={data} onChange={onChangeHandlerDragger} />
                            </div>
                            <span className={classes.h6}>{t('bam:DRAG_UP_DOWN')}</span>
                        </div>
                    </div>

                    {/* </Paper> */}
                </div>

            </DialogContent>)}
            <DialogActions>
                {action_button.map((res, key) => {
                    return (<Button
                        variant={res.variant}
                        color={res.color}
                        onClick={res.action}
                        type={res.type}
                    >
                        {res.label}
                    </Button>)
                })}
            </DialogActions>

        </div>
    );
}
