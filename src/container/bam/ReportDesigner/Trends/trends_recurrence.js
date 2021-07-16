import React, { useState } from "react";
import { makeStyles, useTranslation } from "component";
import { useSelector, useDispatch } from "react-redux";
import { CreateTrend } from "redux/action";
import { ActTrend } from "global/bam/api/ApiMethods";
import moment from 'moment'
import Trends from "./trends";
import ReportRecurrence from "component/ReportRecurrence";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        minHeight: '390px',
    },

    body: {
        height: '100%',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(1),
    },
}))

const TrendsReferences = props => {

    const {
        onNext = null,
        onPrev = null,
        onCancel = null,
        modifyMode = false,
    } = props;

    const classes = useStyles();

    const dispatch = useDispatch();

    const [trendState, snackbarState, globalSetting] = useSelector(state => {
        return [state.createTrendsState, state.snackbarState, state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    const [recurrancePayload, setRecurrancePayload] = useState(trendState.recurrence)
    const [isLoading, setIsLoading] = useState({ loading: true, message: `${t('bam:LOADING')}...` })

    const SubmitDataFinal = (event, payload) => {
        setRecurrancePayload(payload)
        let recurrence = payload;
        let availableData = { ...trendState };
        let date = new Date();
        let finalPayload = {
            opr: availableData.modifyMode ? 1 : 0,
            recurrence: {
                ...recurrence
            },
            scheduler_property: {
                "instance_title": availableData.scheduler_property.instance_title,
                "user_id": availableData.scheduler_property.user_id,
                "description": availableData.scheduler_property.description,
                "created_date_time": `${moment(date).format('YYYY-MM-DD')} ${date.getHours()}:${date.getMinutes()}`,
            },
            report_instance_list: {
                "container_id": "-1",
                "report_instance_id": availableData.modifyMode ? availableData.report_instance_list.report_instance_id : "",
                "report_instance_name": availableData.report_name,
                "report_id": availableData.report_index,
                "input_fields": availableData.input_fields
            },
            "retry_interval": "0",
            "no_of_trials": "0",
        }

        if (availableData.modifyMode) {
            finalPayload["scheduler_list"] = availableData.scheduler_list;
        }

        ActTrend(finalPayload).then(response => {
            if (response != null && response.status.maincode === "0") {
                snackbarState.openSnackbar(`${availableData.modifyMode ? t('bam:TREND_UPDATED_T') : t('bam:TREND_CREATED_T')}`, "Success", 5000)
                onNext();
            }
            else if (response != null) {
                snackbarState.openSnackbar(`${response.status.errormsg}`, "error", 5000)
            }
            else {
                snackbarState.openSnackbar(`${t('bam:WENT_WRONG_ERROR')}`, "error", 5000)
            }
        })
    }

    const onPreviousHandler = () => {
        dispatch(CreateTrend({ ...trendState, current_step: trendState.current_step - 1, recurrence: recurrancePayload }))
    }

    const actionButtonAddPageCommon = [{
        label: `${t('bam:LABEL_CANCEL')}`,
        action: onCancel,
        variant: "outlined",
        color: "secondary",
        type: "button"
    },
    {
        label: `${t('bam:BUTTON_PREVIOUS')}`,
        action: onPreviousHandler,
        variant: "outlined",
        color: "primary",
        type: "button"
    },
    {
        label: `${t('bam:BUTTON_SAVE')}`,
        action: SubmitDataFinal,
        variant: "contained",
        color: "primary",
        type: "submit"
    },]


    return <div className={classes.root}>
        <div className={classes.body}>
            <ReportRecurrence
                t={t}
                loading={isLoading}
                storeState={trendState}
                actionButtonAddPageCommon={actionButtonAddPageCommon}
            />
        </div>
    </div>
}

export default TrendsReferences;