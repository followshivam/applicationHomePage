import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    makeStyles,
    Button,
    Typography,
    DialogActions,
    DialogContent,
    DialogTitle,
    Confirmation,
    IconImage,
    TableComponent,
    Spinner,
} from "component";
import { GetTabAction, GetTabList, GetTemplateList } from "global/bam/api/ApiMethods";
import { GetTabInput, GetTemplateInput } from 'global/json';


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
        color: "#606060",
        fontSize: "12px"
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



const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { loader, successEvent = null, onDeleteHandler, selected = [], t } = props;
    const { loading, msg } = loader;
    const showDelButton = selected && selected.length > 0;

    return (
        <React.Fragment>
            <div className={classes.child_toolbar2}>
                <h6 className={classes.h6}>{t('bam:TABS_ACTIONS')}</h6>
                <div className={classes.child2_toolbar_right}>
                    <IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/plus_blue.svg`} height={15} onClick={() => successEvent(1)} />
                    {showDelButton ? <IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/trash_3.svg`} height={15} onClick={() => onDeleteHandler(selected)} /> : null}
                </div>
            </div>
        </React.Fragment>
    );
};

export default function TabList(props) {
    const classes = useStyles();
    const { successEvent = null, action_button = [], dashboard_id = "", onCallBack = null, t } = props;
    const [selected, setSelected] = useState([]);
    const [isLoading, setIsLoading] = useState({ msg: "", loading: true });
    const { loading } = isLoading;
    const [tabList, setTabList] = useState({});
    const [tabInput, setTabInput] = useState({ ...GetTabInput, group_id: dashboard_id })
    // const [templateList, setTemplateList] = useState([]);
    const onModify = (res) => {
        if (res)
            successEvent(1, res);
    }

    useEffect(() => {
        getTab_list();
    }, [tabInput]);


    const getTab_list = () => {
        setIsLoading({ ...isLoading, loading: true });
        GetTabList(tabInput)
            .then(res => {
                if (res != null && res.status.maincode === "0") {
                    // let selectVal = res && res.data && res.data.tab_list.map((name) => ({
                    //                 value: name.template_id,
                    //                 label: name.template_name,
                    //               })
                    //               );
                    //               const newTemplateList = [...templateList, ...selectVal];
                    // setTemplateList(newTemplateList);
                    setTabList(res.data);
                    setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
                }
            })
            .catch(err => { });
    };

    const checkBoxHandler = (data) => {
        setSelected(data);
    }
    const [store, snackBar] = useSelector(state => {
        return [state.normalDialogState, state.snackbarState];
    });

    // useEffect(() => {
    //     getTemplate_list();
    //   }, []);

    //   const getTemplate_list = () => {
    //     setIsLoading({ ...isLoading, loading: true });
    //     GetTemplateList(GetTemplateInput)
    //       .then(res => {
    //         if (res != null && res.status.maincode === "0") {
    //           let selectVal = res && res.data && res.data.templates.map((name) => ({
    //             value: name.template_id,
    //             label: name.template_name,
    //           })
    //           );
    //           const newTemplateList = [...templateList, ...selectVal];
    //           setTemplateList(newTemplateList);
    //           setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
    //         }
    //       })
    //       .catch(err => { });
    //   };

    // const onChangeHandler=()=>{
    //     console.log("select")
    // }

    const onDeleteHandler = (res) => {
        let data = {
            "opr": "2",
            "group_id": "",
            "user_id": localStorage?.getItem("user_id"),
            "tab_name": res && res.tab_name,
            "template_id": res && res.template_id,
            "togglable": res && res.togglable,
            "dashboard_id": "",
            "tab_id": res && res.tab_id
        }
        setIsLoading({ ...isLoading, loading: true });

        // store.openDialog(<Confirmation title="Are you sure you want to delete this Process?" description="" button_label="Delete" action={() => {
        GetTabAction(data)
            .then(res => {
                if (res != null && res.status.maincode === "0") {
                    snackBar.openSnackbar(`${t('bam:TAB_DELETED_SUCCESS')}`, "success");
                    getTab_list();
                    onCallBack()
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
    const headCells = [
        {
            id: "tab_name",
            sort_id: "tab_name",
            sort: true,
            numeric: false,
            disablePadding: true,
            label: `${t('bam:TAB_NAME')}`
        },

        // {
        //     id: "template_name",
        //     numeric: false,
        //     disablePadding: true,
        //     label: "Template Name"
        // },
    ];

    return (

        <div className={classes.root}>
            <DialogTitle>
                <div className={classes.header}>
                    <div className={classes.headerTitle}>
                        <Typography variant="h6"><strong>{t('bam:BUSINESS_ACTIVITY_MONITOR_TABS_MANAGE')}</strong></Typography>
                    </div>
                </div>
            </DialogTitle>
            {loading ? (
                <div className={classes.spinner}>
                    <Spinner />
                </div>
            ) : (<DialogContent
                className={classes.dialogContentLanding}>
                {/* <Paper className={classes.paper}> */}
                <EnhancedTableToolbar
                    data={tabList}
                    loader={isLoading}
                    successEvent={successEvent}
                    selected={selected}
                    onDeleteHandler={onDeleteHandler}
                    t={t}
                />
                <TableComponent dynamicHeight="180px"
                    tableData={tabList.tab_list}
                    headerData={headCells}
                    loading={loading}
                    disableFirstCell={true}
                    onChangeCheckbox={checkBoxHandler}
                    action={
                        [
                            {
                                action_type: "icon",
                                icon_url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/edit.svg`,
                                height: "15",
                                onClick: (res) => onModify(res),
                                className: ""
                            },
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



