import React, { useState, Fragment } from 'react'
import { useSelector } from 'react-redux'
import {
    Paper,
    Checkbox,
    Box,
    Typography,
    Grid,
    AppBar,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableHead,
    TableContainer,
    makeStyles,
    InputBox,
    DragIndicatorIcon,
} from "component";


const useStyles = makeStyles((theme) => ({
    paperLeft: {
        textAlign: 'left',
        minHeight: "630px",
        paddingLeft: '10px',
        paddingRight: '15px',
    },
    paperRight: {
        textAlign: 'center',
        backgroundColor: theme.palette.backgroundContainer,
        minHeight: "630px",
        border: `1px solid ${theme.palette.borderColor}`
    },
    tableCellStyle: {
        borderBottom: 'none',
    },
    tableHeaderStyle: {
        borderBottom: 'none'
    },
    RPTableHeader: {
        borderBottom: '1px solid #e8e8e8',
        backgroundColor: '#f8f8f8',
    },
    rightTablecontent: {
        width: '96%',
        border: '1px solid #e8e8e8',
        backgroundColor: 'white',
        marginTop: '5px',
        marginLeft: 'auto',
        marginRight: 'auto'
    }
}));


function tableData(fieldName, type, alias) {
    return { fieldName, type, alias }
}

const rows = [
    tableData('P', 'Integer', 'Process Def Id'),
    tableData('Activity ID', 'Integer', 'Activity Id'),
    tableData('ProcessDefId', 'Text', 'Activity Name'),
    tableData('ProcessDefId', 'Text', 'Activity Type'),
    tableData('ProcessDefId', 'Integer', 'Process Def Id'),
    tableData('ProcessDefId', 'Text', 'Process Def Id'),
    tableData('ProcessDefId', 'Integer', 'Process Def Id'),
    tableData('ProcessDefId', 'Text', 'Activity Type'),
    tableData('ProcessDefId', 'Integer', 'Process Def Id'),
    tableData('ProcessDefId', 'Text', 'Process Def Id'),
    tableData('ProcessDefId', 'Integer', 'Process Def Id'),
]
const LeftContainer = (props) => {
    const classes = useStyles();
    const [checked, setChecked] = useState(false);
    const [rowData, setRowData] = useState({})
    const [createReportState] = useSelector(state => {
        return [state.createReportState]
    })

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const handleChangeTableRow = (row) => {
        setRowData(row)
    }

    return (
        <Paper className={classes.paperLeft} elevation={0}>
            <Grid container justify='space-between'>
                <Typography inline textAlign='left' variant="h6">
                    Fields from Table
                </Typography>
                {
                    createReportState.report_report_query_type === "F" &&
                    <Typography textAlign='right' inline variant="subtitle1" color='primary'>
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
                    disableTouchRipple={true}
                    disableFocusRipple={true}
                    style={{ marginLeft: '-10px' }}
                />
                Select the Only Distinct Records
            </Typography>
            <TableContainer>
                <Table style={{ width: '95%' }} size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell align='left'>Field Name</TableCell>
                            <TableCell align='left'>Type</TableCell>
                            <TableCell align='left'>Alias</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell className={classes.tableCellStyle} align='left'>
                                    <Checkbox
                                        size='small'
                                        onChange={() => handleChangeTableRow(row)}
                                        color="primary"
                                        style={{ margin: '-10px' }}
                                    />
                                    {row.fieldName}</TableCell>
                                <TableCell align='left' className={classes.tableCellStyle}>{row.type}</TableCell>
                                <TableCell align='left' className={classes.tableCellStyle}>
                                    <InputBox form={false} value={row.alias} style={{ width: '80px' }} /></TableCell>
                            </TableRow>
                        )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}
const RightContainer = (props) => {
    const classes = useStyles()
    return (
        <Fragment>
            <Paper className={classes.paperRight} elevation={0}>
                <AppBar position='static' elevation={0} className={classes.RPTableHeader}>
                    <TableContainer>
                        <Table style={{ width: '600px' }} >
                            <TableHead>
                                <TableRow elevation={0}>
                                    <TableCell className={classes.tableHeaderStyle} align='center'>Field Name</TableCell>
                                    <TableCell className={classes.tableHeaderStyle} align='left'>Type</TableCell>
                                    <TableCell className={classes.tableHeaderStyle} align='left'>Alias</TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </TableContainer>
                </AppBar>
                {
                    props.rowData.map((data, index) => {
                        return (
                            <Fragment key={index}>
                                <TableContainer>
                                    <Table className={classes.rightTablecontent} >
                                        <TableBody>
                                            <TableRow elevation={0}>
                                                <TableCell className={classes.tableHeaderStyle} align='left'><DragIndicatorIcon /></TableCell>
                                                <TableCell className={classes.tableHeaderStyle} align='left'>{data.fieldName}</TableCell>
                                                <TableCell className={classes.tableHeaderStyle} align='left'>{data.type}</TableCell>
                                                <TableCell className={classes.tableHeaderStyle} align='center'>{data.alias}</TableCell>
                                                <TableCell className={classes.tableHeaderStyle} style={{ width: '250px' }}></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Fragment>
                        )
                    })
                }
            </Paper>
        </Fragment>

    )
}
const OutputFields = () => {
    const classes = useStyles();
    const [rowData, setRowData] = useState([])

    const handleChangeTableRow = (row) => {
        console.log(rowData)
        setRowData([
            ...rowData,
            {
                isChecked: !row.isChecked,
                fieldName: row.fieldName,
                type: row.type,
                alias: row.alias
            }
        ])
    }

    return (
        <Grid container spacing={0} >
            <Grid item sm={4}>
                <LeftContainer rowData={rowData} handleRowData={handleChangeTableRow} />
            </Grid>
            <Grid item sm={8}>
                <RightContainer rowData={rowData} />

            </Grid>
        </Grid>
    );

}

export default OutputFields