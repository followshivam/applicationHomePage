import { makeStyles, Spinner, useTranslation } from "component";
import Rules from "container/bam/ReportDesigner/Create_Update_Report/ReportVisualization/rules_popup";
import { ActReportInstance, GetReportDefinition } from "global/bam/api/ApiMethods";
import { ActReportInstanceInput, ReportDefinitionInput } from "global/json";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateAddReport } from "redux/action";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '100%',
    },
    actionBar: {
        position: 'absolute',
        bottom: '0',
        right: '0',
    }
}))


const RulesManagement = props => {
    const classes = useStyles();

    const {
        closeDialog = null,
        modifyMode = false,
        onCallBack = null,
    } = props;

    const dispatch = useDispatch();

    const [snackbarState, addReportState, globalSetting] = useSelector(state => {
        return [state.snackbarState, state.createAddReportState, state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    const [state, setState] = useState({ loading: true, is_rule_defined: addReportState.is_rule_defined == null ? false : addReportState.is_rule_defined })
    const onPrevious = (rules) => {
        dispatch(CreateAddReport({ ...addReportState, is_rule_defined: state.is_rule_defined, rules: rules, current_step: addReportState.current_step - 1 }));
    }
    const toggleExecuteRules = () => {
        setState(state => ({ ...state, is_rule_defined: !state.is_rule_defined }));
    }
    const onCancel = () => {
        dispatch(CreateAddReport({ current_step: 0 }));
        closeDialog();
    }

    const onSave = (rules) => {
        const finalPayload = {
            ...ActReportInstanceInput,
            "opr": modifyMode ? '1' : '0',
            "tab_id": addReportState.tab_id,
            "instance_type": addReportState.instance_type,
            "container_id": addReportState.container_id,
            "report_instance_name": addReportState.display_name,
            "report_id": addReportState.report_index,
            "default_display": addReportState.default_display,
            "chart_title": addReportState.chart_title,
            "chart_title_color": addReportState.chart_title_color,
            "refresh_interval": addReportState.refresh_interval,
            "alert_delay_interval": addReportState.alert_delay_interval,
            "input_fields": addReportState.input_fields,
            "is_rule_defined": state.is_rule_defined,
            "rules": rules,
        }

        if (modifyMode) {
            finalPayload["report_instance_id"] = addReportState.report_instance_id;
        }

        ActReportInstance(finalPayload).then(response => {
            if (response != null && response.status.maincode === "0") {
                snackbarState.openSnackbar(`${t('bam:REPORT_ADD_TO_DASHBOARD_MESSAGE')}`, 'Success')
                dispatch(CreateAddReport({ current_step: 0 }));
                onCallBack();
                closeDialog();
            }
            else {
                snackbarState.openSnackbar(response.status.error_msg, 'warning')
            }
        })
    }

    useEffect(() => {
        getFieldList();
    }, [])

    const getFieldList = () => {
        let payload = {
            ...ReportDefinitionInput,
            report_index: addReportState.report_index,
        }
        setState({ ...state, loading: true })
        GetReportDefinition(payload).then(response => {
            if (response != null && response.status.maincode === "0") {
                console.log(response);
                setState({ ...state, fieldList: response.custom_report.output_fields.field, loading: false });
            }
            else {
                snackbarState.openSnackbar(`${t('bam:WENT_WRONG_ERROR')}`, 'error');
                return [];
            }
        }).catch(error => { });
    }

    return <div className={classes.root}>
        {state != null && state.loading === false ?
            <Rules
                disableHead
                onCancel={onCancel}
                onPrevious={onPrevious}
                execute_rules={state.is_rule_defined}
                toggleExecuteRules={toggleExecuteRules}
                showPreviousKey
                rules={addReportState.rules}
                onSave={onSave}
                fieldList={state.fieldList}
                displayAlert
                displayGraphical={addReportState.report_type !== "Tabular"}
                displayTabular={addReportState.report_type !== "Graphical"}
            /> : <Spinner />}
    </div>
}

export default RulesManagement;