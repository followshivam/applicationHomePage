import React, { useState, useEffect } from 'react'
import {
    Dialog, DialogTitle, DialogContent, DialogActions, makeStyles, Grid, TableComponent,
    InputBox, Typography, StyledTab as StyledTabs,useTranslation
} from 'component'
import { Button, MenuItem, Select, Chip, FormControl, Avatar, Checkbox, FormControlLabel } from '@material-ui/core'
import { useTheme } from '@material-ui/styles';
import { StyledInput } from 'component/Form';
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Pagination from '@material-ui/lab/Pagination';
import MultiStep from 'component/MultiStep';
import { useSelector } from 'react-redux';


const useStyle = makeStyles((theme) => ({
    paper: {
        borderRadius: '4px',
        minHeight: '20rem',
    },
    inputBox: {
        marginLeft: "2rem",
        "& .MuiInputBase-input": {
            width: "15rem"
        }
    },
    multiLineInputBox: {
        marginLeft: "2rem",
        "& .MuiInputBase-input": {
            width: "20rem"
        }
    },
    tabContainer: {
        marginTop: ".5rem",
        padding: theme.spacing(1, 1, 1, 1)
    },
    chipRoot: {
        borderRadius: "2px"
    },
    chipLabel: {
        paddingLeft: "4px",
        paddingRight: "4px"
    },
    spacing: {
        padding: '16px 24px'
    },
    title: {
        padding: theme.spacing(2, 2, 1, 2),
        fontWeight: '600 !important',
    },
    dividers: {
        borderBottom: 'none',
        padding: theme.spacing(1, 3)
    },
    formControl: {
        minWidth: "15rem",
        maxWidth: "100%",
    },
    formControlRoot: {
        verticalAlign: "bottom"
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    groupItem: {
        marginTop: "auto",
        marginBottom: "auto"
    },
    chip: {
        margin: 1,
    },
    input_label: {
        ...theme.typography.input_label,
        minWidth: "95px",
        maxWidth: "110px",
        marginTop: ".25rem"
    },
    selectBox: {
        width: "15.6rem",
        marginLeft: "2rem",
        "& .MuiInputBase-input": {
            height: "1rem"
        }
    },
    ul: {
        '& ul': {
            justifyContent: 'flex-end'
        }
    },
    paginationRootItem: {
        "& .Mui-selected": {
            height: "24px",
            minWidth: "24px",
            borderRadius: "12px"
        }
    }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
const getStyles = (name, personName, theme) => {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}
const groups = [
    'Report List',
    'Case Manager',
    'Everyone',
    'Super Admin',
    'Admin',
    'Omni App Admin',
    'BAM Manager',
    'BAM Admin',
];
const Properties = (props) => {

    const classes = useStyle();

    const theme = useTheme();

    const { handleChange, handleDelete, t,formData } = props;

    return (
        <Grid item container spacing={2} direction="column" style={{ padding: "1rem" }}>
            <Grid item>
                <InputBox
                    onChangeHandler={handleChange}
                    className={classes.inputBox}
                    value={formData.tabName}
                    label={t('omniapp:TAB_NAME')}
                    form={false}
                    type="text"
                    required={true}
                    name="tabName"
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
                    rows={2}
                    required={true}
                    multiline={true}
                    name="description"
                />
            </Grid>
            <Grid item container spacing={3}>
                <Grid item >
                    <Typography noWrap={true} className={classes.input_label}>{t('omniapp:AUTO_TOGGLE')}</Typography>
                </Grid>
                <Grid item>
                    <Checkbox color="primary" onChange={handleChange} name="autoToggle" />
                </Grid>
            </Grid>
            <Grid item container spacing={4} wrap="nowrap" classes={{ item: classes.groupItem }}>
                <Grid item >
                    <Typography noWrap={true} className={classes.input_label} >{t('omniapp:COMPONENT_INSTANCES')}<span style={{ color: "red" }}>*</span></Typography>
                </Grid>
                <Grid item>
                    <FormControl className={classes.formControl} classes={{ root: classes.formControlRoot }}>
                        <Select
                            multiple
                            value={formData.componentInstances}
                            onChange={handleChange}
                            name="componentInstances"
                            IconComponent={MoreVertIcon}
                            input={<StyledInput id="select-multiple-chip" />}
                            renderValue={(selected) => (
                                <div className={classes.chips}>
                                    {selected.map((value) => (
                                        <Chip classes={{ root: classes.chipRoot, labelSmall: classes.chipLabel }}
                                            key={value} size="small" onDelete={() => handleDelete(value)} onMouseDown={(event) => event.stopPropagation()} label={value}
                                            className={classes.chip} color="primary" variant="outlined" />
                                    ))}
                                </div >
                            )}
                            MenuProps={MenuProps}
                        >
                            {groups.map(option => (
                                <MenuItem key={option} style={getStyles(option, formData.componentInstances, theme)} value={option}>{option}</MenuItem>
                            ))}
                        </Select >
                    </FormControl>
                </Grid>
            </Grid>
            <Grid item container spacing={4} wrap="nowrap" classes={{ item: classes.groupItem }}>
                <Grid item >
                    <Typography noWrap={true} className={classes.input_label} >{t('omniapp:EXTERNAL_APPLICATIONS')}</Typography>
                </Grid>
                <Grid item>
                    <FormControl className={classes.formControl} classes={{ root: classes.formControlRoot }}>
                        {/* <InputLabel id="demo-mutiple-chip-label">Select Groups</InputLabel> */}
                        <Select
                            labelId="demo-mutiple-chip-label"
                            id="demo-mutiple-chip"
                            multiple
                            value={formData.externalApplications}
                            onChange={handleChange}
                            name="externalApplications"
                            IconComponent={MoreVertIcon}
                            input={<StyledInput id="select-multiple-chip" />}
                            renderValue={(selected) => (
                                <div className={classes.chips}>
                                    {selected.map((value) => (
                                        <Chip classes={{ root: classes.chipRoot, labelSmall: classes.chipLabel }}
                                            key={value} size="small" onDelete={() => handleDelete(value)} onMouseDown={(event) => event.stopPropagation()} label={value}
                                            className={classes.chip} color="primary" variant="outlined" />
                                    ))}
                                </div >
                            )}
                            MenuProps={MenuProps}
                        >
                            {groups.map(option => (
                                <MenuItem key={option} style={getStyles(option, formData.externalApplications, theme)} value={option}>{option}</MenuItem>
                            ))}
                        </Select >
                    </FormControl>
                </Grid>
            </Grid>
        </Grid>
    )
}

const Configure = props => {
    const{t}= props;

    return <Grid direction="row" container item spacing={2}>
        <Grid item md={5}>
            <Typography style={{ marginBottom: "1rem" }} variant="subtitle1" >{t('omniapp:LIST')}</Typography>
        </Grid>
        <Grid item md={7}>
            <Typography style={{ marginBottom: "1rem" }} variant="subtitle1">{t('omniapp:INSTANCE_MAPPINGS')}</Typography>
        </Grid>
    </Grid>
}

const AddNewTab = (props) => {

    const classes = useStyle();

    const [index, setIndex] = useState(1);
    const { handleClose, currentEdit, handleRefresh,t, isRefreshRequired } = props;

    console.log(currentEdit)

    const [formData, setFormData] = useState({
        tabName: currentEdit ? currentEdit.tabName : '',
        description: currentEdit ? currentEdit.description : '',
        autoToggle: false,
        componentInstances: currentEdit ? currentEdit.componentInstance.split(",") : [],
        externalApplications: []
    })

    const handleChange = event => {
        const name = event.target.name
        // console.log(name)
        setFormData({
            ...formData,
            [name]: event.target.value
        })
    }

    const handleDelete = (deletedGroup) => {
        // console.log(deletedGroup)
        const selectGroups = formData.selectGroups;
        const updatedSelectGroups = selectGroups.filter(group => group !== deletedGroup);
        setFormData({
            ...formData,
            selectGroups: updatedSelectGroups
        })
        console.log("Delete clicked")
    }



    const handleSubmit = () => {
        console.log('Submitted');
        handleRefresh(!isRefreshRequired);
    }
    return <div>
        <MultiStep disable_container={false}
            step_list={[{
                label: "Properties", component: Properties, componentProps: {
                    formData: formData,
                    t:t,
                    handleChange: handleChange,
                    handleDelete: handleDelete
                }
            },
            { label: "Configure", component: Configure , componentProps: {t:t}}]}
            active={index} />
        <Grid container spacing={2} direction="row" alignItems="flex-end" justify="flex-end">
            <Grid item>
                <Button onClick={handleClose} variant="outlined" style={{ width: "62px", height: "24px" }}>{t('omniapp:LABEL_CANCEL')}</Button>
            </Grid>
            {(index === 1) && <Grid item>
                <Button onClick={() => setIndex(2)} variant="contained" color="primary" style={{ width: "62px", height: "24px" }}>
                {t('omniapp:NEXT')}
                    </Button>
            </Grid>}
            {(index === 2) && <Grid item>
                <Button onClick={() => setIndex(1)} variant="outlined" color="primary" style={{ width: "62px", height: "24px" }}>
                {t('omniapp:PREV')}
                </Button>
            </Grid>}
            {index == 2 && <Grid item>
                <Button onClick={handleSubmit} variant="contained" color="primary" style={{ width: "47px", height: "24px" }}>
                {t('omniapp:LABEL_ADD')}
                </Button>
            </Grid>}
        </Grid>
    </div>
}

const AddExistingTab = (props) => {


    const { handleCheckbox ,t,tabsData} = props;
    const classes = useStyle();
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(0);
    const [rows, setRows] = React.useState([])

    const handleChangePage = (event, newPage) => {
        setPage(newPage - 1);
    };

    useEffect(() => {
        setRows(tabsData.data.tabs)
    }, [])

    return (<div>
        <Typography style={{ marginBottom: "1rem" }}>{t('omniapp:LIST_OF_TRENDS')} </Typography>
        <TableComponent loading={false}
            tableData={rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
            headerData={tabsData.data.tableHeader}
            dynamicHeight="fit-content"
            onChangeCheckbox={handleCheckbox} />
        <Pagination
            classes={{ root: classes.paginationRootItem }}
            component="div"
            count={Number.isInteger((rows.length / rowsPerPage)) ? (rows.length / rowsPerPage) : Math.trunc((rows.length / rowsPerPage)) + 1}
            page={page + 1}
            onChange={handleChangePage}
            color="primary"
            className={classes.ul}
            style={{ marginLeft: 'right', paddingTop: '20px' }}
        />
    </div>)
}

const AddTab = (props) => {

    const classes = useStyle();
    const { currentEdit = undefined } = props;
    // const [formData, setFormData] = useState({
    //     tabName: currentEdit ? currentEdit.tabName : '',
    //     description: currentEdit ? currentEdit.description : '',
    //     selectGroups: [],
    //     existingtabs: []
    // })
    const normalDialogStore = useSelector(state => state.normalDialogState);
    // const handleChange = event => {
    //     const name = event.target.name
    //     // console.log(name)
    //     setFormData({
    //         ...formData,
    //         [name]: event.target.value
    //     })
    // }
    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])
    const tabsData = {
        "data": {
            "tableHeader": [
                { id: 'tabName', label: `${t('omniapp:TAB_NAME')}`},
                { id: 'description', label:`${t('omniapp:DESCRIPTION')}` },
                { id: 'componentInstance', label:`${t('omniapp:COMPONENT_INSTANCE')}` },
            ],
            "tabs": [
                { tabName: "Report Designer", description: "A short description", componentInstance: "Report List, Search Bar" },
                { tabName: "Data  Modeler", description: "A short description", componentInstance: "Report List, Search Bar" },
                { tabName: "Report Creator", description: "A short description", componentInstance: "Audit List, Search Bar" },
                { tabName: "Process Designer", description: "A very short description", componentInstance: "Scheduler List, Search Bar" },
                { tabName: "RPA Designer", description: "A long description", componentInstance: "RPA List, Search Bar" },
                { tabName: "iFrame Designer", description: "A short description", componentInstance: "Report List, Search Bar" },
                { tabName: "Data Designer", description: "A short description", componentInstance: "Data List, Search Bar" },
    
            ]
        }
    }
    // const handleDelete = (deletedGroup) => {
    //     // console.log(deletedGroup)
    //     const selectGroups = formData.selectGroups;
    //     const updatedSelectGroups = selectGroups.filter(group => group !== deletedGroup);
    //     setFormData({
    //         ...formData,
    //         selectGroups: updatedSelectGroups
    //     })
    //     console.log("Delete clicked")
    // }

    const handleCheckbox = (selectedInputs) => {
        console.log(selectedInputs)
    }


    const tabs = [
        {
            label: `${t('omniapp:ADD_NEW')}`,
            component: AddNewTab,
            index: 0,
            componentProps: {
                currentEdit: currentEdit,
                t:t,
                handleClose: () => normalDialogStore.closeDialog(),
            }
        },
        {
            label: `${t('omniapp:ADD_EXISITING')}`,
            component: AddExistingTab,
            index: 1,
            componentProps: {
                handleCheckbox: handleCheckbox,
                t:t,
                tabsData:tabsData
            }
        },
    ]


    // const handleSubmit = () => {
    //     const entries = Object.entries(formData);
    //     for (const [key, value] of entries) {
    //         if (value !== '') {
    //             alert('Some values are empty');
    //             return;
    //         }
    //     }
    //     console.log(formData)
    // }


    return (
        <div>
            <DialogTitle className={classes.title}>{currentEdit ? `${t('omniapp:EDIT_TAB')} (${currentEdit.tabName})` : `${t('omniapp:ADD_TAB')}`}</DialogTitle>
            <DialogContent dividers className={classes.dividers}>
                <StyledTabs tabsArray={tabs} tabHeight={'35px'} container={true}
                    tabContainerClasses={classes.tabContainer} />
            </DialogContent>
            {/* <DialogActions>
                <Button variant="outlined" onClick={handleClose} color="primary" style={{ width: "62px", height: "24px" }}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleSubmit} color="primary" style={{ width: "47px", height: "24px" }}>
                    Add
            </Button>
            </DialogActions> */}
        </div>
    )
}

export default AddTab