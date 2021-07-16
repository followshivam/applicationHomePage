import React, { useState, useEffect } from "react";
import {
    makeStyles,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    SelectBox,
    Spinner,
    useTranslation
} from "component";
import { GetStagingCabDetails, ActStagingCab } from "global/bam/api/ApiMethods";
import { useSelector } from "react-redux";

const useStyles = makeStyles(theme => ({
    root: {
        height: 222,
        width: 350
    },
    spinner: {
        height: 130,
        width: 350
    },
    header: {
        width: '100%',
        // borderBottom: `1px solid ${theme.palette.backgroundContainer}`,
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    homeTab: {
        display: "flex",
        fontSize: "12px",
        whiteSpace: "noWrap",
        color: "##606060",
        fontWeight: 600,
        marginBottom: "15px",
        alignItems: "center"
    },

    leftWrapper: {
        width: "50%",
        flexGrow: 1,
        marginRight: "0px",
    },

    span: {
        display: "inline-block",
        verticalAlign: "middle",
        fontSize: "0.75rem",
        fontWeight: 600,
        color: "rgb(96, 96, 96)"
    },
    button: {
        padding: "0px 15px 0px"
    }

}));


const StagingCabinet = props => {
    const classes = useStyles();
    const [data, setData] = useState();

    const [isLoading, setIsLoading] = useState({ msg: "", loading: true });
    const { loading } = isLoading;
    const [normalStoreDialog, snackbarState, globalSetting] = useSelector(state => {
        return [state.normalDialogState, state.snackbarState, state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    const onCancel = () => {
        normalStoreDialog.closeDialog()
    };
    const onChangeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }


    const list = [
        { id: 1, value: "Y", label: `${t('bam:YES')}` },
        { id: 2, value: "N", label: `${t('bam:NO')}` },
    ];

    const getData = () => {
        setIsLoading({ ...isLoading, loading: true });

        GetStagingCabDetails()
            .then(response => {
                if (response != null && response.status.maincode === "0") {
                    setData(response?.data);
                    setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);

                }
                else {
                    snackbarState.openSnackbar(response.status.error_msg, 'warning');
                    setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);

                }
            }).catch(error => {
                console.error('Error:', error);
            });
    };

    const onSave = () => {
        console.log("staging_cabinet", data, data?.staging_cabinet)
        let payload = {
            "opr": data?.is_exists === true ? "1" : "0",
            "staging_cabinet": data?.staging_cabinet,
            "force_staging": data?.force_staging,
        }
        setIsLoading({ ...isLoading, loading: true });

        ActStagingCab(payload)
            .then(response => {
                if (response != null && response.status.maincode === "0") {
                    setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
                    getData();
                }
                else {
                    snackbarState.openSnackbar(response.status.errormsg, 'warning');
                    setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);

                }
            }).catch(error => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        getData();
    }, [])


    const actionButtonAddPageCommon = [{
        label: `${t('bam:LABEL_CANCEL')}`,
        action: onCancel,
        variant: "outlined",
        // color: "secondary",
        type: "button"
    },
    {
        label: data?.is_exists === true ? `${t('bam:BUTTON_UNREGISTER')}` : `${t('bam:BUTTON_SAVE')}`,
        action: onSave,
        variant: "contained",
        color: "primary",
        type: "button"
    },
    ];
    return (
        <div className={classes.root}>
            <DialogTitle>
                <div className={classes.header}>
                    <div className={classes.headerTitle}>
                        <Typography variant="h6"><strong>{t('bam:STAGING_CABINET')}</strong></Typography>
                    </div>
                </div>
            </DialogTitle>
            {loading ? <div className={classes.spinner}>
                <Spinner />
            </div> :
                <DialogContent style={{ height: 116 }}>
                    <div className={classes.header}>
                        <div className={classes.leftWrapper}>
                            <div className={classes.homeTab}>
                                <span className={classes.span}>{t('bam:CABINET_NAME')}</span>
                                <span className={classes.span} style={{ marginLeft: "22px" }}>{data?.cabinet}</span>
                            </div>
                            {data?.is_exists === true ? <React.Fragment> <div className={classes.homeTab}>
                                <span className={classes.span}>{t('bam:STAGING_NAME')}</span>
                                <span className={classes.span} style={{ marginLeft: "24px" }}>{data?.staging_cabinet}</span>
                            </div>
                                <div className={classes.homeTab}>
                                    <span className={classes.span}>{t('bam:FORCE_STAGING')}</span>
                                    <span className={classes.span} style={{ marginLeft: "28px" }}>{data?.force_staging}</span>
                                </div></React.Fragment> :
                                <React.Fragment><div className={classes.homeTab}>
                                    <div>
                                        <SelectBox style={{ width: "200px" }}
                                            label={t('bam:SELECT_CABINET')}
                                            name='staging_cabinet'
                                            list={data?.staging_cabinets}
                                            // value={data?.staging_cabinets}
                                            labelMaxWidth="100px"
                                            labelMinWidth="100px"
                                            form={false}
                                            onChange={onChangeHandler}
                                        />
                                    </div>
                                </div>
                                    <div className={classes.homeTab}>
                                        <SelectBox style={{ width: "50px" }}
                                            label={t('bam:FORCE_STAGING')}
                                            name='force_staging'
                                            list={list}
                                            // value={data.force_staging}
                                            labelMaxWidth="100px"
                                            labelMinWidth="100px"
                                            form={false}
                                            onChange={onChangeHandler}
                                        />
                                    </div></React.Fragment>}
                        </div>
                    </div>

                </DialogContent>}
            <DialogActions className={classes.button}>
                {actionButtonAddPageCommon.map((res, key) => <Button key={res.key} type={res.type} variant={res.variant} color={res.color} onClick={res.action}>
                    {res.label}
                </Button>)}
            </DialogActions>

        </div>
    );
}

export default StagingCabinet;