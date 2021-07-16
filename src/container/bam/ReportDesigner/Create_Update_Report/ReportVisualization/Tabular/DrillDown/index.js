import React, { useState } from 'react'
import { 
    makeStyles,
    Typography,
    Grid,
    PickList,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
 } from "component";


const useStyles = makeStyles((theme) => ({
    root:{
        padding: '.4rem'
    },
    tableCellStyle: {
        borderBottom: 'none'
    },
}));


const DrillDown = () => {
    const dummyData = [
        {id: 0,fieldName:'Activity Type', type: 'Text'},
        {id: 1,fieldName:'Volume', type: 'Integer'},
    ]
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <TableContainer>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.tableCellStyle} align='left'><b>Fields</b></TableCell>
                                <TableCell className={classes.tableCellStyle} align='left'><b>Type</b></TableCell>
                                <TableCell className={classes.tableCellStyle} align='left'><b>Drill Down Report</b></TableCell>
                                {/* <TableCell align='left'>{' '}</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dummyData.map((row,i) => (
                                <TableRow key={i}> 
                                    <TableCell width="30%" className={classes.tableCellStyle} align='left'>
                                        <Typography variant="subtitle1">{row.fieldName}</Typography>
                                    </TableCell>
                                    <TableCell align='left' width="20%" className={classes.tableCellStyle} color='secondary' ><Typography color='textSecondary' variant="subtitle1">{row.type}</Typography></TableCell>
                                    <TableCell align='left' width="50%" className={classes.tableCellStyle} >
                                        
                                        <PickList style={{ width: '100%' }} /> 
                                        
                                         </TableCell>
                                         
                                        </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
        </div>
    )

}

export default DrillDown