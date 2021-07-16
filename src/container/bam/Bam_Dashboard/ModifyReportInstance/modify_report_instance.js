import { Divider, makeStyles, Spinner, Typography, useTranslation } from "component";
import MultiStep from "component/MultiStep";
import { GetReportDefinition, GetReportInstanceDefinition } from "global/bam/api/ApiMethods";
import React, { lazy, useEffect, useState } from "react";
import { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateAddReport, ResetAddReport } from "redux/action";
import { SnackbarState } from "redux/action/initialstate";

const ReportPreferences = lazy(() => import("./../AddReport/report_preference"));
const RulesMangement = lazy(() => import("./../AddReport/rules_management"));


const useStyles = makeStyles(theme => ({
    root: {
        width: '900px',
        height: '429px',
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    header: {
        margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
        fontSize: '14px'
    },
    body: {
        height: 'calc(100% - 40px)',
        width: '100%',
    },
    dialogContentLanding: {
        padding: '0',
        width: '800px'
    },
    dialogContent: {
        // width: '800px',
        height: '100%',
        overflow: 'auto'
    },
    content: {
        height: 'calc(100% - 50px)',
        width: '100%'
    }
}))



const ModifyReportInstance = props => {
    const {
        report_instance_id = null,
        successEvent = null,
        onCallBack = null,
    } = props;

    const [normalDialogState, globalSetting, addReportState, snackbarState] = useSelector(state => {
        return [state.normalDialogState, state.globalSettings, state.createAddReportState, state.snackbarState];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    const step_list = [
        { label: `${t('bam:REPORTPREFERENCES')}`, component: ReportPreferences },
        { label: `${t('bam:RULE_MANAGEMENT')}`, component: RulesMangement },
    ]

    const classes = useStyles();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState({ loading: true, msg: "Rendering Components" })

    const getTypeFromCode = (code1, code2) => {
        if (code1 == null || code1 === "") {
            code1 = code2;
        }

        if (code1 === "TG") {
            return `${t('bam:LABEL_TABULAR_AND_GRAPHICAL')}`;
        }
        else if (code1 === "T") {
            return `${t('bam:LABEL_TABULAR')}`;
        }
        else {
            return `${t('bam:LABEL_GRAPHICAL')}`;
        }
    }

    useEffect(() => {
        GetReportInstanceDefinition({ report_instance_id: report_instance_id }).then(response => {
            if (response != null && response.status.maincode === "0") {
                dispatch(ResetAddReport({ ...addReportState, ...response.data, report_index: response.data.report_id, report_type: getTypeFromCode(response.data.report_type, response.data.default_display), display_name: response.data.report_instance_name }));
                setIsLoading({ ...isLoading, loading: false })
            }
            else if (response != null && response.status.maincode !== "0") {
                snackbarState.openSnackbar(response.status.errormsg, 'error')
            }
        }).catch(error => { snackbarState.openSnackbar(`${t('bam:WENT_WRONG_ERROR')}`, 'error') })
    }, [])

    const onCloseHandler = () => {
        normalDialogState.closeDialog();
        dispatch(ResetAddReport({ current_step: 1 }))
    };

    const onNextHandler = () => {
        let stepNumber = addReportState["current_step"];
        if (stepNumber < 3) {
            dispatch(CreateAddReport({
                ...addReportState,

                current_step: stepNumber + 1,
            }));
        }
        else {
            onCloseHandler();
        }
    }

    const onPreviousHandler = () => {
        let stepNumber = addReportState["current_step"];
        if (stepNumber === 1) {
            dispatch(ResetAddReport({ current_step: 1 }))
            successEvent(0);
        }
        else {
            dispatch(CreateAddReport({
                ...addReportState,
                current_step: stepNumber - 1,
            }));
        }
    }

    return <div className={classes.root}>
        <div className={classes.header}>
            <Typography variant="h6"><b>{t('bam:MODIFY_REPORT')}</b></Typography>
        </div>

        <div className={classes.body}>
            <Divider fullWidth />
            <div className={classes.dialogContent}>
                <MultiStep active={addReportState.current_step} step_list={step_list} />
                <div className={classes.content}>
                    {isLoading.loading === false ? step_list.map((res, key) => {
                        return (key + 1 === addReportState.current_step ? <Suspense fallback={<div style={{ minHeight: "250px" }}><Spinner /></div>}><res.component modifyMode onCallBack={onCallBack} data={props.data} closeDialog={onCloseHandler} onNext={onNextHandler} onPrev={onPreviousHandler} onCancel={onCloseHandler} /></Suspense> : null)
                    }) : <div style={{ height: '100%' }}><Spinner /></div>}
                </div>
            </div>
        </div>
    </div>
}

export default ModifyReportInstance;