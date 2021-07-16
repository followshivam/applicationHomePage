import React, { useEffect, useState } from "react";
import { Button, makeStyles, NotFound, Pagination, useTranslation, Paper, Spinner, Tab, TableComponent, Tabs, Typography } from "component";
import DynamicForm from "component/DynamicForm";
import { Pagination as MatPagination } from '@material-ui/lab';
import { useSelector } from "react-redux";

const tabHeight = '37px'

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        "& > *": {
            marginBottom: theme.spacing(0.5)
        }
        // backgroundColor: theme.palette.grey,
    },
    tabs: {
        minHeight: tabHeight,
        height: tabHeight,
        flex: " 0 0 480px",
        width: "480px"
    },
    tab: {
        border: `1px solid ${theme.palette.borderColor}`,
    opacity: 1,
    textTransform: 'none',
    minHeight: tabHeight,
    height: tabHeight,
    fontSize: "12px",
    color: "black",
    backgroundColor: "white"
    },
    tab_container: {
        flexGrow: 1,
        backgroundColor: theme.palette.common.white,
    },
    tabSelected: {
        fontWeight: '600',
        color: "black",
        backgroundColor: theme.palette.common.white,
    },
    upperContainer: {
        // display: 'flex',
        // marginBottom: theme.spacing(1)
    },
    lowerContainer: {
        flexGrow: 1,
        '& .MuiTableCell-root': {
            borderBottom: '1px solid #F8F8F8'
        },
        '& .MuiTableCell-head': {
            color: theme.palette.common.black
        }
    },
    lowerContainerTitleBar: {
        height: theme.spacing(5),
        padding: '0 0 0 8px',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    buttonControls: {
        minWidth: theme.spacing(26),
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    ul: {
        '& ul': {
            justifyContent: 'flex-end'
        }
    }
}))


const AuditLogs = props => {
    const {
        disableTabs = true,
        projectType = "BAM",
        data = [],
        history_items = [],
        clearFilters = null,
        GetDataFromApi = null,
        enable_prev = false,
        enable_next = false,
        isLoading = false,
        headerCells = [],
        onPaginationChange = null,
        dynamicHeight = "510px",
        setScreenId = () => { return null },
    } = props;

    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [configValue, setConfigValue] = useState(0);

    useEffect(() => {
        if (data.length > configValue)
            setScreenId(data[configValue].screen_id);
    }, [configValue])

    const handleConfigurations = (event, value) => {
        setConfigValue(value);
        clearFilters();
    }


    const handleChangePage = (event, newPage) => setPage(newPage - 1)

    return <div className={classes.root}>
        <div className={classes.upperContainer}>
            {disableTabs === false ?
                <div className={classes.tabs}>
                    <Tabs value={configValue} className={classes.tabs} variant="scrollable" onChange={handleConfigurations}>
                        {data.map((res, key) => <Tab label={res.tabName} key={key} classes={{ selected: classes.tabSelected, root: classes.tab }} />)}
                    </Tabs>
                </div>
                : null}
            <DynamicForm data={data[configValue].filterData.formElements} alignment="row" />
        </div>


        <div className={classes.lowerContainerTitleBar}>
            <Typography variant="h6"><b>{t('bam:AUDIT_LOG_RESULTS')}:</b></Typography>
            <div className={classes.buttonControls}>
                <Button variant="outlined" color="secondary" style={{ width: '90px' }} onClick={clearFilters}>{t('bam:CLEAR_FILTERS')}</Button>
                <Button variant="contained" color="primary" style={{ width: '76px' }} onClick={(event) => GetDataFromApi(event, 0, "")}>{t('bam:BUTTON_GENERATE')}</Button>
                {projectType === "BAM" && <Pagination disabled_prev={!enable_prev} disabled_next={!enable_next} onChange={onPaginationChange} />}
            </div>
        </div>

        <Paper className={classes.lowerContainer} elevation={0} style={{ padding: projectType === "BAM" ? "0" : "12px 18px" }}>
            {
                isLoading === false
                    ? history_items.length !== 0
                        ? <React.Fragment>
                            <TableComponent
                                disableFirstCell={true}
                                loading={isLoading}
                                tableData={
                                    projectType === "BAM"
                                        ? history_items
                                        : history_items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                }
                                headerData={headerCells}
                                dynamicHeight={dynamicHeight}
                            />
                            {
                                projectType !== "BAM" &&
                                <MatPagination
                                    component="div"
                                    count={Number.isInteger((history_items.length / rowsPerPage)) ? (history_items.length / rowsPerPage) : Math.trunc((history_items.length / rowsPerPage)) + 1}
                                    page={page + 1}
                                    onChange={handleChangePage}
                                    color="primary"
                                    className={classes.ul}
                                    style={{ marginLeft: 'right', paddingTop: '20px' }}
                                />
                            }
                        </React.Fragment>

                        : <NotFound iconSize={90} />
                    : <div style={{ height: '100%' }}><Spinner /></div>
            }
        </Paper>
    </div >
}

export default AuditLogs;