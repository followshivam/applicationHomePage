import { Pagination, useTranslation, makeStyles, Typography, IconImage, TableComponent, Spinner, Button, DialogActions } from "component";
import { GetAlertList } from "global/bam/api/ApiMethods";
import { AlertListInput } from "global/json";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useStyles = makeStyles(theme => ({
    root: {
        height: '350px',
        width: '650px',
    },
    header: {
        height: '50px',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
    },
    body: {
        height: 'calc(100% - 50px - 43.2px)',
        width: '100%',
        overflow: 'auto'
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexGrow: '1'
    },
    title: {
        margin: '3px 6px 0 8px'
    },
    sideControls: {
        display: 'flex',
        alignItems: 'flex-end',
        "& > *": {
            marginLeft: '4px'
        }
    }
}));

const ShowAlert = props => {
    const {
        name = "Alert List",
        closeDialog = null
    } = props;
    const classes = useStyles();
    const [snackbarState, globalSetting] = useSelector(state => {
        return [state.snackbarState, state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    // const [counter, setCounter] = useState(0)
    const [apiData, setApiData] = useState();
    const [isLoading, setIsloading] = useState({ loading: true, msg: `${t('bam:LOADING')}...` });
    const [inputData, setInputData] = useState(() => ({ ...AlertListInput }))


    useEffect(() => {
        setIsloading({ loading: true, msg: 'fetching data from server' })
        GetAlertList(inputData).then(response => {
            console.log(response)
            if (response != null && response.status != null && response.status.maincode === "0") {
                setApiData(response.data);
            }
            else if (response != null && response.status != null && response.status.maincode !== "0") {
                snackbarState.openSnackbar(response.status.errormsg, 'error', 5000);
            }
            else {
                snackbarState.openSnackbar(`${t('bam:WENT_WRONG_ERROR')}`, 'error', 5000);
            }
        }).then(() => setIsloading({ loading: false }))
    }, [inputData]);

    const headerData = [
        {
            id: 'report_instance_name',
            label: `${t('bam:REPORT_INSTANCE_NAME')}`,
            width: "45%"
        },
        {
            id: 'rule_executed',
            label: `${t('bam:EXECUTED_RULES')}`,
            width: "25%"
        },
        {
            id: 'alert_date',
            label: `${t('bam:ALERT_DATE_TIME')}`,
            width: "30%"
        },
    ];

    const onChangePicklist = action => {
        if (action === 'next') {
            setInputData({ ...inputData, opr: '1', last_index: apiData.last_alert_id, last_value: apiData.last_report_instance_name });
        }
        else {
            setInputData({ ...inputData, opr: '2', last_index: apiData.first_alert_id, last_value: apiData.first_report_instance_name });
        }
    }

    const forceRefresh = () => {
        setInputData({ ...inputData, opr: '0', last_index: '', last_value: '' })
    }

    return <div className={classes.root}>
        <div className={classes.header}>
            <div className={classes.title}>
                <Typography variant="h6">
                    {name}
                </Typography>
            </div>
            <div className={classes.toolbar}>
                <div>
                    <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/refresh.svg`} height={16} width={16}
                        onClick={() => forceRefresh()}
                    />
                </div>
                <div className={classes.sideControls}>
                    <Pagination disabled_next={apiData && !apiData.enable_next} disabled_prev={apiData && !apiData.enable_prev} onChange={onChangePicklist} />
                    {/* <IconImage height={18} width={18} url={"icons/close_icon.svg"}
                        onClick={closeDialog}
                    /> */}
                </div>
            </div>
        </div>
        <div className={classes.body}>
            {isLoading.loading === false ?
                <TableComponent
                    tableData={apiData == null ? [] : apiData.alert_list}
                    headerData={headerData}
                    loading={false}
                    dynamicHeight='256.8px'
                    disableFirstCell
                    minWidth="100%"
                /> : <div style={{ height: '300px' }}><Spinner msg={isLoading.msg} /></div>}
        </div>
        <DialogActions>
            <Button variant="outlined" onClick={closeDialog}>{t('bam:BUTTON_CLOSE')}</Button>
        </DialogActions>
    </div>
}


export default ShowAlert;