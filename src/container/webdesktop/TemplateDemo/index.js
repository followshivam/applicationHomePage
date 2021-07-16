import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { useState } from "react";
import { template_data } from "global/json";
import RouteComponents from "global/mapRouteToComponent";
import { NotFound } from "component";

//  Coding sandbox link if required for any POC
// https://codesandbox.io/s/material-demo-forked-vu5r4?file=/demo.js

const useStyles = makeStyles((theme) => ({
    root: {
        display: "grid",
        // gridAutoRows: 100,
        gridTemplateRows: props => getRowHeight(props.row_heights),
        gridTemplateColumns: (props) => getColumnCount(props.column_count)
    },
    paper: {
        padding: theme.spacing(2),
        margin: "2px",
        textAlign: "center",
        border: "1px solid",
        borderRadius: 5,
        color: theme.palette.text.secondary
    }
}));

const getColumnCount = (column_count) => {
    let gridTemplateColumns = "";
    for (let index = 0; index < column_count; index++) {
        gridTemplateColumns += 99 / Number(column_count) + "% ";
    }
    return gridTemplateColumns;
};

const getRowHeight = (row_heights) => {
    return row_heights.join(" ");
};


export default function CenteredGrid() {

    const [data, setData] = useState(template_data);
    const classes = useStyles({ column_count: data.column_count, row_heights: data.row_heights });

    return (
        <div className={classes.root}>
            {data.template_def.map((item) => {
                const input_data = data.components[item.container_id];
                let Component = <NotFound />
                if (RouteComponents.get(input_data.load_url)) {
                    Component = RouteComponents.get(input_data.load_url)(input_data);
                }
                return (
                    <Paper
                        style={{
                            gridColumn: `${item.colStart} / span ${item.colspan}`,
                            gridRow: `${item.rowStart} / span ${item.rowspan}`
                        }}
                        className={classes.paper}
                    >
                        {Component}
                    </Paper>
                );
            })}
        </div>
    );
}
