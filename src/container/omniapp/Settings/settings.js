import React, { Suspense, lazy, useState, useEffect } from 'react';
import {
    makeStyles, Paper, SelectBox, Button,
    Checkbox, FormControlLabel,useTranslation, Grid, Typography, Spinner
} from 'component'
import { useSelector } from 'react-redux';
import { ActCache } from 'global/omniapp/api/ApiMethods';
const MultilingualDefinition = lazy(() => import('container/omniapp/MultilingualDefinition/multilingual_definition'))
const ProxyConfiguration = lazy(() => import('container/omniapp/ProxyConfiguration/proxy_configuration'))
const ExportImportConfiguration = lazy(() => import('container/omniapp/ExportImportConfiguration/export_import_configuration'))

const useStyles = makeStyles(theme => (
    {
        paper: {
            width: "100%",
            minHeight: '509px',
            padding: theme.spacing(2),
            textAlign: 'center',
            marginBottom: theme.spacing(2),
            flexGrow: 1,
            position: 'relative'
        },
        formControllabel: {
            width: "auto"
        },
        labelTypography: {
            marginRight: "3rem",
            fontWeight: 600,
            color: "#606060"
        },
        labelLink: {
            fontWeight: 600,
            color: "#0072C6",
            cursor: "pointer",
            textDecoration: "underline"
        },
        selectBox: {
            width: 200,
            marginLeft: "5.75rem"
        },
        outlinedPrimary: {
            color: theme.palette.primary.main,
            border: `1px solid ${theme.palette.primary.main}`,
            whiteSpace:"noWrap"
        }
    }
))

const Settings = () => {

    const classes = useStyles()
    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])
    const normalDialogStore = useSelector(state => state.normalDialogState);

    const snackbarStore = useSelector(state => {
        return state.snackbarState;
    });

    const [developmentMode, setDevelopmentMode] = useState(false);

    const openDialogBoxFromStore = (component) => {
        normalDialogStore.openDialog(
            <Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}>{component}</Suspense>,
            `${t('omniapp:MULTILINGUAL_DEFINITION')}`        )
    }

    const clearAppCache = () => {
        const payload = {
            opr: "2"
        }
        ActCache(JSON.stringify(payload))
            .then(res => {
                if (res != null && res.status.maincode === "0") {
                    const description = res.status.description ? res.status.description : 'Success';
                    snackbarStore.openSnackbar(description, 'success', 3000);
                }
            })
            .catch(err => {
                snackbarStore.openSnackbar('Something went wrong,Please contact Admin.', 'error', 3000);
            })
    }

    const setDevMode = (event) => {
        const dev_mode = event.target.checked;
        const payload = {
            opr: "1",
            dev_mode: dev_mode
        }
        ActCache(JSON.stringify(payload))
            .then(res => {
                if (res != null && res.status.maincode === "0") {
                    const description = res.status.description ? res.status.description : 'Success';
                    setDevelopmentMode(dev_mode);
                    snackbarStore.openSnackbar(description, 'success', 3000);
                } else if (res != null) {
                    const description = res.status.description ? res.status.description : 'Error';
                    snackbarStore.openSnackbar(description, 'error', 3000);
                } else {
                    snackbarStore.openSnackbar('Something went wrong,Please contact Admin.', 'error', 3000);
                }
            })
            .catch(err => {
                console.log(err)
                snackbarStore.openSnackbar('Something went wrong,Please contact Admin.', 'error', 3000);
            })
    }

    return <div style={{ backgroundColor: "#FFFFFF" }}>
        <Paper className={classes.paper}>
            <Grid item container direction="column" spacing={2} alignItems="flex-start">
                <Grid item>
                    <Button variant="outlined" className={classes.outlinedPrimary} onClick={() => openDialogBoxFromStore(<ProxyConfiguration />)} style={{ height: 24, width: 136 }}>
                       {t('omniapp:PROXY_CONFIGURATION')}
                        </Button>
                    <Button variant="outlined" className={classes.outlinedPrimary} onClick={() => openDialogBoxFromStore(<ExportImportConfiguration />)} style={{ marginLeft: "1rem", height: 24, width: 183 }}>
                     {t('omniapp:EXPORT_IMPORT_CONFIGURATION')}
                        </Button>
                    <Button variant="outlined" className={classes.outlinedPrimary} onClick={() => openDialogBoxFromStore(<MultilingualDefinition />)} style={{ marginLeft: "1rem", height: 24, width: 148 }}>
                    {t('omniapp:MULTILINGUAL_DEFINITION')}
                        </Button>
                </Grid>
                <Grid item container direction="column" spacing={1} alignItems="flex-start" justify="flex-start">
                    <Grid item>
                        <Typography style={{ color: "#606060" }}>{t('omniapp:DEVELOPMENT_OPTIONS')}:</Typography>
                    </Grid>
                    <Grid item>
                        <FormControlLabel
                            classes={{ labelPlacementStart: classes.formControllabel, label: classes.labelTypography }}
                            control={<Checkbox color="primary" checked={developmentMode} onChange={setDevMode} />}
                            label= {t('omniapp:DEVELOPMENT_MODE')}
                            labelPlacement="start"
                        />
                    </Grid>
                    <Grid item>
                        <Typography className={classes.labelTypography} style={{ display: "inline-block", marginRight: "1.75rem" }}> {t('omniapp:CACHE_APP_DATA')}</Typography>
                        <Typography className={classes.labelLink} onClick={clearAppCache} style={{ display: "inline-block" }} > {t('omniapp:CLEAR_DATA')}</Typography>
                    </Grid>
                </Grid>
                <Grid item container direction="column" spacing={1} alignItems="flex-start" justify="flex-start" style={{ marginTop: "2rem" }}>
                    <Grid item>
                        <Typography style={{ color: "#606060" }}>{t('omniapp:SET_THEME_PREFERENCES')}:</Typography>
                    </Grid>
                    <Grid item container style={{ marginTop: "0.5rem" }}>
                        <Grid item>
                            <SelectBox
                                onChangeHandler={() => console.log('Selected')}
                                className={classes.selectBox}
                                value={"Professional"}
                                list={[{ value: "Professional", label: "Professional" }]}
                                label={t('omniapp:THEME_NAME')}
                                name="application"
                                form={false}
                                labelMinWidth="75px"
                                labelMaxWidth="78px"
                            />
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" style={{ marginLeft: "1rem", height: 24, width: 99 }}>
                               {t('omniapp:APPLY_THEME')}
                        </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    </div>
}

export default Settings