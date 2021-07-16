import { Spinner, makeStyles, useTranslation } from "component";
import Rules from "container/bam/ReportDesigner/Create_Update_Report/ReportVisualization/rules_popup";
import { ActReportInstance, GetReportDefinition } from "global/bam/api/ApiMethods";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateSchedule } from "redux/action";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '340px',
    },
    actionBar: {
        position: 'absolute',
        bottom: '0',
        right: '0',
    }
}))


const RuleManagement = props => {
    const classes = useStyles();
    const dispatch = useDispatch()

    const [globalSetting, scheduleState, snackbarState] = useSelector(state => {
        return [state.globalSettings, state.createScheduleState, state.snackbarState];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    const [state, setState] = useState({ loading: true, is_rule_defined: scheduleState.is_rule_defined == null ? true : scheduleState.is_rule_defined })
    const onCancel = (rules) => {
        dispatch(CreateSchedule({ ...scheduleState, current_step: 2, subModifyMode: false, current_sub_step: scheduleState.current_sub_step - 2, report_instance_list: scheduleState.report_instance_list, addRow: false }));
    }
    const toggleExecuteRules = () => {
        setState(state => ({ ...state, is_rule_defined: !state.is_rule_defined }));
    }
    const [switchChange, setSwitchChange] = useState(false);


    // const onRules = () => {
    //     setSwitchChange(true)
    //     dispatch(CreateSchedule({ ...scheduleState, ...state, is_rule_defined: state.is_rule_defined, current_sub_step: scheduleState.current_sub_step, report_instance_list: scheduleState.report_instance_list }));
    // }

    useEffect(() => {
        // onRules();
        if (scheduleState.activeTab === 1) {
            setSwitchChange(true);
        }
    }, [scheduleState]);

    const onSave = (rules) => {
        if (switchChange === true) {
            setSwitchChange(false);
            dispatch(CreateSchedule({ ...scheduleState, rules: rules, activeTab: 0 }));
            return;
        }
        const finalPayload = {
            "opr": scheduleState.subModifyMode ? '1' : '0',
            "tab_id": "",
            "instance_type": "R",
            "container_id": "-1",
            "report_instance_name": scheduleState.display_name,
            "report_id": scheduleState.report_index,
            "default_display": scheduleState.default_display,
            "chart_title": scheduleState.chart_title,
            "chart_title_color": scheduleState.chart_title_color,
            "refresh_interval": scheduleState.refresh_interval,
            "description": scheduleState.description,
            "alert_delay_interval": scheduleState.alert_delay_interval,
            "input_fields": scheduleState.input_fields,
            "is_rule_defined": state.is_rule_defined,
            "rules": rules
        }

        if (scheduleState.subModifyMode) {
            finalPayload["report_instance_id"] = scheduleState.report_instance_id;
        }

        ActReportInstance(finalPayload).then(response => {
            if (response != null && response.status.maincode === "0") {
                snackbarState.openSnackbar(`${t('bam:RULES_ADDED_SECCESS')}`, 'Success');
                if (scheduleState.subModifyMode)
                    dispatch(CreateSchedule({ ...scheduleState, current_step: 2, current_sub_step: 1, rules: [] }));
                else
                    dispatch(CreateSchedule({ ...scheduleState, current_step: 2, current_sub_step: 1, report_instance_id: response.data.report_instance_id, rules: [] }));
            }
            else {
                snackbarState.openSnackbar(response.status.error_msg, 'warning')
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    }

    useEffect(() => {
        getFieldList();
    }, [])

    const getFieldList = () => {
        let payload = {
            option: '2',
            report_index: scheduleState.report_index,
            previous_annotation_index: '0',
            no_of_records_to_fetch: '100',
            sort_order: 'D',
        }
        setState({ ...state, loading: true })
        GetReportDefinition(payload).then(response => {
            if (response != null && response.status.maincode === "0") {
                setState({ ...state, fieldList: response.custom_report && response.custom_report.output_fields && response.custom_report.output_fields.field, loading: false });
            }
            else {
                snackbarState.openSnackbar(`${t('bam:WENT_WRONG_ERROR')}`, 'error');
                dispatch(CreateSchedule({ ...scheduleState, current_step: 2, current_sub_step: 1, report_instance_id: response.data.report_instance_id }));

                return [];
            }
        }).catch(error => {

        });
    }

    return <div className={classes.root}>
        {state != null && state.loading === false ?
            <Rules
                t={t}
                disableHead
                onCancel={onCancel}
                showPreviousKey={false}
                // onPrevious={onPrevious}
                switchChange={switchChange}
                execute_rules={state.is_rule_defined}
                toggleExecuteRules={toggleExecuteRules}
                rules={scheduleState.rules}
                setSwitchChange={setSwitchChange}
                onSave={onSave}
                fieldList={state.fieldList}
                displayAlert
            /> : <Spinner />}
    </div>
}

export default RuleManagement;