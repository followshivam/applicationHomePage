import React from "react"
import { CustomDialog, InputBox, Button, makeStyles, Typography, Tabs, Tab, List, ListItem } from "component";

const tabHeight = '20px'

const useStyles = makeStyles((theme) => ({
    upperContainer: {
        margin: '10px 10px'
    },
    fieldNameContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        width: '950px',
        margin: '0 15px'
    },
    lowerContainer: {
        display: 'flex',
        height: '242px'
    },
    child: {
        border: '1px solid lightgrey',
        width: '33.333%',
        paddingLeft: '10px',
        overflow: 'scroll'
    },
    tabs: {
        minHeight: tabHeight,
        height: tabHeight,
        borderBottom: '1px solid lightgrey'
    },
    tab: {
        fontSize: '12px',
        minWidth: '10px',
        textTransform: 'none',
        minHeight: tabHeight,
        height: tabHeight
    },
    labelLowerContainer: {
        paddingBottom: '10px',
        color: '#767676'
    },
    reportedFieldsListContainer: {
        height: '190px',
        overflow: 'scroll'
    },
    listItem: {
        fontSize: '12px',
        padding: '0',
        marginBottom: '5px'
    }
}))

const tabsArray = [
    { label: "Math", index: 0 },
    { label: "Aggregate", index: 1 },
    { label: "String", index: 2 },
    { label: "Date", index: 3 },
    { label: "Query", index: 4 },
]

const tabsArraySecond = [
    { label: "Arithmetic", index: 0 },
    { label: "Comparison", index: 1 },
    { label: "Date", index: 2 },
    { label: "Pattern match", index: 3 },
]

const reportedFieldsList = [
    "All Fields", "ProcessDefId", "ActivityID", "ActivityName", "ActivityType", "UserID", "ActionID", "ActionDateTime", "ReplicateType"
]

const FieldEditor = props => {
    const classes = useStyles();
    return <CustomDialog
        open={props.open}
        handleClose={props.handleClose}
        title="Calculated Field Editor"
        hasActions={true}
        actionList={[
            {
                label: "Cancel",
                clickHandler: props.handleClose,
                color: "secondary",
            },
            {
                label: "Add",
                clickHandler: alert,
                color: "primary",
            },
        ]}
    >
        <div className={classes.upperContainer}>
            <div className={classes.fieldNameContainer}>
                <InputBox
                    id="notquie"
                    label="Field Name"
                    form={false}
                />
                <Button color="primary">Clear All</Button>
            </div>
            <InputBox
                label="Expression:"
                multiline={true}
                fullWidth={true}
                form={true}
                rows={4} />
            <InputBox
                id="unqie"
                label="Description"
                fullWidth={true}
                form={true}
            />
        </div>

        <div className={classes.lowerContainer}>
            <div className={classes.child}>
                <Typography className={classes.labelLowerContainer} variant="subtitle1">Functions</Typography>
                <Tabs value={0} className={classes.tabs} variant="scrollable">
                    {tabsArray.map((res, key) => <Tab label={res.label} key={key} classes={{ selected: classes.tabSelected, root: classes.tab }} />)}
                </Tabs>
            </div>
            <div className={classes.child}>
                <Typography className={classes.labelLowerContainer} variant="subtitle1">Reported Fields</Typography>
                <List className={classes.reportedFieldsListContainer}>
                    {reportedFieldsList.map((item) => (
                        <ListItem className={classes.listItem} key={item}>{item}</ListItem>
                    ))}
                </List>
            </div>
            <div className={classes.child}>
                <Typography className={classes.labelLowerContainer} variant="subtitle1">Operators</Typography>
                <Tabs value={0} className={classes.tabs} >
                    {tabsArraySecond.map((res, key) => <Tab label={res.label} key={key} classes={{ selected: classes.tabSelected, root: classes.tab }} />)}
                </Tabs>
            </div>
        </div>
    </CustomDialog>
}

export default FieldEditor;

