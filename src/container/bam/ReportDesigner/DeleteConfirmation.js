import { Button, DialogActions, DialogTitle, makeStyles, Typography } from "component";
import React from "react";

const useStyles = makeStyles(theme => ({
    root: {
        width: '520px',
    },
    title: {
        padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`
    },
    body: {
        padding: `0 ${theme.spacing(2)}px ${theme.spacing(1)}px ${theme.spacing(2)}px`

    }
}))

const DeleteConfirmation = props => {
    const classes = useStyles();

    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    return <div className={classes.root}>
        <DialogTitle className={classes.title}><strong>{t('bam:CONFIRMATION_ACTION')}</strong></DialogTitle>
        <div className={classes.body}>
            <Typography variant="subtitle1">A very short but explainable description for the above mentioned alert type.</Typography>
        </div>
        <DialogActions>
            <Button variant="outlined">{t('bam:LABEL_CANCEL')}</Button>
            <Button variant="contained" color="primary">{t('bam:BUTTON_DELETE')}</Button>
        </DialogActions>
    </div>
}

export default DeleteConfirmation;