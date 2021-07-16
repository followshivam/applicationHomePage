import React, { useEffect, useState } from "react";
import { InputBox, makeStyles, Button, Typography, DialogActions, useTranslation } from "component";
import { useSelector, useDispatch } from "react-redux";
import { CreateTrend } from "redux/action";
import { AuthenticateUser } from "global/bam/api/ApiMethods";
import { responsiveFontSizes } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
    root: {
        margin: `0px ${theme.spacing(2)}px`,
        height: '70%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    input_width: {
        width: "240px"
    },
    form: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    }
}))
const TrendsProperties = props => {
    const { onNext = null, onPrev = null, onCancel = null } = props
    const classes = useStyles();
    const dispatch = useDispatch()


    const [globalSetting, trendState, snackbarState] = useSelector(state => {
        return [state.globalSettings, state.createTrendsState, state.snackbarState];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    const [state, setState] = useState({ isLoading: true });
    useEffect(() => {
        setState({ isLoading: false, scheduler_property: { ...trendState.scheduler_property } })
    }, [trendState])


    const onNextHandler = (e) => {
        e.preventDefault();

        let payload = {
            "scheduler_name": state.scheduler_property.instance_title,
            "scheduler_type": "TA",
            "modify_flag": trendState.modifyMode ? "Y" : "N",
            "application_info": "",
            "participant": {
                "name": state.scheduler_property.user_id,
                "password": state.scheduler_property.password,
                "scope": "ADMIN",
                "user_exist": "N",
                "participant_type": "U"
            }
        }

        AuthenticateUser(payload).then((response) => {
            if (response != null && response.status != null && response.status.maincode === "0") {
                trendState.scheduler_property = state.scheduler_property;
                snackbarState.openSnackbar(`${t('bam:AUTHENTICATED_SUCCESS')}`, 'Success')
                dispatch(CreateTrend(trendState));
                onNext();
            }
            else if (response != null && response.status != null && response.status.maincode !== "0") {
                snackbarState.openSnackbar(`${response.status.errormsg}`, 'warning')
            }
            else {
                snackbarState.openSnackbar(`${t('bam:WENT_WRONG_ERROR')}`, 'error')
            }
        })

    }
    const actionButtonAddPageCommon = [{
        label: `${t('bam:LABEL_CANCEL')}`,
        action: onCancel,
        variant: "outlined",
        color: "secondary",
        type: "button"
    },
    {
        label: `${t('bam:BUTTON_PREVIOUS')}`,
        action: onPrev,
        variant: "outlined",
        color: "primary",
        type: "button"
    },
    {
        label: `${t('bam:BUTTON_NEXT')}`,
        action: null,
        variant: "contained",
        color: "primary",
        type: "submit"
    },]



    const handleChange = event => {
        setState({
            ...state,
            scheduler_property: {
                ...state.scheduler_property,
                [event.target.name]: event.target.value.trim(),
            }
        })
    }

    return <form onSubmit={onNextHandler} className={classes.form}>
        {state.isLoading === false ?
            <div style={{ width: '100%', height: '100%' }}>
                <div className={classes.root}>
                    <Typography variant="subtitle1" gutterBottom>{t('bam:TREND_DETAILS')}:</Typography>
                    <InputBox
                        form={false}
                        required={true}
                        label={t('bam:TREND_NAME')}
                        name="instance_title"
                        value={state.scheduler_property.instance_title}
                        className={classes.input_width}
                        onChange={handleChange}
                        disabled={trendState != null && trendState.modifyMode}
                    />
                    <InputBox
                        form={false}
                        required={false}
                        multiline={true}
                        rows={5}
                        label={t('bam:DESCRIPTION')}
                        name="description"
                        value={state.scheduler_property.description}
                        className={classes.input_width}
                        onChange={handleChange}
                    />

                    <Typography variant="subtitle1" gutterBottom>{t('bam:CREDENTIAL_FOR_SECURE')}</Typography>
                    <InputBox
                        form={false}
                        required={true}
                        label={t('bam:TREND_USER')}
                        value={state.scheduler_property.user_id}
                        className={classes.input_width}
                        name="user_id"
                        onChange={handleChange}
                    />
                    <InputBox
                        form={false}
                        required={true}
                        type="password"
                        label={t('bam:PASSWORD')}
                        name="password"
                        value={state.scheduler_property.password}
                        className={classes.input_width}
                        onChange={handleChange}
                    />

                </div>

            </div>

            : null}
        <DialogActions>
            {actionButtonAddPageCommon.map((res, key) => <Button key={res.key} type={res.type} variant={res.variant} color={res.color} onClick={res.action}>
                {res.label}
            </Button>)}
        </DialogActions>
    </form>

}

export default TrendsProperties;
//     <DialogActions>
//  {actionButtonAddPageCommon.map(res => (
//                         <Button key={res.label}
//                             variant={res.variant}
//                             color={res.color}
//                             onClick={res.action}>
//                             {res.label}
//                         </Button>))}

//                 {/*stepNumber === 0 ?
//                     actionButtonLandingPage.map(res => (
//                         <Button  key={res.label}
//                             variant={res.variant}
//                             color={res.color}
//                             onClick={res.action}>
//                             {res.label}
//                         </Button>
//                     ))
//                     : actionButtonAddPageCommon.map(res => (
//                         <Button key={res.label}
//                             variant={res.variant}
//                             color={res.color}
//                             onClick={res.action}>
//                             {res.label}
//                         </Button>
//                     ))*/}
//             </DialogActions>