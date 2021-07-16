import React from "react";
import { Button, DialogActions, DialogContent, DialogTitle, makeStyles, Typography, useTranslation } from "component";
import { useSelector } from "react-redux";
const useStyles = makeStyles(theme => ({
    root: {
        width: '420px',
    },
    title: {
        padding: `${theme.spacing(1.5)}px ${theme.spacing(2.5)}px ${theme.spacing(1.75)}px`,
        direction: props => props.direction
    },
    body: {
        padding: `0 ${theme.spacing(2)}px ${theme.spacing(1)}px ${theme.spacing(2)}px`,
        direction: props => props.direction
    },
    divider: {
        borderBottom: 'none'
    },
    spacing: {
        padding: theme.spacing(1.375, 2.5),
        backgroundColor: '#f5f5f5',
        alignItems: 'stretch',
        direction: props => props.direction
     }
}))

const DeleteConfirmation = props => {
    const [globalSetting] = useSelector((state) => {
        return [state.globalSettings];
      });
    const { t } = useTranslation(
        globalSetting.locale_module
          ? globalSetting.locale_module
          : ["bam", "omniapp"]
      );
    const { description = "", title = t('omniapp:DELETE'), button_label = null , direction = "ltr"} = props;
    const classes = useStyles({ direction });
    const dialogState = useSelector(state => {
        return state.normalDialogState;
    })
    const onSelect = () => {
        props.action();
        onCloseHandler();
    }
    const onCloseHandler = () => {
        dialogState.closeDialog();
    }
    return <div className={classes.root}>
        <DialogTitle divider className={classes.title}><strong>{title}</strong></DialogTitle>
        <DialogContent dividers classes={{ dividers: classes.divider }} style={{  padding: '18px 4px' }}>
            <div className={classes.body}>
                <Typography variant="subtitle1">{description}</Typography>
            </div>
        </DialogContent>
        <DialogActions className={classes.spacing}>
            <Button variant="outlined" onClick={onCloseHandler} style={{ marginLeft: direction === "rtl" ? "12px" : 0 }}>{t("omniapp:LABEL_CANCEL")}</Button>
            <Button variant="contained" style={{ marginLeft: direction === "rtl" ? "0px" : "12px" , fontSize: '0.75rem' }} color="primary" onClick={onSelect}>{button_label != null ? button_label : t("omniapp:LABEL_OK")}</Button>
        </DialogActions>
    </div>
}

export default DeleteConfirmation;