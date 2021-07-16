import React from "react";
import { IconImage, makeStyles, NotFound, TableComponent, Typography, useTranslation } from "component";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: `${theme.spacing(1)}px ${theme.spacing(1)}px 0px ${theme.spacing(1)}px `,
        "& > *": {
            marginBottom: theme.spacing(2)
        }
    },
    title: {
        borderBottom: `1px solid ${theme.palette.backgroundColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    content: {
        height: '350px',
        // width: '740px'
    },
    buttonPanel: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        width: 'calc(100% - 230px)'
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        width: theme.spacing(7)
    },
    paginationButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginLeft: theme.spacing(2.5)
    }
}));

const LandingScreen = props => {
    const { trendList = [], closeDialog = null, action, modifyTrend = null, setList, list = [] } = props;

    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    const headCells = [
        {
            id: "trend_title",
            numeric: false,
            disablePadding: true,
            label: `${t('bam:TREND_NAME')}`,
            align: "left"
        },
        {
            id: "description",
            numeric: false,
            disablePadding: true,
            label: `${t('bam:DESCRIPTION')}`,
            align: "left"
        },
        {
            id: "next_run_time",
            numeric: false,
            disablePadding: true,
            label: `${t('bam:NEXT_RUN_TIME')}`,
            align: "center"
        },

        {
            id: "last_run_time",
            numeric: false,
            disablePadding: true,
            label: `${t('bam:LAST_RUN_TIME')}`,
            align: "center"
        },
        {
            id: "status",
            numeric: false,
            disablePadding: true,
            label: `${t('bam:STATUS')}`,
            align: "center"
        },
        {
            id: '',
            component: (res, index) => (<div><IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/modify.svg`} onClick={() => modifyTrend(index)} height={16} width={16} /></div>)
        }
    ];
    const classes = useStyles();

    // const getStatusId = status => {
    //     if (status[0] === 'S') return 0;
    //     else if (status[0] === 'R') return 1;
    //     else if (status[0] === 'T') return 50;
    //     else if (status[0] === 'C') return 3;
    //     else if (status[0] === 'E') return 2;
    //     else return -999;
    // }
    //stopped 0, started 1, completed 3, thread_running 50, error 2, unknown
    const checkBoxHandler = (data) => {
        setList(data.map(item => ({ trend_id: item.trend_id, status_id: parseInt(item.status_id) })));
        // console.log(data)
    }

    return (
        <div className={classes.root}>

            {trendList.length === 0 || (trendList.length === 1 && Object.keys(trendList[0]).length === 0) ?
                <div className={classes.content}>
                    <NotFound iconUrl={`${process.env.REACT_APP_CONTEXT_PATH}/icons/trends_blank_screen_icon.svg`} iconSize={100} message={t('bam:NO_TRENDS_MESSAGE')} />
                </div>
                : <div className={classes.content}>
                    <Typography className={classes.text} variant="subtitle1">{t('bam:LIST_OF_TRENDS')}:</Typography>
                    <TableComponent loading={false}
                        listKey="trend_id"
                        list={list}
                        onChangeCheckbox={checkBoxHandler}
                        headerData={headCells}
                        dynamicHeight="300px"
                        tableData={trendList
                            //     .map(trend => ({
                            //     status: trend.status,
                            //     last_run_time: trend.last_run_time === "" ? "Never" : trend.last_run_time,
                            //     next_run_time: trend.next_run_time === "" ? "Never" : trend.next_run_time,
                            //     description: trend.description,
                            //     trend_title: trend.trend_title,
                            //     trend_id: trend.trend_id
                            // }))
                        }
                    />
                </div>}
            {/* <DialogActions style={{ marginBottom: '0px' }}>
                <Button variant="outlined" onClick={closeDialog}>Cancel</Button>

            </DialogActions> */}
        </div>)

}

export default LandingScreen;