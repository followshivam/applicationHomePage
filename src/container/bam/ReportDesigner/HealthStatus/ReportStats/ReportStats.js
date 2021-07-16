import React, { useEffect, useState } from "react";
import stylesheet from "./style.module.css";
import FilterForm from "container/bam/ReportDesigner/HealthStatus/ReportStats/FilterForm/FilterForm";
import { AppBar, makeStyles, Button, FixedFooter, CardContent, Grid, IconButton, List, ListItem, Table, TableBody, TableCell, TableHead, TableRow, Toolbar, Typography, withStyles, ArrowBackIos, ArrowForwardIos, SimpleCard, Dialog, MuiDialogTitle, CloseIcon, MuiDialogContent, Spinner, DialogActions, NotFound, IconImage } from "component";
import { FetchSqlPlan } from "global/bam/api/ApiMethods";
import Chart from "react-apexcharts";
import { ScatterChartData } from "global/json";
import { useSelector } from "react-redux";

const StyledStatusCard = withStyles((theme) => {
    return ({
        root: {
            backgroundColor: '#F1F1F4',
            borderRadius: '2px',
            height: '62px',
            width: '140px'
        }
    }
    )
})(SimpleCard);

const StyledStatusCardContent = withStyles((theme) => {
    return ({
        root: {
            padding: '5px 0px 0px 0px',
            height: '62px',
            width: '136px',
            textAlign: 'center',
            "&:last-child": {
                paddingBottom: 0
            }
        }
    })
})(CardContent)

const PrintCircle = props => {

    const {
        color,
        radius,
        launchFunction,
        index,
    } = props;

    return (
        <span style={{
            display: 'inline-block',
            backgroundColor: color,
            width: radius,
            height: radius,
            borderRadius: '50%',
            marginRight: '5px',
            marginLeft: '5px',
            cursor: launchFunction != null ? 'pointer' : "",
        }}
            onClick={() => launchFunction != null ? launchFunction(index) : null}
        />
    )
}


const StatusCard = props => {

    const {
        t,
        type,
        isBlocked,
        title,
        statusColor,
        cardValue
    } = props;


    const getStatusById = type => {

        if (type === 1) {
            return `${t('bam:LABEL_GOOD')}`
        }
        else if (type === 2) {
            return `${t('bam:LABEL_AVERAGE')}`;
        }
        else {
            return `${t('bam:LABEL_CRITICAL')}`
        }
    }
    let statusValue = "";
    if (type === 1) {
        statusValue = <div className={stylesheet.statusValue}>
            {isBlocked === true ? (<div className={stylesheet.statusValue}>
                <IconImage
                    url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/block.svg`}
                    height={10}
                />
                <Typography variant="subtitle1">
                    <b>{t('bam:LABEL_BLOCKED')}</b>
                </Typography>
            </div>) :
                <div className={stylesheet.statusValue}>
                    <PrintCircle color={statusColor} radius={11} />
                    <Typography variant="subtitle1">
                        <strong>
                            {getStatusById(type)}
                        </strong>
                    </Typography>
                </div>
            }
        </div>
    }
    return (
        <StyledStatusCard elevation={0}>
            <StyledStatusCardContent>
                <Typography variant="subtitle1" gutterBottom>{title}</Typography>
                {type === 1 ? statusValue : <Typography variant="h6"><strong>{cardValue}</strong></Typography>}
            </StyledStatusCardContent>
        </StyledStatusCard>
    )
}

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },

});

const useStyles = makeStyles(theme => ({
    chartRoot: {
        // height: "24px",
        // borderRadius: "5px"
        // position: 'absolute',
        // bottom: 0
        height: '100%',
        width: '100%',
        overflow: 'hidden'
    },
    chart: {
        height: "300px"
    }

}));
const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const Charts = (props) => {
    // console.log(data)
    const classes = useStyles();
    const [chartData, setChartData] = useState({});
    const [isLoading, setIsLoading] = useState({ msg: "", loading: true });
    const { data, param } = props;

    useEffect(() => {
        if (data != null) {
            setChartData(ScatterChartData(data, param));
            setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 500);
        }
    }, [data]);


    return (
        <div className={classes.chartRoot}>
            { isLoading.loading ? (
                <div style={{ height: "300px" }}>
                    <Spinner />
                </div>
            ) : (<Chart
                options={chartData ? chartData.options : null}
                series={chartData ? chartData.series : null}
                type="scatter"
                height={350}
            />)}
        </div>
    );
}
const ReportStats = props => {

    const [open, setOpen] = useState({
        isOpen: false,
        isLoading: true,
        data: "NAN",
    })

    const {
        closeDialog = null,
        data = null,
        report_index = "35",
        status = {},
        refreshReportStats = null,
        toggleBlockStatus = null,
        hitPagination = null,
        t
    } = props;

    useEffect(() => {
        if (open.data !== "NAN") {
            setOpen({ ...open, isLoading: false })
            // console.log(`open data: ${open.data}`)
        }
    }, [open.data])

    const handleClose = () => {
        // console.log('hit recieved')
        setOpen({
            ...open,
            isOpen: false,
        })
    }
    const snackbarState = useSelector(state => {
        return state.snackbarState;
    });
    const openModal = index => {
        setOpen({ ...open, isLoading: true })
        FetchSqlPlan({
            "log_id": index,
            "report_id": report_index,
        }).then(response => {
            if (response != null && response.status != null && response.status.maincode === "0") {
                setOpen({ isLoading: true, isOpen: true, data: response.data })
            }
            else if (response != null && response.status != null) {
                snackbarState.openSnackbar(`${t('bam:ERROR')}: ${response.status.subject} ${response.status.description} ${response.status.errormsg}`, "error")
            }
            else {
                snackbarState.openSnackbar(`${t('bam:ERROR')}: ${t('bam:INVALID_RESPONSE')}`, "error")
            }
        })
    }
    return (
        <React.Fragment>
            {status != null && status.maincode === "0" ?
                <React.Fragment>
                    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open.isOpen}>
                        {open.isLoading === true ? (<DialogContent style={{ height: "200px", width: '200px' }}>
                            <Spinner />
                        </DialogContent>) : (
                            <React.Fragment><DialogTitle id="customized-dialog-title" onClose={handleClose}>
                                {t('bam:EXECUTION_PLAN')}
                            </DialogTitle>
                                <DialogContent dividers>
                                    <Typography gutterBottom>
                                        {`The report is Blocked due to: ${data.history_list[0].blocked_reason}`}
                                    </Typography>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>{t('bam:PHYSICAL_OP')}</TableCell>
                                                <TableCell>{t('bam:ESTIMATE_ROWS')}</TableCell>
                                                <TableCell>{t('bam:ESTIMATE_IO')}</TableCell>
                                                <TableCell>{t('bam:ESTIMATE_CPU')}</TableCell>
                                                <TableCell>{t('bam:TOTAl_SUBTREE_COST')}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {open.data.parameters.map((parameter, key) => (
                                                <TableRow key={key}>
                                                    <TableCell>{parameter.name}</TableCell>
                                                    <TableCell>{parameter.estimate_rows}</TableCell>
                                                    <TableCell>{parameter.estimate_io}</TableCell>
                                                    <TableCell>{parameter.estimate_cpu}</TableCell>
                                                    <TableCell>{parameter.total_subtree_cost}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <br />
                                    <Typography gutterBottom>
                                        <strong>{t('bam:RECOMMENDATIONS')}</strong>
                                    </Typography>
                                    <List dense>
                                        {open.data.recommendations.map((rec, index) => (
                                            <ListItem key={index}>{"• "}{rec.recommendation}</ListItem>
                                        ))}
                                    </List>
                                </DialogContent></React.Fragment>)}
                    </Dialog>

                    <Grid container className={stylesheet.mainContainer} direction="column" justify="flex-start" spacing={1} alignItems="stretch">
                        <Grid container item className={stylesheet.upperSubContainer} spacing={1} xs={12}>
                            <Grid container item className={stylesheet.cardContainer} lg={5} xs={12} spacing={1}>
                                <Grid item>
                                    <StatusCard t={t} title={t('bam:HEALTH_STATUS')} type={1} isBlocked={data.status_info.blocked === true} statusId={data.status_info.status_id} statusColor={data.status_info.status_color} />
                                </Grid>
                                <Grid item>
                                    <StatusCard t={t} title={t('bam:AVERAGE_TIME_TAKEN')} type={2} cardValue={`${data.status_info.average_time}`} />
                                </Grid>
                                <Grid item>
                                    <StatusCard t={t} title={t('bam:MAX_TIME_TAKEN')} type={2} cardValue={`${data.status_info.max_time}`} />
                                </Grid>
                            </Grid>
                            <Grid item className={stylesheet.formContainer} lg={7} xs={12}>
                                <FilterForm syncStates={refreshReportStats} t={t} />
                            </Grid>
                        </Grid>
                        <Grid container item className={stylesheet.lowerSubContainer} justify="space-between" alignItems="stretch">
                            <Grid item className={stylesheet.topNavigationBar} lg={12} xs={12}>
                                <Typography className={stylesheet.topNavigationBarTitle} variant="h6">{t('bam:REPORT_GENERATION_ACTIVITY')}</Typography>
                                <Typography className={stylesheet.topNavigationBarInfo} variant="subtitle1">{`Showing ${data.fetch_count} items`}</Typography>
                                <div className={stylesheet.topNavigationBarButtonContainer}>
                                    <div className={stylesheet.topNavigationBarButtons}>
                                        <IconButton disabled={data.enable_prev === false} onClick={() => {
                                            hitPagination(1)
                                        }}><ArrowBackIos /></IconButton>
                                        <IconButton disabled={data.enable_next === false} onClick={() => {
                                            hitPagination(2)
                                        }}><ArrowForwardIos /></IconButton>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item className={stylesheet.tableContainer} lg={6} xs={12}>
                                <Table stickyHeader={true}>
                                    <TableHead stick>
                                        <TableRow>
                                            <TableCell>{t('bam:SERIAL_NO')}</TableCell>
                                            <TableCell>{t('bam:DATE')}</TableCell>
                                            <TableCell>{t('bam:LABEL_GENERATION_TIME')}</TableCell>
                                            <TableCell>{t('bam:LABEL_GENERATED_BY')}</TableCell>
                                            <TableCell>{t('bam:LABEL_TIME_TAKEN')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.history_list.map((row, index) => {
                                            return <TableRow key={row.log_id}>
                                                <TableCell>{index + 1}{row.blocked === true ? <IconImage
                                                    url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/block.svg`} onClick={() => openModal(row.log_id)}
                                                    height={10}
                                                /> : null}</TableCell>
                                                <TableCell>{row.action_date_time != null ? row.action_date_time.split(' ')[0] : "NA"}</TableCell>
                                                <TableCell>{row.action_date_time != null ? row.action_date_time.split(' ')[1] : "NA"}</TableCell>
                                                <TableCell>{row.user_name}</TableCell>
                                                <TableCell>{row.api_execution_time}</TableCell>
                                            </TableRow>
                                        })}
                                    </TableBody>
                                </Table>
                            </Grid>
                            <Grid item className={stylesheet.graphContainer} lg={6} xs={12}>
                                <Charts data={data.history_list} param={data?.status_info} />
                            </Grid>
                            {/* <FixedFooter>
                    <Typography variant="div" style={{ flexGrow: 1 }} >
                    </Typography>
                    <Typography variant="div"  >
                        <Button color="secondary" onClick={() => window.close()} className={stylesheet.cancelButton}>Cancel</Button>
                        <Button color="primary" onClick={() => { toggleBlockStatus() }}>{state.status_info.blocked === "Y" ? 'Unblock' : 'Block'}</Button>

                    </Typography>

                </FixedFooter> */}
                        </Grid>
                    </Grid>
                    <DialogActions>
                        <Button variant="outlined" color="secondary" onClick={closeDialog}>{t('bam:LABEL_CANCEL')}</Button>
                        <Button variant="contained" color="primary" onClick={toggleBlockStatus}>{data.status_info.blocked === false ? `${t('bam:BLOCK')}` : `${t('bam:UNBLOCK')}`}</Button>
                    </DialogActions>
                </React.Fragment> :
                <div className={stylesheet.blank}>
                    <div className={stylesheet.errorPane}>
                        <NotFound iconSize={120} message={t('bam:NO_HEALTH_STATUS_DATA')} />
                    </div>
                    <DialogActions className={stylesheet.errorActions}>
                        <Button variant="outlined" color="secondary" onClick={closeDialog}>{t('bam:LABEL_CANCEL')}</Button>
                    </DialogActions>
                </div>
            }
        </React.Fragment>)
}
export default ReportStats;