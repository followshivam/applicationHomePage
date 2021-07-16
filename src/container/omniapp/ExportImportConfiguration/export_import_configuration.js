import React, { useState } from 'react';
import {
    DialogContent, DialogTitle, makeStyles,
    Checkbox, Grid, FormControlLabel, InputBox,useTranslation, Button, DialogActions, Typography, AlertBox
} from 'component';
import { useSelector } from 'react-redux';
import { ExportImportConfig } from 'global/omniapp/api/ApiMethods';

const useStyles = makeStyles(theme => (
    {
        formControllabel: {
            width: "auto"
        },
        labelTypography: {
            // width: "142px",
            fontWeight: 600,
            color: "#606060"
        },
        labelTypography: {
            // width: "142px",
            fontWeight: 600,
            color: "#606060"
        },
        checkboxLabelRoot: {
            marginRight: 0
        },
        inputBox: {
            // marginLeft: "2rem",
            "& .MuiInputBase-input": {
                width: 349
            }
        },
        labelLink: {
            fontWeight: 600,
            color: "#0072C6",
            cursor: "pointer",
            textDecoration: "underline"
        },
        dialogActionsRoot: {
            paddingRight: 16,
            paddingBottom: 16
        }
    }
)
)


const ExportImportConfiguration = () => {

    const classes = useStyles();

    const [key, setKey] = useState();

    const [deletePreviousConfiguration, setDeletePreviousConfiguration] = useState(false)

    const handleSubmit = () => {

    }
    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])
    const snackbarStore = useSelector(state => {
        return state.snackbarState;
    });

    const normalDialogStore = useSelector(state => state.normalDialogState);

    const exportConfiguration = () => {

        const payload = {
            opr: "1"
        }
        ExportImportConfig(JSON.stringify(payload))
            .then(res => {
                console.log(res)
                if (res != null && res.status.maincode === "0") {
                    const data = res.data
                    setKey(data.key)
                    const description = res.status.description ? res.status.description : "Success";
                    snackbarStore.openSnackbar(description, "success", 3000)
                }
                else {
                    const description = res.status.description ? res.status.description : "Error";
                    snackbarStore.openSnackbar(description, "error", 3000)
                }
            })
            .catch(err => {
                console.log(err)
                snackbarStore.openSnackbar('Something went wrong. Please contact Admin.', "error", 3000)
            })

    }

    const importConfiguration = () => {
        const payload = {
            opr: "2",
            delete_prev: deletePreviousConfiguration ? "Y" : "N",
            key: key
        }
        ExportImportConfig(JSON.stringify(payload))
            .then(res => {
                console.log(res)
                if (res != null && res.status.maincode === "0") {
                    const description = res.status.description ? res.status.description : "Success";
                    snackbarStore.openSnackbar(description, "success", 3000)
                }
                else {
                    const description = res.status.description
                    snackbarStore.openSnackbar(description, "error", 3000)
                }
            })
            .catch(err => {
                console.log(err)
                snackbarStore.openSnackbar('Something went wrong. Please contact Admin.', "error", 3000)
            })

    }

    return <div>
        <DialogTitle>{t('omniapp:EXPORT_IMPORT_CONFIGURATION')}</DialogTitle>
        <DialogContent style={{ marginLeft: "1rem" }}>
            <Grid item container direction="column" spacing={2}>
                <Grid item container direction="row" justify="space-between" >
                    <Grid item>
                        <Typography className={classes.labelTypography}>{t('omniapp:EXPORT_CONFIG')}</Typography>
                    </Grid>
                    <Grid item>
                        <Button onClick={exportConfiguration} >
                            <Typography className={classes.labelLink} >{t('omniapp:EXPORT')}</Typography>
                        </Button>
                    </Grid>
                </Grid>
                <Grid item container direction="row" justify="space-between" >
                    <Grid item>
                        <Typography className={classes.labelTypography}>{t('omniapp:IMPORT_CONFIG')}</Typography>
                    </Grid>
                </Grid>
                <Grid item>
                    <InputBox
                        onChangeHandler={(event) => setKey(event.target.value)}
                        className={classes.inputBox}
                        value={key}
                        label={t('omniapp:KEY')}
                        injectLiveValue={true}
                        type="text"
                        labelMinWidth="35px"
                        labelMaxWidth="35px"
                        form={false}
                        required={true}
                        name="key"
                    />
                </Grid>
                <Grid item container direction="row" justify="flex-end">
                    <Grid item>
                        <FormControlLabel
                            value={deletePreviousConfiguration}
                            classes={{
                                labelPlacementEnd: classes.formControllabel, label: classes.labelTypography,
                                root: classes.checkboxLabelRoot
                            }}
                            control={<Checkbox color="primary" onClick={() => setDeletePreviousConfiguration(!deletePreviousConfiguration)} />}
                            label={t('omniapp:DELETE_PREV_CONFS')}
                            labelPlacement="end"
                        />
                    </Grid>
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions classes={{ root: classes.dialogActionsRoot }}>
            <Button variant="outlined" onClick={() => normalDialogStore.closeDialog()} color="primary" style={{ width: "61px", height: "24px" }}>
            {t('omniapp:LABEL_CANCEL')}
                </Button>
            <Button variant="contained" onClick={importConfiguration} color="primary" style={{ width: "51px", height: "24px" }}>
            {t('omniapp:IMPORT')}
            </Button>
        </DialogActions>
        <AlertBox />
    </div>
}

export default ExportImportConfiguration;