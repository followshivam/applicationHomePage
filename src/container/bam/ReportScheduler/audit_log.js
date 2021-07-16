import React, { useState } from "react";
import { Button, DialogActions, DialogContent, DialogTitle, Divider, makeStyles, Typography, useTranslation } from "component";
import { useSelector, } from "react-redux";
import AuditLogs from "container/bam/AuditLogs/audit_logs";
import { GetAuditLog, GetSchedulerList } from "global/bam/api/ApiMethods";

const useStyles = makeStyles(theme => ({
    root: {
        height: '460px',
        // width: `calc(100% - ${theme.spacing(4)}px)`,
        width: `742px`,
        margin: `0 ${theme.spacing(2)}px`,
    },
    spinner: {
        height: '400px',
        width: '742px'
    },
    DialogActions: {
        padding: 20,
    },
    DialogTitle: {
        padding: 0,
        margin: "0px -15px"
    },
    DialogContent: {
        padding: 0,
        height: '350px',
        overflowY: "auto"
    },
    headerTitle: {
        margin: "10px 20px"
    },
    elementStyleCommon: {
        width: "150px"
    }

}))

const AuditLog = props => {
    const classes = useStyles();

    const [globalSetting, normalStoreDialog, snackBar] = useSelector(state => {
        return [state.globalSettings, state.normalDialogState, state.snackbarState];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    const headerCells = [
        {
            id: 'date_time',
            label: `${t('bam:DATE_N_TIME')}`,
            width: '30%'
        },
        {
            id: 'description',
            label: `${t('bam:DESCRIPTION')}`,
            width: '70%',
        }
    ];

    const [inputParameters, setInputParameters] = useState({
        "object_id": "",
        "from_date": "",
        "to_date": "",
        "action_by": "",
    })
    const options_report = [
        {
            label: `${t('bam:STARTED_EXECUTING_T')}`,
            id: '1'
        }, {
            label: `${t('bam:FINISHED_EXECUTING_T')}`,
            id: '2'
        }, {
            label: `${t('bam:STARTED_EXECUTING_REPORT_T')}`,
            id: '3'
        }, {
            label: `${t('bam:FINISHED_EXECUTING_REPORT_T')}`,
            id: '4'
        },
        {
            label: `${t('bam:FAILED_EXECUTING_REPORT_T')}`,
            id: '5'
        },
        {
            label: `${t('bam:FAILED_EXECUTING_T')}`,
            id: '6'
        },
        {
            label: `${t('bam:EXECUTE_REPORT_BATCH_T')}`,
            id: '7'
        },
    ];
    const onChangeHandler = event => {
        setInputParameters({
            ...inputParameters,
            [event.target.name]: event.target.value
        })
    }
    const [displayField, setDisplayField] = useState("");

    const [objectList, setObjectList] = useState({ loading: true, list: null, error_msg: "" })

    // useEffect(() => {
    //     setDisplayField("")
    // }, [screenId])

    const onChangePicklist = (type, subType = "user", opr) => {
        // if (type === 1) {
        if (opr === "next")
            onOpenPicklist(type, subType, "1")
        else
            onOpenPicklist(type, subType, "2")

    }

    const onOpenPicklist = (type, subType = "report", opr = "0") => {
        if (type === 1) {

            let payload = {
                "opr": opr,
                "report_id": "",
                "scheduler_type": "RS",
                "sort_order": "d",
                "last_index": opr === "0" ? "" : (opr === "1" ? objectList.list.last_scheduler_id : objectList.list.first_scheduler_id),
                "last_value": opr === "0" ? "" : (opr === "1" ? objectList.list.last_scheduler_title : objectList.list.first_scheduler_title),
                "prefix": "",
                "type": "List",
            }
            GetSchedulerList(payload).then((res) => {
                if (res != null && res.status.maincode === "0") {
                    setObjectList({ ...objectList, loading: false, list: res.data })
                }
                else {
                    setObjectList({ ...objectList, loading: false, error_msg: res.status.errormsg })
                }
            }).catch((err) => { })
        }
    }

    const onChangePicklistInput = (result, key, field_name = "report_id", display_name = "report_name") => {
        if (key === "action_by") {
            setInputParameters({
                ...inputParameters,
                "action_by": result.name,
            })
        }
        else
            setInputParameters({
                ...inputParameters,
                "object_id": result[field_name],
            })
        setDisplayField(result[display_name]);

    }
    const data = [
        {
            tabName: "Scheduler Logs",
            screen_id: "scheduler",
            filterData: {
                formElements: [
                    {
                        elementType: 'PickList',
                        elementConfig: {
                            name: "object_id",
                            value: displayField, // inputParameters.object_id,
                            form: false,
                            labelMinWidth: "100px",
                            labelMaxWidth: "100px",
                            label: `${t('bam:SCHEDULER_FILTER')}`,
                            className: classes.elementStyleCommon,
                            onOpen: () => onOpenPicklist(1, "scheduler"),
                            list: objectList.list == null ? null : objectList.list,
                            loading: objectList.loading,
                            displayKey: "scheduler_title",
                            valueKey: "scheduler_id",
                            onChangeHandler: (result) => onChangePicklistInput(result, "object_id", "scheduler_id"),
                            onChangePicklist: (params) => onChangePicklist(1, "scheduler", params),
                        }
                    },

                    {
                        elementType: 'DatePickers',
                        elementConfig: {
                            name: "from_date",
                            value: inputParameters.from_date,
                            form: false,
                            labelMinWidth: "70px",
                            style: { width: '110px' },
                            labelMaxWidth: "70px",
                            label: `${t('bam:FROM_DATE')}`,
                            timeFormat: false,
                            placeholder: "eg. 15/01/2021",
                            disableBefore: '2021-03-02',
                            className: classes.elementStyleCommon,
                            onChange: (e) => {
                                setInputParameters({
                                    ...inputParameters,
                                    from_date: e.target.value
                                })
                            }
                        }
                    },
                    {
                        elementType: 'DatePickers',
                        elementConfig: {
                            name: "to_date",
                            value: inputParameters.to_date,
                            form: false,
                            labelMinWidth: "70px",
                            style: { width: '110px' },
                            labelMaxWidth: "70px",
                            label: `${t('bam:TO_DATE')}`,
                            timeFormat: false,
                            placeholder: "eg. 15/01/2021",
                            disableBefore: '2021-03-10',
                            className: classes.elementStyleCommon,
                            onChange: (e) => {
                                setInputParameters({
                                    ...inputParameters,
                                    to_date: e.target.value
                                })
                            }
                        }
                    },
                    {
                        elementType: 'MultiSelectBox',
                        elementConfig: {
                            name: "action_id",
                            value: inputParameters.action_id,
                            form: false,
                            disabled: false,
                            labelMinWidth: "114px",
                            labelMaxWidth: "114px",
                            label: `${t('bam:ACTION_PERFORMED')}`,
                            injectLiveValue: false,
                            className: classes.elementStyleCommon,
                            onChange: (val) => setInputParameters({
                                ...inputParameters,
                                action_id: val
                            }),
                            options: options_report
                        }
                    },
                ]
            }
        },
    ];

    const handleClose = () => {
        normalStoreDialog.closeDialog()
    };
    const action_button = [
        {
            id: 1,
            label: `${t('bam:BUTTON_CLOSE')}`,
            type: 'button',
            variant: 'outlined',
            color: 'primary',
            action: handleClose
        },

    ]

    const [apiResponse, setApiRespose] = useState();
    const [isLoading, setIsLoading] = useState(false);


    const clearFilters = () => {
        setInputParameters({
            object_id: "",
            action_id: "",
            user_index: "",
            to_date: "",
            from_date: "",
        })
    }

    const onPaginationChange = (action) => {
        if (action === "next") {
            GetDataFromApi({}, 1, apiResponse != null ? apiResponse.last_value : "");
        }
        else {
            GetDataFromApi({}, 2, apiResponse != null ? apiResponse.first_value : "");
        }
    }

    const GetDataFromApi = (event, i_action = 0, last_value = "") => {
        let payload = {
            ...inputParameters,
            opr: 0,
            i_action: i_action,
            last_value: last_value,
            screen_id: "audit_log",
            type: "RS",
            batch_size: '25',
            selected_tab: '1',
            sort_order: 'DESC',
            action_id: inputParameters?.action_id?.join(',')
        }
        setIsLoading(true);
        GetAuditLog(payload).then(response => {
            if (response != null && response.status.maincode === "0") {
                setApiRespose(response.data);
                setTimeout(setIsLoading(false), 100)
            }
        }).then(() => {
            setIsLoading(false);
        }).catch(err => { })
    }


    return <div className={classes.root}>
        <DialogTitle className={classes.DialogTitle}>
            <div className={classes.header}>
                <div className={classes.headerTitle}>
                    <Typography variant="h6"><strong>{t('bam:REPORTS_AUDIT_LOG')}</strong></Typography>
                </div>
            </div>
            <Divider />
        </DialogTitle>
        <DialogContent className={classes.DialogContent}>
            <AuditLogs
                headerCells={headerCells}
                data={data}
                isLoading={isLoading}
                onPaginationChange={onPaginationChange}
                GetDataFromApi={GetDataFromApi}
                clearFilters={clearFilters}
                dynamicHeight="230px"
                {...apiResponse}
            /></DialogContent>
        <DialogActions className={classes.DialogActions}>
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
}

export default AuditLog;