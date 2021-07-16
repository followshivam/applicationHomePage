import React, { Suspense, lazy } from "react";
import {
    makeStyles,
    Button,
    Spinner,
    useTranslation
} from "component";
import { useSelector } from "react-redux";
const AddReport = lazy(() => import("./AddReport/add_report"));
const AddApplication = lazy(() => import("./AddApplication/add_application"));
const ShowAlert = lazy(() => import("./ShowAlert/show_alert"));

const useStyles = makeStyles((theme) => ({
    wrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "60px 0px 20px 0px"
    },
    button: {
        marginRight: "5px",
        padding: "1px 9px",
        fontWeight: 600,
        width: "100%",
        marginBottom: "25px"
    },
    h4: {
        fontSize: "12px",
        textAlign: "center",
        fontWeight: 400,
        marginBottom: "30px"
    }
}));


// const addAlert = (data, snackbarState) => {
//     const {
//         container_id,
//         tab_id,
//     } = data;

//     let payload = {
//         opr: '0',
//         container_id: container_id,
//         tab_id: tab_id,
//         instance_type: "A",
//     }

//     ActReportInstance(payload).then(response => {
//         if (response != null && response.status.maincode === "0") {
//             snackbarState.openSnackbar('Alert list added successfully', 'success');
//         }
//         else if (response != null && response.status.maincode !== "0") {
//             snackbarState.openSnackbar(response.status.errormsg, 'error')
//         }
//     }).catch(error => { });
// }



export default function AddAnother(props) {

    const [normalDialogState, globalSetting] = useSelector(state => {
        return [state.normalDialogState, state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    const classes = useStyles();
    const { onCallBack = null } = props;

    return (
        <React.Fragment>
            <div className={classes.wrapper}>
                <h4 className={classes.h4}>{t('bam:NOTHING_TO_SHOW')}
                    <span style={{ display: "block" }}>{t('bam:SELECT_FROM_GIVEN_OPTIONS')}</span></h4>
                <div >
                    <div><Button className={classes.button} variant="outlined" color="primary" onClick={() => normalDialogState.openDialog(<Suspense fallback={<div style={{ height: "450px", minWidth: "600px" }}><Spinner msg="" /></div>}><AddReport data={props.data} onCallBack={onCallBack} /></Suspense>, "AddReport")}>{t('bam:ADD_REPORT')}</Button></div>
                    {/* <div><Button className={classes.button} variant="outlined" color="primary" onClick={() => normalDialogState.openDialog(<Suspense fallback={<div style={{ width: '600px', height: '400px' }}><Spinner msg="" /></div>}><ShowAlert closeDialog={normalDialogState.closeDialog} /></Suspense>)}>{t('bam:SHOWALERTS')}</Button></div> */}
                    <div><Button className={classes.button} variant="outlined" color="primary" onClick={() => normalDialogState.openDialog(<Suspense fallback={<div style={{ height: "350px", minWidth: "650px" }}><Spinner msg="" /></div>}><AddApplication data={props.data} onCallBack={onCallBack} /></Suspense>, "AddApplication")} >{t('bam:ADD_EXTERNAL_URL')}</Button></div>
                </div>
            </div>
        </React.Fragment>
    )
}