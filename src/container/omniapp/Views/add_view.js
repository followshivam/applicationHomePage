import React, { useState, useEffect } from 'react'
import {
    Dialog, DialogTitle, DialogContent,useTranslation, DialogActions, makeStyles, Grid, TableComponent,
    InputBox, Typography, StyledTab as StyledTabs
} from 'component'
import { Button, MenuItem, Select, Chip, FormControl } from '@material-ui/core'
import { useTheme } from '@material-ui/styles';
import { StyledInput } from 'component/Form';
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Pagination from '@material-ui/lab/Pagination';
import { useSelector } from 'react-redux';
import { ActView } from '../../../global/omniapp/api/ApiMethods';



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
        marginTop: "0.5rem",
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
        fontWeight: '600 !important',
        padding: theme.spacing(1, 2, 0, 2),
    },
    contentRoot: {
        padding: theme.spacing(1, 2, 0, 2),
    },
    dialogActionsRoot: {
        paddingRight: 16,
        paddingBottom: 16
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
        marginTop: "auto"
    },
    chip: {
        margin: 1,
    },
    input_label: {
        ...theme.typography.input_label,
        minWidth: "95px",
        maxWidth: "95px",
        marginTop: "0.25rem"
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
    'Business Admin',
    'Case Manager',
    'Everyone',
    'Super Admin',
    'Admin',
    'Omni App Admin',
    'BAM Manager',
    'BAM Admin',
];
const AddNewView = (props) => {

    const classes = useStyle();

    const theme = useTheme();

    const { handleChange, viewsData, t,handleDelete, formData } = props;

    return (
        <Grid item container spacing={2} direction="column">
            <Grid item>
                <InputBox
                    onChangeHandler={handleChange}
                    className={classes.inputBox}
                    value={formData.viewName}
                    label={t('omniapp:VIEW_NAME')}
                    form={false}
                    type="text"
                    required={true}
                    name="viewName"
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
                    alignItems={"baseline"}
                    required={true}
                    multiline={true}
                    name="description"
                />
            </Grid>
            <Grid item container spacing={4} wrap="nowrap" classes={{ item: classes.groupItem }}>
                <Grid item >
                    <Typography noWrap={true} className={classes.input_label} >{t('omniapp:SELECT_GROUPS')}<span style={{ color: "red" }}>*</span></Typography>
                </Grid>
                <Grid item>
                    <FormControl className={classes.formControl} classes={{ root: classes.formControlRoot }}>
                        {/* <InputLabel id="demo-mutiple-chip-label">Select Groups</InputLabel> */}
                        <Select
                            labelId="demo-mutiple-chip-label"
                            id="demo-mutiple-chip"
                            multiple
                            value={formData.selectGroups}
                            onChange={handleChange}
                            name="selectGroups"
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
                            {groups.map(group => (
                                <MenuItem key={group} style={getStyles(group, formData.selectGroups, theme)} value={group}>{group}</MenuItem>
                            ))}
                        </Select >
                    </FormControl>
                </Grid>
            </Grid>
        </Grid>
    )
}

const AddExistingView = (props) => {


    const { handleCheckbox,viewsData,t } = props;
    const classes = useStyle();
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(0);
    const [rows, setRows] = React.useState([])

    const handleChangePage = (event, newPage) => {
        setPage(newPage - 1);
    };

    useEffect(() => {
        setRows(viewsData.data.views)
    }, [])


    return (<div>
        <Typography style={{ marginBottom: "1rem", color: "#606060" }}>{t('omniapp:LIST_OF_TRENDS')} </Typography>
        <TableComponent loading={false}
            tableData={rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
            headerData={viewsData.data.tableHeader}
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

const AddView = (props) => {

    const classes = useStyle();

    const { currentEdit = undefined, handleRefresh, isRefreshRequired } = props;

    const normalDialogStore = useSelector(state => state.normalDialogState);

    const [formData, setFormData] = useState({
        viewName: currentEdit ? currentEdit.viewName : '',
        description: currentEdit ? currentEdit.description : '',
        selectGroups: [],
        existingViews: []
    })
    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });

    const { t } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])
    const viewsData = {
        "data": {
            "tableHeader": [
                { id: 'viewName', label:`${t('omniapp:VIEW_NAME')}`, disablePadding: true, },
                { id: 'description', label:`${t('omniapp:DESCRIPTION')}`, disablePadding: true, },
            ],
            "views": [
                { viewName: "Report", description: "A short description" },
                { viewName: "Scheduler", description: "A short description" },
                { viewName: "Audit Logs", description: "A short description" },
                { viewName: "Report", description: "A very short description" },
                { viewName: "Scheduler", description: "A long description" },
                { viewName: "Designer", description: "A short description" },
                { viewName: "Scheduler", description: "A short enough description" },
    
            ]
        }
    }
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

    const handleCheckbox = (selectedInputs) => {
        setFormData({
            ...formData,
            existingViewsList: selectedInputs
        })
    }


    const tabs = [
        {
            label: `${t('omniapp:ADD_NEW')}`,
            component: AddNewView,
            index: 0,
            componentProps: {
                formData: formData,
                viewsData:viewsData,
                t:t,
                handleChange: handleChange,
                handleDelete: handleDelete
            }
        },
        {
            label: `${t('omniapp:ADD_EXISITING')}`,
            component: AddExistingView,
            index: 1,
            componentProps: {
                handleCheckbox: handleCheckbox,
                t:t,
                viewsData:viewsData
            }
        },
    ]


    const handleSubmit = () => {
        const entries = Object.entries(formData);
        for (const [key, value] of entries) {
            if (value !== '') {
                alert('Some values are empty');
                return;
            }
        }
        ActView(JSON.stringify(formData))
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


    return (
        <div>
            <DialogTitle className={classes.title}>{currentEdit ?  `${t('omniapp:EDIT_VIEW')} (${currentEdit.viewName})` : `${t('omniapp:ADD_VIEW')}`}</DialogTitle>
            <DialogContent style={{ minHeight: "20rem", minWidth: "40rem" }} classes={{ root: classes.contentRoot }}>
                <StyledTabs tabsArray={tabs} tabHeight={'30px'} container={true}
                    tabContainerClasses={classes.tabContainer} />
            </DialogContent>
            <DialogActions classes={{ root: classes.dialogActionsRoot }}>
                <Button variant="outlined" onClick={() => normalDialogStore.closeDialog()} color="primary" style={{ width: "62px", height: "24px" }}>
                {t('omniapp:LABEL_CANCEL')}

                </Button>
                <Button variant="contained" onClick={handleSubmit} color="primary" style={{ width: "47px", height: "24px" }}>
                {t('omniapp:SAVE')}

                </Button>
            </DialogActions>
        </div>
    )
}

export default AddView