import React, { useState } from "react";
import { makeStyles, useTranslation } from "component";
import AuditLogs from "container/bam/AuditLogs/audit_logs";
import { GetAuditLog } from "global/omniapp/api/ApiMethods";
import moment from 'moment'
import { useSelector } from "react-redux";

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        width: '100%',
    },
    elementStyleCommon: {
        width: '137px',
    }
}))

const AuditLogsParent = props => {
    const classes = useStyles();
    const snackbarState = useSelector(store => store.snackbarState);
    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])
    const headerCells = [
        {
            id: 'date',
            label: `${t('omniapp:DATE_TIME')}`
        },
        {
            id: 'description',
            label: `${t('omniapp:DESCRIPTION')}`
        }
    ]

    var from_date = new Date();
    from_date.setDate(from_date.getDate() - 7);

    const initialState = {
        "opr": "0",
        "from_date": moment(from_date).format('YYYY-MM-DD'),
        "to_date": moment(new Date()).format('YYYY-MM-DD'),
        "action_ids": "",
        "last_value": "",
    }

    const [inputParameters, setInputParameters] = useState(initialState);


    const onChangeHandler = event => {
        setInputParameters({
            ...inputParameters,
            [event.target.name]: event.target.value
        })
    }

    const data = [{
        filterData: {
            formElements: [
                {
                    elementType: 'DatePickers',
                    elementConfig: {
                        name: "from_date",
                        value: inputParameters.from_date,
                        placeholder: 'Select',
                        form: false,
                        labelMinWidth: "73px",
                        labelMaxWidth: "73px",
                        label: `${t('omniapp:FROM_DATE')}`,
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
                        placeholder: 'Select',
                        form: false,
                        labelMinWidth: "57px",
                        labelMaxWidth: "57px",
                        label: `${t('omniapp:TO_DATE')}`,
                        disableBefore: inputParameters.from_date,
                        timeFormat: false,
                        injectLiveValue: true,
                        className: classes.elementStyleCommon,
                        onChange: onChangeHandler
                    }
                },
                {
                    elementType: 'MultiSelectBox',
                    elementConfig: {
                        name: "action_ids",
                        value: inputParameters.action_ids,
                        form: false,
                        disabled: false,
                        labelMinWidth: "114px",
                        labelMaxWidth: "114px",
                        label: `${t('omniapp:ACTION_PERFORMED')}`,
                        injectLiveValue: true,
                        className: classes.elementStyleCommon,
                        onChange: (val) => setInputParameters({
                            ...inputParameters,
                            action_ids: val
                        }),
                        options: [
                            { label: `${t('omniapp:APPLICATION_REGISTER')}`, value: 'APPLICATION_REGISTER', id: '1' },
                            { label: `${t('omniapp:APPLICATION_MODIFY')}`, value: 'APPLICATION_MODIFY', id: '2' },
                            { label: `${t('omniapp:APPLICATION_DELETE')}`, value: 'APPLICATION_DELETE', id: '3' },
                            { label: `${t('omniapp:COMPONENT_REGISTER')}`, value: 'COMPONENT_REGISTER', id: '4' },
                            { label: `${t('omniapp:COMPONENT_MODIFY')}`, value: 'COMPONENT_MODIFY', id: '5' },
                            { label: `${t('omniapp:COMPONENT_DELETE')}`, value: 'COMPONENT_DELETE', id: '6' },
                            { label: `${t('omniapp:COMPONENT_INSTANCE_REGISTER')}`, value: 'COMPONENT_INSTANCE_REGISTER', id: '7' },
                            { label: `${t('omniapp:COMPONENT_INSTANCE_MODIFY')}`, value: 'COMPONENT_INSTANCE_MODIFY', id: '8' },
                            { label: `${t('omniapp:COMPONENT_INSTANCE_DELETE')}`, value: 'COMPONENT_INSTANCE_DELETE', id: '9' },
                            { label: `${t('omniapp:EXTERNAL_APPLICATION_REGISTER')}`, value: 'EXTERNAL_APPLICATION_REGISTER', id: '10' },
                            { label: `${t('omniapp:EXTERNAL_APPLICATION_MODIFY')}`, value: 'EXTERNAL_APPLICATION_MODIFY', id: '11' },
                            { label: `${t('omniapp:EXTERNAL_APPLICATION_DELETE')}`, value: 'EXTERNAL_APPLICATION_DELETE', id: '12' },
                            { label: `${t('omniapp:VIEW_REGISTER')}`, value: 'VIEW_REGISTER', id: '13' },
                            { label: `${t('omniapp:VIEW_MODIFY')}`, value: 'VIEW_MODIFY', id: '14' },
                            { label: `${t('omniapp:VIEW_DELETE')}`, value: 'VIEW_DELETE', id: '15' },
                            { label: `${t('omniapp:THEME_REGISTER')}`, value: 'THEME_REGISTER', id: '16' },
                            { label: `${t('omniapp:THEME_MODIFY')}`, value: 'THEME_MODIFY', id: '17' },
                            { label: `${t('omniapp:THEME_DELETE')}`, value: 'THEME_DELETE', id: '18' },
                            { label: `${t('omniapp:PROXY_CONFIGURATION')}`, value: 'PROXY_CONFIGURATION', id: '19' },
                            { label: `${t('omniapp:EXPORT_IMPORT')}`, value: 'EXPORT_IMPORT', id: '20' },
                            { label: `${t('omniapp:USER_LOGIN')}`, value: 'USER_LOGIN', id: '21' },
                            { label: `${t('omniapp:USER_LOGOUT')}`, value: 'USER_LOGOUT', id: '22' },
                            { label: `${t('omniapp:CODE_FRAGMENT_REGISTER')}`, value: 'CODE_FRAGMENT_REGISTER', id: '23' },
                            { label: `${t('omniapp:CODE_FRAGMENT_MODIFY')}`, value: 'CODE_FRAGMENT_MODIFY', id: '24' },
                            { label: `${t('omniapp:CODE_FRAGMENT_DELETE')}`, value: 'CODE_FRAGMENT_DELETE', id: '25' }
                        ]
                    }
                },
            ]
        },
    }
    ]

    const [apiResponse, setApiRespose] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const clearFilters = () => {
        setInputParameters(initialState)
    }

    const GetDataFromApi = () => {

        if (inputParameters.action_ids.length === 0) {
            snackbarState.openSnackbar('Please select some actions', 'warning');
        }
        else {
            setIsLoading(true)

            let payload = {
                ...inputParameters,
                "from_date": moment(inputParameters.from_date, 'YYYY-MM-DD').format('DD/MMM/YYYY'),
                "to_date": moment(inputParameters.to_date, 'YYYY-MM-DD').format('DD/MMM/YYYY'),
                action_ids: inputParameters.action_ids.join(',')
            };

            GetAuditLog(payload)
                .then(response => {
                    if (response != null && response.status.maincode === "0") {
                        setApiRespose(response.data.history_items);
                    }
                    setIsLoading(false);
                })
                .catch(err => {
                    setIsLoading(false);
                })
        }
    }

    return <div className={classes.root}>
        <AuditLogs
            disableTabs={true}
            headerCells={headerCells}
            GetDataFromApi={GetDataFromApi}
            isLoading={isLoading}
            data={data}
            clearFilters={clearFilters}
            history_items={apiResponse}
            projectType="OMNIAPP"
        />
    </div>
}

export default AuditLogsParent;
