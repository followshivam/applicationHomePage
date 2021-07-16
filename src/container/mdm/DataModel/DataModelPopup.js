import React, { useState } from "react";
import { makeStyles, InputBox, useTranslation } from "component";
import CustomDialogWrapper from "component/GenericComponet/CustomDialog";
import { useSelector } from "react-redux";

const useDailogStyles = makeStyles((theme) => ({

    header: {
        // display: 'flex',
        width: '100%',
        // borderBottom: `1px solid ${theme.palette.backgroundContainer}`,
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    spacing: {
        padding: theme.spacing(1.5, 3, 1.5, 1),
        alignItems: 'stretch',
        borderTop: "1px solid #e0e0e0",
        backgroundColor: '#F5F5F5'
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
        width: "400px",
    },
    show_more_text: {
        padding: theme.spacing(1, 0, 0, 13.75),
        cursor: 'pointer'
    }
}));


export const DataModelPopup = props => {
    const classes = useDailogStyles();
    const { open, togglePopup, handleClose } = props

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    })

    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])


    const handleSubmit = () => {
        console.log('will do this')
    }

    const handleChange = (e) => {
        let event = e.target
        setFormData({ ...formData, [event.name]: event.value })
    }

    const handleContent = () => {
        return (
            <form className={classes.form} onSubmit={handleSubmit}>
                <div className={classes.dividers}>
                    <InputBox
                        label='Category Name'
                        name={"name"}
                        required={true}
                        value={formData.name}
                        injectLiveValue={true}
                        form={false}
                        onChangeHandler={handleChange}
                        labelMaxWidth="110px"
                        fontColor="#000000"
                        labelMinWidth={'110px'}
                        style={{ width: '93%', paddingTop: "10px" }}
                        fontWeight='300'
                    />
                    <InputBox
                        onChangeHandler={handleChange}
                        value={formData.description}
                        label='Description'
                        form={false}
                        placeholder='Type here'
                        injectLiveValue={true}
                        alignItems={"baseline"}
                        labelMaxWidth="110px"
                        labelMinWidth="110px"
                        fontColor="#000000"
                        fontWeight="normal"
                        fontSize="12px"
                        style={{ width: "93%", paddingTop: "20px" }}
                        type="text"
                        rows={4}
                        multiline
                        name="description"
                    />

                </div>
            </form >
        )
    }

    return (

        <div className={classes.dir}>
            <CustomDialogWrapper
                storeHandled={false}
                open={open}
                setOpen={togglePopup}
                direction={`${t('bam:HTML_DIR')}`}
                header={{
                    title: 'Create Category'
                }}
                content={{
                    contentHeight: "160px",
                    contentWidth: "424px",
                    data: handleContent()

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




