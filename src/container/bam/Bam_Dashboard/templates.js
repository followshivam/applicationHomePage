import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    makeStyles,
    Button,
    Typography,
    DialogActions,
    DialogContent,
    DialogTitle,
    // IconImage,
    TableComponent,
    useTranslation,
    Spinner,
} from "component";
import { GetTemplateList, TemplateAction } from "global/bam/api/ApiMethods";
import { GetTemplateInput } from 'global/json';


const useStyles = makeStyles(theme => ({
    root: {
        width: "100%"
    },
    header: {
        width: '100%',
        // borderBottom: `1px solid ${theme.palette.backgroundContainer}`,
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    paper: {
        width: "100%",
        marginBottom: theme.spacing(2)
    },

    head: {
        backgroundColor: '#FFFFFF',
    },
    spinner: {
        height: '230px',
        width: '750px'
    },

}));
const useToolbarStyles = makeStyles(theme => ({

    icon: {
        marginRight: "24px !important",
    },
    h6: {
        paddingLeft: "10px",
        color: "#606060"
    },
    child_toolbar2: {
        display: "flex",
        flex: 1,
        justifycontent: "space-between",
        alignItems: "center",
        height: "30px"
    },
    child2_toolbar_right: {
        display: "flex",
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingRight: "18px",
        marginRight: "5px"
    }

}));


const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { loader, selected = [], heading, onDeleteHandler, t } = props;
    const { loading, msg } = loader;
    // const showDelButton = selected && selected.length > 0;

    return (
        <React.Fragment>
            <div className={classes.child_toolbar2}>
                <h6 className={classes.h6}>{heading ? heading : `${t('bam:TEMPLATES_ACTIONS')}`}</h6>
                <div className={classes.child2_toolbar_right}>
                    {/* <IconImage className={classes.icon} url={"icons/Plus_Blue.svg"} height={15} /> */}
                    {/* {showDelButton ?  <IconImage className={classes.icon} url={"icons/trash_2.svg"} height={15}  onClick={() => onDeleteHandler(selected)} /> : null} */}
                </div>
            </div>
        </React.Fragment>
    );
};

export default function Templates(props) {

    const classes = useStyles();
    const [templateData, setTemplateData] = useState({});
    const [selected, setSelected] = React.useState([]);
    const [isLoading, setIsLoading] = useState({ msg: "", loading: true });
    const { loading, msg } = isLoading;
    const heading = '';

    useEffect(() => {
        getTemplate_list();
    }, [GetTemplateInput]);


    const getTemplate_list = () => {
        setIsLoading({ ...isLoading, loading: true });
        GetTemplateList(GetTemplateInput)
            .then(res => {
                if (res != null && res.status.maincode === "0") {
                    setTemplateData(res.data);
                    setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
                }
            })
            .catch(err => { });
    };

    const checkBoxHandler = (data) => {
        setSelected(data);
    }
    const normalStoreDialog = useSelector(state => {
        return state.normalDialogState;
    });
    const handleClose = () => {
        normalStoreDialog.closeDialog()
    };
    const [store, snackBar, globalSetting] = useSelector(state => {
        return [state.normalDialogState, state.snackbarState, state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module)

    const headCells = [
        {
            id: "template_name",
            numeric: false,
            disablePadding: true,
            label: `${t('bam:TEMPLATE_NAME')}`
        },

    ];

    const onDeleteHandler = (res) => {
        let data = {
            "opr": "2",
            "template_id": res && res != null && res.template_id,
            "template_name": res && res != null && res.template_name,
            "template_def": {
                "template_data": {
                    "resolution": {
                        "window_height": "",
                        "window_width": "",
                        "browser": "",
                        "parent_left": "",
                        "parent_top": "",
                        "parent_height": "",
                        "parent_width": ""
                    },
                    "containers": [{
                        "container_id": "",
                        "container_left": "",
                        "container_top": "",
                        "container_right": "",
                        "container_bottom": ""
                    }
                    ]
                }
            },
            "created_by_user_id": res && res != null && res.created_by_user_id
        }
        setIsLoading({ ...isLoading, loading: true });

        //  normalStoreDialog.openDialog(<Confirmation title="Are you sure you want to delete this Process?" description="" button_label="Delete" action={() => {
        TemplateAction(data)
            .then(res => {
                if (res != null && res.status.maincode === "0") {
                    // SnackBarClose.openSnackbar("Report Deleted Successfully", "success");
                    getTemplate_list();
                    setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);

                }
                else {
                    setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
                    snackBar.openSnackbar(`${t('bam:NO_RIGHTS_TO_DELETE')}`, "error");

                }
            })
            .catch(err => { });
        // }} />, "")
    }

    return (

        <div className={classes.root}>
            <DialogTitle>
                <div className={classes.header}>
                    <div >
                        <Typography variant="h6"><strong>{t('bam:BUSINESS_ACTIVITY_MONITOR_TEMPLATES')}</strong></Typography>
                    </div>
                </div>
            </DialogTitle>
            {loading ? (
                <div className={classes.spinner}>
                    <Spinner />
                </div>
            ) : (<DialogContent >
                <EnhancedTableToolbar
                    t={t}
                    data={templateData}
                    loader={isLoading}
                    heading={heading}
                    selected={selected}
                    onDeleteHandler={onDeleteHandler}

                />

                <TableComponent dynamicHeight="180px"
                    tableData={templateData.templates}
                    headerData={headCells}
                    loading={loading}
                    // selectType="radio"
                    disableFirstCell={true}
                    onChangeCheckbox={checkBoxHandler}
                    action={
                        [
                            {
                                action_type: "icon",
                                icon_url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/trash_2.svg`,
                                height: "15",
                                onClick: (res) => { onDeleteHandler(res) },
                                className: ""
                            },
                        ]
                    }
                />
            </DialogContent>)}
            <DialogActions>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleClose}
                > {t('bam:BUTTON_CLOSE')} </Button>
            </DialogActions>

        </div>
    );
}

