import { SelectBox, Spinner, DialogTitle, Divider, makeStyles, Typography, useTranslation } from "component";
import MultiStep from "component/MultiStep";
import React from "react";
import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateSchedule, ResetSchedule } from "redux/action";
import { GetSchedulerActionInput } from "global/json";

const BasicProperties = React.lazy(() => import("./basic_properties"));
const SelectReport = React.lazy(() => import("./SelectReport/index"));
const Recurrence = React.lazy(() => import("./recurrence"));
const Destination = React.lazy(() => import("./destination"));


const useStyles = makeStyles(theme => ({
    root: {
        // margin: theme.spacing(1),
        // height: '491px',
        width: '822px',
    },
    stepper: {
        // height: theme.spacing(3),
        width: '100%',

        // border: '1px solid grey'
    },
    headerControlsAdd: {
        flex: '1',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    step_label: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "&>*": {
            margin: "2px"
        },
        labelCompleted: {
            color: `${theme.palette.primary.main}`
        },
    },
    numberCircle: {
        borderRadius: "50%",
        width: "1rem",
        height: "1rem",
        padding: "3px",
        textAlign: "center",
        fontSize: "0.75rem"
    },
    numberCircleCompleted: {
        borderRadius: "50%",
        width: "15px",
        height: "16px",
        padding: "3px",
        textAlign: "center",
        fontSize: "12px",
        border: `2px solid ${theme.palette.primary.main}`,
        background: ` ${theme.palette.primary.main}`,
        color: "white"
    },
    body: {
        height: 'calc(100% - 55px)',
    },
    content: {
        height: 'calc(100% - 50px)'
    },
    title: {
        display: 'flex',
        alignItems: "center"
    }
}))



const AddScheduler = props => {
    const { scheduler_id, title, getReportSchedularList, successEvent = null, } = props;

    const [scheduleState, globalSetting] = useSelector(state => {
        return [
            state.createScheduleState,
            state.globalSettings
        ]
    })


    const { t } = useTranslation(globalSetting.locale_module)

    const step_list = [
        { label: `${t('bam:BASIC_PROPERTIES')}`, component: BasicProperties },
        { label: `${t('bam:SELECT_REPORT')}`, component: SelectReport },
        { label: `${t('bam:RECURRENCE')}`, component: Recurrence },
        { label: `${t('bam:SCHEDULER_DESTINATION')}`, component: Destination, componentProps: { getReportSchedularList } },
    ]
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState({ msg: "", loading: true });

    const normalStoreDialog = useSelector(state => {
        return state.normalDialogState;
    });

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(ResetSchedule({ current_step: 1, current_sub_step: 1, opr: '0', ...GetSchedulerActionInput, modifyMode: false, scheduler_id: scheduler_id }))
        setTimeout(() => setIsLoading(false), 500);
    }, [])

    const onCloseHandler = () => {
        normalStoreDialog.closeDialog();
        dispatch(ResetSchedule({ current_step: 1 }))
    };

    const onNextHandler = () => {
        let stepNumber = scheduleState["current_step"];
        if (stepNumber < 3) {
            dispatch(CreateSchedule({ ...scheduleState, current_step: stepNumber + 1 }));
        }
        else {
            onCloseHandler();
        }
    }
    const onPreviousHandler = () => {
        let stepNumber = scheduleState["current_step"];
        if (stepNumber === 1) {
            dispatch(ResetSchedule({ current_step: 1 }))
            successEvent(0);
        }
        else {
            dispatch(CreateSchedule({ ...scheduleState, current_step: stepNumber - 1 }));
        }
    }

    const buttonGroupAddPageCommon =
        <div className={classes.headerControlsAdd}>
            <SelectBox
                label={t('bam:LOCALE_TIME_ZONE')}
                list={[{ value: 0, label: 'English(United States)[en_us]' }]}
                value={0}
                labelMinWidth="120px"
                labelMaxWidth="120px"
                form={false}
            />
        </div>
    return <div className={classes.root}>
        <DialogTitle>
            <div className={classes.title}>  <Typography variant="14px">
                <b>{title ? title : `${t('bam:ADD_SCHEDULE')}`}</b>
            </Typography>
                {buttonGroupAddPageCommon}
            </div>

        </DialogTitle>
        <Divider />

        <div className={classes.body}>
            <div className={classes.stepper}>
                <MultiStep active={scheduleState.current_step} step_list={step_list} />
                <div className={classes.content}>
                    {step_list.map((res, key) => {
                        return (
                            key + 1 === scheduleState.current_step
                                ? <Suspense fallback={<div style={{ height: "390px" }}><Spinner /></div>}>
                                    <res.component onNext={onNextHandler} onPrev={onPreviousHandler} onCancel={onCloseHandler} {...res.componentProps} />
                                </Suspense>
                                : null
                        )
                    })}
                </div>
            </div>
        </div>

    </div>
}


export default AddScheduler;