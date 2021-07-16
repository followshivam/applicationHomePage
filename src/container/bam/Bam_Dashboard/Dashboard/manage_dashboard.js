import React, { useEffect, useState } from "react";
import { useSelector, } from "react-redux";
import {
    makeStyles,
    Button,
    Typography,
    Checkbox,
    PickList,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputBox,
    SelectBox,
    Spinner,
    IconImage,
} from "component";
import { DashboardAction, GetTemplateList, GroupList, GetUserList } from "global/bam/api/ApiMethods";
import { AddDashboardInput, GetTemplateInput, GroupListInput, UserListInput } from "global/json";


const useStyles = makeStyles(theme => ({
    root: {
        width: "100%"
    },
    header: {
        // display: 'flex',
        width: '100%',
        // borderBottom: `1px solid ${theme.palette.backgroundContainer}`,
        justifyContent: 'space-between',
        alignItems: 'center',
        // padding:"15px"
    },
    headerControls: {
        paddingLeft: theme.spacing(1),
        display: 'flex',
        justifyContent: 'space-between',
        flexGrow: '1'
    },
    content: {
        width: '100%',
        height: 'calc(100% - 51px)'
        // height: '350px',
    },
    paper: {
        width: "100%",
        marginBottom: theme.spacing(2)
    },
    h6: {
        fontSize: "12px",
        color: "#606060",
        fontWeight: 300,
        margin: "10px 0 10px 0"
    },
    homeTab: {
        display: "flex",
        whiteSpace: "noWrap",
        color: "##606060",
        margin: "10px 0px 28px 0",
        alignItems: "center"
    },
    rightWrapper: {
        // width: "40%",
        margin: "0 auto",
        position: "relative",
    },
    leftWrapper: {
        width: "50%",
        flexGrow: 1,
        marginRight: "45px"
    },
    wrapper: {
        width: "100%",
        display: "flex",
    },
    span: {
        display: "inline-block",
        verticalAlign: "middle",
        fontSize: "0.75rem",
        fontWeight: 600,
        color: "rgb(96, 96, 96)"
    },
    list: {
        color: "#0072C6",
        fontSize: "12px",
        marginLeft: "5px",
        marginBottom: "20px",
    },
    spinner: {
        height: '385px',
        width: '685px'
    }

}));


export default function ManageDashboard(props) {
    const classes = useStyles();
    const { t } = props;
    const [templateList, setTemplateList] = useState([]);
    const [normalStoreDialog, snackBar] = useSelector(state => {
        return [state.normalDialogState, state.snackbarState];
    });
    const handleClose = () => {
        normalStoreDialog.closeDialog()
    };
    const [inputData, setInputData] = React.useState(AddDashboardInput);

    const onChangeHandler = (e) => {
        if (e.target.name === "togglable") {
            setInputData({ ...inputData, [e.target.name]: e.target.checked });
        } else {
            setInputData({ ...inputData, [e.target.name]: e.target.value });
        }
    }

    const [isLoading, setIsLoading] = useState({ msg: "", loading: true });
    const { loading } = isLoading;
    const [userList, setUserList] = useState({ loading: true, list: null, error_msg: "" })
    const [groupName, setGroupName] = useState({ loading: true, list: null, error_msg: "" })

    const onChangePicklist = (type, opr) => {
        if (opr === "next")
            onOpenPicklist(type, "1")
        else
            onOpenPicklist(type, "2")

    }
    const onChangePicklistInput = (result, key) => {
        if (key === "group_name") {
            setInputData({ ...inputData, "group_id": result.id });

        }
        else
            setInputData({ ...inputData, "contoller_id": result.user_index });
    }
    const onOpenPicklist = (type, opr = "0") => {
        if (type === "group_name") {
            let data = {
                ...GroupListInput,
                opr: opr,
                last_index: opr === "0" ? "" : (opr === "1" ? groupName.list.last_id : groupName.list.first_id),
                last_value: opr === "0" ? "" : (opr === "1" ? groupName.list.last_name : groupName.list.first_name),
            }
            GroupList(data).then((res) => {
                if (res != null && res.status.maincode === "0") {
                    setGroupName({ ...groupName, loading: false, list: res && res.data })
                }
                else {
                    setGroupName({ ...groupName, loading: false, error_msg: res.status.errormsg })
                }
            }).catch((err) => { })
        }
        else {
            if (type === "user_list") {
                let payload = { ...UserListInput };
                payload.opr = opr;
                payload.group_index = inputData && inputData.group_id
                payload.last_sort_field = opr === "0" ? "" : (opr === "1" ? userList.list.last_name : userList.list.first_name);
                payload.previous_index = opr === "0" ? "" : (opr === "1" ? userList.list.last_user_index : userList.list.first_user_index);

                if (inputData.group_id != null && inputData.group_id != "") {
                    GetUserList(payload).then((res) => {
                        if (res != null && res.status.maincode === "0") {
                            setUserList({ ...userList, loading: false, list: res.data })
                        }
                        else {
                            setUserList({ ...userList, loading: false, error_msg: res.status.errormsg })
                        }
                    }).catch((err) => { })
                }
                else {
                    snackBar.openSnackbar("Please Select Group Name", "warning")
                }
            }
        }
    }

    useEffect(() => {
        getTemplate_list();
    }, []);

    const getTemplate_list = () => {
        setIsLoading({ ...isLoading, loading: true });
        GetTemplateList(GetTemplateInput)
            .then(res => {
                if (res != null && res.status.maincode === "0") {
                    let selectVal = res && res.data && res.data.templates.map((name) => ({
                        value: name.template_id,
                        label: name.template_name,
                    })
                    );
                    const newTemplateList = [...templateList, ...selectVal];
                    setTemplateList(newTemplateList);
                    setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
                }
            })
            .catch(err => { });
    };

    const AddDashboard = () => {
        let data = {
            ...inputData,
            togglable: inputData && (inputData.togglable === true) ? "Y" : "N",
        }
        setIsLoading({ ...isLoading, loading: true });

        if (data.tab_name !== "" && inputData.dashboard_name !== "") {

            DashboardAction(data)
                .then(res => {
                    if (res != null && res.status.maincode === "0") {
                        snackBar.openSnackbar(`${t('bam:ADDED_DASHBOARD_SUCCESS')}`, "success");
                        setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
                        handleClose()
                    } else {
                        snackBar.openSnackbar(res.status.errormsg, "error");
                        setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
                    }
                })
                .catch(err => { });
        }
        else {
            setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
            snackBar.openSnackbar(`${t('bam:PLEASE_FILL_REQ_FIELDS')}`, "error");
            setInputData({ ...inputData, "group_id": "" });


        }
    };
    const action_button = [
        {
            id: 1,
            label: `${t('bam:BUTTON_CLOSE')}`,
            type: 'button',
            variant: 'outlined',
            color: 'primary',
            action: handleClose
        },

        {
            id: 2,
            label: `${t('bam:ADD')}`,
            type: 'submit',
            variant: 'contained',
            color: 'primary',
            action: AddDashboard
        },
    ]

    return (

        <div className={classes.root}>
            <DialogTitle>
                <div className={classes.header}>
                    <div className={classes.headerTitle}>
                        <Typography variant="h6"><strong>{t('bam:BUSINESS_ACTIVITY_MONITOR')}</strong></Typography>
                    </div>

                </div>

            </DialogTitle>
            {loading ? (
                <div className={classes.spinner}>
                    <Spinner />
                </div>
            ) : (<DialogContent
                className={classes.dialogContentLanding}>
                <div className={classes.header}>
                    {/* <Paper className={classes.paper}> */}
                    <div className={classes.wrapper}>
                        <div className={classes.leftWrapper}>
                            <div className={classes.h6}>
                                <label>{t('bam:NEW_DASHBOARD_PROPERTIES')}</label>
                            </div>
                            <div className={classes.homeTab}>

                                <InputBox
                                    label={t('bam:DASHBOARD_NAME')}
                                    form={false}
                                    labelMaxWidth="120px"
                                    labelMinWidth="120px"
                                    value={inputData.name}
                                    style={{ width: "150px" }}
                                    name='dashboard_name'
                                    onChangeHandler={onChangeHandler}
                                    required={true}
                                />

                            </div>
                            <div className={classes.homeTab}>

                                <PickList
                                    style={{ width: "150px" }}
                                    label={t('bam:GROUP_NAME')}
                                    form={false}
                                    labelMaxWidth="120px"
                                    labelMinWidth="120px"
                                    value={groupName.value}
                                    required={true}
                                    list={groupName.list == null ? null : groupName.list}
                                    loading={groupName.loading}
                                    displayKey="group_name"
                                    valueKey="id"
                                    pagination={true}
                                    search={true}
                                    onOpen={() => onOpenPicklist("group_name")}
                                    error_msg={groupName.error_msg}
                                    fullWidth={true}
                                    form={false}
                                    onChangePicklist={(params) => onChangePicklist("group_name", params)}
                                    onChangeHandler={(result) => onChangePicklistInput(result, "group_name")}
                                />
                            </div>
                            <div className={classes.homeTab}>

                                <PickList
                                    style={{ width: "150px" }}
                                    label={t('bam:LABEL_CONTROLLER')}
                                    form={false}
                                    labelMaxWidth="120px"
                                    labelMinWidth="120px"
                                    value={userList.value}
                                    required={true}
                                    list={userList.list == null ? null : userList.list}
                                    loading={userList.loading}
                                    displayKey="name"
                                    valueKey="user_index"
                                    pagination={true}
                                    search={true}
                                    onOpen={() => onOpenPicklist("user_list")}
                                    error_msg={userList.error_msg}
                                    fullWidth={true}
                                    form={false}
                                    onChangePicklist={(params) => onChangePicklist("user_list", params)}
                                    onChangeHandler={(result) => onChangePicklistInput(result, "user_list")}
                                />
                            </div>
                            <div className={classes.homeTab}>

                                <InputBox
                                    label={t('bam:TAB_NAME')}
                                    form={false}
                                    labelMaxWidth="120px"
                                    labelMinWidth="120px"
                                    value={inputData.name}
                                    style={{ width: "150px" }}
                                    name='tab_name'
                                    onChangeHandler={onChangeHandler}
                                    required={true}
                                />
                            </div>
                            <div className={classes.homeTab}>
                                <span className={classes.span}>{t('bam:TOGGLABLE')}</span>
                                <span style={{ marginLeft: "50px" }}>
                                    <Checkbox
                                        // label="Template"
                                        // form={false}
                                        // labelMaxWidth="120px"
                                        // labelMinWidth="120px"
                                        name='togglable'
                                        onChange={onChangeHandler} />
                                </span>
                            </div>
                            <div className={classes.homeTab}>

                                <SelectBox
                                    style={{ width: "150px" }}
                                    label={t('bam:TEMPLATE')}
                                    form={false}
                                    labelMaxWidth="80px"
                                    labelMinWidth="80px"
                                    name='template_id'
                                    list={templateList} value={0}
                                    labelMaxWidth="120px"
                                    labelMinWidth="120px"
                                    form={false}
                                    onChange={onChangeHandler}
                                    className={classes.inputBox} />
                            </div>

                        </div>
                        <div className={classes.rightWrapper}>
                            <div className={classes.h6}>
                                <label>{t('bam:TEMPLATE_PREVIEW')}</label>
                            </div>
                            <div style={{ display: "block", width: '318px', height: "180px", border: "1px solid #E4E4E4" }}>
                                <IconImage className={classes.icon} url={"icons/temp.png"} height={150} width={250} />

                            </div>
                        </div>
                    </div>

                    {/* </Paper> */}
                </div>

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

