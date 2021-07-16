import React, { useEffect, useState } from "react";
import {
    makeStyles,
    Button,
    Typography,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconImage,
    Spinner,
    TableComponent,
} from "component";
import { GetDashboardList, DashboardAction } from "global/bam/api/ApiMethods";
import { GetDashboardInput } from 'global/json';
import { useSelector, } from "react-redux";


const useStyles = makeStyles(theme => ({
    root: {
        width: "100%"
    },
    header: {
        width: '100%',
        // borderBottom: `1px solid ${theme.palette.backgroundContainer}`,
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    paper: {
        width: "100%",
        marginBottom: theme.spacing(2)
    },

    head: {
        backgroundColor: '#FFFFFF',
    },
    spinner: {
        height: '230px',
        width: '750px'
    },

}));
const useToolbarStyles = makeStyles(theme => ({

    icon: {
        marginRight: "24px !important",
    },
    h6: {
        paddingLeft: "10px",
        color: "#606060"
    },
    child_toolbar2: {
        display: "flex",
        flex: 1,
        justifycontent: "space-between",
        alignItems: "center",
        height: "30px"
    },
    child2_toolbar_right: {
        display: "flex",
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingRight: "18px",
        marginRight: "5px"
    }

}));


const headCells = [
    {
        id: "dashboard_name",
        numeric: false,
        disablePadding: true,
        label: "Dashboard Name"
    },
    {
        id: "controller_name",
        numeric: false,
        disablePadding: false,
        label: "Controller User "
    },
    {
        id: "group_name",
        numeric: false,
        disablePadding: false,
        label: "Group Name "
    },
];

const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { data, loader, selected = [], onDeleteHandler, onRefresh, heading, successEvent = null, t } = props;
    const { loading, msg } = loader;
    const showDelButton = selected && selected.length > 0;
    return (
        <React.Fragment>
            <div className={classes.child_toolbar2}>
                <h6 className={classes.h6}>{heading ? heading : `${t('bam:CAN_ADD_OR_DELETE_DASHBOARD')}`}</h6>
                <div className={classes.child2_toolbar_right}>
                    <IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/plus_blue.svg`} height={15} onClick={() => successEvent(1)} />
                    {showDelButton ? <IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/trash_2.svg`} height={15} onClick={() => onDeleteHandler(selected)} /> : null}
                </div>
            </div>
        </React.Fragment>
    );
};

export default function DashboardList(props) {
    const classes = useStyles();
    const { successEvent = null, action_button = [], t } = props;
    const [dashboardList, setDashboardList] = useState({});
    const [selected, setSelected] = React.useState([]);
    const [isLoading, setIsLoading] = useState({ msg: "", loading: true });
    const { loading, msg } = isLoading;
    const heading = '';
    const [store, snackBar] = useSelector(state => {
        return [state.normalDialogState, state.snackbarState];
    });
    useEffect(() => {
        getDashboard_list();
        setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 500);
    }, []);
    const getDashboard_list = () => {
        setIsLoading({ ...isLoading, loading: true });
        GetDashboardList(GetDashboardInput)
            .then(res => {
                if (res != null && res.status.maincode === "0") {
                    setDashboardList(res.data);
                    setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
                }
            })
            .catch(err => { });
    };


    const checkBoxHandler = (data) => {
        setSelected(data);
    }
    const onDeleteHandler = (res) => {
        let data = {
            "opr": "1",
            "user_id": "",
            "dashboard_name": res && res.dashboard_name,
            "group_id": res && res.group_id,
            "contoller_id": res && res.controller_id,
            "tab_name": "",
            "template_id": "",
            "togglable": "",
            "dashboard_id": res && res.dashboard_id
        }
        setIsLoading({ ...isLoading, loading: true });

        //  normalStoreDialog.openDialog(<Confirmation title="Are you sure you want to delete this Process?" description="" button_label="Delete" action={() => {
        DashboardAction(data)
            .then(res => {
                if (res != null && res.status.maincode === "0") {
                    snackBar.openSnackbar(`${t('bam:DASHBOARD_SUCCESS_DELETED')}`, "success");
                    getDashboard_list();
                    setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
                }
                else {
                    setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
                    snackBar.openSnackbar(`${t('bam:WENT_WRONG_ERROR')}`, "error");

                }
            })
            .catch(err => { });
        // }} />, "")
    }

    return (

        <div className={classes.root}>
            <DialogTitle>
                <div className={classes.header}>
                    <div >
                        <Typography variant="h6"><strong>{t('bam:BUSINESS_ACTIVITY_MONITOR')}</strong></Typography>
                    </div>
                </div>
            </DialogTitle>
            {loading ? (
                <div className={classes.spinner}>
                    <Spinner />
                </div>
            ) : (<DialogContent>
                <EnhancedTableToolbar
                    t={t}
                    data={dashboardList}
                    loader={isLoading}
                    heading={heading}
                    selected={selected}
                    successEvent={successEvent}
                    onDeleteHandler={onDeleteHandler}

                />


                <TableComponent dynamicHeight="180px"
                    tableData={dashboardList && dashboardList.dashboard_list}
                    headerData={headCells}
                    loading={loading}
                    disableFirstCell={true}
                    onChangeCheckbox={checkBoxHandler}
                    action={
                        [

                            // {
                            //     action_type: "icon",
                            //     icon_url: "icons/edit.svg",
                            //     height: "15",
                            //     onClick: (res) => { console.log(res) },
                            //     className: ""
                            // },
                            {
                                action_type: "icon",
                                icon_url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/trash_2.svg`,
                                height: "15",
                                onClick: (res) => { onDeleteHandler(res) },
                                className: ""
                            },
                        ]
                    }
                />

                {/* </Paper> */}

            </DialogContent>)}
            <DialogActions>
                {action_button.map((res, key) => {
                    return (<Button
                        variant={res.variant}
                        color={res.color}
                        onClick={res.action}
                        type={res.type}
                    >
                        {res.label}
                    </Button>)
                })}
            </DialogActions>

        </div>
    );
}
