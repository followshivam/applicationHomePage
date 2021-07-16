import { makeStyles, Spinner, useTranslation } from "component";
import React from "react";
import { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateSchedule, ResetSchedule } from "redux/action";

const AddReport = React.lazy(() => import("./add_report"));
const SelectReportList = React.lazy(() => import("./select_report"));
const ReportManagement = React.lazy(() => import("./ReportManagement/report_management"));

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '390px',
    },
    actionBar: {
        position: 'absolute',
        bottom: '0',
        right: '0',
    },
    body: {
        height: 'calc(100% - 50px)',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(1),
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(0.5)
    },
    icon: {
        marginRight: "8px !important",
    },
    child_toolbar2: {
        display: "flex",
        flex: 1,
        justifycontent: "space-between",
        alignItems: "center",
        height: "30px"
    },
    child2_toolbar_right: {
        display: "flex",
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingRight: "18px",
        marginRight: "5px"
    },
    textColor: {
        color: '#606060'
    },
    inputBox: {
        width: '140px'
    },
    toolbarControls: {
        display: 'flex',
        alignItems: 'center',
        "& > *": {
            marginLeft: theme.spacing(1)
        }
    }
}))


const SelectReport = props => {


    const classes = useStyles();
    const {
        data = null,
        successEvent = null
    } = props;


    const [globalSetting, scheduleState, normalStoreDialog] = useSelector(state => {
        return [state.globalSettings, state.createScheduleState, state.normalDialogState];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    const dispatch = useDispatch();
    const sub_step_list = [
        { component: AddReport },
        { component: SelectReportList },
        { component: ReportManagement },
    ]
    const onSubCloseHandler = () => {
        normalStoreDialog.closeDialog();
        dispatch(ResetSchedule({ current_sub_step: 1, current_step: 1 }))
    };

    const onSubNextHandler = () => {
        let subStepNumber = scheduleState["current_sub_step"];
        if (subStepNumber < 1) {
            dispatch(CreateSchedule({ ...scheduleState, current_sub_step: subStepNumber + 1 }));
        }
        else {
            onSubCloseHandler();
        }
    }
    const onSubPreviousHandler = () => {
        let subStepNumber = scheduleState["current_sub_step"];
        if (subStepNumber === 1) {
            dispatch(ResetSchedule({ current_sub_step: 1, current_step: 1 }))
        }
        else {
            dispatch(CreateSchedule({ ...scheduleState, current_sub_step: subStepNumber - 1, current_step: scheduleState.current_step - 1 }));
        }
    }


    return <div className={classes.root}>
        <div className={classes.content}>
            {sub_step_list.map((res, key) => {
                return (key + 1 === scheduleState.current_sub_step ? <Suspense fallback={<div style={{ minHeight: "250px" }}><Spinner /></div>}><res.component t={t} onNext={onSubNextHandler} onPrev={onSubPreviousHandler} onCancel={onSubCloseHandler} /></Suspense> : null)
            })}
        </div>
    </div>
}

export default SelectReport;