import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Input, makeStyles, OutlinedInput, Radio, RadioGroup, TableBody, TableCell, TableRow, Typography, withStyles } from "@material-ui/core";
import { CustomDialog, InputBox, Spinner, AssociatedPickList, PickList, DashboardTile } from "component";
import Picklist from "component/PickList";
import React, { lazy, useState } from "react";
import { Suspense } from "react";
import { useSelector } from "react-redux";
import Rules from "./Create_Update_Report/ReportVisualization/rules_popup";

const HealthStatus = lazy(() => import("container/bam/ReportDesigner/HealthStatus/HealthStatus"));
const StagingCabinet = lazy(() => import("container/bam/ReportDesigner/staging_cabinet"));
const DownloadConifguration = lazy(() => import("container/bam/ReportDesigner/Create_Update_Report/ReportVisualization/download_config"));
const useStyles = makeStyles({
    groupingOrder: {
        width: '500px',
    },
    inputBox: {
        marginTop: '0px',
        marginBottom: '0px',
        marginRight: '0px',
        marginLeft: '15px'
    },

})

const tile_data = [
    {
        title: "209",
        description: { label: 'Health', value: 'Good' },
        img_info: {
            background_color: "#0d6f0829",
            url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/report_good.svg`,
        },
        hover_border_color: "#0d6f0880"
    },
    {
        title: 107,
        description: { label: 'Health', value: 'Average' },
        img_info: {
            background_color: "#0072c629",
            url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/report_average.svg`,
        },
        hover_border_color: "#0072C666"
    },
    {
        title: 10,
        description: { value: 'Critical', subLabel: "Pending" },
        img_info: {
            background_color: "#d53d3d26",
            url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/report_critical.svg`,
        },
        hover_border_color: '#d53d3d80'
    },
    {
        title: 12,
        description: { label: '', value: 'Blocked' },
        img_info: {
            background_color: "#d53d3d26",
            url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/blocked.svg`,
        },
        hover_border_color: '#d53d3d80'
    }
]

const TestingWindow = props => {
    const classes = useStyles();
    const store = useSelector(store => store.normalDialogState)

    return <div style={{ backgroundColor: '#F8F8F8', height: '90vh' }}>
        <Button onClick={() => store.openDialog(<Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}><HealthStatus closeDialog={store.closeDialog} report_index="35" report_name="Average Process Time Report" /></Suspense>, "HealthStatus")}> Healthstatus</Button>
        <Button onClick={() => store.openDialog(<Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}><DownloadConifguration closeDialog={store.closeDialog} /></Suspense>, "DownloadConifguration")}> DownloadConifguration</Button>
        <Button onClick={() => store.openDialog(<Suspense fallback={<div style={{ height: "250px", minWidth: "600px" }}><Spinner msg="" /></div>}><StagingCabinet closeDialog={store.closeDialog} /></Suspense>, "StagingCabinet")}> StagingCabinet</Button>
        <Button onClick={() => store.openDialog(<Suspense fallback={<div style={{ height: "600px", minWidth: "1200px" }}><Spinner msg="" /></div>}><div style={{ height: "600px", minWidth: "1200px" }}><Rules closeDialog={store.closeDialog} /></div></Suspense>, "Rules")}> Rules</Button>
        <PickList />
        <div style={{ margin: '20px 20px', width: '750pt' }}>
            <DashboardTile tileList={tile_data} direction="ltr" onClickHandler={() => { }} />
        </div>
    </div>
}

export default TestingWindow;


