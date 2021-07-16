import React, { useEffect, useState } from "react";
import { makeStyles, PickList, useTranslation } from "component";
import AuditLogs from "./audit_logs";
import { GetAuditLog, GetReportList, GetSchedulerList, GetTrendList, GetUserList, GroupList } from "global/bam/api/ApiMethods";
import { UserListInput } from "global/json";
import { useSelector } from 'react-redux'

const useStyles = makeStyles(theme => ({
    root: {
        height: 'calc(100vh - 86px)',
        width: '100%',
    },
    elementStyleCommon: {
        width: '130px',
        // marginBottom: theme.spacing(1),
    }
}))


const AuditLogsParent = props => {
    const classes = useStyles();

    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    const headerCells = [
        {
            id: 'date_time',
            label: `${t('bam:DATE_N_TIME')}`,
            width: "20%"
        },
        {
            id: 'description',
            label: `${t('bam:DESCRIPTION')}`,
            width: "80%"
        }
    ]

    const [inputParameters, setInputParameters] = useState({
        object_id: "",
        action_id: [],
        user_index: "",
        to_date: "",
        from_date: "",
    });


    const options_report = [
        {
            label: `${t('bam:REPORT_CREATED_T')}`,
            id: '1'
        }, {
            label: `${t('bam:REPORT_MODIFIED_T')}`,
            id: '2'
        }, {
            label: `${t('bam:REPORT_DELETED_T')}`,
            id: '3'
        }, {
            label: `${t('bam:REPORT_GENERATED_T')}`,
            id: '4'
        }, {
            label: `${t('bam:REPORT_BLOCKED_T')}`,
            id: '50'
        }, {
            label: `${t('bam:REPORT_UNBLOCKED_T')}`,
            id: '51'
        },
    ];

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

    const options_scheduler = [
        {
            label: `${t('bam:SCHEDULER_CREATED_T')}`,
            id: '5'
        }, {
            label: `${t('bam:SCHEDULER_MODIFIED_T')}`,
            id: '6'
        }, {
            label: `${t('bam:SCHEDULER_DELETED_T')}`,
            id: '7'
        }, {
            label: `${t('bam:SCHEDULER_STARTED_T')}`,
            id: '8'
        }, {
            label: `${t('bam:SCHEDULER_STOPPED_T')}`,
            id: '9'
        },
    ];




    const onChangeHandler = event => {
        setInputParameters({
            ...inputParameters,
            [event.target.name]: event.target.value
        })
    }


    const [userList, setUserList] = useState({ loading: true, list: null, error_msg: "" })
    const [objectList, setObjectList] = useState({ loading: true, list: null, error_msg: "" })


    const onChangePicklist = (type, subType = "user", opr) => {
        // if (type === 1) {
        if (opr === "next")
            onOpenPicklist(type, subType, "1")
        else
            onOpenPicklist(type, subType, "2")

    }
    const [query, setQuery] = useState({ query: "", load: false });

    const onOpenPicklist = (type, subType = "report", opr = "0") => {

        setObjectList({ loading: true, list: null })
        setUserList({ loading: true, list: null });
        if (type === 1) {
            if (subType === "trend") {
                let payload = {
                    "opr": opr,
                    "report_id": "",
                    "scheduler_type": "TA",
                    "sort_order": "d",
                    "last_index": opr === "0" ? "" : (opr === "1" ? objectList.list.last_id : objectList.list.first_id),
                    "last_value": opr === "0" ? "" : (opr === "1" ? objectList.list.last_name : objectList.list.first_name),
                    "prefix": "",
                    "type": "List",
                }
                GetTrendList(payload).then((res) => {
                    if (res != null && res.status.maincode === "0") {
                        setObjectList({ ...objectList, loading: false, list: res.data })
                    }
                    else {
                        setObjectList({ ...objectList, loading: false, error_msg: res.status.errormsg })
                    }
                }).catch((err) => { })
            }
            else if (subType === "scheduler") {
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
                // console.log(objectList)
                GetSchedulerList(payload).then((res) => {
                    if (res != null && res.status.maincode === "0") {
                        setObjectList({ ...objectList, loading: false, list: res.data })
                    }
                    else {
                        setObjectList({ ...objectList, loading: false, error_msg: res.status.errormsg })
                    }
                }).catch((err) => { })
            }
            else {
                let payload = {
                    "category_id": "GR",
                    "type": "List",
                    "last_blockedstatus": "",
                    "showblocked_top": false,
                    "hide_blocked": false,
                    "healthstatus_code": "0",
                    "filter": query.query,
                    "opr": opr,
                    "last_index": opr === "0" ? "" : (opr === "1" ? objectList.list.last_index : objectList.list.first_index),
                    "last_name": opr === "0" ? "" : (opr === "1" ? objectList.list.last_name : objectList.list.first_name),
                }

                GetReportList(payload).then((res) => {
                    if (res != null && res.status.maincode === "0") {
                        setObjectList({ ...objectList, loading: false, list: res.data })
                    }
                    else {
                        setObjectList({ ...objectList, loading: false, error_msg: res.status.errormsg })
                    }
                }).catch((err) => { })
            }
        }
        else {
            let payload = { ...UserListInput };
            payload.opr = opr;
            payload.group_index = userPicklistSettings.group_index;
            payload.order_by = userPicklistSettings.order_by;
            payload.prefix = query.query;
            payload.last_sort_field = opr === "0" ? "" : (opr === "1" ? userPicklistSettings.order_by === '2' ? userList.list.last_name : userList.list.last_personal_name : userPicklistSettings.order_by === '2' ? userList.list.first_name : userList.list.first_personal_name);
            payload.previous_index = opr === "0" ? "" : (opr === "1" ? userList.list.last_user_index : userList.list.first_user_index);
            GetUserList(payload).then((res) => {
                if (res != null && res.status.maincode === "0") {
                    setUserList({ ...userList, loading: false, list: res.data })
                }
                else {
                    setUserList({ ...userList, loading: false, error_msg: res.status.errormsg })
                }
            }).catch((err) => { });
        }
    }

    const onChangePicklistInput = (result, key, field_name = "trend_id", display_name = "report_name") => {
        // console.log(result)
        if (key === "action_by") {
            setInputParameters({
                ...inputParameters,
                "action_by": result.name,
            });
            setQuery({ ...query, query: "" })
        }
        else {
            setInputParameters({
                ...inputParameters,
                "object_id": result[field_name],
            });
            setQuery({ ...query, query: "" });
            setDisplayField(result[display_name]);
        }
    }


    useEffect(() => {
        if (query.load === true)
            onOpenPicklist(query.type, query.subType, "0")
    }, [query])

    const searchHandler = (input, type, subType) => {
        // onOpenPicklist(1, "report", 0, input)
        setQuery({ query: input, type: type, subType: subType, load: true })
    }

    const clearSearchResult = () => {
        setQuery({ ...query, query: "" });
    }

    const [displayField, setDisplayField] = useState("");
    const [userPicklistSettings, setUserPicklistSettings] = useState({ order_by: "2", group_index: "4" });
    const handleSearchToggle = (value) => {
        setUserPicklistSettings({
            ...userPicklistSettings,
            order_by: value
        })
    }
    const onChangePicklistInputSubGroup = (res) => {
        // console.log(res);
        setUserPicklistSettings({ ...userPicklistSettings, group_index: res.id })
    }

    const onChangePicklistSubGroup = action => {
        if (action === 'prev') {
            onOpenSubGroupPicklist('2');
        }
        else {
            onOpenSubGroupPicklist('1');
        }
    }

    const [subGroupList, setSubGroupList] = useState({ list: null, loading: true });
    const [subGroupQuery, setSubGroupQuery] = useState({ query: "", load: false });


    useEffect(() => {
        if (subGroupQuery.load)
            onOpenSubGroupPicklist();
    }, [subGroupQuery])

    const searchHandlerSubGroup = query => {
        setSubGroupQuery({ ...subGroupQuery, query: query, load: true });
    }

    const clearSearchResultSubGroup = () => {
        setSubGroupQuery({ ...subGroupQuery, query: "", load: true })
    }

    const onOpenSubGroupPicklist = (opr = "0") => {
        setSubGroupList({ ...subGroupList, list: null, loading: false });
        let payload = {
            "opr": opr,
            "order_by": "1",
            "sort_order": "D",
            "last_index": opr === "0" ? "" : (opr === "1" ? subGroupList.list.last_id : subGroupList.list.first_id),
            "last_value": opr === "0" ? "" : (opr === "1" ? subGroupList.list.last_group_name : subGroupList.list.first_group_name),
            "prefix": subGroupQuery.query,
            "no_of_records_to_fetch": "5"
        }
        GroupList(payload).then(response => {
            if (response != null && response.status.maincode === "0") {
                setSubGroupList({ loading: false, list: response.data, errorMessage: "" })
            }
            else if (response != null && response.status.maincode !== "0") {
                setSubGroupList({ loading: false, list: null, errorMessage: response.status.errormsg })
            }
        }).catch(error => { })
    }
    const setValue = value => {
        setInputParameters({
            ...inputParameters,
            object_id: value,
        })
    }
    const data = [
        {
            tabName: `${t('bam:REPORT_LOGS')}`,
            screen_id: "audit_log",
            filterData: {
                formElements: [
                    {
                        elementType: 'PickList',
                        elementConfig: {
                            name: "object_id",
                            value: displayField,
                            injectLiveValue: true,
                            // disabled: false,
                            form: false,
                            labelMinWidth: "80px",
                            labelMaxWidth: "80px",
                            label: `${t('bam:REPORT_FILTER')}`,
                            setValue: (value) => setValue(value),
                            onOpen: () => onOpenPicklist(1, "report"),
                            className: classes.elementStyleCommon,
                            list: objectList.list == null ? null : objectList.list,
                            loading: objectList.loading,
                            displayKey: "report_name",
                            valueKey: "report_index",
                            onChangeHandler: (result) => onChangePicklistInput(result, "object_id", "report_index", "report_name"),
                            onChangePicklist: (params) => onChangePicklist(1, "report", params),
                            onSearch: (query) => searchHandler(query, 1, "report"),
                            clearSearchResult: () => clearSearchResult()
                        }
                    },
                    {
                        elementType: 'AdvancedUserPickList',
                        elementConfig: {
                            name: "action_by",
                            value: inputParameters.action_by,
                            form: false,
                            labelMinWidth: "90px",
                            labelMaxWidth: "90px",
                            label: `${t('bam:ACTION_DONE_BY')}`,
                            injectLiveValue: true,
                            className: classes.elementStyleCommon,
                            onOpen: () => onOpenPicklist(2),
                            list: userList.list == null ? null : userList.list,
                            loading: userList.loading,
                            displayKey: "name",
                            valueKey: "user_index",
                            onChangeHandler: (result) => onChangePicklistInput(result, "action_by", "trend_id", "trend_title"),
                            onChangePicklist: (params) => onChangePicklist(2, "user", params),
                            onSearch: (query) => searchHandler(query, 2),
                            clearSearchResult: () => clearSearchResult(),
                            handleSearchToggle: (value) => handleSearchToggle(value),
                            hitGoAction: () => onOpenPicklist(2),
                            Picklist: <PickList
                                label={t('bam:GROUPS')}
                                labelMinWidth="50px"
                                labelMaxWidth="50px"
                                form={false}
                                style={{ width: '110px' }}
                                onOpen={() => onOpenSubGroupPicklist()}
                                list={subGroupList.list == null ? null : subGroupList.list}
                                // value={userPicklistSettings.group_index}
                                loading={subGroupList.loading}
                                displayKey="group_name"
                                valueKey="id"
                                onChangeHandler={(res) => onChangePicklistInputSubGroup(res)}
                                onChangePicklist={(res) => onChangePicklistSubGroup(res)}
                                injectLiveValue={true}
                                onSearch={(query) => searchHandlerSubGroup(query)}
                                // disablePickList={state.mode === "U"}
                                clearSearchResult={() => clearSearchResultSubGroup()}
                            />
                        }
                    },
                    {
                        elementType: 'DatePickers',
                        elementConfig: {
                            name: "from_date",
                            value: inputParameters.from_date,
                            form: false,
                            labelMinWidth: "70px",
                            labelMaxWidth: "70px",
                            fontSize : "0.75rem",
                            label: `${t('bam:FROM_DATE')}`,
                            timeFormat: false,
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
                            labelMinWidth: "50px",
                            fontSize : "0.75rem",
                            labelMaxWidth: "50px",
                            label: `${t('bam:TO_DATE')}`,
                            timeFormat: false,
                            disableBefore: inputParameters.from_date,
                            injectLiveValue: true,
                            className: classes.elementStyleCommon,
                            onChange: onChangeHandler
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
            },
        },
        {
            tabName: `${t('bam:SCHEDULER_LOGS')}`,
            screen_id: "scheduler",
            filterData: {
                formElements: [
                    {
                        elementType: 'PickList',
                        elementConfig: {
                            name: "object_id",
                            value: displayField,
                            form: false,
                            labelMinWidth: "90px",
                            labelMaxWidth: "90px",
                            search: false,
                            injectLiveValue: true,
                            label: `${t('bam:SCHEDULER_FILTER')}`,
                            className: classes.elementStyleCommon,
                            onOpen: () => onOpenPicklist(1, "scheduler"),
                            list: objectList.list == null ? null : objectList.list,
                            loading: objectList.loading,
                            displayKey: "scheduler_title",
                            valueKey: "scheduler_id",
                            onChangeHandler: (result) => onChangePicklistInput(result, "object_id", "scheduler_id", "scheduler_title"),
                            onChangePicklist: (params) => onChangePicklist(1, "scheduler", params),
                        }
                    },
                    {
                        elementType: 'DatePickers',
                        elementConfig: {
                            name: "from_date",
                            value: inputParameters.from_date,
                            form: false,
                            labelMinWidth: "75px",
                            fontSize : "0.75rem",
                            labelMaxWidth: "75px",
                            label: `${t('bam:FROM_DATE')}`,
                            timeFormat: false,
                            injectLiveValue: true,
                            className: classes.elementStyleCommon,
                            onChange: onChangeHandler
                        }
                    },
                    {
                        elementType: 'DatePickers',
                        elementConfig: {
                            name: "to_date",
                            value: inputParameters.to_date,
                            form: false,
                            labelMinWidth: "75px",
                            labelMaxWidth: "75px",
                            fontSize : "0.75rem",
                            disableBefore: inputParameters.from_date,
                            label: `${t('bam:TO_DATE')}`,
                            timeFormat: false,
                            injectLiveValue: true,
                            className: classes.elementStyleCommon,
                            onChange: onChangeHandler
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
                            options: options_scheduler
                        }
                    },
                ]
            }
        },
        {
            tabName: `${t('bam:TREND_LOGS')}`,
            screen_id: "trend",
            filterData: {
                formElements: [
                    {
                        elementType: 'PickList',
                        elementConfig: {
                            name: "object_id",
                            value: displayField,
                            form: false,
                            labelMinWidth: "75px",
                            labelMaxWidth: "75px",
                            search: false,
                            label: `${t('bam:TREND_FILTER')}`,
                            injectLiveValue: true,
                            className: classes.elementStyleCommon,
                            onOpen: () => onOpenPicklist(1, "trend"),
                            list: objectList.list == null ? null : objectList.list,
                            loading: objectList.loading,
                            displayKey: "trend_title",
                            valueKey: "trend_id",
                            onChangeHandler: (result) => onChangePicklistInput(result, "object_id", "trend_id", "trend_title"),
                            onChangePicklist: (params) => onChangePicklist(1, "trend", params),
                        }
                    },
                    {
                        elementType: 'DatePickers',
                        elementConfig: {
                            name: "from_date",
                            value: inputParameters.from_date,
                            form: false,
                            labelMinWidth: "75px",
                            labelMaxWidth: "75px",
                            fontSize : "0.75rem",
                            label: `${t('bam:FROM_DATE')}`,
                            timeFormat: false,
                            injectLiveValue: true,
                            className: classes.elementStyleCommon,
                            onChange: onChangeHandler
                        }
                    },
                    {
                        elementType: 'DatePickers',
                        elementConfig: {
                            name: "to_date",
                            value: inputParameters.to_date,
                            form: false,
                            labelMinWidth: "75px",
                            labelMaxWidth: "75px",
                            fontSize : "0.75rem",
                            label: `${t('bam:TO_DATE')}`,
                            timeFormat: false,
                            disableBefore: inputParameters.from_date,
                            injectLiveValue: true,
                            className: classes.elementStyleCommon,
                            onChange: onChangeHandler
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
                            options: options_trend
                        }
                    },
                ]
            }
        }
    ]

    const [apiResponse, setApiRespose] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [screenId, setScreenId] = useState("audit_log");
    useEffect(() => {
        setApiRespose({
            history_items: [],
            enable_next: false,
            enable_prev: false
        })
    }, [screenId]);

    useEffect(() => {
        setDisplayField("")
    }, [screenId])

    const clearFilters = () => {
        setInputParameters({
            object_id: "",
            action_id: "",
            user_index: "",
            to_date: "",
            from_date: "",
        });
        setDisplayField();
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
            screen_id: screenId,
            type: screenId === "audit_log" ? "" : (screenId === "trend" ? "TA" : "RS"),
            batch_size: '25',
            selected_tab: '1',
            sort_order: 'DESC',
            action_id: inputParameters.action_id.join(',')
        }
        setIsLoading(true);
        GetAuditLog(payload).then(response => {
            if (response != null && response.status.maincode === "0") {
                setApiRespose(response.data);
            }
        }).then(() => {
            setIsLoading(false);
        }).catch(err => { })
    }

    return <div className={classes.root}>
        <AuditLogs
            onPaginationChange={onPaginationChange}
            headerCells={headerCells}
            setScreenId={setScreenId}
            GetDataFromApi={GetDataFromApi}
            isLoading={isLoading}
            data={data}
            t={t}
            disableTabs={false}
            clearFilters={clearFilters}
            {...apiResponse}
            disableButton={false}
        />
    </div>
}

export default AuditLogsParent;
