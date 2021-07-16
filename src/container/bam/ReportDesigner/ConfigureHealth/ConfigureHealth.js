import { Button, DialogActions, Divider, makeStyles, Typography } from "@material-ui/core";
import { IconImage, Spinner } from "component"
import React, { useEffect, useState } from "react";
import { GetHealthConfigData } from "../../../global/bam/api/ApiMethods";
import { useSelector } from 'react-redux'
import ConfigureHealthEditor from "./ConfigureHealthEditor";

const useStyles = makeStyles(theme => ({
    root: {
        width: '800px',
        height: '562px',
    },
    header: {
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(1)}px ${theme.spacing(3)}px`,
        // borderBottom: '1px solid #C9C9C9'
    },
    body: {
        width: '100%',
        height: 'calc(100% - 47px)',
        display: 'flex'
    },
    leftContainer: {
        width: '207px',
        height: 'calc(100% - 16px)',
        borderRight: '1px solid #C9C9C9',
        paddingTop: theme.spacing(1),
        "& > *": {
            paddingLeft: theme.spacing(2),
            marginTop: theme.spacing(1),
        },
        overflow: 'auto'
    },

    actionBar: {
        position: 'absolute',
        bottom: '0',
        right: '0'
    },
    notActiveTab: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        cursor: 'pointer',
        height: '29px',
        "& > *": {
            paddingLeft: theme.spacing(2),
        }
    },
    activeTab: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        cursor: 'pointer',
        height: '29px',
        backgroundColor: '#FF66001A',
        "& > *": {
            paddingLeft: theme.spacing(2),
        }
        // margin: `${theme.spacing(1)}px ${theme.spacing(3)}`
    },
    rightContainer: {
        width: 'calc(100% - 208px)',
        padding: theme.spacing(1),
    }
}))

const ConfigureHealth = props => {
    const classes = useStyles();
    const [active, setActive] = useState(0);
    const [state, setState] = useState();

    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    const payload = {
        report_index: 0,
    }

    useEffect(() => {
        payload.report_index = active;
        GetHealthConfigData(payload).then(response => {
            // setState(response)
            console.log(response)
        })
    }, [active, payload])

    return <div className={classes.root}>
        <div className={classes.header}>
            <Typography variant="h6"><b>{t('bam:CONFIGURE_HEALTH_STATUS')}</b></Typography>
        </div>
        <div className={classes.body}>
            <div className={classes.leftContainer}>
                <Typography variant="subtitle2"><b>{t('bam:DEFAULT_CONFIG')}</b></Typography>
                <div className={active === 0 ? classes.activeTab : classes.notActiveTab} onClick={() => setActive(0)}>
                    <Typography variant="subtitle1"><b>{t('bam:ALL_REPORTS')}</b></Typography>
                </div>
                <Typography variant="subtitle2"><b>{t('bam:EXCEPTIONAL_CONFIGURATION')}</b> <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/plus_blue.svg`} /></Typography>

                {state != null ? state.report_list.map((res, index) => (
                    <div key={res.report_index} className={active === res.report_index ? classes.activeTab : classes.notActiveTab} onClick={() => setActive(res.report_index)}>
                        <Typography variant="subtitle1"><b>{res.report_name}</b></Typography>
                    </div>
                )) : <div style={{ height: '400px' }}><Spinner /></div>}
            </div>
            <div className={classes.rightContainer}>
                <div className={classes.component}>
                    <ConfigureHealthEditor t={t} state={state} />
                </div>
                <DialogActions className={classes.actionBar}>
                    <Button variant="outlined" onClick={props.closeDialog}>{t('bam:LABEL_CANCEL')}</Button>
                    <Button variant="contained" color="primary">{t('bam:BUTTON_SAVE')}</Button>
                </DialogActions>
            </div>
        </div>
    </div>
}

export default ConfigureHealth;