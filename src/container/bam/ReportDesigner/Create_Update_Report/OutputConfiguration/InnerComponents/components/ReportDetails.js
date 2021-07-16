import React from "react";
import { CustomDialog, InputBox, makeStyles, Typography } from "component";

const useStyles = makeStyles({
    root: {
        margin: '5px',
        height: '500px',
        width: '500px'
    },
    queryToggle: {
        height: '170px'
    },
    caution: {
        backgroundColor: '#F8E9E9',
        height: '37px',
        width: '485px',
        display: 'flex',
        alignItems: 'center'
    },
    cautionHead: {
        fontWeight: '600',
        color: '#CE2020',
        paddingLeft: '10px'
    }
})

const ReportDetails = props => {
    const classes = useStyles();
    return <CustomDialog
        open={props.open}
        handleClose={props.handleClose}
        title="Edit Report Details"
    >
        <div className={classes.root}>
            <InputBox
                label="Report Name"
                helpertext="Max 20 Charecters"
                form={true}
                fullWidth={true}
            />
            <InputBox
                label="Description"
                helpertext="Max 50 Charecters"
                form={true}
                fullWidth={true}
                multiline={true}
                rows={4}
            />
            <div className={classes.queryToggle}>
                INSERT WIZARD HERE
            </div>
            <div className={classes.caution}>
                <Typography variant="subtitle1" className={classes.cautionHead}>CAUTION: </Typography>

            </div>
        </div>

    </CustomDialog>
}

export default ReportDetails;