import React from "react";
import { Button, Checkbox, useTranslation, DialogActions, DialogTitle, Divider, InputBox, FormControlLabel, makeStyles, Pagination, Typography, withStyles, Spinner } from "component";
import { useSelector, useDispatch } from "react-redux";
import { ImportReport } from "global/bam/api/ApiMethods";
const useStyles = makeStyles(theme => ({
    root: {
        width: '500px',
    },
    title: {
        padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`
    },
    body: {
        padding: `10px ${theme.spacing(2)}px ${theme.spacing(1)}px ${theme.spacing(2)}px`
    },
    spinner: {
        height: '125px',
        width: '500px'
    },
    filePicker: {
        display: 'flex',
        width: '90%',
        margin: '10px auto',
        border: '1px solid #f8f8f8',
        fontSize: '12px'
    },
    browseButton: {
        width: '20%',
        backgroundColor: '#f8f8f8',
        padding: theme.spacing(0.5),
        color: '#606060',
        cursor: 'pointer',
        textAlign: 'center'
    },
    pickedDetails: {
        padding: theme.spacing(0.5),
    }
}))

const StyledFormControlLabel = withStyles({
    label: {
        fontSize: '12px',
    }
})(FormControlLabel)


const ImportDialogSystem = props => {
    const classes = useStyles();

    const [normalStoreDialog, snackBar, globalSetting] = useSelector(state => {
        return [state.normalDialogState, state.snackbarState, state.globalSettings];
    });


    const { t } = useTranslation(globalSetting.locale_module)

    const [isLoading, setIsLoading] = React.useState({ msg: "", loading: false });
    const [selectedFile, setSelectedFile] = React.useState();
    const { loading } = isLoading;

    const onCloseHandler = () => {
        normalStoreDialog.closeDialog();
    };

    const onSelectHandler = (event) => {
        setSelectedFile(event.target.files[0])
    };

    const onImport = () => {
        setIsLoading({ ...isLoading, loading: true });
        const data = new FormData();
        data.append('file', selectedFile);
        ImportReport(data)
            .then(res => {
                if (res != null && res.status.maincode === "0") {
                    snackBar.openSnackbar(`${t('bam:IMPORTED_FILE_SUCCESS')}`, "success");
                    setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
                    onCloseHandler()
                } else {
                    snackBar.openSnackbar(res.status.errormsg, "error");
                    setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
                }
            })
            .catch(err => { });
    }

    return <div className={classes.root}>
        <DialogTitle className={classes.title}><Typography variant="h6"><strong>{t('bam:IMPORT_FROM_SYSTEM_')}</strong></Typography></DialogTitle>
        <Divider variant="fullWidth" />
        {loading ? (
            <div className={classes.spinner}>
                <Spinner />
            </div>
        ) : <div className={classes.body}>
            <Typography variant="subtitle1">{t('bam:CHOOSE_FILE')}</Typography>
            <div className={classes.filePicker}>
                <InputBox type="file" onChange={onSelectHandler} />
                {/*<div className={classes.browseButton}>Browse File</div>
                <div className={classes.pickedDetails}>No file chosen</div>*/}
            </div>

            <StyledFormControlLabel
                className={classes.checkBox}
                label={t('bam:OVERWRITE_EXISTING_REPORT')}
                control={<Checkbox />}
            />
        </div>}
        <DialogActions>
            <Button variant="outlined" onClick={onCloseHandler}>{t('bam:LABEL_CANCEL')}</Button>
            <Button variant="contained" color="primary" onClick={onImport}>{t('bam:IMPORT')}</Button>
        </DialogActions>
    </div>
}

export default ImportDialogSystem;