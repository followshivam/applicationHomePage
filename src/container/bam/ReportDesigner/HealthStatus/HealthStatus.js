import React, { useEffect, useState } from "react";
import { Grid, Spinner, Typography, useTranslation } from "component";
import Description from "./Description/Description"
import TabBar from "./TabBar/TabBar"
import stylesheet from "./style.module.css";
import { ActHealthStatus, GetHealth } from "global/bam/api/ApiMethods";
import ReportStats from "./ReportStats/ReportStats";
import { useSelector } from "react-redux";


const HealthStatus = props => {

    const {
        report_index = "35",
        report_name = "Dummy",
        closeDialog = null
    } = props;

    const [reportStatsState, setReportStatsState] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [state, setState] = useState({
        current: 0,
    });

    const [snackbarState, globalSetting] = useSelector(state => {
        return [state.snackbarState, state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    const handleChange = (active) => {
        setState({
            current: parseInt(active),
        })
    }

    let payload = {
        "option": "healthstatus",
        "report_index": report_index,
        "opr": "0",
        "last_value": "",
        "filter_data":
        {
            "from_date": "",
            "to_date": "",
            "health_status": "0",
            "user_index": "",
            "time_taken": "0",
        }
    }

    const getHealthStatusData = (payload) => {
        GetHealth(payload).then(response => {
            if (response != null && response.status.maincode === '0') {
                setReportStatsState(response);
            }
            else if (response != null && response.status.maincode !== '0') {
                snackbarState.openSnackbar(`Error: ${response.status.errormsg}`, 'error', 5000)
            }
            else {
                snackbarState.openSnackbar(`${t('bam:WENT_WRONG_ERROR')}`, 'error')
            }
        }).then(() => setIsLoading(false))
    }

    const refreshReportStats = new_filter_data => {
        payload.filter_data = new_filter_data;
        getHealthStatusData(payload)
    }
    let toggleBlockPayload = {
        "opr": "",
        "report_id": "",
        "report_name": "",
        "block_code": ""
    }

    const toggleBlockStatus = () => {
        toggleBlockPayload.report_id = report_index;
        toggleBlockPayload.report_name = report_name;
        toggleBlockPayload.block_code = "4"; //To be determined

        if (reportStatsState.data.status_info.blocked === false) {
            toggleBlockPayload.opr = "1";
        }
        else {
            toggleBlockPayload = {
                opr: "2",
                report_id: report_index,
                report_name: report_name,
            }
            // toggleBlockPayload.opr = "1";
        }
        ActHealthStatus(toggleBlockPayload).then((response) => {
            if (response.status.maincode === "0") {
                props.refresh();
                if (toggleBlockPayload.opr === "1")
                    snackbarState.openSnackbar(`${t('bam:REPORT_BLOCKED_SUCCESS')}`, "success")
                else
                    snackbarState.openSnackbar(`${t('bam:REPORT_UNBLOCKED_SUCCESS')}`, "success");
            }
            else {
                snackbarState.openSnackbar(`Error Occured, Code: ${response.status.suberrorcode}, Subject: ${response.status.subject}, `, 'failure')
            }
            getHealthStatusData(payload)

        });
    }

    const hitPagination = type => {
        if (type === 1) {
            payload.opr = 2;
            payload.last_value = reportStatsState.data.history_list[0].log_id;
        }
        else if (type === 2) {
            payload.opr = 1;
            payload.last_value = reportStatsState.data.history_list[reportStatsState?.data?.history_list?.length - 1].log_id;
        }
        getHealthStatusData(payload);
    }

    useEffect(() => {
        // const payload = getPayLoad(state.current)
        getHealthStatusData(payload);
    }, [])
    return (

        <div className={stylesheet.mainContainer}>
            <Grid container xs={12} alignItems="center" style={{ margin: '0 8px 8px 8px' }}>
                <Typography variant="h6"><b>{report_name}</b></Typography>
            </Grid>
            <TabBar handleActiveChange={handleChange} tabList={[`${t('bam:RUNTIME_STATS')}`, `${t('bam:DESCRIPTION')}`]} />
            {isLoading === true ? (<div style={{ height: "504px" }}>
                <Spinner />
            </div>) : (<React.Fragment>{(state.current === 0) ?
                <ReportStats t={t} closeDialog={closeDialog}
                    report_index={report_index}
                    hitPagination={hitPagination}
                    toggleBlockStatus={toggleBlockStatus}
                    refreshReportStats={refreshReportStats}
                    data={reportStatsState != null ? reportStatsState.data : null}
                    status={reportStatsState != null ? reportStatsState.status : null} />
                : <Description report_index={report_index} closeDialog={closeDialog} />}</React.Fragment>)}
        </div>

    )
}

export default HealthStatus;