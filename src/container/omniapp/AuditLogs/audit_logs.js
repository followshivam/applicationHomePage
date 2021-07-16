import React, { useEffect, useState } from "react";
import { Button, makeStyles, Paper, Spinner, TableComponent,useTranslation, NotFound, Typography } from "component";
import Pagination from '@material-ui/lab/Pagination';
import DynamicForm from "component/DynamicForm";

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        "& > *": {
            marginBottom: theme.spacing(1)
        }
    },
    upperContainer: {
        display: 'flex',
        marginBottom: theme.spacing(1)
    },
    lowerContainer: {
        flexGrow: 1,
        height: 'calc(100vh - 200px)',

        '& .MuiTableCell-root': {
            borderBottom: '1px solid #F8F8F8'
        },
        '& .MuiTableCell-head': {
            background: 'transparent',
            color: theme.palette.common.black
        }
    },
    buttonControls: {
        minWidth: '180px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing(1),
        alignSelf: 'baseline'
    },
    ul: {
        '& ul': {
            justifyContent: 'flex-end'
        }
    }
}))


const AuditLogs = props => {
    const {
        data = [],
        apiResponse = [],
        clearFilters = null,
        GetDataFromApi = null,
        isLoading = false,
        headerCells = [],
    } = props;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])
    const classes = useStyles();

    const handleChangePage = (event, newPage) => setPage(newPage - 1)

    return <div className={classes.root}>
        <div className={classes.upperContainer}>
            <DynamicForm data={data.filterData.formElements} alignment="row" />
            <div className={classes.buttonControls}>
                <Button variant="outlined" color="secondary" style={{ width: '90px', }} onClick={clearFilters}>{t('omniapp:CLEAR_FILTERS')}</Button>
                <Button variant="contained" color="primary" style={{ width: '76px' }} onClick={() => GetDataFromApi()}>{t('omniapp:GENERATE')}</Button>
            </div>
        </div>

        <Paper className={classes.lowerContainer}>
            {
                isLoading === false
                    ? (apiResponse.length !== 0
                        ? <div style={{ padding: '12px 18px' }}>
                            <Typography variant="h5" style={{ marginBottom: '13px' }}>Audit Log Result(s)</Typography>
                            <TableComponent
                                disableFirstCell={true}
                                loading={isLoading}
                                tableData={apiResponse.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                                headerData={headerCells}
                            />
                            <Pagination
                                component="div"
                                count={Number.isInteger((apiResponse.length / rowsPerPage)) ? (apiResponse.length / rowsPerPage) : Math.trunc((apiResponse.length / rowsPerPage)) + 1}
                                page={page + 1}
                                onChange={handleChangePage}
                                color="primary"
                                className={classes.ul}
                                style={{ marginLeft: 'right', paddingTop: '20px' }}
                            />
                        </div>
                        : <div style={{ height: '100%', width: '374px', margin: '0 auto' }}>
                            <NotFound message="It looks like you don't have anything to show here right now! Please select/change filters for better results."
                                iconSize={96} messageFontSize="12px" />
                        </div>
                    )
                    : <div style={{ height: '100%' }}><Spinner /></div>
            }
        </Paper>
    </div>
}

export default AuditLogs;