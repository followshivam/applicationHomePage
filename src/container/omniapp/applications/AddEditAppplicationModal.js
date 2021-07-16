import React, { useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { InputBox } from "component/Form";
import { ReactReduxContext, useSelector } from "react-redux";
import { ActApp, GetConfig } from 'global/omniapp/api/ApiMethods'

import {
    Spinner, Button, Typography, DialogActions,
    DialogContent, useTranslation, DialogTitle, Radio, RadioGroup, FormControlLabel, FormControl, Checkbox, IconImage
} from 'component';
import AdvanceCombo from 'component/GenericComponet/AdvanceCombo';

const useDailogStyles = makeStyles((theme) => ({
    paper: {
        borderRadius: '4px',
        width: '421px',
        height: '420px',
    },
    header: {
        // display: 'flex',
        width: '100%',
        // borderBottom: `1px solid ${theme.palette.backgroundContainer}`,
        justifyContent: 'space-between',
        alignItems: 'center',
        // padding:"15px"
    },
    dir: {
        direction: props => props.direction
    },
    spacing: {
        padding: theme.spacing(1, 3, 2, 1),
        alignItems: 'stretch',
        borderTop: "1px solid #e0e0e0"
    },
    title: {
        padding: theme.spacing(2, 2, 1, 2),
        fontWeight: '600 !important',
    },
    form: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        height: '100%'
    },
    dividers: {
        borderBottom: 'none',
        width: "700px",
        height: props => props?.values?.app_location === "2" ? "350px" : "220px"
    },
    checkboxRoot: {
        '& .MuiCheckbox-root': {
            paddingLeft: theme.spacing(7)
        },
        '& .MuiTypography-root': {
            flexBasis: '140px'
        },
        '& .MuiFormControlLabel-label': {
            marginLeft: props => props.direction === "ltr" ? "85px" : "90px"
        },
        '& .MuiSvgIcon-fontSizeSmall': {
            fontSize: "1rem"
        }
    }
}));

function AddEditAppplicationModal(props) {
    const { handleClose, modalType, contextData, data } = props;
    const [isLoading, setIsLoading] = React.useState({ msg: "", loading: false });
    const { loading, msg } = isLoading;
    const snackbarState = useSelector(store => store.snackbarState);
    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])
    const [values, setvalues] = React.useState({
        app_name: '',
        ssl_secured: '',
        app_location: "1",
        app_domain: '',
        app_port: '',
        app_context: ''
    })
    const [direction] = React.useState(`${t('bam:HTML_DIR')}`)

    const classes = useDailogStyles({ values, direction });

    useEffect(() => {
        if (data != undefined) {
            setvalues({
                app_id: data.app_id,
                app_name: data.name,
                ssl_secured: data.ssl_secured === "Y" ? true : false,
                app_location: data.app_loc,
                app_domain: data.app_domain,
                app_port: data.app_port,
                app_context: data.app_context
            })
        }
    }, [])

    const onClear=()=>{
        setvalues({...values,app_context:""})
    }
    const handleSubmit = (event) => {
        setIsLoading({ ...isLoading, loading: true });
        event.preventDefault();

        let obj = {
            opr: (data != undefined) ? '2' : '1'
        }

        if (values.app_location === "1") {
            obj = {
                ...obj,
                app_name: values.app_name,
                app_location: values.app_location,
                app_context: values.app_context
            }
        } else {
            obj = {
                ...obj,
                app_name: values.app_name,
                ssl_secured: values.ssl_secured,
                app_location: values.app_location,
                app_domain: values.app_domain,
                app_port: values.app_port,
                app_context: values.app_context
            }
        }

        if (data == undefined) {
            GetConfig()
                .then(res => {
                    if (res.status.maincode === "0") {
                        obj = {
                            ...obj,
                            app_code: res.data.app_code,
                        }
                        actAppHandler(obj)
                    }
                })
                .catch(err => console.log("Error While Calling GetConfig : ", err))
        } else
            actAppHandler({ ...obj, app_id: data.app_id })

        // return false;
    }

    const actAppHandler = (param) => {
        ActApp(param)
            .then((res) => {
                if (res && res.status.maincode === "0") {
                    console.log("in")
                    if (res.data.operation === "register") {
                        console.log("in--if")
                        handleClose();
                        props.onSuccessCallback();
                        setIsLoading({ ...isLoading, loading: false });
                        snackbarState.openSnackbar(`Successfully added ${param.app_name}`, 'success');
                    } else {

                        handleClose();
                        console.log("in--esl")

                        props.onSuccessCallback();
                        setIsLoading({ ...isLoading, loading: false });
                        snackbarState.openSnackbar(`Successfully updated ${param.app_name}`, 'success');
                        console.log("in-ifesle")

                    }
                } else {
                    setIsLoading({ ...isLoading, loading: false });
                    snackbarState.openSnackbar(res != null ? res.status.description : "Something Went Wrong", 'warning', 5000);
                    console.log("in-else")

                }
            })
            .catch((err) => { console.log("in-catch") })
    }
    const ref = useRef(null)

    return (
        <div className={classes.dir}>
            <form className={classes.form} onSubmit={handleSubmit}>

                <DialogTitle>
                    <div className={classes.header}>
                        <div className={classes.headerTitle}>
                            <Typography variant="h6"><strong>{modalType === 'EDIT' ? t('omniapp:EDIT_APPLICATION') : t('omniapp:ADD_APPLICATION')}</strong></Typography>
                        </div>

                    </div>

                </DialogTitle>
                <DialogContent dividers className={classes.dividers} style={{overflowY: "inherit"}}>
                    {/* ! Location control */}
                    <FormControl style={{
                        display: 'flex', alignItems: 'center',
                        flexDirection: 'row', paddingBottom: '14px',
                    }}>
                        <Typography >{t('omniapp:LOCATION')}</Typography>
                        <RadioGroup style={{ margin: direction === "ltr" ? "0 0 0 115px" : "0 80px 0 0" }} row aria-label="location" name="app_location" value={values.app_location} onChange={(e) => setvalues({ ...values, app_location: e.target.value })} defaultValue="1">
                            <FormControlLabel value="1" control={<Radio color="primary" />} label={t('omniapp:OMNIAPP_SERVER')} />
                            <FormControlLabel value="2" control={<Radio color="primary" />} label={t('omniapp:OTHER_SERVER')} />
                        </RadioGroup>
                    </FormControl>

                    <div style={{ paddingBottom: '20px' }}>
                        <InputBox
                            label={t('omniapp:APPLICATION_NAME')}
                            name={"app_name"}
                            required={true}
                            value={values.app_name}
                            injectLiveValue={true}
                            form={false}
                            direction={`${t('bam:HTML_DIR')}`}
                            onChangeHandler={(e) => setvalues({ ...values, app_name: e.target.value })}
                            labelMaxWidth="160px"
                            labelMinWidth={'160px'}
                            style={{ width: '440px' }}
                            fontWeight='300'
                            disabled={values?.app_id != null ? true : false}
                        />
                        <span style={{ fontSize: "10px", color: "#606060", margin: direction === "rtl" ? "0 120px 0 0" : "0 0 0 160px" }}>Enter full name. Do not use short name like BAM, BRMS.</span>
                    </div>
                    {
                        values.app_location === "2"
                        &&
                        <>
                            <div style={{ paddingBottom: '24px' }}>
                                <InputBox
                                    label={t('omniapp:APPLICATION_DOMAIN')}
                                    name={"app_domain"}
                                    required={true}
                                    value={values.app_domain}
                                    injectLiveValue={true}
                                    form={false}
                                    direction={`${t('bam:HTML_DIR')}`}
                                    info={true}
                                    onChangeHandler={(e) => setvalues({ ...values, app_domain: e.target.value })}
                                    labelMaxWidth="160px"
                                    labelMinWidth={'160px'}
                                    style={{ width: '440px' }}
                                    fontWeight='300'
                                />
                            </div>
                            <div style={{ paddingBottom: '24px' }}>
                                <InputBox
                                    label={t('omniapp:APPLICATION_PORT')}
                                    name={"app_port"}
                                    value={values.app_port}
                                    injectLiveValue={true}
                                    required={true}
                                    direction={`${t('bam:HTML_DIR')}`}
                                    form={false}
                                    info={true}
                                    onChangeHandler={(e) => setvalues({ ...values, app_port: e.target.value })}
                                    labelMaxWidth="160px"
                                    labelMinWidth={'160px'}
                                    style={{ width: '440px' }}
                                    fontWeight='300'
                                />
                            </div>
                        </>
                    }

                    <div style={{ paddingBottom: '15px', width: "600px", display: "flex" }}>
                        {/* <InputBox
                            label={t('omniapp:APPLICATION_CONTEXT')}
                            name={"app_context"}
                            value={values.app_context}
                            injectLiveValue={true}
                            required={true}
                            direction={`${t('bam:HTML_DIR')}`}
                            form={false}
                            info={true}
                            onChangeHandler={(e) => setvalues({ ...values, app_context: e.target.value })}
                            labelMaxWidth="160px"
                            labelMinWidth={'160px'}
                            style={{ width: '440px' }}
                            fontWeight='300'
                        /> */}
                        <AdvanceCombo
                            ref={ref}
                            direction={`${t('bam:HTML_DIR')}`}
                            value={values?.app_context}
                            onClearHandler={onClear}
                            info={true}
                            items={contextData}
                            onSelectHandler={(e) => setvalues({ ...values, app_context: e?.label })}
                            labelData={{
                                label: `${t("omniapp:APPLICATION_CONTEXT")}`,
                                minWidth: "160px",
                                maxWidth: "160px",
                                fontSize: "12px",
                                fontColor: "rgb(96 96 96)",
                            }}
                        />
                    </div>

                    {/* {
                        values.app_location === "2"
                        && */}
                    <FormControlLabel classes={{ root: classes.checkboxRoot }}
                        control={
                            <Checkbox
                                name="ssl_secured"
                                checked={values.ssl_secured}
                                onChange={(e) => setvalues({ ...values, ssl_secured: e.target.checked })}
                            />
                        }
                        label={t('omniapp:SSL_SECURED')}
                        labelPlacement="start"
                    />
                    {/* } */}

                </DialogContent>
                <DialogActions className={classes.spacing}>
                    <Button style={{ marginLeft: direction === 'rtl' ? "8px" : 0 }} onClick={handleClose} variant="outlined">{t('omniapp:LABEL_CANCEL')}</Button>
                    <Button type="submit" variant="contained" color="primary" style={{ width: '60px', whiteSpace: 'nowrap' }}>
                        {modalType === "EDIT" ? `${t('omniapp:SAVE')}` : 'Register'}
                    </Button>

                </DialogActions>
            </form>
        </div>
    )
}

export default AddEditAppplicationModal