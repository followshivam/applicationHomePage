import React, { useState, Fragment } from 'react'
import { useSelector } from 'react-redux'
import {
    Paper,
    Checkbox,
    CustomDialog,
    Typography,
    Grid,
    Button,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableHead,
    TableContainer,
    makeStyles,
    IconsButton,
    Toolbar,
    InputBox
} from "component";

import RowDragger from "component/RowDragger"

const useStyles = makeStyles((theme) => ({
    paperLeft: {
        textAlign: 'left',
        minHeight: "630px",
        paddingLeft: '10px',
        paddingRight: '10px',
    },
    paperRight: {
        textAlign: 'center',
        border: `1px solid ${theme.palette.borderColor}`,
        backgroundColor: theme.palette.backgroundContainer,
        minHeight: "630px",
    },
    app_root: {
        flex: 1,
        flexGrow: 1,
        width: "100%",
        height: 35,
        boxShadow: `0px 2px 4px -1px rgba(0,0,0,0.1)`
    },
    toolbar: {
        "& > *": {
            // marginRight:theme.spacing(15),
            marginLeft: theme.spacing(10)
        }
    },
    dragger_toolbar: {
        "& > *": {
            marginRight: theme.spacing(10),
            //  marginLeft:theme.spacing(10)
        }
    },
    tableCellStyle: {
        borderBottom: 'none'
    }
}));


const LeftContainer = (props) => {
    const { rowData } = props
    const classes = useStyles()
    const [calculateField, setCalculateField] = useState(
        { fieldName: '', type: '', alias: '', isChecked: false, fromCalculate: true }
    )
    const [checked, setChecked] = useState(false)
    const [toggle, setToggle] = useState(false)

    const [createReportState] = useSelector(state => {
        return [state.createReportState]
    })
    const handleToggle = () => {
        setToggle(!toggle)
    }

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };
    console.log(checked)
    return (
        <Paper className={classes.paperLeft} elevation={0}>
            <Grid container justify='space-between'>
                <Typography inline textAlign='left' variant="h6" >
                    <b>Fields from Table</b>
                </Typography>
                {
                    createReportState.report_report_query_type === "F" &&
                    <Typography textAlign='right' inline variant="subtitle1" color='primary' onClick={handleToggle}>
                        + Calculated Field
                    </Typography>
                }
            </Grid>
            <Grid container justify='space-between'>
                <Typography inline textAlign='left' variant="subtitle1">
                    Select the fields you want for output.
                </Typography>
                <Typography textAlign='right' inline variant="subtitle1" color='primary'>
                    Invert
                </Typography>
            </Grid>
            <Typography textAlign='left' variant="subtitle1">
                <Checkbox
                    size='small'
                    onChange={handleChange}
                    color="primary"
                    disableRipple={true}
                    disableFocusRipple={true}
                    style={{ marginLeft: '-10px' }}
                />
                Select the Only Distinct Records
            </Typography>
            <TableContainer>
                <Table style={{ width: '95%' }} size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell align='left'>Fields</TableCell>
                            <TableCell align='left'>Type</TableCell>
                            <TableCell align='left'>Alias</TableCell>
                            <TableCell align='left'>{' '}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rowData.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell className={classes.tableCellStyle} align='left'>
                                    <Checkbox
                                        size='small'
                                        onChange={() => props.handleChangeTableRow(row.id)}
                                        color="primary"
                                        disableRipple={true}
                                        disableFocusRipple={true}
                                        style={{ margin: '-6px', marginLeft: '-20px' }}
                                    />
                                    {row.fieldName}</TableCell>
                                <TableCell align='left' className={classes.tableCellStyle} color='secondary' ><Typography color='textSecondary' variant="subtitle1">{row.type}</Typography></TableCell>
                                <TableCell align='left' className={classes.tableCellStyle} style={{ paddingLeft: 0, paddingRight: 0 }}>
                                    {row.isChecked ?
                                        <>
                                            <InputBox form={false} value={row.alias} style={{ width: '120px' }} />
                                        </>
                                        : <InputBox form={false} value={row.alias} id={row.id} style={{ width: '120px' }} disabled />
                                    }
                                </TableCell>
                                {row.isChecked ?
                                    <TableCell align='left' className={classes.tableCellStyle} style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <IconsButton type="EditIcon" color={"primary"} />{' '}
                                        <IconsButton type="DeleteIcon" style={{ color: 'red' }} />
                                    </TableCell>
                                    : null}
                            </TableRow>
                        )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {toggle ?
                <CustomDialog open={true} handleClose={handleToggle} maxWidth='sm' title='Calculate Fields'>

                    <Grid conatiner justify="flex-end">
                        <Button onClick={handleToggle} color="primary">Close</Button>{' '}
                        <Button >Submit</Button>
                    </Grid>
                </CustomDialog>
                : null
            }
        </Paper>

    )
}
const RightContainer = (props) => {
    const { rowData } = props
    const classes = useStyles();
    const [items, setItems] = useState([1, 2, 3, 4, 5, 6])

    const rowData1 = rowData.filter(row => row.isChecked === true)
    console.log(rowData1)


    return (
        <Fragment>
            <Paper className={classes.paperRight} elevation={0}>
                <div className={classes.app_root}>
                    <Toolbar variant="dense" className={classes.toolbar} >
                        <Typography variant="h6"><b>Field Name</b></Typography>
                        <Typography variant="h6"><b>Type</b></Typography>
                        <Typography variant="h6"><b>Alias</b></Typography>
                    </Toolbar>
                </div>

                <RowDragger items={items} onChange={(list) => setItems(list)} />
            </Paper>
        </Fragment>

    )
}
const OutputFields = () => {
    const dummyData = [
        { id: 0, fieldName: 'ProcessDefId', type: 'Integer', alias: 'Process Def Id', isChecked: false },
        { id: 1, fieldName: 'ProcessDefId', type: 'Integer', alias: 'Process Def Id', isChecked: false },
        { id: 2, fieldName: 'ProcessDefId', type: 'Integer', alias: 'Process Def Id', isChecked: false },
        { id: 3, fieldName: 'ProcessDefId', type: 'Integer', alias: 'Process Def Id', isChecked: false },
        { id: 4, fieldName: 'ProcessDefId', type: 'Integer', alias: 'Process Def Id', isChecked: false },
        { id: 5, fieldName: 'ProcessDefId', type: 'Integer', alias: 'Process Def Id', isChecked: false },
        { id: 6, fieldName: 'ProcessDefId', type: 'Integer', alias: 'Process Def Id', isChecked: false },

    ]

    const classes = useStyles();
    const [rowData, setRowData] = useState(dummyData)

    const handleChangeTableRow = (id) => {
        const newRowData = [...rowData]
        newRowData[id].isChecked = !newRowData[id].isChecked
        setRowData(newRowData)
    }

    return (
        <Grid container spacing={0} >
            <Grid item sm={4}>
                <LeftContainer rowData={rowData} handleChangeTableRow={handleChangeTableRow} />
            </Grid>
            <Grid item sm={8}>
                <RightContainer rowData={rowData} />

            </Grid>
        </Grid>
    );

}

export default OutputFields 