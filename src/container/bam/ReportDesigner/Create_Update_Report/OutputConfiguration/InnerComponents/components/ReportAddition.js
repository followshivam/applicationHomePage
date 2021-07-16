import { FormControlLabel, makeStyles, MenuItem, Select, Typography, withStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
    root: {
        height: '522px',
        width: '739px',
        marginTop: '20px'
    },

    outlinedSelect: {
        borderRadius: '0%',
        maxHeight: '23px',
        minWidth: '106px'
    },

})

const StyledFormControlLabelLeft = withStyles({
    label: {
        fontSize: '12px',
        paddingRight: '10px',
        marginLeft: '0',
        marginRight: '0'
    }
})(FormControlLabel)

const StyledSelect = withStyles({
    root: {
        fontSize: '12px',
    }
})(Select)



const ReportAddition = props => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Typography variant="subtitle1" gutterBottom>Select a report to Add</Typography>
            <StyledFormControlLabelLeft
                control={<StyledSelect value={0}
                    variant="outlined"
                    className={classes.outlinedSelect}>
                    <MenuItem value={0}>General</MenuItem>
                </StyledSelect>}
                label="Report Category"
                labelPlacement="start"
            />
        </div>
    )
}

export default ReportAddition