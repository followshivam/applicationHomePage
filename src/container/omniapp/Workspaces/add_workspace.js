import React, { useState } from 'react'
import {
    Dialog, DialogTitle, DialogContent, DialogActions, makeStyles, Grid, InputBox, RadioGroup,
    FormControlLabel, Radio, useTranslation,Typography, IconImage
} from 'component'
import { Button } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { ActWorkspace } from '../../../global/omniapp/api/ApiMethods'

const useStyle = makeStyles(theme => {
    return {
        paper: {
            borderRadius: '4px',
            minHeight: '20rem',
        },
        inputBox: {
            marginLeft: "2rem",
            "& .MuiInputBase-input": {
                width: "230px"
            }
        },
        multiLineInputBox: {
            marginLeft: "2rem",
            "& .MuiInputBase-input": {
                width: "230px"
            }
        },
        input_label: {
            ...theme.typography.input_label,
            minWidth: "106px",
            maxWidth: "106px",
            marginTop: "0.25rem"
        },
        title: {
            fontWeight: '600 !important',
            padding: theme.spacing(1, 2, 0, 2),
        },
        contentRoot: {
            paddingTop: "16px"
        },
        dialogActionsRoot: {
            paddingRight: 16,
            paddingBottom: 16
        },

    }
})

const AddWorkspace = (props) => {

    const { currentEdit = undefined, handleRefresh, isRefreshRequired } = props;
    const classes = useStyle();
    const [formData, setFormData] = useState({
        workspaceName: currentEdit ? currentEdit.workspaceName : '',
        description: currentEdit ? currentEdit.description : '',
        defaultLanding: 'collapsedView',
        leftBarType: 'withTabs'
    })
    const normalDialogStore = useSelector(state => state.normalDialogState);
    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])
    const handleChange = event => {
        const name = event.target.name
        console.log(name)
        setFormData({
            ...formData,
            [name]: event.target.value
        })
    }

    const handleSubmit = () => {
        console.log(formData)
        ActWorkspace(JSON.stringify(formData))
            .then(res => {
                console.log(res, formData)
                if (res != null && res.status.maincode === "0") {
                    handleRefresh(!isRefreshRequired)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (<div>
        <DialogTitle className={classes.title}>{currentEdit ? `${t('omniapp:EDIT_WORKSPACE')}(${currentEdit.workspaceName})` : `${t('omniapp:ADD_WORKSPACE')}`}</DialogTitle>
        <DialogContent style={{ minHeight: '20rem' }} className={classes.contentRoot}>
            <Grid item container spacing={2} direction="column">
                <Grid item>
                    <InputBox
                        onChangeHandler={handleChange}
                        className={classes.inputBox}
                        value={formData.workspaceName}
                        label={t('omniapp:WORKSPACES_NAME')}
                        form={false}
                        labelMinWidth={"106px"}
                        labelMaxWidth={"106px"}
                        type="text"
                        required={true}
                        name="workspaceName"
                    />
                </Grid>
                <Grid item>
                    <InputBox
                        onChangeHandler={handleChange}
                        className={classes.multiLineInputBox}
                        value={formData.description}
                        label={t('omniapp:DESCRIPTION')}
                        form={false}
                        type="text"
                        labelMinWidth={"106px"}
                        labelMaxWidth={"106px"}
                        alignItems={"baseline"}
                        rows={2}
                        required={true}
                        multiline={true}
                        name="description"
                    />
                </Grid>
                <Grid item container spacing={4} direction="row">
                    <Grid item >
                        <Typography noWrap={true} className={classes.input_label} >{t('omniapp:DEFAULT_LANDING')}</Typography>
                    </Grid>
                    <Grid item>
                        <RadioGroup onChange={handleChange} row value={formData.defaultLanding} name="defaultLanding">
                            <FormControlLabel label={t('omniapp:COLLAPSED_VIEW')} value="collapsedView" control={<Radio color="primary" />} />
                            <FormControlLabel label={t('omniapp:EXPANDED_VIEW')} value="expandedView" control={<Radio color="primary" />} />
                        </RadioGroup>
                    </Grid>
                </Grid>
                <Grid item container spacing={4} direction="row">
                    <Grid item >
                        <Typography noWrap={true} className={classes.input_label} >{t('omniapp:LEFT_BAR_TYPE')}</Typography>
                    </Grid>
                    <Grid item>
                        <RadioGroup onChange={handleChange} row value={formData.leftBarType} name="leftBarType">
                            <FormControlLabel label={t('omniapp:WITH_TABS')} value="withTabs" control={<Radio color="primary" />} />
                            <FormControlLabel label={t('omniapp:WITHOUT_TABS')}value="withoutTabs" control={<Radio color="primary" />} />
                        </RadioGroup>
                        <div>
                            <img style={{ marginLeft: "1rem" }} alt="with_tab_bartype" src={"icons/with_tab_bartype.svg"} width="120px" height="72px"></img>
                            <img style={{ marginLeft: "3rem" }} alt="without_tab_bartype" src={"icons/without_tab_bartype.svg"} width="120px" height="72px"></img>
                        </div>
                        {/* <IconImage url={"icons/with_tab_bartype.svg"} width="120px" height="72px" />
                            <IconImage url={"icons/without_tab_bartype.svg"} width="120px" height="72px" /> */}
                    </Grid>
                </Grid>
            </Grid>
        </DialogContent>

        <DialogActions classes={{ root: classes.dialogActionsRoot }}>
            <Button variant="outlined" onClick={() => normalDialogStore.closeDialog()} color="primary" style={{ width: "62px", height: "24px" }}>
                {t('omniapp:LABEL_CANCEL')}
                </Button>
            <Button variant="contained" onClick={handleSubmit} color="primary" style={{ width: "47px", height: "24px" }}>
            {t('omniapp:SAVE')}
            </Button>
        </DialogActions>
    </div>)
}

export default AddWorkspace