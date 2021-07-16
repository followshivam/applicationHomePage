import { CustomDialog, InputBox, FormControl, FormControlLabel, makeStyles, Radio, RadioGroup, withStyles } from "component";
import React from "react";


const useStyles = makeStyles({
    groupingOrder: {
        width: '500px',
        padding: '0 25px'
    },
    inputBox: {
        marginTop: '0px',
        marginBottom: '0px',
        marginRight: '0px',
        marginLeft: '15px',
        width: '500px'
    }
})

const StyledFormControlLabelRight = withStyles({
    label: {
        fontSize: '12px',
    }
})(FormControlLabel)

const GroupingSettings = props => {
    const classes = useStyles();
    return <CustomDialog open={props.open} handleClose={props.handleDialogClose} title="Grouping Settings">
        <div className={classes.groupingOrder}>
            <FormControl component="fieldset">
                <RadioGroup aria-label="gender" name="gender1" >
                    <StyledFormControlLabelRight value={0} control={<Radio />} label="Intelligent Grouping" />
                    <StyledFormControlLabelRight value={1} control={<Radio />} label="Group Manually" />
                </RadioGroup>
            </FormControl>
            <InputBox
                rows="4"
                fullWidth={true}
                multiline={true}
                className={classes.inputBox}
                form={false}
                placeholder="Write the value and press enter to write another...."
            />
        </div>
    </CustomDialog>
}

export default GroupingSettings;