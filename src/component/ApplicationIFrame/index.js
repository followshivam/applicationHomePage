import React, { Suspense, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { IconImage } from "component/Icon";
import { ActReportInstance } from "global/bam/api/ApiMethods";
import { useSelector } from "react-redux";
import AddApplication from "container/bam/Bam_Dashboard/AddApplication/add_application";
import { Spinner } from "component/Loader";


const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        width: '100%',
        direction: props => props.direction
    },
    header: {
        height: '32px',
        width: 'calc(100% - 8px)',
        padding: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    head: {
        height: '32px',
        width: 'calc(100% - 8px)',
        padding: '20px 5px ',
        borderBottom: "1px solid #f8f8f8",
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    body: {
        height: 'calc(100% - 50px)',
        width: '100%'
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexGrow: '1'
    },
    title: {
        margin: '0 6px 0 8px'
    },
    sideControlsDashboard: {
        "& > *": {
            marginLeft: '4px'
        }
    },
    sideControls: {
        "& > *": {
            marginLeft: '8px'
        }
    }
}));


const ApplicationIFrame = props => {
    const {
        instance_data = {},
        onCallBack = null,
        screenType = "dashboard",
        minimize,
        direction = "ltr",
        // onRefresh = () => console.warn('Application IFrame: function onRefresh() not passed'),
        // modifyApplication = () => console.warn('Application IFrame: function onRefresh() not passed'),
    } = props;
    const classes = useStyles({ direction });

    const {
        load_url = "",
        name = "Application",
        report_instance_id = "",
        data,
    } = instance_data;

    const snackbarState = useSelector(store => store.snackbarState);
    const normalDialogState = useSelector(store => store.normalDialogState);

    const deleteReportInstance = () => {
        ActReportInstance({ opr: '2', report_instance_id: report_instance_id }).then(response => {
            if (response != null && response.status.maincode === "0") {
                snackbarState.openSnackbar('Report Instance Removed Successfully', 'success');
                onCallBack();
            }
            else if (response != null && response.status.maincode !== "0") {
                snackbarState.openSnackbar(response.status.errormsg, 'error');
            }
        }).catch(err => { })
    }

    const [counter, setCounter] = useState(0);

    const [fullDialogStore, normalDialogStore] = useSelector(state => {
        return [state.fullDialogState, state.normalDialogState];
    });

    const handleClose = () => {
        handleFullClose()
        normalDialogStore.closeDialog()
    }
    const handleFullClose = () => {
        fullDialogStore.closeDialog()
    }
    const onExpand = () => {
        fullDialogStore.openDialog(
            <Suspense
                fallback={
                    <div
                        style={{ height: '250px', minWidth: '600px' }}>
                        <Spinner msg='' />
                    </div>
                }
            >
                <ApplicationIFrame
                    minimize={false}
                    screenType="application"
                    instance_data={{
                        load_url: load_url,
                        name: name,
                    }}
                    direction={direction}
                />
            </Suspense>,
        )
    }

    return <div className={classes.root}>
        {screenType === "dashboard" ? <React.Fragment>
            <div className={classes.header}>
                <div className={classes.title}>
                    <Typography variant="h6">
                        {name}
                    </Typography>
                </div>
                <div className={classes.toolbar}>
                    <div>
                        <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/refresh.svg`} height={16} width={16} onClick={() => setCounter(counter => counter + 1)} />
                    </div>
                    <div className={classes.sideControlsDashboard}>
                        <IconImage height={16} width={16} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/modify.svg`} onClick={() => normalDialogState.openDialog(<Suspense fallback={<div style={{ height: "450px", minWidth: "600px" }}><Spinner msg="" /></div>}><AddApplication onCallBack={onCallBack} closeDialog={normalDialogState.closeDialog} modifyMode data={{ ...data, report_instance_id: report_instance_id }} /></Suspense>, "AddApplication")} />
                        <IconImage height={16} width={16} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/delete_grey.svg`} onClick={() => deleteReportInstance()} />
                    </div>
                </div>
            </div>

        </React.Fragment>
            : <React.Fragment>
                <div className={classes.head}>
                    <div className={classes.title}>
                        <Typography variant="h6">
                            {name}
                        </Typography>
                    </div>
                    <div className={classes.sideControls}>
                        {minimize ? <IconImage height={16} width={16} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/expand_icon.svg`}
                            onClick={onExpand} />
                            : <IconImage height={16} width={16} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/minimize.svg`}
                                onClick={handleFullClose} />}
                        <IconImage height={16} width={16} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/close_icon.svg`} onClick={() => handleClose()} />
                    </div>
                </div>
            </React.Fragment>}
        <div className={classes.body}>
            <iframe key={counter} title={`frame #${load_url} ${counter}`}
                src={load_url} width={minimize ? "650px" : "100%"}
                height={minimize ? "350px" : "100%"} frameBorder="0" />
        </div>
    </div>
}

export default ApplicationIFrame;