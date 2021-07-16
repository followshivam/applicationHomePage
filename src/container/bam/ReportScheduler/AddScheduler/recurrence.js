
import { makeStyles, useTranslation } from "component";
import ReportRecurrence from "component/ReportRecurrence";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateSchedule, ResetSchedule } from "redux/action";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        minHeight: '390px',
    },

    body: {
        height: '100%',
        padding: theme.spacing(1, 2, 8),
    },
}))

const Recurrence = props => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState({ loading: true, message: "Rendering Component" })

    const [createScheduleState, globalSetting] = useSelector(state => {
        return [state.createScheduleState, state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    const onNextHandler = (event, payload) => {
        event.preventDefault();

        dispatch(CreateSchedule({ ...createScheduleState, current_step: createScheduleState.current_step + 1, recurrence: payload }))
    }
    const onPrevious = () => {
        dispatch(ResetSchedule({ ...createScheduleState, current_sub_step: 1, current_step: createScheduleState.current_step - 1 }))
    };
    const actionButtonAddPageCommon = [
        {
            label: `${t('bam:LABEL_CANCEL')}`,
            action: props.onCancel,
            variant: "outlined",
            color: "secondary",
            type: "button"
        },
        {
            label: `${t('bam:BUTTON_PREVIOUS')}`,
            action: onPrevious,
            variant: "outlined",
            color: "primary",
            type: "button"
        },
        {
            label: `${t('bam:BUTTON_NEXT')}`,
            action: onNextHandler,
            variant: "contained",
            color: "primary",
            type: "submit"
        }
    ]

    return <div className={classes.root}>
        <div className={classes.body}>
            <ReportRecurrence
                t={t}
                loading={isLoading}
                storeState={createScheduleState}
                actionButtonAddPageCommon={actionButtonAddPageCommon}
            />
        </div>
    </div>
}

export default Recurrence;