import React, { useEffect, useState } from "react";
import { makeStyles, useTranslation } from "component";
import AuditLogs from "container/bam/AuditLogs/audit_logs";
import { GetAuditLog, GetTrendList, GetUserList } from "global/bam/api/ApiMethods";
import { UserListInput } from "global/json";
import { useSelector } from 'react-redux'

const useStyles = makeStyles(theme => ({
    root: {
        height: '374px',
        width: `calc(100% - ${theme.spacing(4)}px)`,
        margin: `0 ${theme.spacing(2)}px`,
    }
}))

const TrendsAuditLog = props => {
    const classes = useStyles();


    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    const headerCells = [
        {
            id: 'date_time',
            label: `${t('bam:DATE_N_TIME')}`,
            width: '25%'
        },
        {
            id: 'description',
            label: `${t('bam:DESCRIPTION')}`,
            width: '75%',
        }
    ];

    const [inputParameters, setInputParameters] = useState({
        "object_id": "",
        "from_date": "",
        "to_date": "",
        "action_by": "",
        action_id: [],
        "trend_name": ""
    })

    const onChangeHandler = event => {
        setInputParameters({
            ...inputParameters,
            [event.target.name]: event.target.value
        })
    }

    const [trendList, setTrendList] = useState({ loading: true, list: null, error_msg: "" })
    const [userList, setUserList] = useState({ loading: true, list: null, error_msg: "" })


    const onChangePicklist = (type, subType = "user", opr) => {
        if (opr === "next")
            onOpenPicklist(type, "1")
        else
            onOpenPicklist(type, "2")
    }

    const onOpenPicklist = (type, opr = "0") => {
        if (type === 1) {
            let payload = {
                "opr": opr,
                "report_id": "",
                "scheduler_type": "TA",
                "sort_order": "d",
                "last_index": opr === "0" ? "" : (opr === "1" ? trendList.list.last_id : trendList.list.first_id),
                "last_value": opr === "0" ? "" : (opr === "1" ? trendList.list.last_name : trendList.list.first_name),
                "prefix": "",
                "type": "List",
            }

            GetTrendList(payload).then((res) => {
                if (res != null && res.status.maincode === "0") {
                    setTrendList({ ...trendList, loading: false, list: res.data })
                }
                else {
                    setTrendList({ ...trendList, loading: false, error_msg: res.status.errormsg })
                }
            }).catch((err) => { })
        }
        else {
            GetUserList(UserListInput).then((res) => {
                if (res != null && res.status.maincode === "0") {
                    setUserList({ ...userList, loading: false, list: res.data })
                }
                else {
                    setUserList({ ...userList, loading: false, error_msg: res.status.errormsg })
                }
            }).catch((err) => { })
        }
    }

    const onChangePicklistInput = (result, key) => {
        if (key === "action_by") {
            console.log(result)
            setInputParameters({
                ...inputParameters,
                "action_by": result.user_index,
            })
        }
        else
            setInputParameters({
                ...inputParameters,
                "object_id": result.trend_id,
                trend_name: result.trend_title
            })
    }
    const options_trend = [
        {
            label: `${t('bam:TREND_CREATED_T')}`,
            id: '13'
        }, {
            label: `${t('bam:TREND_MODIFIED_T')}`,
            id: '14'
        }, {
            label: `${t('bam:TREND_DELETED_T')}`,
            id: '15'
        }, {
            label: `${t('bam:TREND_STARTED_T')}`,
            id: '16'
        }, {
            label: `${t('bam:TREND_STOPPED_T')}`,
            id: '17'
        },
    ];
    const data = [
        {
            tabName: "Trends Logs",
            screen_id: "trend",
            filterData: {
                formElements: [
                    {
                        elementType: 'PickList',
                        elementConfig: {
                            name: "object_id",
                            value: inputParameters.trend_name,
                            form: false,
                            labelMinWidth: "75px",
                            labelMaxWidth: "75px",
                            label: "Trends Filter",
                            className: classes.elementStyleCommon,
                            onOpen: () => onOpenPicklist(1),
                            list: trendList.list == null ? null : trendList.list,
                            loading: trendList.loading,
                            injectLiveValue: true,
                            displayKey: "trend_title",
                            valueKey: "trend_id",
                            search: false,
                            onChangeHandler: (result) => onChangePicklistInput(result, "object_id"),
                            onChangePicklist: (params) => onChangePicklist(1, "trend", params),
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
                            label: "From Date",
                            timeFormat: false,
                            // placeholder: "eg. 15/01/2021",
                            className: classes.elementStyleCommon,
                            onChange: (e) => {
                                // console.log('date : ', date);
                                setInputParameters({
                                    ...inputParameters,
                                    from_date: e.target.value
                                })
                            }
                        }
                    }, {
                        elementType: 'DatePickers',
                        elementConfig: {
                            name: "to_date",
                            value: inputParameters.to_date,
                            form: false,
                            labelMinWidth: "70px",
                            style: { width: '110px' },
                            labelMaxWidth: "70px",
                            label: "To Date",
                            timeFormat: false,
                            // placeholder: "eg. 15/01/2021",
                            disableBefore: inputParameters.from_date,
                            className: classes.elementStyleCommon,
                            onChange: (e) => {
                                // console.log('date : ', date);
                                setInputParameters({
                                    ...inputParameters,
                                    to_date: e.target.value
                                })
                            }
                        }
                    },
                    // {
                    //     elementType: 'InputBox',
                    //     elementConfig: {
                    //         name: "from_date",
                    //         value: inputParameters.from_date,
                    //         form: false,
                    //         labelMinWidth: "75px",
                    //         labelMaxWidth: "75px",
                    //         label: "From Date",
                    //         type: "date",
                    //         injectLiveValue: true,
                    //         className: classes.elementStyleCommon,
                    //         onChange: onChangeHandler
                    //     }
                    // },
                    // {
                    //     elementType: 'InputBox',
                    //     elementConfig: {
                    //         name: "to_date",
                    //         value: inputParameters.to_date,
                    //         form: false,
                    //         labelMinWidth: "75px",
                    //         labelMaxWidth: "75px",
                    //         label: "To Date",
                    //         type: "date",
                    //         injectLiveValue: true,
                    //         className: classes.elementStyleCommon,
                    //         onChange: onChangeHandler
                    //     }
                    // },


                    {
                        elementType: 'MultiSelectBox',
                        elementConfig: {
                            name: "action_id",
                            value: inputParameters.action_id,
                            form: false,
                            disabled: false,
                            labelMinWidth: "114px",
                            labelMaxWidth: "114px",
                            label: "Action Performed",
                            injectLiveValue: true,
                            className: classes.elementStyleCommon,
                            onChange: (val) => setInputParameters({
                                ...inputParameters,
                                action_id: val
                            }),
                            options: options_trend
                        }
                    },
                ]
            }
        }
    ]

    const [isLoading, setIsLoading] = useState(false);

    const [apiResponse, setApiRespose] = useState();


    const clearFilters = () => {
        setInputParameters({
            object_id: "",
            user_index: "",
            to_date: "",
            from_date: "",
            action_id: [],
            trend_name: "",
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
            screen_id: "trend",
            type: "TA",
            batch_size: '8',
            selected_tab: '1',
            sort_order: 'DESC',
            action_id: inputParameters.action_id.join(',')
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
        <AuditLogs
            headerCells={headerCells}
            data={data}
            isLoading={isLoading}
            onPaginationChange={onPaginationChange}
            GetDataFromApi={GetDataFromApi}
            clearFilters={clearFilters}
            {...apiResponse}
            dynamicHeight="250px"
        />
    </div>
}

export default TrendsAuditLog;