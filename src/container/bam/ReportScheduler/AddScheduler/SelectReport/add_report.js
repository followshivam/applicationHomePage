import { Button, DialogActions, makeStyles, Typography, TableComponent, IconImage, Pagination } from "component";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateSchedule } from "redux/action";
import { GetReportInstanceDefinition, ActReportInstance } from "global/bam/api/ApiMethods";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '390px',
    },
    actionBar: {
        position: 'absolute',
        bottom: '0',
        right: '0',
    },
    body: {
        height: 'calc(100% - 50px)',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(1),
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(0.5)
    },
    icon: {
        marginRight: "8px !important",
    },
    iconRow: {
        marginRight: "25px ",
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
    },
    textColor: {
        color: '#606060'
    },
    inputBox: {
        width: '140px'
    },
    toolbarControls: {
        display: 'flex',
        alignItems: 'center',
        "& > *": {
            marginLeft: theme.spacing(1)
        }
    }
}))


const AddReport = props => {

    const { data = {}, t = null } = props;
    const classes = useStyles();
    const headerData = [
        {
            id: "report_instance_name",
            numeric: false,
            sor_id: "report_name",
            disablePadding: true,
            label: `${t('bam:REPORT_NAME')}`
        },
        {
            id: "report_type",
            sor_id: "report_type",
            numeric: true,
            disablePadding: true,
            label: `${t('bam:LABEL_REPORT_TYPE')}`
        },
        {
            id: "description",
            numeric: false,
            sor_id: "description",
            disablePadding: false,
            label: `${t('bam:DESCRIPTION')}`
        },
        {
            id: "",
            numeric: false,
            disablePadding: false,
            component: (res) => {
                return (<React.Fragment>
                    <IconImage className={classes.iconRow} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/edit.svg`} height={15} onClick={() => onEdit(res)} />
                    <IconImage className={classes.iconRow} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/trash_2.svg`} height={15} onClick={() => onDeleteHandler(res)} />
                </React.Fragment>)
            },
        },

    ];
    const [isLoading, setIsLoading] = useState({ msg: "", loading: true });
    const { loading } = isLoading;
    const [selected, setSelected] = useState();
    const [value, setValue] = useState();
    const checkBoxHandler = (data) => {
        if (data) {
            console.log("data", data)
            setSelected({
                selected_fields: [...data],
                report_index: data && data[0] && data[0].report_id,
                report_type: data && data[0] && data[0].report_type,
                chart_title: data && data[0] && data[0].report_name,
                display_name: data && data[0] && data[0].report_instance_name,
            });
        }
    }

    const snackbarState = useSelector(store => store.snackbarState);

    const dispatch = useDispatch();
    const createScheduleState = useSelector(store => store.createScheduleState);
    const [rowList, setRowList] = useState(createScheduleState.report_instance_list);

    const onNextHandler = event => {
        event.preventDefault();
        if (selected != null) {
            console.log("selected", selected)
            dispatch(CreateSchedule({ ...createScheduleState, current_step: createScheduleState.current_step + 1, addRow: false, ...selected, ...data }))
        } else
            snackbarState.openSnackbar('Add a report to proceed', 'warning')
    }
    const onPreviousHandler = event => {
        event.preventDefault();
        dispatch(CreateSchedule({ ...createScheduleState, current_step: createScheduleState.current_step - 1, addRow: false, report_instance_list: createScheduleState.report_instance_list }))

    }

    const onAdd = event => {
        event.preventDefault();
        dispatch(CreateSchedule({ ...createScheduleState, current_sub_step: createScheduleState.current_sub_step + 1, addRow: true, ...selected, ...data, chart_title_color: "", input_fields: [] }))
    }


    const onEdit = (res) => {
        // setValue({
        //     report_index: res && res.report_id,
        //     report_instance_id: res && res.report_instance_id,
        //     report_type: res && res.report_type,
        //     chart_title: res && res.report_name,
        //     display_name: res && res.report_name,
        //     rules: res && res.rules
        // });
        GetReportInstanceDefinition({ report_instance_id: res.report_instance_id })
            .then(res => {
                if (res != null && res.status.maincode === "0") {
                    setValue({ ...res.data, report_index: res?.data?.report_id, display_name: res?.data?.report_name, chart_title: res?.data?.report_name, report_type: res?.data?.report_type, chart_title_color: res?.data?.chart_title_color })
                }
            })
            .catch(err => { });
    }

    const ChangeHandler = (key, param) => {
        if (key === "prev") {
            //   setInputData({ ...inputData, act: "3", sub_action: "0" })
        }
        if (key === "next") {
            //   setInputData({ ...inputData, act: "2", sub_action: "0" });
        }
    }

    useEffect(() => {
        if (createScheduleState && createScheduleState.report_instance_id != null) {
            getList();
        }
    }, [createScheduleState.report_instance_id]);

    useEffect(() => {
        if (value != null)
            dispatch(CreateSchedule({ ...createScheduleState, current_sub_step: createScheduleState.current_sub_step + 2, subModifyMode: true, ...selected, ...value }))
    }, [value]);


    const getList = () => {
        const data = {
            report_instance_id: createScheduleState.report_instance_id
        }
        setIsLoading({ ...isLoading, loading: true });
        GetReportInstanceDefinition(data)
            .then(res => {
                if (res != null && res.status.maincode === "0") {
                    if (createScheduleState.subModifyMode) {
                        const index = rowList.findIndex((i) => i.report_instance_id === createScheduleState.report_instance_id);
                        rowList.splice(index, 1, res.data);
                        dispatch(CreateSchedule({ ...createScheduleState, subModifyMode: false, report_instance_list: rowList, ...selected, ...data }))

                    } else {

                        if (createScheduleState.addRow === true) {
                            setRowList([...rowList, res.data]);

                            dispatch(CreateSchedule({ ...createScheduleState, report_instance_list: [...createScheduleState.report_instance_list, res.data], ...selected, ...data }))
                        }
                    }

                    setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
                }
            })
            .catch(err => { });
    };

    const onDeleteHandler = (res) => {
        const finalPayload = {
            "opr": "2",
            "report_instance_id": res.report_instance_id
        }

        ActReportInstance(finalPayload).then(response => {
            if (response != null && response.status.maincode === "0") {
                snackbarState.openSnackbar(`${t('bam:SUCCESS_DELETE')}`, 'Success');
                let list = rowList;
                list = list.reduce((p, c) => (c.report_instance_id !== res.report_instance_id && p.push(c), p), []);
                setRowList(list);
                dispatch(CreateSchedule({ ...createScheduleState, report_instance_list: list, ...selected, ...data }))

            }
            else {
                snackbarState.openSnackbar(response.status.error_msg, 'error')
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    }


    return <div className={classes.root}>
        <div className={classes.body}>

            <div className={classes.tableContainer}>
                <React.Fragment>
                    <div className={classes.child_toolbar2}>
                        <Typography variant="subtitle1" className={classes.textColor}>{t('bam:LIST_OF_REPORTS')}:</Typography>

                        <div className={classes.child2_toolbar_right}>
                            {/* <IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/trash_3.svg`} height={15} onClick={onDeleteHandler} /> */}
                            <IconImage className={classes.icon} url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/plus_blue.svg`} height={15} onClick={onAdd} />
                            {/* {rowList != null ? <Pagination disabled_prev={true} disabled_next={true} onChange={ChangeHandler} />:null} */}

                        </div>
                    </div>
                </React.Fragment>
                <TableComponent
                    dynamicHeight="295px"
                    overflowRequired={true}
                    headerData={headerData}
                    tableData={rowList && rowList != null && rowList}
                    loading={false}
                    onChangeCheckbox={checkBoxHandler}
                // selectType = "radio"

                />
            </div>

            <DialogActions className={classes.actionBar}>
                <Button variant="outlined" onClick={props.onCancel}>{t('bam:LABEL_CANCEL')}</Button>
                <Button variant="outlined" onClick={onPreviousHandler}>{t('bam:BUTTON_PREVIOUS')}</Button>
                <Button variant="contained" onClick={onNextHandler} color="primary">{t('bam:BUTTON_NEXT')}</Button>
            </DialogActions>
        </div>
        {/* } */}
    </div>
}

export default AddReport;