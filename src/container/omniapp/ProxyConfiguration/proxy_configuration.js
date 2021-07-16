import React, { useState } from 'react';
import {
    DialogContent, DialogTitle, makeStyles,
    Checkbox, Grid, FormControlLabel, InputBox,useTranslation, Button, DialogActions
} from 'component';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => (
    {
        formControllabel: {
            width: "auto"
        },
        labelTypography: {
            width: "142px",
            fontWeight: 600,
            color: "#606060"
        },
        inputBox: {
            // marginLeft: "2rem",
            "& .MuiInputBase-input": {
                width: 257
            }
        },
        dialogActionsRoot: {
            paddingRight: 24,
            paddingBottom: 16
        },
        title: {
            paddingBottom: 0
        }
    }
)
)

const ProxyConfiguration = (props) => {

    const classes = useStyles();
    const [proxyEnabled, setProxyEnabled] = useState(false);
    const [authenticationRequired, setAuthenticationRequired] = useState(false);
    const normalDialogStore = useSelector(state => state.normalDialogState);
    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])
    const [proxyFormData, setProxyFormData] = useState({
        proxyIPAddress: '',
        proxyPort: '',

    })

    const [userFormData, setUserFormData] = useState({
        proxyUserId: '',
        password: ''
    })

    const handleChange = event => {
        const name = event.target.name;
        setProxyFormData({
            ...proxyFormData,
            [name]: event.target.value
        })

        if (authenticationRequired) {
            setUserFormData({
                ...userFormData,
                [name]: event.target.value
            })
        }
    }
    const handleSubmit = () => {
        console.log({ ...userFormData, ...proxyFormData })
    }
    return (<div>
        <DialogTitle classes={{ root: classes.title }}>{t('omniapp:PROXY_CONFIGURATION')}</DialogTitle>
        <DialogContent>
            <Grid container direction="column" spacing={1}>
                <Grid item>
                    <FormControlLabel
                        value={proxyEnabled}
                        classes={{ labelPlacementStart: classes.formControllabel, label: classes.labelTypography }}
                        control={<Checkbox color="primary" onClick={() => setProxyEnabled(!proxyEnabled)} />}
                        label={t('omniapp:PROXY_ENABLED')}
                        labelPlacement="start"
                    />
                </Grid>
                <Grid item>
                    <InputBox
                        onChangeHandler={handleChange}
                        className={classes.inputBox}
                        value={proxyFormData.proxyIPAddress}
                        labelMinWidth="152px"
                        labelMaxWidth="152px"
                        label={t('omniapp:PROXY_IP')}
                        type="text"
                        form={false}
                        disabled={(proxyEnabled) ? false : true}
                        name="proxyIPAddress"
                    />
                </Grid>
                <Grid item>
                    <InputBox
                        onChangeHandler={handleChange}
                        className={classes.inputBox}
                        value={proxyFormData.proxyPort}
                        labelMinWidth="152px"
                        labelMaxWidth="152px"
                        label={t('omniapp:PROXY_PORT')}
                        disabled={(proxyEnabled) ? false : true}
                        type="text"
                        form={false}
                        name="proxyPort"
                    />
                </Grid>
                <Grid item>
                    <FormControlLabel
                        value={authenticationRequired}
                        classes={{ labelPlacementStart: classes.formControllabel, label: classes.labelTypography }}
                        control={<Checkbox color="primary" onClick={() => setAuthenticationRequired(!authenticationRequired)} />}
                        label={t('omniapp:PROXY_AUTHENTICATION_REQUIRED')}
                        labelPlacement="start"
                    />
                </Grid>
                <Grid item>
                    <InputBox
                        onChangeHandler={handleChange}
                        className={classes.inputBox}
                        value={userFormData.proxyUserId}
                        labelMinWidth="152px"
                        labelMaxWidth="152px"
                        disabled={(authenticationRequired && proxyEnabled) ? false : true}
                        label={t('omniapp:PROXY_USER_ID')}
                        type="text"
                        form={false}
                        name="proxyUserId"
                    />
                </Grid>
                <Grid item>
                    <InputBox
                        onChangeHandler={handleChange}
                        className={classes.inputBox}
                        value={userFormData.password}
                        labelMinWidth="152px"
                        labelMaxWidth="152px"
                        disabled={(authenticationRequired && proxyEnabled) ? false : true}
                        label={t('omniapp:PASSWORD')}
                        type="password"
                        form={false}
                        name="password"
                    />
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions classes={{ root: classes.dialogActionsRoot }}>
            <Button variant="outlined" onClick={() => normalDialogStore.closeDialog()} color="primary" style={{ width: "62px", height: "24px" }}>
            {t('omniapp:LABEL_CANCEL')}
                </Button>
            <Button variant="contained" onClick={() => handleSubmit} color="primary" style={{ width: "47px", height: "24px" }}>
            {t('omniapp:SAVE')}
            </Button>
        </DialogActions>
    </div>)
}

export default ProxyConfiguration