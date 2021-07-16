import React from "react"
import { CustomDialog, InputBox } from "component"
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    reportInputBox: {
        width: '465px'
    },
    mainContainer: {
        margin: '15px'
    }
}))

const ReportCategoryDialog = props => {
    const classes = useStyles();
    return <CustomDialog
        open={props.open}
        handleClose={props.handleClose}
        title="Create a Report Category"
    >   <div className={classes.mainContainer}>
            <InputBox
                label="Report Category Name"
                className={classes.reportInputBox}
                helpertext="Max 20 Charecters" />
            <InputBox
                label="Description"
                className={classes.reportInputBox}
                helpertext="Max 50 Charecters"
                placeholder="It contains all the important report starting from the year 2020 only."
                multiline={true}
                rows={4} />
        </div>
    </CustomDialog>
}

export default ReportCategoryDialog;