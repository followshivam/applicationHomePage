import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { InputBox } from "component/Form";
import { ActExtApp } from "global/omniapp/api/ApiMethods";
import { useSelector } from "react-redux";
import {
    FormControlLabel, Checkbox, useTranslation,
} from 'component';
import CustomDialogWrapper from 'component/GenericComponet/CustomDialog';

const useDailogStyles = makeStyles((theme) => ({
    paper: {
        borderRadius: '4px',
        width: '421px',
        height: '380px',
    },
    header: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        // width: "700px"
    },
    checkboxWrapper: {
        background: "#f8f8f8",
        width:"92%", // props => props.direction === "rtl" ? "86%" : "92%",
        marginBottom: "30px"
    },
    checkboxRoot: {
        justifyContent: 'flex-end',
        background: "#f8f8f8",
        marginRight: 0,
        '& .MuiCheckbox-root': {
            padding: theme.spacing(1, 0.75),
        },
        '& .MuiTypography-root': {
            flexBasis: '300px'
        },
        '& .MuiFormControlLabel-label': {
            fontWeight: '600',
            color: '#606060',
        },


    }
}));


// const Content = (props) => {
//     const{values,t, setValues}=props;
//     const classes = useDailogStyles();

//     return <form className={classes.form} >
//         <div dividers className={classes.dividers}>
//             <div style={{ padding: '15px 0 15px 0' }}>
//                 <InputBox
//                     label={t('omniapp:COMPONENT_NAME')}
//                     name={"app_name"}
//                     direction={`${t('bam:HTML_DIR')}`}
//                     required={true}
//                     value={values.app_name}
//                     injectLiveValue={true}
//                     form={false}
//                     onChangeHandler={(e) => setValues({ ...values, app_name: e.target.value })}
//                     labelMaxWidth="160px"
//                     labelMinWidth={'160px'}
//                     style={{ width: '440px' }}
//                     fontWeight='600'
//                     disabled={values?.app_id != null ? true : false}
//                 />
//             </div>
//             <div style={{ paddingBottom: '10px' }}>
//                 <InputBox
//                     label={t('omniapp:URL')}
//                     name={"app_url"}
//                     direction={`${t('bam:HTML_DIR')}`}
//                     required={true}
//                     value={values.app_url}
//                     injectLiveValue={true}
//                     multiline={true}
//                     form={false}
//                     onChangeHandler={(e) => setValues({ ...values, app_url: e.target.value })}
//                     labelMaxWidth="160px"
//                     labelMinWidth={'160px'}
//                     style={{ width: '440px' }}
//                     fontWeight='600'
//                 />
//             </div>
//             <div className={classes.checkboxWrapper}>
//                 <FormControlLabel classes={{ root: classes.checkboxRoot }}
//                     control={
//                         <Checkbox
//                             name="app_sys_var"
//                             checked={values.app_sys_var}
//                             onChange={(e) => setValues({ ...values, app_sys_var: e.target.checked })}
//                         />
//                     }
//                     label={t('omniapp:Would you like to your authentication token?')}
//                     labelPlacement="end"
//                 />
//             </div>
//         </div>
//     </form>
// }


function AddEditExternalAppplicationModal(props) {
    const { handleClose,modalType, data,open,setOpen } = props;
    const [isLoading, setIsLoading] = React.useState({ msg: "", loading: false });
    const { loading, msg } = isLoading;
    const snackbarState = useSelector(store => store.snackbarState);
    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])
    const [direction] = React.useState(`${t('bam:HTML_DIR')}`)
    const classes = useDailogStyles({ direction });

    const [values, setValues] = React.useState({
        app_name: '',
        app_url: '',
        app_sys_var: ""
    })

    useEffect(() => {
        if (data != null) {
            setValues({
                ...data,
                app_sys_var: data.app_sys_var === "true" ? true : false
            })
        }
    }, [])

    const handleSubmit = (event) => {
        setIsLoading({ ...isLoading, loading: true });
        event.preventDefault();
        let param = {
            opr:(modalType==="EDIT") ? '2' : '1',
            ...values
        }

        ActExtApp(param)
            .then((res) => {
                if (res && res.status.maincode == "0") {
                    if (res.data.operation === "register") {
                        handleClose();
                        props.onSuccessCallback();
                        setIsLoading({ ...isLoading, loading: false });
                        snackbarState.openSnackbar(`Successfully added ${param.app_name}`, 'success');
                    } else {
                        handleClose();
                        props.onSuccessCallback();
                        setIsLoading({ ...isLoading, loading: false });
                        snackbarState.openSnackbar(`Successfully updated ${param.app_name}`, 'success');
                    }
                } else {
                    setIsLoading({ ...isLoading, loading: false });
                    snackbarState.openSnackbar(res !== undefined && res != null ? res?.status?.description : "Something Went Wrong", 'warning', 5000);
                }
            })
            .catch((err) => { })

        return false;
    }
    const handleContent = () => {
        return <form className={classes.form} onSubmit={handleSubmit}>
            <div dividers className={classes.dividers}>
                <div style={{ padding: '15px 0 15px 0' }}>
                    <InputBox
                        label={t('omniapp:COMPONENT_NAME')}
                        name={"app_name"}
                        direction={`${t('bam:HTML_DIR')}`}
                        required={true}
                        value={values.app_name}
                        injectLiveValue={true}
                        form={false}
                        onChangeHandler={(e) => {console.log("---",e.target.value)
                            setValues({ ...values, app_name: e.target.value })}}
                        labelMaxWidth="160px"
                        labelMinWidth={'160px'}
                        style={{ width: '440px' }}
                        fontWeight='600'
                        disabled={values?.app_id != null ? true : false}
                    />
                </div>
                <div style={{ paddingBottom: '10px' }}>
                    <InputBox
                        label={t('omniapp:URL')}
                        name={"app_url"}
                        direction={`${t('bam:HTML_DIR')}`}
                        required={true}
                        value={values.app_url}
                        injectLiveValue={true}
                        multiline={true}
                        form={false}
                        onChangeHandler={(e) => setValues({ ...values, app_url: e.target.value })}
                        labelMaxWidth="160px"
                        labelMinWidth={'160px'}
                        style={{ width: '440px' }}
                        fontWeight='600'
                    />
                </div>
                <div className={classes.checkboxWrapper}>
                    <FormControlLabel classes={{ root: classes.checkboxRoot }}
                        control={
                            <Checkbox
                                name="app_sys_var"
                                checked={values.app_sys_var}
                                onChange={(e) => setValues({ ...values, app_sys_var: e.target.checked })}
                            />
                        }
                        label={t('omniapp:Would you like to your authentication token?')}
                        labelPlacement="end"
                    />
                </div>
            </div>
        </form>
    }
   

    return (

        <div className={classes.dir}>
            <CustomDialogWrapper
                storeHandled={false}
                open={open}
                setOpen={setOpen}
                direction={`${t('bam:HTML_DIR')}`}
                header={{
                    title: modalType==="EDIT"?t('omniapp:EDIT_EXTERNAL_APPLICATION'):t('omniapp:ADD_EXTERNAL_APPLICATION'),
                }}
                content={{
                    contentHeight: "200px",
                    contentWidth: "700px",
                    data:handleContent()
                    // <Content values={values} t={t} setValues={setValues}/>
                }}
                footer={{
                    actionList: [
                        {
                            label: `${t('bam:LABEL_CANCEL')}`,
                            clickHandler: handleClose,
                            class: "secondary",
                        },
                        {
                            label: `${t('omniapp:Register')}`,
                            clickHandler: handleSubmit,
                            class: "primary",
                        },
                    ]
                }}
            />

        </div>
    )
}

export default AddEditExternalAppplicationModal
