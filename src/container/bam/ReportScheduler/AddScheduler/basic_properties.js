import React, { useEffect, useState } from "react";
import { InputBox, useTranslation, makeStyles, Button, Typography, DialogActions, Spinner } from "component";
import { useSelector, useDispatch } from "react-redux";
import { CreateSchedule } from "redux/action";
import { AuthenticateUser, GetSchedulerDefinition } from "global/bam/api/ApiMethods";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: `18px 25px`,
        height: '70%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    input_width: {
        width: "240px",
    },
    space: {
        marginBottom: "24px",
        '& .MuiInputBase-inputMultiline': {
            padding: 0
        },
        '& .MuiInputBase-marginDense': {
            padding: 0
        },

    },
    spinner: {
        height: '300px',
        width: '822px',
    },
    form: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    }
}))
const BasicProperties = props => {
    const { onNext = null, onPrev = null, onCancel = null } = props;
    const classes = useStyles();
    const dispatch = useDispatch()

    const [globalSetting, scheduleState] = useSelector(state => {
        return [state.globalSettings, state.createScheduleState];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    const [isLoading, setIsLoading] = useState({ msg: "", loading: false });
    const { loading } = isLoading;

    const verifyCredentials = () => {

        let payload = {
            "scheduler_name": state && state.scheduler_title,
            "application_info": "",
            "scheduler_type": "RS",
            "modify_flag": "N",
            "participant": {
                "name": state && state.user_id,
                "password": state && state.password,
                "scope": "ADMIN",
                "user_exist": "N",
                "participant_type": "U"
            }
        }
        setIsLoading({ ...isLoading, loading: true });

        AuthenticateUser(payload)
            .then(res => {
                if (res != null && res.status.maincode === "0") {
                    scheduleState.scheduler_property = state;
                    // dispatch(CreateSchedule({ ...scheduleState, ...state, current_step: 2 }))
                    dispatch(CreateSchedule({ ...scheduleState, current_step: 2 }))
                    snackbarState.openSnackbar("Authentication Successfull", "success");
                    setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
                    // onNext();
                }
                else {
                    snackbarState.openSnackbar(res.status.errormsg, 'error');
                    setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 300);

                }
            }
            ).catch(err => { });


    }

    const snackbarState = useSelector(store => store.snackbarState);

    const onNextHandler = (e) => {
        e.preventDefault();
        verifyCredentials()

    }
    const actionButtonAddPageCommon = [{
        label: `${t('bam:LABEL_CANCEL')}`,
        action: onCancel,
        variant: "outlined",
        color: "secondary",
        type: "button"
    },

    {
        label: `${t('bam:BUTTON_NEXT')}`,
        action: null,
        variant: "contained",
        color: "primary",
        type: "submit"
    },];

    const [state, setState] = useState(scheduleState.scheduler_property);
    useEffect(() => {
        if (scheduleState && scheduleState.scheduler_id != null) {
            getSchedulertDefinition();
        }
    }, [scheduleState.scheduler_id])


    const getSchedulertDefinition = () => {
        setIsLoading({ ...isLoading, loading: true });

        GetSchedulerDefinition({
            scheduler_id: scheduleState && scheduleState.scheduler_id
        })
            .then(res => {
                if (res != null && res.status.maincode === '0') {
                    setState(res.data.scheduler_property);
                    dispatch(CreateSchedule({ ...scheduleState, ...res.data, modifyMode: true }))
                    setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
                }
            })
            .catch(err => { })
    }
    const handleChange = event => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        })
    }

    return <form onSubmit={onNextHandler} className={classes.form}>
        {loading ? <div className={classes.spinner}>
            <Spinner />
        </div> : <div className={classes.root}>
            <Typography variant="subtitle1" gutterBottom>{t('bam:SCHEDULER_DETAILS')}</Typography>
            <div className={classes.space}>
                <InputBox
                    form={false}
                    required={true}
                    label={t('bam:SCHEDULER_TITLE')}
                    name="scheduler_title"
                    labelMaxWidth="120px"
                    labelMinWidth="120px"
                    injectLiveValue={true}
                    value={state && state.scheduler_title}
                    className={classes.input_width}
                    onChange={handleChange}
                    disabled={scheduleState.scheduler_id != null ? true : false}

                /></div>
            <div className={classes.space}>
                <InputBox
                    form={false}
                    required={false}
                    multiline={true}
                    labelMaxWidth="120px"
                    labelMinWidth="120px"
                    rows={3}
                    label={t('bam:SCHEDULER_DESCRIPTION')}
                    name="description"
                    injectLiveValue={true}
                    value={state && state.description}
                    className={classes.input_width}
                    onChange={handleChange}
                    disabled={scheduleState.scheduler_id != null ? true : false}

                />
            </div>
            <Typography variant="subtitle1" gutterBottom>{t('bam:CREDENTIAL_FOR_SECURE')}</Typography>
            <div className={classes.space}>
                <InputBox
                    form={false}
                    required={true}
                    label={t('bam:SCHEDULER_USER')}
                    labelMaxWidth="120px"
                    labelMinWidth="120px"
                    value={state && state.user_id}
                    className={classes.input_width}
                    name="user_id"
                    onChange={handleChange}
                /></div>
            <div className={classes.space}>
                <InputBox
                    form={false}
                    required={true}
                    type="password"
                    label={t('bam:PASSWORD')}
                    labelMaxWidth="120px"
                    labelMinWidth="120px"
                    name="password"
                    className={classes.input_width}
                    onChange={handleChange}
                />
            </div>
        </div>}
        <DialogActions>
            {actionButtonAddPageCommon.map((res, key) => <Button key={res.key} type={res.type} variant={res.variant} color={res.color} onClick={res.action}>
                {res.label}
            </Button>)}
        </DialogActions>
    </form>

}

export default BasicProperties;
