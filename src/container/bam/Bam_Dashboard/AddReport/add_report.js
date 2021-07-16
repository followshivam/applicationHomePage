import { Divider, makeStyles, Spinner, Typography, useTranslation } from "component";
import MultiStep from "component/MultiStep";
import React, { lazy } from "react";
import { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateAddReport, ResetAddReport } from "redux/action";

const ReportPreferences = lazy(() => import("./report_preference"));
const RulesMangement = lazy(() => import("./rules_management"));
const SelectReport = lazy(() => import("./select_report"));


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



const AddReport = props => {
  const {
    // data = {
    //   tab_id: "74",
    //   container_id: "3",
    //   instance_type: "R"
    // },
    data = null,
    successEvent = null,
    onCallBack = null,
    closeDialog = null,
  } = props;

  const [addReportState, normalStoreDialog, globalSetting] = useSelector(state => {
    return [state.createAddReportState, state.normalDialogState, state.globalSettings];
  });

  const { t } = useTranslation(globalSetting.locale_module)

  const step_list = [
    { label: `${t('bam:SELECT_REPORT')}`, component: SelectReport },
    { label: `${t('bam:REPORTPREFERENCES')}`, component: ReportPreferences },
    { label: `${t('bam:RULE_MANAGEMENT')}`, component: RulesMangement },
  ]

  const classes = useStyles();
  const dispatch = useDispatch()

  const onCloseHandler = () => {
    normalStoreDialog.closeDialog();
    dispatch(ResetAddReport({ current_step: 1 }));
    // onCallBack();
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
      <Typography variant="h6"><b>{t('bam:ADD_REPORT')}</b></Typography>
    </div>

    <div className={classes.body}>
      <Divider fullWidth />
      <div className={classes.dialogContent}>
        <MultiStep active={addReportState.current_step} step_list={step_list} />
        <div className={classes.content}>
          {step_list.map((res, key) => {
            return (key + 1 === addReportState.current_step ? <Suspense fallback={<div style={{ minHeight: "250px" }}><Spinner /></div>}><res.component t={t} data={props.data} closeDialog={onCloseHandler} onCallBack={onCallBack} onNext={onNextHandler} onPrev={onPreviousHandler} onCancel={onCloseHandler} /></Suspense> : null)
          })}
        </div>
      </div>
    </div>
  </div>
}

export default AddReport;