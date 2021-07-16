import React, { useEffect } from "react";
import {
    makeStyles,
    Button,
    Checkbox,
    DialogActions,
    DialogContent,
    InputBox,
    SelectBox,
    useTranslation
} from "component";
import { SchedulertAction } from "global/bam/api/ApiMethods";
import { GetSchedulerActionInput } from "global/json";
import { useDispatch, useSelector } from "react-redux";
import { CreateSchedule, ResetSchedule } from "redux/action";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        overflowY: "auto",
        // maxHeight: "335px"
    },
    header: {
        // display: 'flex',
        width: '100%',
        // borderBottom: `1px solid ${theme.palette.backgroundContainer}`,
        justifyContent: 'space-between',
        alignItems: 'center',
        // padding:"15px"
    },
    form: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    content: {
        width: '100%',
        // height: 'calc(100% - 51px)'
        paddingTop: "10px !important",
        height: '318px',
        overflowY: "auto"
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
        marginBottom: "24px",
        alignItems: "center"
    },
    required_field: {
        color: "red"
    },

    leftWrapper: {
        width: "50%",
        flexGrow: 1,
        // marginRight: "45px"
    },
    wrapper: {
        width: "100%",
        display: "flex",
    },
    span: {
        display: "inline-block",
        verticalAlign: "middle",
        fontWeight: 600,
        fontSize: "0.75rem",
        color: "rgb(96, 96, 96)"
    },
    list: {
        fontSize: "12px",
        marginBottom: "20px",
    },
    actionBar: {
        margin: "5px 20px"
    },


}));



const Destination = props => {
    const classes = useStyles();
    const { onNext = null, onPrev = null, getReportSchedularList, modifyMode = false } = props;

    const [showParam, setShowParam] = React.useState("");

    const [inputData, setInputData] = React.useState(GetSchedulerActionInput);
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = React.useState({ msg: "", loading: true });

    const [normalStoreDialog, snackBar, globalSetting, scheduleState] = useSelector(state => {
        return [state.normalDialogState, state.snackbarState, state.globalSettings, state.createScheduleState];
    });

    useEffect(() => {
        setInputData({ ...scheduleState })
    }, [scheduleState])

    const { t } = useTranslation(globalSetting.locale_module)

    const onChangeHandler = (e) => {

        if (e.target.name === "file_option") {
            setInputData({ ...inputData, [e.target.name]: e.target.checked });
        }
        if (e.target.name === "destination_type" || e.target.name === "to" || e.target.name === "message" || e.target.name === "from" || e.target.name === "subject" || e.target.name === "drive_location" || e.target.name === "cc" || e.target.name === "folder_location") {
            if (e.target.name === "destination_type") {
                setShowParam(list_destination[parseInt(e.target.value)].label);
            }
            setInputData({ ...inputData, destination: { ...inputData.destination, [e.target.name]: e.target.value } });
        }
        else {
            setInputData({ ...inputData, [e.target.name]: e.target.value });
        }

    }


    const onCancel = () => {
        dispatch(ResetSchedule({ current_step: 1 }))
        normalStoreDialog.closeDialog();
    }
    const onPreviousHandler = event => {
        event.preventDefault();
        dispatch(CreateSchedule({ ...scheduleState, ...inputData, current_step: scheduleState.current_step - 1, }))

    }
    const verifyCredentials = () => {

        let data = {
            // ...inputData,
            opr: scheduleState.modifyMode ? '1' : '0',
            scheduler_list: scheduleState.modifyMode ? [scheduleState.scheduler_id] : [""],
            scheduler_property: scheduleState ? scheduleState.scheduler_property : {
                scheduler_title: "",
                user_id: "",
                description: "",
                created_date_time: "",
                scheduler_status: "",
                scheduler_state: "",
                start_date_time: "",
                next_run_time: ""
            },
            scheduler_type: "RS",
            report_instance_list: scheduleState ? scheduleState.selected_fields : [
                {
                    display_name: "",
                    chart_title: "",
                    chart_title_color: "",

                    instance_type: "R",
                    report_instance_id: "",
                    report_instance_name: "A_UserPicklist",
                    report_id: "41",
                    default_display: "",
                    refresh_interval: "",
                    alert_delay_interval: "10",
                    is_rule_defined: false,
                    input_fields: [{
                        field_name: "",
                        field_type: "",
                        field_input_value: ""
                    }
                    ],
                    rules: []
                }
            ],
            deleted_report_instances: scheduleState ? scheduleState.deleted_report_instances : [],
            recurrence: scheduleState ? scheduleState.recurrence : {
                occurrence: "OT",
                time_gap: 1,
                days: "A",
                hour_gap: "",
                hours: "00",
                minutes: "00",
                start_hour: "",
                start_minute: "",
                end_hour: "",
                end_minute: "",
                start_date: new Date(),
                end_date: "",
                week: "",
                week_days: "",
                month: "",
                description: "Occurs once on"
            },
            file_option: inputData.file_option,
            split_size: inputData.split_size,
            output_format: inputData.output_format,
            retry_interval: inputData.retry_interval,
            no_of_trials: inputData.no_of_trials,
            destination: {
                destination_type: inputData.destination.destination_type,
                folder_location: inputData.destination.folder_location,
                drive_location: inputData.destination.drive_location,
                from: inputData.destination.from,
                to: inputData.destination.to,
                cc: inputData.destination.cc,
                subject: inputData.destination.subject,
                message: inputData.destination.message
            }
        }
        SchedulertAction(data)
            .then(res => {
                if (res != null && res.status.maincode === "0") {
                    snackBar.openSnackbar(scheduleState.modifyMode ? "Schedule Modified Successfully" : "Schedule Added Successfully", "success");
                    setTimeout(() => setIsLoading(false), 200);
                    if (getReportSchedularList)
                        getReportSchedularList()
                    onCancel();

                }
                else {
                    snackBar.openSnackbar(res.status.errormsg, "error");
                    setTimeout(() => setIsLoading(false), 200);
                }
            })
            .catch(err => { });
    }
    const onSave = (e) => {
        e.preventDefault();
        verifyCredentials()
    }

    const actionButtonAddPageCommon = [{
        label: `${t('bam:LABEL_CANCEL')}`,
        action: onCancel,
        variant: "outlined",
        // color: "secondary",
        type: "button"
    },
    {
        label: `${t('bam:BUTTON_PREVIOUS')}`,
        action: onPreviousHandler,
        variant: "outlined",
        color: "primary",
        type: "button"
    },
    {
        label: `${t('bam:BUTTON_SAVE')}`,
        action: null,
        variant: "contained",
        color: "primary",
        type: "submit"
    },];

    const list_destination = [
        { value: 0, label: `${t('bam:OCURRENCE_EMAIL')}` },
        { value: 1, label: `${t('bam:OCURRENCE_LINKONEMAIL')}` },
        { value: 2, label: `${t('bam:OCURRENCE_HARDDRIVELOCATION')}` },
        { value: 3, label: `${t('bam:OCURRENCE_ARCHIVETOOMNIDOCS')}` },
    ];
    const list = [
        { value: "HTML", label: `${t('bam:HTML')}` },
        { value: "PDF", label: `${t('bam:PDF')}` },
        { value: "XLSX", label: `${t('bam:XLSX')}` },
        { value: "CSV", label: `${t('bam:CSV')}` },
        { value: "TXT", label: `${t('bam:TXT')}` }
    ]


    return (
        <form onSubmit={onSave} className={classes.form}>
            <div className={classes.root}>

                <DialogContent className={classes.content}>
                    <div className={classes.header}>
                        {/* <Paper className={classes.paper}> */}
                        <div className={classes.wrapper}>
                            <div className={classes.leftWrapper}>
                                <div className={classes.h6}>
                                    <label className={classes.list}>{t('bam:PROPERTIES')}</label>
                                </div>
                                <div className={classes.homeTab}>
                                    <SelectBox style={{ width: "100px" }}
                                        label={t('bam:SCHEDULER_OUTPUT_FORMAT')}
                                        name='output_format'
                                        list={list}
                                        value={inputData.output_format}
                                        labelMaxWidth="100px"
                                        labelMinWidth="100px"
                                        form={false}
                                        injectLiveValue
                                        onChange={onChangeHandler}
                                    />
                                    <span style={{ marginLeft: "24px" }}>
                                        <InputBox
                                            label={t('bam:SCHEDULER_NUMOFRETRY')}
                                            form={false}
                                            value={inputData.no_of_trials}
                                            type="number"
                                            labelMaxWidth="75px"
                                            labelMinWidth="75px"
                                            style={{ width: "72px" }}
                                            name='no_of_trials'
                                            onChangeHandler={onChangeHandler}
                                            injectLiveValue={true}
                                        />
                                    </span>
                                    <span style={{ marginLeft: "24px" }}>
                                        <InputBox
                                            label={t('bam:SCHEDULER_INTERVAL')}
                                            form={false}
                                            value={inputData.retry_interval}
                                            type="number"
                                            labelMaxWidth="90px"
                                            labelMinWidth="90px"
                                            style={{ width: "72px" }}
                                            name='retry_interval'
                                            onChangeHandler={onChangeHandler}
                                            injectLiveValue={true}
                                        />
                                    </span>

                                </div>
                                {(inputData.destination.destination_type === "0" || showParam === 'Email Reports') ?
                                    <div className={classes.homeTab}>
                                        <InputBox
                                            label={t('bam:SIZE')}
                                            form={false}
                                            value={inputData.split_size}
                                            type="number"
                                            labelMaxWidth="100px"
                                            labelMinWidth="100px"
                                            style={{ width: "72px" }}
                                            name='split_size'
                                            disabled={inputData.file_option !== "CS"}
                                            onChangeHandler={onChangeHandler}
                                            injectLiveValue={true}
                                        />
                                        <span className={classes.span} style={{ marginLeft: "5px" }}>{t('bam:KB')}</span>
                                        <span style={{ marginLeft: "40px" }}>
                                            <Checkbox name='file_option' value="C" onChange={onChangeHandler} />
                                            <span className={classes.span}>{t('bam:COMPRESSED')}</span>
                                        </span>
                                        <span style={{ marginLeft: "40px" }}>
                                            <Checkbox name='file_option' value="CS" onChange={onChangeHandler} />
                                            <span className={classes.span}>{t('bam:MAX_ZIP_SIZE')}</span>
                                        </span>
                                    </div> : null}
                                <div className={classes.h6}>
                                    <label className={classes.list}>{t('bam:SCHEDULER_DESTINATION')}</label>
                                </div>
                                <div className={classes.homeTab}>

                                    <SelectBox style={{ width: "140px" }}
                                        label={t('bam:SCHEDULER_DESTINATION')}
                                        name='destination_type'
                                        list={list_destination}
                                        value={inputData && inputData.destination && inputData.destination.destination_type}
                                        labelMaxWidth="100px"
                                        labelMinWidth="100px"
                                        form={false}
                                        injectLiveValue
                                        required={true}
                                        onChange={(e) => onChangeHandler(e)}
                                    />
                                </div>
                                {inputData.destination.destination_type === "2" || showParam === 'Hard Drive Location' ?
                                    <div className={classes.homeTab}>
                                        <InputBox
                                            label={t('bam:DRIVE_LOCATION')}
                                            form={false}
                                            value={inputData && inputData.destination && inputData.destination.drive_location}
                                            labelMaxWidth="100px"
                                            labelMinWidth="100px"
                                            style={{ width: "15rem" }}
                                            name='drive_location'
                                            onChangeHandler={onChangeHandler}
                                            injectLiveValue={true}
                                            required={true}
                                        />
                                    </div>
                                    : (inputData.destination.destination_type === "0" || inputData.destination.destination_type === "1" || showParam === 'Email Reports' || showParam === 'Email Notification') ?
                                        <div>
                                            <div className={classes.homeTab}>
                                                <InputBox
                                                    label={t('bam:SCHEDULER_FROM')}
                                                    form={false}
                                                    value={inputData && inputData.destination && inputData.destination.from}
                                                    labelMaxWidth="100px"
                                                    labelMinWidth="100px"
                                                    style={{ width: "15rem" }}
                                                    name='from'
                                                    type="email"
                                                    onChangeHandler={onChangeHandler}
                                                    injectLiveValue={true}
                                                    required={true}
                                                />
                                            </div>
                                            <div className={classes.homeTab}>
                                                <InputBox
                                                    label={t('bam:SCHEDULER_TO')}
                                                    form={false}
                                                    value={inputData && inputData.destination && inputData.destination.to}
                                                    labelMaxWidth="100px"
                                                    labelMinWidth="100px"
                                                    style={{ width: "15rem" }}
                                                    name='to'
                                                    type="email"
                                                    onChangeHandler={onChangeHandler}
                                                    injectLiveValue={true}
                                                    required={true}
                                                />
                                            </div>
                                            <div className={classes.homeTab}>
                                                <InputBox
                                                    label={t('bam:SCHEDULER_CC')}
                                                    form={false}
                                                    value={inputData && inputData.destination && inputData.destination.cc}
                                                    labelMaxWidth="100px"
                                                    labelMinWidth="100px"
                                                    style={{ width: "15rem" }}
                                                    name='cc'
                                                    type="email"
                                                    onChangeHandler={onChangeHandler}
                                                    injectLiveValue={true}
                                                    required={true}
                                                />
                                            </div>
                                            <div className={classes.homeTab}>
                                                <InputBox
                                                    label={t('bam:SCHEDULER_SUBJECT')}
                                                    name="subject"
                                                    form={false}
                                                    value={inputData && inputData.destination && inputData.destination.subject}
                                                    labelMaxWidth="100px"
                                                    labelMinWidth="100px"
                                                    style={{ width: "32.5rem" }}
                                                    onChangeHandler={onChangeHandler}
                                                    injectLiveValue={true}
                                                    required={true}
                                                />
                                            </div>
                                            <div className={classes.homeTab}>
                                                <InputBox
                                                    label={t('bam:SCHEDULER_MESSAGE')}
                                                    form={false}
                                                    name="message"
                                                    rows={3}
                                                    multiline={true}
                                                    value={inputData && inputData.destination && inputData.destination.message}
                                                    labelMaxWidth="100px"
                                                    labelMinWidth="100px"
                                                    style={{ width: "32.5rem" }}
                                                    onChangeHandler={onChangeHandler}
                                                    injectLiveValue={true}
                                                    required={true}
                                                />
                                            </div>
                                        </div>
                                        : <div className={classes.homeTab}>
                                            <InputBox
                                                label={t('bam:FOLDER_NAME')}
                                                form={false}
                                                name="folder_location"
                                                value={inputData && inputData.destination && inputData.destination.folder_location}
                                                labelMaxWidth="100px"
                                                labelMinWidth="100px"
                                                style={{ width: "15rem" }}
                                                onChangeHandler={onChangeHandler}
                                                injectLiveValue={true}
                                                required={true}
                                            />
                                        </div>}
                            </div>
                        </div>

                        {/* </Paper> */}
                    </div>

                </DialogContent>
                <DialogActions className={classes.actionBar}>
                    {actionButtonAddPageCommon.map((res, key) => <Button key={res.key} type={res.type} variant={res.variant} color={res.color} onClick={res.action}>
                        {res.label}
                    </Button>)}
                </DialogActions>

            </div>
        </form>

    );
}

export default Destination;