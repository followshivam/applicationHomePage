import React, { useEffect, useState } from 'react';
import {
    Grid, DialogTitle, DialogContent, DialogActions,
    makeStyles, SelectBox, InputBox, Button, IconsButton,useTranslation, Typography, TableComponent, IconImage
} from 'component'
import { useSelector } from 'react-redux';
import { GetMultilingualConf, GetEntityList, ActMultilingualDef } from '../../../global/omniapp/api/ApiMethods';


const useStyle = makeStyles((theme) => ({
    inputBox: {
        marginLeft: "2rem",
        "& .MuiInputBase-input": {
            width: "15rem"
        }
    },
    dialogActionsRoot: {
        paddingRight: 16,
        paddingBottom: 16
    },
    selectBox: {
        width: "15.6rem",
        marginLeft: "2rem",
        // "& .MuiInputBase-input": {
        //     height: "1rem"
        // }
    },
    outlinedPrimary: {
        color: theme.palette.primary.main,
        border: `1px solid ${theme.palette.primary.main}`
    }
}))


const MultilingualDefinition = () => {

    const classes = useStyle();
    const [formData, setFormData] = useState({
        entityType: undefined,
        locale: '',
        application: '',
        mulitlingualName: ''
    })
    const [applications, setApplications] = useState([]);
    const [localeList, setLocaleList] = useState([])
    const [linguals, setLinguals] = useState([]);
    const [entityTypes, setEntityTypes] = useState([])
    const [selectedLinguals, setSelectedLinguals] = useState([]);
    const normalDialogStore = useSelector(state => state.normalDialogState);
    const [saveMultilinguals, setSaveMultilinguals] = useState([]);
    const [entityName, setEntityName] = useState();
    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])
    const snackbarStore = useSelector(state => {
        return state.snackbarState;
    });

    const tableHeader = [
        { id: 'name', label:`${t('omniapp:ENTITY_NAME')}` },
        { id: 'localized_name', label:`${t('omniapp:MULTILINGUAL_NAME')}` },
        { id: 'locale', label:`${t('omniapp:LABEL_LOCALE')}` },
    ]
    useEffect(() => {
        GetMultilingualConf()
            .then(res => {
                if (res != null && res.status.maincode === "0") {
                    const data = res.data;
                    const localeList = data.locales;
                    const modifiedLocaleList = localeList.map(locale => {
                        return { value: locale.name, label: locale.display_string }
                    })
                    const entityTypes = data.entity_types;
                    const modifiedEntityTypes = entityTypes.map(entityType => {
                        return { value: entityType.value, label: entityType.name }
                    })
                    setLocaleList(modifiedLocaleList);
                    setEntityTypes(modifiedEntityTypes);
                }
            })
            .catch(err => console.log(err))
    }, [])

    const handleChange = event => {
        const name = event.target.name;
        setFormData({
            ...formData,
            [name]: event.target.value
        })
    }
    const handleSubmit = () => {
        const payload = {
            opr: "2",
            entity_type: formData.entityType,
            name: entityName,
            id: formData.application,
            entity_info: saveMultilinguals
        }
        ActMultilingualDef(JSON.stringify(payload))
            .then(res => {
                console.log(res);
                if (res != null && res.status.maincode === "0") {
                    const data = res.data;
                    setSaveMultilinguals([]);
                    snackbarStore.openSnackbar('Success', "success", 2000)
                    // normalDialogStore.closeDialog();
                }
            })
            .catch(err => {
                snackbarStore.openSnackbar('Something went wrong. Please contact Admin', "error", 2000)
                console.log(err)
            })
    }

    const handleCheckbox = (selectedInputs) => {
        setSelectedLinguals(selectedInputs);
    }

    const getEntityList = (event) => {
        const entity_type = event.target.value
        const payload = {
            entity_type: entity_type
        }
        setFormData({ ...formData, entityType: '', application: '' })
        GetEntityList(JSON.stringify(payload))
            .then(res => {
                console.log(res)
                if (res != null && res.status.maincode === "0") {
                    const data = res.data;
                    const applications = data.entities
                    const modifiedApplications = applications.map(application => {
                        return { value: application.id, label: application.name }
                    })
                    setApplications(modifiedApplications)
                    setFormData({ ...formData, entityType: entity_type, application: '' })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const addMultilingual = () => {
        const lingual = {
            id: formData.application,
            localized_name: formData.mulitlingualName,
            locale: formData.locale,
            name: entityName,
        }
        setLinguals([...linguals, lingual]);
        setSaveMultilinguals([...saveMultilinguals,
        {
            localized_name: formData.mulitlingualName,
            locale: formData.locale,
            operation: "I"
        }
        ]);
        setFormData({ ...formData, name: '', locale: '' })
    }

    const deleteMultilingual = (lingualParam) => {
        const filteredLinguals = linguals.filter(lingual => {
            return !(lingual.localized_name === lingualParam.localized_name &&
                lingual.locale === lingualParam.locale)
        })
        setLinguals(filteredLinguals)
        setSaveMultilinguals([...saveMultilinguals,
        {
            localized_name: lingualParam.localized_name,
            locale: lingualParam.locale,
            operation: "D"
        }
        ]);
    }

    const deleteSelectedMultilingual = () => {
        const deletedLinguals = [];
        const filteredLinguals = [];
        let check = false;
        linguals.forEach(lingual => {
            check = false;
            selectedLinguals.forEach(selectedLingual => {
                if (selectedLingual.localized_name === lingual.localized_name &&
                    selectedLingual.locale === lingual.locale) {
                    deletedLinguals.push({ localized_name: lingual.localized_name, locale: lingual.locale, operation: "D" })
                    check = true;
                }
            });
            if (!check)
                filteredLinguals.push(lingual);
        })
        // console.log(deletedLinguals, filteredLinguals);
        setLinguals(filteredLinguals);
        setSaveMultilinguals([...saveMultilinguals, ...deletedLinguals]);
    }


    const getMulitilingualDef = (event) => {
        const index = event.nativeEvent.target.selectedIndex;
        const label = event.nativeEvent.target[index].text;
        const entity_id = event.target.value;
        const payload = {
            opr: "1",
            id: entity_id,
            entity_type: formData.entityType
        }
        ActMultilingualDef(JSON.stringify(payload))
            .then(res => {
                console.log(res);
                if (res != null && res.status.maincode === "0") {
                    const data = res.data;
                    const modifiedEntityInfo = data.entity_info.map(entity => {
                        return { ...entity, name: data.name, id: data.id }
                    })
                    setLinguals(modifiedEntityInfo)
                } else if (res != null && res.status.maincode === "1") {
                    setLinguals([])
                }
                setFormData({ ...formData, application: entity_id })
                setEntityName(label);
            })
            .catch(err => {
                console.log(err)
            })
    }
    return (<div>
        <DialogTitle>{t('omniapp:MULTILINGUAL_DEFINITION')}</DialogTitle>
        <DialogContent style={{ minHeight: '18rem' }}>
            <Grid container direction="column" spacing={4}>
                <Grid item container spacing={2} direction="row">
                    <Grid item>
                        <SelectBox
                            onChangeHandler={getEntityList}
                            className={classes.selectBox}
                            value={formData.entityType}
                            list={entityTypes}
                            placeholder={t('omniapp:SELECT_ENTITY_TYPE')}
                            label={t('omniapp:ENTITY_TYPE')}
                            name="entityType"
                            required={true}
                            form={false}
                        />
                    </Grid>
                    <Grid item>
                        <SelectBox
                            onChangeHandler={handleChange}
                            className={classes.selectBox}
                            value={formData.locale}
                            placeholder={t('omniapp:SELECT_LANG')}
                            list={localeList}
                            label={t('omniapp:LABEL_LOCALE')}
                            name="locale"
                            labelMinWidth="115px"
                            form={false}
                        />
                    </Grid>
                </Grid>
                {formData.entityType && <Grid container item spacing={2} direction="row">
                    <Grid item>
                        <SelectBox
                            onChangeHandler={getMulitilingualDef}
                            className={classes.selectBox}
                            value={formData.application}
                            list={applications}
                            label={t('omniapp:APPLICATIONS')}
                            name="application"
                            required={true}
                            form={false}
                        />
                    </Grid>
                    <Grid item>
                        <InputBox
                            onChangeHandler={handleChange}
                            className={classes.inputBox}
                            labelMinWidth="115px"
                            value={formData.mulitlingualName}
                            label={t('omniapp:MULTILINGUAL_NAME')}
                            form={false}
                            required={true}
                            type="text"
                            name="mulitlingualName"
                        />
                    </Grid>
                </Grid>}
                {formData.entityType && <Grid container justify="flex-end">
                    <Grid item style={{ marginRight: '1rem' }}>
                        <Button variant="outlined" className={classes.outlinedPrimary}
                            onClick={addMultilingual} style={{ width: "47px", height: "24px" }}>
                            {t('omniapp:LABEL_ADD')}
                        </Button>
                    </Grid>
                </Grid>}
            </Grid>
            {formData.application != '' && <Grid style={{ marginTop: "2rem" }} container direction="row" >
                <Grid item container justify="space-between">
                    <Grid item>
                        <Typography style={{ marginBottom: "1rem", color: "#606060" }}  >{t('omniapp:ALREADY_ADDED')} </Typography>
                    </Grid>
                    {selectedLinguals.length !== 0 && <Grid item style={{ marginLeft: "-10px" }}>
                        <IconImage url={"icons/delete_grey.svg"} height={"15"} onClick={deleteSelectedMultilingual} disabled={selectedLinguals.length === 0 ? true : false} />
                    </Grid>}
                </Grid>
                <TableComponent loading={false}
                    tableData={linguals}
                    dynamicHeight="180px"
                    backgroundColor="none"
                    headerData={tableHeader} 
                    onChangeCheckbox={handleCheckbox}
                    action={
                        [{
                            action_type: "icon",
                            icon_url: "icons/delete_grey.svg",
                            height: "",
                            onClick: (res) => deleteMultilingual(res),
                            className: ""
                        }]
                    }
                />
            </Grid>}
        </DialogContent>
        <DialogActions classes={{ root: classes.dialogActionsRoot }}>
            <Button variant="outlined" onClick={() => normalDialogStore.closeDialog()} color="primary" style={{ width: "62px", height: "24px" }}>
            {t('omniapp:LABEL_CANCEL')}
                </Button>
            {formData.application != '' && <Button variant="contained" onClick={handleSubmit} color="primary" style={{ width: "47px", height: "24px" }}>
            {t('omniapp:SAVE')}
            </Button>}
        </DialogActions>
    </div>)

}


export default MultilingualDefinition;