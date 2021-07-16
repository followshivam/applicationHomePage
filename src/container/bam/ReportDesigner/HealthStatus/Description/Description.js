import { useTranslation, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography, SimpleCard, AppBar, Toolbar, Button, DialogActions, NotFound, Spinner, IconImage } from "component";
import { GetHealth } from "global/bam/api/ApiMethods";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import stylesheet from "./style.module.css";

const PrintCircle = props => {
    return (
        <span style={{
            display: 'inline-block',
            backgroundColor: props.color,
            width: props.radius,
            height: props.radius,
            borderRadius: '50%',
            marginRight: '5px',
            marginLeft: '5px',
        }}
            onClick={() => props.launchFunction != null ? props.launchFunction(props.index) : null} />
    )
}



const Description = props => {
    const [state, setState] = useState();
    const [isLoading, setIsLoading] = useState({ loading: true, message: "Rendering Component" });

    const [snackbarState, globalSetting] = useSelector(state => {
        return [state.snackbarState, state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    const getStatusById = type => {
        if (type === '1') {
            return `${t('bam:LABEL_GOOD')}`
        }
        else if (type === '2') {
            return `${t('bam:LABEL_AVERAGE')}`;
        }
        else {
            return `${t('bam:LABEL_CRITICAL')}`
        }
    }

    useEffect(() => {
        setIsLoading({ ...isLoading, message: "Fetching Data From Api" })
        GetHealth({
            option: "healthdefinition",
            report_index: props.report_index,
        }).then(response => {
            if (response != null && response.status != null && response.status.maincode === '0') {
                setState({ ...response.data });
            }
            else if (response != null && response.status != null && response.status.maincode !== '1') {
                snackbarState.openSnackbar(response.status.errormsg, 'error', 3000);
            }
            else {
                snackbarState.openSnackbar(`${t('bam:WENT_WRONG_ERROR')}`, 'error');
            }
        }).then(() => setIsLoading({ loading: false }))
    }, [])

    console.log(state);
    return <React.Fragment>
        {isLoading.loading === false ? <Grid container className={stylesheet.mainContainer} direction="column" spacing={2} justify="space-between" alignItems="stretch">
            <Grid item className={stylesheet.tableContainer}>
                <Table stickyHeader={true}>
                    <TableHead style={{ backgroundColor: '#FFFFFF' }}>
                        <TableRow>
                            <TableCell>{t('bam:STATUS_NAME')}</TableCell>
                            <TableCell>{t('bam:RANGE')}</TableCell>
                            <TableCell>{t('bam:PREVIEW')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {state.health_status.map((row, index) => {
                            return <TableRow key={row.id}>
                                <TableCell>{getStatusById(row.id)}</TableCell>
                                {index === 2 ? <TableCell><div style={{ display: 'flex', justifyContent: 'space-between', width: '45px' }}> <Typography>{`${row.from_range != null ? row.from_range : 0}`}</Typography> - <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/infinity.svg`} height="14px" width="14px" /> </div></TableCell> :
                                    <TableCell><div style={{ display: 'flex', justifyContent: 'space-between', width: '45px' }}><Typography>{`${row.from_range != null ? row.from_range : 0}`}</Typography> - <Typography>{`${row.to_range}`}</Typography></div></TableCell>}
                                <TableCell><PrintCircle radius={10} color={row.colour} /> {getStatusById(row.id)}</TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </Grid>
            <Grid item className={stylesheet.blockingConditions}>
                <Typography variant="subtitle1" className={stylesheet.blockingConditionsTextFont}>{t('bam:BLOCKING_CONDITIONS')}</Typography>
                {(state.block_if_frequency === false && state.block_if_range === false && state.block_if_gen_time_avg === false ? (
                    <div className={[stylesheet.noBlockingCondition, stylesheet.blockingConditionsText].join(' ')}>
                        <Typography varinant="subtitle1">{t('bam:NO_BLOCKING_CONDITION_DEFINED')}</Typography>
                    </div>
                ) : null)}
                <div className={stylesheet.blockingConditionsText}>
                    {state.block_if_frequency ? <Typography variant="subtitle1">
                        {`${t('bam:BLOCK_REPORT_IF_GENERATED_MORE_THAN')} ${state.block_frequency} ${t('bam:WITHIN')} ${state.block_frequency_time_bound} ${t('bam:HOURS')}.`}
                    </Typography> : null}
                    {state.block_if_range ? <Typography variant="subtitle1">
                        {`${t('bam:BLOCK_REPORT_IF_GENERATED_MORE_THAN')} ${getStatusById(state.block_range)} ${t('bam:RANGE')}.`}
                    </Typography> : null}
                    {state.block_if_gen_time_avg ? <Typography variant="subtitle1">
                        {`${t('bam:GENERATION_TIME_CONDITION_MESSAGE')}`}
                    </Typography> : null}
                </div>
            </Grid>
            <Grid item className={stylesheet.blockingConditionsText}>
                {state.send_mail ? <Grid container item className={stylesheet.userNotify}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">{t('bam:USERS_NOTIFIED')}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <div className={stylesheet.emailContainer}>
                            {state.mail_ids.map(id => (
                                <div className={stylesheet.emailCard}>
                                    <Typography variant="subtitle1">{id}</Typography>
                                </div>
                            ))}
                        </div>
                    </Grid>
                </Grid> : null}
            </Grid>
        </Grid> : <div style={{ display: 'flex', height: 'calc(100% - 70px)', justifyContent: 'center', alignItems: 'center', alignContent: 'center', justifyItems: 'center' }}><Spinner msg={isLoading.message} /></div>}
        <DialogActions className={stylesheet.dialogActions}>
            <Button variant="outlined" color="secondary" onClick={props.closeDialog}>{t('bam:LABEL_CANCEL')}</Button>
        </DialogActions>
    </React.Fragment>
}

export default Description;